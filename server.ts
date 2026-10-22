import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CLINICAL_SYSTEM_INSTRUCTION = `
You are a Senior Malaysian Infectious Disease Specialist & Primary Care Antimicrobial Stewardship Consultant advising General Practitioners (GPs), Klinik Kesihatan medical officers, and Emergency Department (ED) doctors across Malaysia and Southeast Asia.

Guidelines & Standards:
1. National Antimicrobial Guideline (NAG, Ministry of Health Malaysia - MOH).
2. Malaysian CPG for Upper Respiratory Tract Infections (URTI), CAP in Adults, UTI, Skin and Soft Tissue Infections (SSTI), and Dengue Infection.
3. WHO AWaRe classification (Access, Watch, Reserve).

Core Stewardship Rules:
- Viral URTIs (common cold, acute bronchitis, non-strep pharyngitis, acute laryngitis) and acute viral gastroenteritis DO NOT require antibiotics. Routine antibiotics are contraindicated.
- Sore throat: Use Centor/McIsaac score. Strep pharyngitis 1st-line is Oral Phenoxymethylpenicillin (Pen V) 500mg QID x 10 days OR Oral Amoxicillin 500mg BD/TDS x 10 days. Augmentin (co-amoxiclav) is NOT 1st line for simple tonsillitis.
- Acute Bronchitis in healthy adults: >90% viral. Purulent/green sputum reflects neutrophil myeloperoxidase, NOT bacterial etiology. Explain this clearly.
- Acute Otitis Media: High-dose Amoxicillin 80-90 mg/kg/day (paeds) or 1g TDS (adults) for 5-7 days.
- Outpatient CAP: Check CRB-65! If CRB-65 = 0, Oral Amoxicillin 1g TDS +/- Azithromycin 500mg D1 then 250mg D2-5. If CRB-65 >= 1, refer hospital for admission.
- Uncomplicated UTI (Cystitis): Oral Nitrofurantoin 100mg BD x 5 days or Fosfomycin 3g stat. Do NOT use Ciprofloxacin as 1st-line for simple cystitis (reserve for pyelonephritis or high resistance risk).
- Cellulitis: Oral Cloxacillin 500mg QID (MUST be on empty stomach: 1h before or 2h after food) x 5-7 days.
- Animal/Human Bites: Oral Co-amoxiclav (Augmentin) 625mg TDS x 5-7 days (mandatory for Pasteurella multocida). Check Tetanus toxoid!
- Penicillin Allergy: Distinguish Type I IgE immediate (anaphylaxis, angioedema, hives within 1h) from non-IgE delayed mild rash (safe for cephalosporins) and SCAR (SJS/TEN/DRESS - strictly avoid all beta-lactams).
- Malaysian Epidemiology: Always remind to check Dengue NS1/FBC if febrile with leucopenia or thrombocytopenia before reflexively giving antibiotics.

Output JSON format:
{
  "condition": string,
  "antibioticIndicated": boolean,
  "confidence": "HIGH" | "INTERMEDIATE" | "LOW",
  "clinicalReasoning": string, // structured diagnostic rationale
  "primaryRegimen": {
    "drug": string,
    "dose": string,
    "frequency": string,
    "duration": string,
    "instructions": string,
    "pearl": string
  } | null,
  "alternativeRegimen": {
    "allergyType": string,
    "drug": string,
    "dose": string,
    "frequency": string,
    "duration": string
  } | null,
  "symptomaticCare": string[],
  "cpgReference": string, // e.g. "MOH NAG Malaysia 3rd Ed. & CPG URTI"
  "redFlags": string[], // warning signs requiring ED referral
  "investigations": {
    "indicated": string[],
    "interpretation": string
  },
  "malaysianDoctorScript": {
    "english": string, // How GP can explain to patient why antibiotics are or are not needed
    "bahasaMelayu": string // Natural conversational BM for Malaysian patients
  }
}
`;

// Helper for offline/fallback rule-based response when Gemini API key is missing or offline
function generateRuleBasedConsult(query: string, condition?: string, allergy?: string) {
  const q = (query + ' ' + (condition || '')).toLowerCase();

  let result = {
    condition: "Upper Respiratory Infection / Sore Throat",
    antibioticIndicated: false,
    confidence: "HIGH" as const,
    clinicalReasoning: "Based on MOH Malaysia National Antimicrobial Guideline (NAG) and CPG URTI: Over 85-90% of sore throats and acute coughs in primary care are viral. Unless clinical criteria (e.g., Centor/McIsaac score >= 4, signs of bacterial quinsy, or severe bacterial otitis) are met, empiric antibiotics do not shorten illness and significantly induce gut dysbiosis and antimicrobial resistance.",
    primaryRegimen: null as any,
    alternativeRegimen: null as any,
    symptomaticCare: [
      "Paracetamol 500mg-1000mg QID PRN for fever and odynophagia (max 4000mg/24h)",
      "Warm saline gargles (1/2 tsp salt in 200ml warm water) TDS",
      "Throat lozenges (e.g. Dequalinium, Difflam / Benzydamine spray) for local analgesia",
      "Adequate hydration (>2-2.5L fluids daily) and voice rest"
    ],
    cpgReference: "MOH Malaysia National Antimicrobial Guideline (NAG) & CPG Management of URTI",
    redFlags: [
      "Inability to swallow saliva / drooling (suspect epiglottitis or peritonsillar abscess)",
      "Trismus (difficulty opening mouth) or unilateral tonsillar bulging with uvular deviation",
      "Stridor, hoarseness with respiratory distress",
      "High persistent fever >5 days despite antipyretics"
    ],
    investigations: {
      indicated: ["Rapid Strep Antigen Test (if available)", "FBC if high prolonged fever in endemic Dengue area"],
      interpretation: "Normal CRP (<10 mg/L) and normal WCC strongly supports viral etiology. Leucopenia with thrombocytopenia in Malaysia warrants Dengue NS1 / IgM testing."
    },
    malaysianDoctorScript: {
      english: "Your symptoms are caused by a viral infection. Antibiotics kill bacteria, not viruses. Taking an antibiotic won't speed up recovery, but can cause stomach upset, diarrhea, and make future bacterial infections much harder to treat. Let's treat the fever and pain with paracetamol and lozenges.",
      bahasaMelayu: "Penyakit ini berpunca daripada jangkitan kuman virus, bukannya bakteria. Antibiotik hanya membunuh bakteria dan tidak berkesan untuk virus selsema atau tekak ini. Jika ambil antibiotik tanpa perlu, boleh dapat cirit-birit, alahan, dan kuman menjadi kebal. Kita rawat sakit tekak dan demam dengan ubat tahan sakit dan kumur air garam."
    }
  };

  if (q.includes('uti') || q.includes('kencing') || q.includes('dysuria') || q.includes('cystitis')) {
    result.condition = "Uncomplicated Acute Cystitis";
    result.antibioticIndicated = true;
    result.primaryRegimen = {
      drug: "Oral Nitrofurantoin (Modified Release / Macrocrystals)",
      dose: "100 mg",
      frequency: "BD (Twice daily with meals)",
      duration: "5 Days",
      instructions: "Take with food or milk to optimize tolerance. Complete full 5 days.",
      pearl: "MOH NAG 1st-line for simple cystitis. Avoid Ciprofloxacin for uncomplicated cystitis to prevent collateral fluoroquinolone resistance."
    };
    result.alternativeRegimen = {
      allergyType: "Alternative / Penicillin safe",
      drug: "Oral Fosfomycin Trometamol",
      dose: "3 g sachet",
      frequency: "Stat (Single dose dissolved in water)",
      duration: "1 Day (Single dose)"
    };
    result.clinicalReasoning = "Acute dysuria, frequency, and urgency in non-pregnant adult female with positive nitrites/pyuria indicates acute uncomplicated cystitis. E. coli remains the dominant pathogen.";
    result.redFlags = ["High fever with chills/rigors", "Flank pain / costovertebral angle tenderness (suspect pyelonephritis)", "Gross hematuria without improvement", "Vomiting / unable to retain oral medications"];
    result.cpgReference = "MOH Malaysia National Antimicrobial Guideline (NAG) - Urinary Tract Infections";
  } else if (q.includes('pneumonia') || q.includes('cap') || q.includes('crepitations')) {
    result.condition = "Community-Acquired Pneumonia (CAP) - Outpatient Low Risk";
    result.antibioticIndicated = true;
    result.primaryRegimen = {
      drug: "Oral Amoxicillin",
      dose: "1 g",
      frequency: "TDS (Three times daily)",
      duration: "5 to 7 Days",
      instructions: "Add Oral Azithromycin 500mg D1 then 250mg D2-5 if atypical pathogens suspected or patient not improving.",
      pearl: "CRB-65 score MUST be 0 for outpatient management. If CRB-65 >= 1, refer to hospital ED."
    };
    result.alternativeRegimen = {
      allergyType: "Penicillin Allergy",
      drug: "Oral Doxycycline OR Azithromycin",
      dose: "Doxycycline 100mg BD / Azithromycin 500mg OD",
      frequency: "BD / OD",
      duration: "5 to 7 Days"
    };
    result.cpgReference = "MOH Malaysia CPG Management of Community-Acquired Pneumonia in Adults & NAG";
    result.redFlags = ["Tachypnea RR >= 30/min", "Hypotension SBP < 90 mmHg or DBP <= 60 mmHg", "Confusion or altered mental state", "SpO2 < 95% on room air"];
  } else if (q.includes('cellulitis') || q.includes('skin') || q.includes('erysipelas')) {
    result.condition = "Acute Non-Purulent Cellulitis";
    result.antibioticIndicated = true;
    result.primaryRegimen = {
      drug: "Oral Cloxacillin",
      dose: "500 mg",
      frequency: "QID (Four times daily)",
      duration: "5 to 7 Days",
      instructions: "CRUCIAL: Must be taken on an EMPTY STOMACH (1 hour before or 2 hours after food). Food impairs absorption significantly.",
      pearl: "Mark advancing borders with surgical pen. Group A Strep and Staph aureus are primary pathogens."
    };
    result.alternativeRegimen = {
      allergyType: "Penicillin Allergy (Non-anaphylaxis)",
      drug: "Oral Cephalexin 500mg QID OR Oral Clindamycin 300mg TDS",
      dose: "500 mg",
      frequency: "QID / TDS",
      duration: "5 to 7 Days"
    };
    result.cpgReference = "MOH Malaysia NAG - Skin and Soft Tissue Infections";
  } else if (q.includes('bite') || q.includes('gigit') || q.includes('dog') || q.includes('cat') || q.includes('kucing') || q.includes('anjing')) {
    result.condition = "Animal / Human Bite Wound (Infected or High Risk)";
    result.antibioticIndicated = true;
    result.primaryRegimen = {
      drug: "Oral Co-amoxiclav (Augmentin)",
      dose: "625 mg",
      frequency: "TDS (Three times daily with food)",
      duration: "5 to 7 Days",
      instructions: "Thorough wound irrigation with saline. Check Tetanus toxoid status! Do NOT primary close puncture wounds.",
      pearl: "Pasteurella multocida (cat/dog bites) is resistant to cephalexin, cloxacillin, and clindamycin. Co-amoxiclav is the mandatory gold standard."
    };
    result.alternativeRegimen = {
      allergyType: "Penicillin Allergy",
      drug: "Oral Doxycycline 100mg BD + Oral Metronidazole 400mg TDS",
      dose: "Combination",
      frequency: "BD + TDS",
      duration: "7 Days"
    };
    result.cpgReference = "MOH Malaysia NAG & Emergency Wound Care Protocols";
  } else if (q.includes('otitis') || q.includes('aom') || q.includes('ear') || q.includes('telinga')) {
    result.condition = "Acute Otitis Media (AOM)";
    result.antibioticIndicated = true;
    result.primaryRegimen = {
      drug: "Oral Amoxicillin (High Dose)",
      dose: "Adult: 1 g TDS | Paeds: 80-90 mg/kg/day divided BD/TDS",
      frequency: "TDS / BD",
      duration: "5 to 7 Days (10 days if age < 2 years)",
      instructions: "High dose required to penetrate middle ear fluid and treat resistant Strep pneumoniae.",
      pearl: "If treatment failure after 48-72h, escalate to Oral Co-amoxiclav (Augmentin)."
    };
    result.alternativeRegimen = {
      allergyType: "Penicillin Allergy",
      drug: "Oral Cefuroxime axetil (if non-anaphylactic) OR Azithromycin",
      dose: "Age-adjusted",
      frequency: "BD / OD",
      duration: "5 to 7 Days"
    };
    result.cpgReference = "MOH Malaysia CPG Acute Otitis Media & NAG";
  }

  return result;
}

// API: Clinical Consult with Gemini or intelligent rule-based fallback
app.post('/api/clinical-consult', async (req: Request, res: Response) => {
  try {
    const {
      patientAge,
      chiefComplaint,
      durationDays,
      symptoms,
      temperature,
      systolicBp,
      heartRate,
      respiratoryRate,
      spO2,
      centorScore,
      penicillinAllergy,
      allergyDetails,
      investigations,
      setting, // "GP_CLINIC" | "EMERGENCY_DEPT"
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      // Offline fallback: Use MOH NAG calibrated rule-based clinical engine
      const fallbackResult = generateRuleBasedConsult(
        `${chiefComplaint || ''} ${symptoms?.join(' ') || ''}`,
        chiefComplaint,
        penicillinAllergy ? allergyDetails : undefined
      );
      return res.json({
        ...fallbackResult,
        source: "MOH_NAG_OFFLINE_RULES",
        note: "Generated via internal MOH Malaysia NAG Guideline Engine (Offline Mode)."
      });
    }

    const prompt = `
Patient Context:
- Clinical Setting: ${setting || 'Primary Care / GP Clinic in Malaysia'}
- Age: ${patientAge || 'Adult'}
- Chief Complaint: ${chiefComplaint || 'Upper respiratory symptoms'}
- Duration of illness: ${durationDays ? durationDays + ' days' : 'Acute'}
- Presenting Symptoms: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms || 'None listed'}
- Vitals: Temp: ${temperature || 'Not recorded'}°C, BP: ${systolicBp || 'Normal'}, HR: ${heartRate || 'Normal'} bpm, RR: ${respiratoryRate || 'Normal'}/min, SpO2: ${spO2 || 'Normal'}%
- Calculated Centor/McIsaac Score (if pharyngitis): ${centorScore !== undefined ? centorScore : 'N/A'}
- Penicillin Allergy: ${penicillinAllergy ? `YES - Details: ${allergyDetails || 'Unspecified'}` : 'NO known drug allergy'}
- Available Investigations/Labs: ${investigations || 'None performed yet'}

Task:
Provide a rigorous, concise antimicrobial stewardship decision for this patient following the MOH Malaysia National Antimicrobial Guideline (NAG) and relevant CPGs. Focus on preventing unnecessary antibiotics if viral (e.g. bronchitis, common cold, viral gastroenteritis, low-score pharyngitis), or selecting the exact right first-line drug, dose, frequency, duration, and penicillin allergy alternative if a true bacterial infection is present. Include both English and colloquial Bahasa Melayu doctor-patient communication scripts. Return response as valid JSON matching the schema provided.
`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out')), 6000)
    );

    const response: any = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: CLINICAL_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.2, // Low temperature for high clinical precision
        },
      }),
      timeoutPromise
    ]);

    const text = response.text || '';
    const parsed = JSON.parse(text);

    return res.json({
      ...parsed,
      source: "GEMINI_MOH_NAG_CONSULTANT",
    });

  } catch (error: any) {
    console.error("Clinical consult error, falling back to rule-based engine:", error);
    const fallbackResult = generateRuleBasedConsult(
      `${req.body.chiefComplaint || ''} ${req.body.symptoms?.join?.(' ') || ''}`,
      req.body.chiefComplaint,
      req.body.penicillinAllergy ? req.body.allergyDetails : undefined
    );
    return res.json({
      ...fallbackResult,
      source: "MOH_NAG_OFFLINE_RULES_FALLBACK",
      errorNote: "Live AI unavailable; delivered from local MOH NAG knowledge matrix."
    });
  }
});

// API: Patient Counseling Explainer Generator (Bilingual English & Bahasa Melayu)
app.post('/api/patient-counseling', async (req: Request, res: Response) => {
  try {
    const { condition, antibioticPrescribed, drugName, duration } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        english: {
          title: `Important Information: ${condition || 'Viral Upper Respiratory Infection'}`,
          whyNoAntibiotic: "Antibiotics are only effective against bacteria. Your condition is caused by a virus. Taking antibiotics for viral infections does not help you recover faster and causes side effects like diarrhea and bacterial resistance.",
          homeCare: "Rest well, drink plenty of fluids, and use paracetamol for fever and pain as instructed.",
          warningSigns: "Seek immediate medical review if you develop difficulty breathing, chest pain, inability to swallow, or high fever persisting more than 3-5 days."
        },
        bahasaMelayu: {
          title: `Maklumat Rawatan: ${condition || 'Jangkitan Virus Saluran Pernafasan'}`,
          whyNoAntibiotic: "Antibiotik hanya membunuh bakteria dan tidak berkesan untuk virus. Mengambil antibiotik tanpa keperluan tidak mempercepatkan sembuh, malah boleh menyebabkan alahan, cirit-birit, dan kuman menjadi kebal.",
          homeCare: "Dapatkan rehat yang cukup, minum banyak air kosong, dan ambil paracetamol jika demam atau sakit tekak.",
          warningSigns: "Segera ke klinik atau kecemasan hospital jika sesak nafas, tidak boleh menelan air liur, sakit dada, atau demam tinggi melebihi 3-5 hari."
        }
      });
    }

    const prompt = `
Generate clear, respectful, empathetic patient education leaflet text for a patient seen in a Malaysian primary care clinic:
Condition: ${condition || 'Upper Respiratory Tract Infection'}
Antibiotic Prescribed: ${antibioticPrescribed ? `YES (${drugName}, duration: ${duration})` : 'NO (Viral etiology, antibiotics withheld)'}

Return JSON with structure:
{
  "english": {
    "title": string,
    "whyNoAntibiotic": string,
    "homeCare": string,
    "warningSigns": string
  },
  "bahasaMelayu": {
    "title": string,
    "whyNoAntibiotic": string,
    "homeCare": string,
    "warningSigns": string
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error("Patient counseling error:", error);
    return res.status(500).json({ error: "Failed to generate counseling content" });
  }
});

// Vite middleware mounting or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`AntibioticGuard PrimaryCare Server running on http://localhost:${PORT}`);
  });
}

startServer();
