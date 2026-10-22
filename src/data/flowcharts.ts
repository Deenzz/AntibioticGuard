import { FlowchartGraph } from '../types/clinical';

export const CLINICAL_FLOWCHARTS: FlowchartGraph[] = [
  {
    id: 'sore-throat',
    title: 'Acute Sore Throat & Pharyngitis Triage',
    icon: 'stethoscope',
    description: 'Differentiates viral sore throat from Group A Strep (GABHS) & screens for airway emergencies (Quinsy/Epiglottitis).',
    initialStepId: 'check-redflags',
    steps: {
      'check-redflags': {
        id: 'check-redflags',
        question: 'Step 1: Check for Emergency Red Flags / Quinsy',
        hint: 'Examine for trismus, hot-potato muffled voice, uvular deviation, severe unilateral tonsillar swelling, drooling, or stridor.',
        options: [
          {
            label: 'YES: Severe Red Flag(s) Present',
            actionOutcome: {
              title: 'EMERGENCY: Suspected Quinsy or Epiglottitis',
              status: 'URGENT_REFERRAL',
              reasoning: 'Unilateral tonsillar bulge, uvular deviation, and trismus indicate Peritonsillar Abscess (Quinsy) or deep neck space infection. Stridor and drooling indicate supraglottitis/epiglottitis.',
              references: 'Refer immediately to Hospital Emergency Dept / ENT Specialist for aspiration/drainage and IV Ceftriaxone + Metronidazole. Do NOT examine pharynx with tongue depressor if epiglottitis is suspected.'
            }
          },
          {
            label: 'NO: No airway compromise or trismus',
            nextStepId: 'check-centor'
          }
        ]
      },
      'check-centor': {
        id: 'check-centor',
        question: 'Step 2: Calculate Centor / McIsaac Clinical Criteria',
        hint: 'Score 1 point each: Fever >38°C, Absence of cough/runny nose, Tender anterior cervical adenopathy, Tonsillar exudate/swelling. Age: 3-14 (+1), 15-44 (0), >=45 (-1).',
        options: [
          {
            label: 'Score 0 to 1 Point (Very Low Strep Risk < 10%)',
            actionOutcome: {
              title: 'Viral Pharyngitis - Withhold Antibiotics',
              status: 'VIRAL_WITHHOLD',
              reasoning: 'GABHS probability is under 10%. Over 90% are viral (rhinovirus, adenovirus, EBV). Antibiotics will not reduce symptom duration and cause side effects & resistance.',
              references: 'MOH NAG & CPG URTI: Prescribe Paracetamol 500-1000mg TDS/QID PRN + Lozenges + warm saline gargles. Provide delayed safety-net counseling.'
            }
          },
          {
            label: 'Score 2 to 3 Points (Intermediate Risk 15 - 32%)',
            actionOutcome: {
              title: 'Intermediate Risk: Delayed Script or Throat Swab / RADT',
              status: 'DELAYED_SCRIPT',
              drugChoice: 'Delayed Script: Oral Penicillin V 500mg QID x 10d (or Amoxicillin 500mg BD x 10d)',
              reasoning: 'Probability of Strep is moderate (15-32%). Rapid Antigen Detection Test (RADT) or throat swab is recommended if available. If unavailable, implement a Delayed Prescription strategy.',
              references: 'MOH NAG: Instruct patient to wait 48-72 hours. Fill prescription ONLY if fever spikes, throat pain worsens, or no improvement by day 3.'
            }
          },
          {
            label: 'Score 4 to 5 Points (High Strep Probability 40 - 60%)',
            actionOutcome: {
              title: 'Bacterial Pharyngitis - 1st-Line Antibiotic Indicated',
              status: 'BACTERIAL_INDICATED',
              drugChoice: 'Oral Phenoxymethylpenicillin (Pen V) 500mg QID x 10 DAYS (or Amoxicillin 500mg BD x 10d)',
              reasoning: 'High likelihood of Group A Strep. A full 10-day course of narrow-spectrum penicillin is required to eradicate pharyngeal carriage and prevent post-streptococcal Acute Rheumatic Fever (ARF).',
              references: 'MOH Malaysia NAG 3rd Ed. If Penicillin Allergy: Oral Azithromycin 500mg OD x 5d OR Oral Cephalexin 500mg BD x 10d (if non-anaphylactic).'
            }
          }
        ]
      }
    }
  },
  {
    id: 'acute-cough',
    title: 'Acute Cough & Lower Respiratory Triage (Bronchitis vs CAP)',
    icon: 'activity',
    description: 'Prevents unnecessary antibiotics for acute viral bronchitis and identifies high-risk Community-Acquired Pneumonia (CAP).',
    initialStepId: 'check-focal-signs',
    steps: {
      'check-focal-signs': {
        id: 'check-focal-signs',
        question: 'Step 1: Clinical Chest Examination & Vitals',
        hint: 'Are there signs of focal lung consolidation (unilateral bronchial breathing, dense focal crepitations/dullness) OR systemic vitals compromise (RR >= 24, HR > 100, SpO2 < 95%)?',
        options: [
          {
            label: 'NO: Normal vitals, bilateral vesicular breath sounds or diffuse rhonchi/wheeze',
            nextStepId: 'bronchitis-assessment'
          },
          {
            label: 'YES: Focal crepitations, bronchial breathing, or tachypnea (Suspect CAP)',
            nextStepId: 'crb65-calc'
          }
        ]
      },
      'bronchitis-assessment': {
        id: 'bronchitis-assessment',
        question: 'Step 2: Acute Bronchitis Assessment in Previously Healthy Host',
        hint: 'Patient presents with cough < 3 weeks, with or without green/yellow sputum, normal vitals, no underlying chronic lung disease.',
        options: [
          {
            label: 'Healthy adult with acute bronchitis (even with green/purulent phlegm)',
            actionOutcome: {
              title: 'Acute Viral Bronchitis - ANTIBIOTICS STRICTLY CONTRAINDICATED',
              status: 'VIRAL_WITHHOLD',
              reasoning: '>90% viral. Sputum purulence is due to neutrophil myeloperoxidase, NOT bacteria! Multiple randomized trials show antibiotics do not shorten cough duration.',
              references: 'MOH NAG & CPG URTI: Reassure patient that normal viral cough takes 2-3 weeks to resolve completely. Offer inhaled salbutamol if wheezing, warm honey-lemon, and paracetamol.'
            }
          },
          {
            label: 'Patient has underlying COPD / Bronchiectasis with acute exacerbation (Anthonisen criteria)',
            actionOutcome: {
              title: 'COPD Exacerbation (AECOPD) - Antibiotic Indicated',
              status: 'BACTERIAL_INDICATED',
              drugChoice: 'Oral Co-amoxiclav 625mg TDS x 5-7 days OR Oral Doxycycline 100mg BD x 5-7 days',
              reasoning: 'Patients with Anthonisen Type 1 (increased dyspnea + increased sputum volume + increased sputum purulence) benefit significantly from antibiotics.',
              references: 'MOH CPG Management of Chronic Obstructive Pulmonary Disease (COPD) & NAG.'
            }
          }
        ]
      },
      'crb65-calc': {
        id: 'crb65-calc',
        question: 'Step 3: Calculate CRB-65 Outpatient Mortality Score for CAP',
        hint: '1 point for each: C (New Confusion / AMT <= 8), R (Respiratory Rate >= 30/min), B (BP SBP < 90 or DBP <= 60 mmHg), 65 (Age >= 65 years).',
        options: [
          {
            label: 'CRB-65 Score = 0 (Low Risk, 30-day mortality < 1%)',
            actionOutcome: {
              title: 'Outpatient CAP (Low Risk) - Oral Amoxicillin',
              status: 'BACTERIAL_INDICATED',
              drugChoice: 'Oral Amoxicillin 1 g TDS x 5 to 7 days (+/- Oral Azithromycin 500mg D1 then 250mg D2-5)',
              reasoning: 'Safe for outpatient oral management. Streptococcus pneumoniae remains the predominant pathogen.',
              references: 'MOH Malaysia CPG Management of CAP in Adults. Penicillin allergy: Oral Doxycycline 100mg BD x 5-7d. Safety-net: Review at 48 hours.'
            }
          },
          {
            label: 'CRB-65 Score >= 1 (Intermediate to High Risk, mortality 8% to >30%)',
            actionOutcome: {
              title: 'HOSPITAL REFERRAL MANDATORY: Moderate/Severe CAP',
              status: 'URGENT_REFERRAL',
              reasoning: 'Presence of confusion, tachypnea, hypotension, or advanced age carries high inpatient mortality. Requires hospital admission, blood cultures, sputum C&S, and parenteral antibiotics.',
              references: 'Refer to Hospital ED. Give stat dose of IV/IM Ceftriaxone 1g if transport delay > 1 hour.'
            }
          }
        ]
      }
    }
  },
  {
    id: 'dysuria-uti',
    title: 'Dysuria & Urinary Tract Infection (UTI) Triage',
    icon: 'droplets',
    description: 'Guides rational treatment of uncomplicated cystitis, prevents fluoroquinolone overuse, and avoids overtreating asymptomatic bacteriuria.',
    initialStepId: 'check-pyelo',
    steps: {
      'check-pyelo': {
        id: 'check-pyelo',
        question: 'Step 1: Check for Upper Tract / Pyelonephritis Symptoms',
        hint: 'Does the patient have fever (>38°C), chills/rigors, flank/loin pain, costovertebral angle tenderness, or systemic nausea/vomiting?',
        options: [
          {
            label: 'YES: High fever, loin pain, or rigors present (Acute Pyelonephritis)',
            actionOutcome: {
              title: 'Acute Pyelonephritis (Upper UTI)',
              status: 'BACTERIAL_INDICATED',
              drugChoice: 'Oral Ciprofloxacin 500mg BD x 7d OR Co-amoxiclav 625mg TDS x 10-14d (Send Urine C&S first!)',
              reasoning: 'Upper tract infection requiring adequate renal tissue penetration. Nitrofurantoin is INEFFECTIVE for pyelonephritis as it only concentrates in bladder urine.',
              references: 'MOH NAG. If hemodynamically unstable, vomiting, or pregnant: refer Hospital ED for admission and IV Ceftriaxone 1g daily.'
            }
          },
          {
            label: 'NO: Symptoms strictly confined to lower tract (dysuria, frequency, urgency)',
            nextStepId: 'check-symptoms'
          }
        ]
      },
      'check-symptoms': {
        id: 'check-symptoms',
        question: 'Step 2: Are clinical symptoms of lower urinary tract infection present?',
        hint: 'Evaluate for acute painful urination (dysuria), urgency, and frequency in the absence of vaginal discharge/itching.',
        options: [
          {
            label: 'Symptomatic Acute Dysuria + Frequency (Uncomplicated Cystitis in Non-Pregnant Female)',
            actionOutcome: {
              title: 'Uncomplicated Cystitis - 1st-Line Stewardship Choice',
              status: 'BACTERIAL_INDICATED',
              drugChoice: 'Oral Nitrofurantoin 100mg BD x 5 days OR Oral Fosfomycin 3g stat sachet',
              reasoning: 'MOH NAG 1st-line choices have low resistance rates and minimal collateral damage. Do NOT use Ciprofloxacin for simple cystitis to prevent community ESBL resistance.',
              references: 'MOH NAG: Alternative is Oral Cephalexin 500mg BD x 5d. Note: Nitrofurantoin is contraindicated if eGFR < 30 mL/min.'
            }
          },
          {
            label: 'Asymptomatic Bacteriuria (Bacteria on dipstick/microscopy with NO dysuria/frequency)',
            actionOutcome: {
              title: 'Asymptomatic Bacteriuria - DO NOT TREAT',
              status: 'VIRAL_WITHHOLD',
              reasoning: 'Bacteria in the urine without urinary symptoms does NOT constitute an infection in non-pregnant adults or elderly patients. Treating it eradicates protective commensal strains and selects for resistant MDR pathogens.',
              references: 'MOH Malaysia NAG & Infectious Diseases Society Guidelines: Antibiotics are ONLY indicated in pregnant women or prior to invasive urological procedures.'
            }
          }
        ]
      }
    }
  },
  {
    id: 'skin-ssti',
    title: 'Skin & Soft Tissue Infection (SSTI) Decision Pathway',
    icon: 'shield',
    description: 'Differentiates non-purulent cellulitis from purulent abscess and flags surgical emergencies like Necrotizing Fasciitis.',
    initialStepId: 'check-necfasc',
    steps: {
      'check-necfasc': {
        id: 'check-necfasc',
        question: 'Step 1: Screen for Surgical Emergencies (Necrotizing Fasciitis)',
        hint: 'Look for: Pain severely out of proportion to skin signs, skin anesthesia, bullae/blisters, purple/dusky skin, crepitus, or septic shock.',
        options: [
          {
            label: 'YES: Severe pain out of proportion, dusky bullae, or crepitus',
            actionOutcome: {
              title: 'SURGICAL RED ALERT: Suspected Necrotizing Fasciitis',
              status: 'URGENT_REFERRAL',
              reasoning: 'Life- and limb-threatening surgical emergency. Subcutaneous tissue destruction spreads rapidly along fascial planes. Antibiotics alone are completely futile without immediate surgical debridement.',
              references: 'Urgent immediate transfer to Hospital ED / General Surgery. Resuscitate with IV fluids and give stat broad-spectrum IV antibiotics (e.g., Ceftriaxone + Metronidazole or Piperacillin-Tazobactam).'
            }
          },
          {
            label: 'NO: Typical warm, erythematous, swollen skin without necrotic features',
            nextStepId: 'purulent-vs-nonpurulent'
          }
        ]
      },
      'purulent-vs-nonpurulent': {
        id: 'purulent-vs-nonpurulent',
        question: 'Step 2: Is it Purulent (Fluctuant Abscess / Boil) or Non-Purulent (Diffuse Cellulitis)?',
        hint: 'Examine for discrete fluctuance, collection of pus, or diffuse spreading non-fluctuant erythema.',
        options: [
          {
            label: 'Purulent: Cutaneous Abscess / Furuncle / Carbuncle with fluctuance',
            actionOutcome: {
              title: 'Cutaneous Abscess - Incision & Drainage is Primary Treatment',
              status: 'BACTERIAL_INDICATED',
              drugChoice: 'Primary: Incision & Drainage (I&D). Antibiotics usually NOT needed if uncomplicated.',
              reasoning: 'Pus collection must be evacuated. Antibiotics cannot penetrate into an intact abscess cavity. If surrounding cellulitis >5cm, systemic fever, or immunocompromised, add Oral Cloxacillin 500mg QID x 5d.',
              references: 'MOH NAG & Emergency Wound Care: In penicillin allergy, use Oral Clindamycin 300mg TDS x 5d.'
            }
          },
          {
            label: 'Non-Purulent: Spreading Erythema & Edema (Typical Cellulitis / Erysipelas)',
            actionOutcome: {
              title: 'Non-Purulent Cellulitis - 1st-Line Anti-Staph/Strep Regimen',
              status: 'BACTERIAL_INDICATED',
              drugChoice: 'Oral Cloxacillin 500mg QID (MUST be on EMPTY STOMACH) x 5 to 7 days',
              reasoning: 'Group A Streptococcus and Staphylococcus aureus are the causative pathogens. Mark advancing edges with a surgical pen.',
              references: 'MOH NAG: MUST take Cloxacillin 1 hour before or 2 hours after meals (food reduces absorption by >50%). Penicillin allergy: Oral Cephalexin 500mg QID or Clindamycin 300mg TDS. Elevate the affected limb!'
            }
          }
        ]
      }
    }
  }
];
