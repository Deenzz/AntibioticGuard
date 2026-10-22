import { DiseaseProtocol, BiomarkerRef } from '../types/clinical';

export const CPG_DISEASE_DATABASE: DiseaseProtocol[] = [
  {
    id: 'pharyngitis',
    name: 'Acute Streptococcal Pharyngitis / Tonsillitis',
    organ: 'URTI / Throat',
    commonPathogens: 'Group A Beta-Hemolytic Streptococcus (Streptococcus pyogenes)',
    firstLine: {
      drug: 'Oral Phenoxymethylpenicillin (Penicillin V)',
      dose: '500 mg',
      frequency: 'QID (Four times daily on an empty stomach)',
      duration: '10 Days (Full course mandatory)',
      instructions: 'Take 1 hour before or 2 hours after meals. Must complete full 10-day course to prevent Acute Rheumatic Fever (ARF).'
    },
    secondLineOrAllergy: {
      drug: 'Oral Amoxicillin 500mg BD/TDS (Adult alternative) OR Oral Azithromycin 500mg OD x 5d (Penicillin allergy)',
      dose: 'Amoxicillin 500 mg BD/TDS or Azithromycin 500 mg OD',
      frequency: 'BD/TDS x 10d (Amox) or OD x 5d (Azith)',
      duration: '10 Days (Amox) / 5 Days (Azithromycin)',
      note: 'If non-anaphylactic delayed rash: Oral Cephalexin 500mg BD x 10 days is safe and preferred over macrolides.'
    },
    pediatricDose: 'Amoxicillin 50 mg/kg/day divided BD x 10 days (or Pen V 250mg TDS/QID x 10 days)',
    renalAdjustment: 'Pen V: dose reduction only if severe renal failure (eGFR < 10 mL/min).',
    stewardshipPearl: 'Centor/McIsaac score <= 1 has <10% Strep risk; antibiotics provide NO benefit and harm gut flora. Co-amoxiclav (Augmentin) is strictly unnecessary for simple acute tonsillitis.',
    cpgSource: 'MOH Malaysia National Antimicrobial Guideline (NAG) 3rd Ed. & CPG Management of URTI',
    redFlags: [
      'Trismus (inability to open jaw normally)',
      'Hot-potato muffled voice, severe unilateral tonsillar bulge with uvular deviation (Peritonsillar Abscess / Quinsy)',
      'Inability to swallow saliva / pooling of secretions',
      'Stridor or neck swelling / crepitus (Epiglottitis / Ludwig Angina)'
    ]
  },
  {
    id: 'aom',
    name: 'Acute Otitis Media (AOM)',
    organ: 'Ear / ENT',
    commonPathogens: 'Streptococcus pneumoniae, non-typeable Haemophilus influenzae, Moraxella catarrhalis',
    firstLine: {
      drug: 'Oral Amoxicillin (High-Dose Protocol)',
      dose: 'Adults: 1 g TDS | Paeds: 80 - 90 mg/kg/day divided BD or TDS',
      frequency: 'TDS (Adults) / BD (Paeds)',
      duration: '5 to 7 Days (10 days if age < 2 years or tympanic perforation)',
      instructions: 'High dose is necessary in Southeast Asia to overcome intermediate penicillin-resistant S. pneumoniae (PRSP) in middle ear fluid.'
    },
    secondLineOrAllergy: {
      drug: 'Oral Co-amoxiclav (Augmentin) 625 mg TDS (Adult) or 45/6.4 mg/kg/day (Paeds)',
      dose: '625 mg TDS',
      frequency: 'TDS with meals',
      duration: '5 to 7 Days',
      note: 'Indicated if clinical failure after 48-72h of high-dose amoxicillin (covers beta-lactamase producing H. influenzae / M. catarrhalis). Penicillin anaphylaxis: Oral Azithromycin or Clarithromycin.'
    },
    pediatricDose: 'Amoxicillin 80-90 mg/kg/day divided BD or TDS (e.g. 10kg child = 800mg/day -> 400mg BD)',
    renalAdjustment: 'Reduce dose frequency to BD if eGFR 10-30 mL/min; OD if eGFR < 10 mL/min.',
    stewardshipPearl: 'In children >2 years with mild unilateral otalgia and no high fever, an initial 48-hour watchful waiting with analgesia (Paracetamol/Ibuprofen) is endorsed by CPG guidelines.',
    cpgSource: 'MOH Malaysia CPG Acute Otitis Media & NAG (Infectious Diseases Committee)',
    redFlags: [
      'Post-auricular erythema, tenderness, and ear protrusion (Acute Mastoiditis - emergency CT & ENT refer)',
      'Facial nerve palsy (facial drooping)',
      'Meningism, photophobia, severe headache or altered consciousness',
      'Vertigo or spontaneous nystagmus (Labyrinthitis)'
    ]
  },
  {
    id: 'sinusitis',
    name: 'Acute Bacterial Rhinosinusitis (ABRS)',
    organ: 'Ear / ENT',
    commonPathogens: 'Streptococcus pneumoniae, Haemophilus influenzae, anaerobes',
    firstLine: {
      drug: 'Oral Amoxicillin',
      dose: '500 mg to 1 g',
      frequency: 'TDS (Three times daily)',
      duration: '5 to 7 Days',
      instructions: 'Combine with regular nasal saline irrigation and intranasal corticosteroid spray (e.g. Fluticasone or Mometasone).'
    },
    secondLineOrAllergy: {
      drug: 'Oral Co-amoxiclav 625 mg TDS OR Oral Doxycycline 100 mg BD',
      dose: '625 mg TDS (Augmentin) or 100 mg BD (Doxy)',
      frequency: 'TDS / BD',
      duration: '5 to 7 Days',
      note: 'Doxycycline is preferred in adults with severe penicillin allergy. Fluoroquinolones are NOT first-line.'
    },
    pediatricDose: 'Amoxicillin 50-90 mg/kg/day divided TDS x 7-10 days',
    renalAdjustment: 'Adjust interval in renal impairment based on CrCl.',
    stewardshipPearl: '>90% of rhinosinusitis cases are viral (AVRS). Only diagnose bacterial if symptoms persist >10 days without improvement, or "double-sickening" (worsening after 5 days of initial recovery).',
    cpgSource: 'MOH Malaysia CPG Rhinosinusitis in Adults & Children & NAG',
    redFlags: [
      'Periorbital swelling, proptosis, or visual acuity loss (Orbital cellulitis / subperiosteal abscess)',
      'Severe frontal headache with photophobia or meningism',
      'Forehead soft tissue fluctuant doughy swelling (Pott puffy tumor / osteomyelitis)',
      'Cranial nerve III, IV, VI palsies (Cavernous sinus thrombosis)'
    ]
  },
  {
    id: 'bronchitis',
    name: 'Acute Bronchitis (Previously Healthy Adult)',
    organ: 'Lower Respiratory',
    commonPathogens: '>90% Viral (Rhinovirus, Influenza A/B, Parainfluenza, RSV, Coronaviruses)',
    firstLine: {
      drug: 'ROUTINE ANTIBIOTICS NOT RECOMMENDED',
      dose: 'Nil',
      frequency: 'Nil',
      duration: '0 Days',
      instructions: 'Symptomatic therapy: Honey-lemon warm drinks, inhaled salbutamol if bronchial wheezing, paracetamol, saline gargles.'
    },
    secondLineOrAllergy: {
      drug: 'Supportive / Delayed Safety-Net Advice',
      dose: 'Nil',
      frequency: 'Nil',
      duration: 'Nil',
      note: 'Antibiotics neither reduce cough duration nor prevent pneumonia in healthy immunocompetent hosts.'
    },
    pediatricDose: 'Antibiotics contraindicated unless documented underlying bronchiectasis or cystic fibrosis.',
    renalAdjustment: 'Not applicable.',
    stewardshipPearl: 'PURULENT GREEN SPUTUM DOES NOT EQUAL BACTERIAL INFECTION! The color is produced by myeloperoxidase enzyme released from dying neutrophils fighting the viral infection. Average viral cough lasts 14 to 21 days.',
    cpgSource: 'MOH Malaysia National Antimicrobial Guideline & CPG Management of URTI',
    redFlags: [
      'Resting tachypnea (Respiratory rate >= 24/min in adults)',
      'SpO2 < 95% on room air or cyanosis',
      'Hemoptysis (coughing up frank blood)',
      'Focal consolidation on chest auscultation (unilateral bronchial breathing, dense localized crackles - suspect CAP)'
    ]
  },
  {
    id: 'cap',
    name: 'Community-Acquired Pneumonia (CAP) - Outpatient Low Risk',
    organ: 'Lower Respiratory',
    commonPathogens: 'Streptococcus pneumoniae, Mycoplasma pneumoniae, Chlamydia pneumoniae, H. influenzae',
    firstLine: {
      drug: 'Oral Amoxicillin (+/- Oral Azithromycin if atypical suspected)',
      dose: 'Amoxicillin 1 g TDS (+/- Azithromycin 500mg D1 then 250mg D2-5)',
      frequency: 'TDS (Amoxicillin) & OD (Azithromycin)',
      duration: '5 to 7 Days',
      instructions: 'Patient must have CRB-65 score of 0. Must be able to tolerate oral medication and have reliable home support.'
    },
    secondLineOrAllergy: {
      drug: 'Oral Doxycycline 100 mg BD OR Oral Co-amoxiclav 625 mg TDS + Azithromycin',
      dose: 'Doxycycline 100 mg BD or Co-amoxiclav 625 mg TDS',
      frequency: 'BD or TDS',
      duration: '5 to 7 Days',
      note: 'Doxycycline is an excellent single agent for outpatient CAP in penicillin-allergic patients (covers typical S. pneumoniae & atypicals).'
    },
    pediatricDose: 'Amoxicillin 80-90 mg/kg/day divided BD or TDS x 5-7 days',
    renalAdjustment: 'Amoxicillin: reduce to 500mg BD if eGFR 10-30 mL/min.',
    stewardshipPearl: 'Calculate CRB-65 immediately: (Confusion, RR >= 30, BP < 90/60, Age >= 65). Score 0 = Outpatient amoxicillin. Score >= 1 = Refer Hospital Emergency Dept for admission and IV therapy.',
    cpgSource: 'MOH Malaysia CPG Management of Community-Acquired Pneumonia in Adults (3rd Ed.) & NAG',
    redFlags: [
      'CRB-65 >= 1 (e.g. Age >= 65 with CAP, confusion, RR >= 30, SBP < 90)',
      'Oxygen saturation < 93% on room air',
      'Multi-lobar involvement on Chest X-Ray',
      'Inability to tolerate oral fluids or severe dehydration'
    ]
  },
  {
    id: 'cystitis',
    name: 'Uncomplicated Acute Cystitis (Adult Female)',
    organ: 'Urinary Tract (UTI)',
    commonPathogens: 'Escherichia coli (75-90%), Klebsiella pneumoniae, Staphylococcus saprophyticus, Proteus mirabilis',
    firstLine: {
      drug: 'Oral Nitrofurantoin (Modified Release / Macrocrystals)',
      dose: '100 mg',
      frequency: 'BD (Twice daily with meals)',
      duration: '5 Days',
      instructions: 'Take with food or glass of milk. Alternatively: Oral Fosfomycin Trometamol 3 g single-dose sachet in water.'
    },
    secondLineOrAllergy: {
      drug: 'Oral Cephalexin 500 mg BD or Oral Co-amoxiclav 625 mg BD',
      dose: '500 mg BD (Cephalexin) or 625 mg BD (Co-amoxiclav)',
      frequency: 'BD (Twice daily)',
      duration: '5 Days',
      note: 'Co-amoxiclav 625mg BD is effective for non-ESBL coliforms. Avoid Ciprofloxacin/Levofloxacin for simple cystitis!'
    },
    pediatricDose: 'Cephalexin 25-50 mg/kg/day divided TDS x 5 days (Nitrofurantoin not recommended in infants <3 months)',
    renalAdjustment: 'CONTRAINDICATION: Nitrofurantoin is ineffective and risks peripheral neuropathy if eGFR < 30 mL/min.',
    stewardshipPearl: 'DO NOT USE CIPROFLOXACIN AS 1ST LINE FOR SIMPLE CYSTITIS. Reserving fluoroquinolones prevents community-wide ESBL and MDR Gram-negative resistance. Do NOT treat asymptomatic bacteriuria in non-pregnant women or elderly.',
    cpgSource: 'MOH Malaysia National Antimicrobial Guideline (NAG) - Urinary Tract Infections',
    redFlags: [
      'High fever (>38.5°C) with rigors (suspect Pyelonephritis or Urosepsis)',
      'Loin pain / Costovertebral angle (CVA) tenderness',
      'Vomiting, dehydration, or septic shock parameters',
      'Cystitis in pregnant woman, male patient, or catheterized patient (complicated UTI - requires urine C&S and alternative management)'
    ]
  },
  {
    id: 'pyelonephritis',
    name: 'Acute Pyelonephritis (Mild / Outpatient Setting)',
    organ: 'Urinary Tract (UTI)',
    commonPathogens: 'Escherichia coli, Proteus mirabilis, Klebsiella pneumoniae, Enterococcus',
    firstLine: {
      drug: 'Oral Ciprofloxacin 500 mg BD OR Oral Co-amoxiclav 625 mg TDS',
      dose: 'Ciprofloxacin 500 mg BD or Co-amoxiclav 625 mg TDS',
      frequency: 'BD (Cipro) or TDS (Co-amox)',
      duration: '7 Days (Ciprofloxacin) or 10-14 Days (Co-amoxiclav)',
      instructions: 'Always send clean catch mid-stream urine for Microscopic Examination (UFEME) and Culture & Sensitivity (C&S) prior to first dose.'
    },
    secondLineOrAllergy: {
      drug: 'Single initial stat dose of IV/IM Ceftriaxone 1 g, followed by Oral Ciprofloxacin or Cefuroxime axetil',
      dose: 'Ceftriaxone 1 g stat, then oral tailored to culture',
      frequency: 'Stat then tailored',
      duration: '10 to 14 Days total',
      note: 'If ESBL suspected or recent hospitalization: Hospital admission for IV Carbapenem / Aminoglycoside.'
    },
    pediatricDose: 'Children with pyelonephritis require hospital admission for parenteral antibiotics.',
    renalAdjustment: 'Ciprofloxacin: 250-500mg every 18-24h if eGFR 15-30 mL/min.',
    stewardshipPearl: 'Nitrofurantoin and Fosfomycin DO NOT achieve therapeutic renal parenchymal concentrations and MUST NOT be used for pyelonephritis.',
    cpgSource: 'MOH Malaysia NAG & CPG Management of Urinary Tract Infections',
    redFlags: [
      'Inability to tolerate oral fluids or persistent vomiting',
      'Signs of sepsis: HR > 100, RR > 22, SBP <= 100 mmHg, GCS < 15',
      'Pregnancy, solitary kidney, or known nephrolithiasis / urinary obstruction',
      'Worsening or lack of defervescence after 48 hours of compliant antibiotics'
    ]
  },
  {
    id: 'cellulitis',
    name: 'Cellulitis & Erysipelas (Non-Purulent)',
    organ: 'Skin / Soft Tissue',
    commonPathogens: 'Group A Streptococcus (Streptococcus pyogenes), Staphylococcus aureus (MSSA)',
    firstLine: {
      drug: 'Oral Cloxacillin',
      dose: '500 mg',
      frequency: 'QID (Four times daily on an EMPTY STOMACH)',
      duration: '5 to 7 Days',
      instructions: 'CRUCIAL COUNSELING: Must take 1 hour before or 2 hours after meals. Food drastically decreases Cloxacillin bioavailability by >50%!'
    },
    secondLineOrAllergy: {
      drug: 'Oral Cephalexin 500 mg QID (if non-anaphylactic allergy) OR Oral Clindamycin 300 mg TDS',
      dose: 'Cephalexin 500 mg QID or Clindamycin 300 mg TDS',
      frequency: 'QID / TDS',
      duration: '5 to 7 Days',
      note: 'Clindamycin provides excellent coverage for MRSA and Strep exotoxin suppression. Mark erythema borders with a pen to track progression.'
    },
    pediatricDose: 'Cloxacillin 50 mg/kg/day divided QID (empty stomach) or Cephalexin 25-50 mg/kg/day divided TDS',
    renalAdjustment: 'Cloxacillin: no dose adjustment needed in mild to moderate renal failure (dual hepatic/renal excretion).',
    stewardshipPearl: 'Elevate the limb! Venous stasis and edema significantly delay resolution. Oral Cloxacillin or Cephalexin is superior to Augmentin because pure MSSA/Strep does not require clavulanic acid.',
    cpgSource: 'MOH Malaysia National Antimicrobial Guideline - Skin & Soft Tissue Infections',
    redFlags: [
      'Pain out of proportion to physical exam findings (Red alert for Necrotizing Fasciitis!)',
      'Skin bullae, violaceous/purple discoloration, skin anesthesia, or crepitus (subcutaneous gas)',
      'Rapid advancing border (>2 cm/hour) despite antibiotics',
      'Systemic toxicity, hypotension, or altered sensorium'
    ]
  },
  {
    id: 'impetigo',
    name: 'Impetigo (Contagiosa / Bullous)',
    organ: 'Skin / Soft Tissue',
    commonPathogens: 'Staphylococcus aureus, Streptococcus pyogenes',
    firstLine: {
      drug: 'Topical Mupirocin 2% Ointment OR Topical Fusidic Acid 2% Cream',
      dose: 'Thin layer applied to lesions',
      frequency: 'TDS (Three times daily)',
      duration: '5 to 7 Days',
      instructions: 'Gently soak and de-crust golden-yellow crusts using warm saline or clean water before applying topical medication.'
    },
    secondLineOrAllergy: {
      drug: 'Oral Cephalexin 500 mg BD or Oral Cloxacillin 500 mg QID',
      dose: '500 mg BD/QID',
      frequency: 'BD (Cephalexin) or QID (Cloxacillin)',
      duration: '7 Days',
      note: 'Indicated for widespread lesions (>5-10 lesions), bullous impetigo in children, or failure of topical therapy.'
    },
    pediatricDose: 'Topical preferred; if systemic needed: Cephalexin 25-50 mg/kg/day divided BD/TDS',
    renalAdjustment: 'Standard safety profile.',
    stewardshipPearl: 'Limit topical fusidic acid/mupirocin use to <10 days to prevent emergence of resistant Staph strains in primary care.',
    cpgSource: 'MOH Malaysia NAG & Pediatric Dermatology Guidelines',
    redFlags: [
      'Generalized erythematous tender peeling skin (suspect Staphylococcal Scalded Skin Syndrome - SSSS in toddlers)',
      'Associated high fever with lethargy or dehydration',
      'Periorbital or facial cellulitis spread'
    ]
  },
  {
    id: 'bites',
    name: 'Animal & Human Bite Wounds (Dog, Cat, Human)',
    organ: 'Infected Wounds',
    commonPathogens: 'Pasteurella multocida (cats/dogs), Eikenella corrodens (humans), Capnocytophaga, Staph, Anaerobes',
    firstLine: {
      drug: 'Oral Co-amoxiclav (Augmentin)',
      dose: '625 mg',
      frequency: 'TDS (Three times daily with meals)',
      duration: '3 to 5 Days (Prophylaxis) or 7 to 10 Days (Infected wound)',
      instructions: 'Copious high-pressure wound irrigation with normal saline. Do NOT primary suture puncture wounds (leave open to drain).'
    },
    secondLineOrAllergy: {
      drug: 'Oral Doxycycline 100 mg BD + Oral Metronidazole 400 mg TDS',
      dose: 'Combination therapy',
      frequency: 'BD + TDS',
      duration: '7 to 10 Days',
      note: 'CRITICAL: Cephalexin, Cloxacillin, Erythromycin, and Clindamycin do NOT cover Pasteurella multocida! Doxycycline + Metronidazole is mandatory for penicillin allergy.'
    },
    pediatricDose: 'Co-amoxiclav 45/6.4 mg/kg/day divided BD or TDS (e.g. 10kg = 450mg/day)',
    renalAdjustment: 'Co-amoxiclav: reduce to 625mg BD if eGFR 10-30 mL/min.',
    stewardshipPearl: 'Cat bites are puncture wounds with >50% infection rate due to sharp teeth piercing periosteum/tenosynovium. Always verify Tetanus toxoid and rabies risk based on animal vaccination status.',
    cpgSource: 'MOH Malaysia NAG & Emergency Medicine Wound Guidelines',
    redFlags: [
      'Tendon sheath tenderness, finger in slight flexion, uniform digit swelling, pain on passive extension (Kanavel cardinal signs of Flexor Tenosynovitis - immediate ortho/hand consult!)',
      'Joint effusion adjacent to bite (Septic arthritis)',
      'Systemic fever, rigors, or rapidly ascending lymphangitis'
    ]
  },
  {
    id: 'gastroenteritis',
    name: 'Acute Infectious Diarrhea / Gastroenteritis (AGE)',
    organ: 'Gastrointestinal',
    commonPathogens: '>80% Viral (Rotavirus, Norovirus, Enteric Adenovirus) or self-limiting toxin (Staph, B. cereus)',
    firstLine: {
      drug: 'ROUTINE ANTIBIOTICS NOT RECOMMENDED. Oral Rehydration Salts (ORS) is cornerstone.',
      dose: 'ORS packets dissolved in clean water, drink after every loose stool',
      frequency: 'PRN frequent sips',
      duration: 'Until diarrhea resolves',
      instructions: 'Continue age-appropriate normal feeding. Avoid sugary drinks and juices. Add Zinc tablet (20mg/day for 14 days in children).'
    },
    secondLineOrAllergy: {
      drug: 'Oral Azithromycin 500 mg OD x 3 days OR Oral Ciprofloxacin 500 mg BD x 3 days',
      dose: 'Azithromycin 500 mg OD x 3d (Cipro 500 mg BD x 3d)',
      frequency: 'OD or BD',
      duration: '3 Days',
      note: 'ONLY indicated if severe invasive bacterial dysentery: Gross bloody mucoid stool + high sustained fever + tenesmus, or confirmed cholera.'
    },
    pediatricDose: 'Zinc sulphate: <6 months 10mg OD x 14d; >6 months 20mg OD x 14d. Antibiotics NOT indicated for watery diarrhea.',
    renalAdjustment: 'Adjust based on dehydration degree; prioritize IV hydration if in renal failure.',
    stewardshipPearl: 'Loperamide is CONTRAINDICATED in children and in patients with bloody diarrhea or toxic megacolon. In Malaysia, antibiotics for simple watery diarrhea cause prolonged Salmonella carriage and superbug emergence.',
    cpgSource: 'MOH Malaysia CPG Management of Acute Gastroenteritis in Children & Adults & NAG',
    redFlags: [
      'Severe dehydration: sunken eyes, prolonged skin pinch >2s, lethargy, cold extremities',
      'Gross bloody stools (dysentery) with high fever and prostration',
      'Anuria or severe oliguria >12 hours',
      'Suspected intussusception (red currant jelly stool, colicky screaming, bilious vomiting in infants)'
    ]
  },
  {
    id: 'hpylori',
    name: 'Helicobacter pylori Eradication (1st-Line Triple Therapy)',
    organ: 'Gastrointestinal',
    commonPathogens: 'Helicobacter pylori',
    firstLine: {
      drug: 'PPI (Esomeprazole 20mg BD or Omeprazole 20mg BD) + Amoxicillin 1g BD + Clarithromycin 500mg BD',
      dose: 'PPI BD + Amoxicillin 1g BD + Clarithromycin 500mg BD',
      frequency: 'BD (Twice daily)',
      duration: '14 Days (14 days superior to 7 days in Malaysia)',
      instructions: 'Take 30 minutes before breakfast and dinner. Emphasize compliance: missing doses causes immediate clarithromycin resistance.'
    },
    secondLineOrAllergy: {
      drug: 'Bismuth Quadruple Therapy: PPI BD + Bismuth subcitrate 240mg BD + Metronidazole 400mg TDS + Tetracycline 500mg QID x 14d',
      dose: 'Quadruple regimen',
      frequency: 'BD / TDS / QID',
      duration: '14 Days',
      note: 'Preferred 1st-line in penicillin-allergic patients or regions with high clarithromycin resistance (>15%).'
    },
    pediatricDose: 'Pediatric gastroenterologist referral indicated.',
    renalAdjustment: 'Reduce Clarithromycin to 500mg OD if eGFR < 30 mL/min.',
    stewardshipPearl: 'Confirm eradication with 13C-Urea Breath Test or Stool Antigen Test at least 4 weeks post-treatment and 2 weeks off PPI.',
    cpgSource: 'Malaysian Society of Gastroenterology & Hepatology Consensus & MOH NAG',
    redFlags: [
      'Dysphagia or odynophagia',
      'Persistent vomiting, unintentional weight loss, or epigastric mass',
      'Gastrointestinal bleeding (melena, hematemesis, anemia)'
    ]
  },
  {
    id: 'dental',
    name: 'Acute Dentoalveolar Abscess (Outpatient GP Care)',
    organ: 'Dental / Head & Neck',
    commonPathogens: 'Polymicrobial oral flora: Streptococcus viridans, Peptostreptococcus, Fusobacterium, Prevotella',
    firstLine: {
      drug: 'Oral Amoxicillin 500 mg TDS (+/- Metronidazole 400 mg TDS)',
      dose: 'Amoxicillin 500 mg TDS (+ Metronidazole 400 mg TDS if anaerobic)',
      frequency: 'TDS (Three times daily)',
      duration: '5 Days',
      instructions: 'URGENT DENTAL REFERRAL MANDATORY. Definitive treatment is operative (incision & drainage, root canal, or extraction).'
    },
    secondLineOrAllergy: {
      drug: 'Oral Clindamycin 300 mg TDS OR Oral Co-amoxiclav 625 mg TDS',
      dose: '300 mg TDS (Clindamycin) or 625 mg TDS (Co-amox)',
      frequency: 'TDS',
      duration: '5 Days',
      note: 'Clindamycin provides excellent oral anaerobic and Gram-positive bone penetration for penicillin-allergic patients.'
    },
    pediatricDose: 'Amoxicillin 40-50 mg/kg/day divided TDS x 5 days',
    renalAdjustment: 'Metronidazole: reduce frequency in severe hepatic/renal impairment.',
    stewardshipPearl: 'Antibiotics without dental surgical intervention will fail and lead to deep neck space abscess. Antibiotics are only adjuncts for systemic fever or facial spread.',
    cpgSource: 'MOH Malaysia Oral Health Division & NAG Guidelines',
    redFlags: [
      'Elevation of floor of mouth or tongue protrusion (Ludwig Angina - AIRWAY EMERGENCY)',
      'Trismus or limitation of mouth opening <2 fingerbreadths',
      'Difficulty swallowing saliva or respiratory distress',
      'Orbital cellulitis or vision changes from maxillary dental spread'
    ]
  }
];

export const INFECTION_BIOMARKERS: BiomarkerRef[] = [
  {
    name: 'C-Reactive Protein (CRP)',
    normalRange: '< 5.0 mg/L (Normal) | 5 – 20 mg/L (Typical Viral URTI)',
    redFlagThreshold: '> 100 mg/L (Severe bacterial CAP, deep tissue, or sepsis) OR < 20 mg/L with acute cough',
    clinicalAction: 'CRP < 20 mg/L: Withhold antibiotics with high confidence. CRP 20-100 mg/L: Delayed prescription or clinical re-evaluation. CRP > 100 mg/L: Perform CXR and initiate targeted antibiotics.',
    cpgNotes: 'Point-of-care CRP drastically reduces inappropriate primary care antibiotic prescriptions by >40% without increasing adverse outcomes.',
    dangerLevel: 'CRITICAL'
  },
  {
    name: 'White Cell Count (WCC) & Neutrophil %',
    normalRange: '4.0 – 10.0 × 10⁹/L | Neutrophils 40 – 70%',
    redFlagThreshold: 'WCC > 15.0 × 10⁹/L (with >10% bands) OR WCC < 4.0 × 10⁹/L in febrile patient',
    clinicalAction: 'Neutrophilia with toxic granulations indicates acute pyogenic infection. If WCC < 4.0 and febrile in Malaysia: STOP! Screen for Dengue (FBC + NS1 RDT) before reflexively prescribing antibiotics.',
    cpgNotes: 'CPG Dengue MOH Malaysia: Leucopenia is a hallmark of the febrile phase of dengue; giving antibiotics delays correct fluid monitoring.',
    dangerLevel: 'CRITICAL'
  },
  {
    name: 'Platelet Count (Plt)',
    normalRange: '150 – 400 × 10⁹/L',
    redFlagThreshold: '< 100 × 10⁹/L (or rapidly plunging daily count)',
    clinicalAction: 'Suspect Dengue Hemorrhagic Fever or severe bacteremic sepsis/DIC. Do NOT give NSAIDs (Ibuprofen, Mefenamic acid) or unnecessary antibiotics. Initiate Dengue home monitoring or hospital referral.',
    cpgNotes: 'NSAIDs in thrombocytopenic dengue patients trigger severe upper gastrointestinal hemorrhage.',
    dangerLevel: 'CRITICAL'
  },
  {
    name: 'CRB-65 Pneumonia Risk Score',
    normalRange: 'Score 0: Low Risk (<1% 30-day mortality)',
    redFlagThreshold: 'Score >= 1: Intermediate to High Risk (mortality 8% to >30%)',
    clinicalAction: 'CRB-65 Criteria: Confusion (AMT <= 8), RR >= 30/min, BP < 90/60 mmHg, Age >= 65. Score 0: Safe for outpatient oral Amoxicillin. Score >= 1: Refer Hospital ED immediately for admission.',
    cpgNotes: 'MOH Malaysia CPG CAP: CRB-65 is the gold-standard outpatient triage tool because it does not require blood urea results.',
    dangerLevel: 'CRITICAL'
  },
  {
    name: 'Urine Full Examination & Microscopic Exam (UFEME)',
    normalRange: 'WBC < 5 / hpf | Nitrite Negative | Leukocyte Esterase Negative',
    redFlagThreshold: 'Pyuria > 10 WBC/hpf + Nitrite Positive + Clinical Dysuria',
    clinicalAction: 'Treat symptomatic acute cystitis with Nitrofurantoin 100mg BD x 5d or Fosfomycin 3g stat. Do NOT treat asymptomatic bacteriuria in non-pregnant adults.',
    cpgNotes: 'Asymptomatic bacteriuria is common in elderly and diabetics; treating it promotes multi-drug resistant superbugs (MOH NAG).',
    dangerLevel: 'INTERMEDIATE'
  },
  {
    name: 'qSOFA Sepsis Screening',
    normalRange: 'Score 0 (Low risk of sepsis)',
    redFlagThreshold: 'Score >= 2: Respiratory Rate >= 22/min, GCS < 15, SBP <= 100 mmHg',
    clinicalAction: 'IMMEDIATE RED ZONE TRANSFER: IV access, bolus 30ml/kg balanced crystalloids, high-flow oxygen, stat parenteral antibiotic (Ceftriaxone 1-2g IV if transport time >30 min).',
    cpgNotes: 'MOH Sepsis Bundles: Surviving Sepsis Campaign in primary care centers.',
    dangerLevel: 'CRITICAL'
  },
  {
    name: 'Serum Creatinine & Estimated GFR (eGFR)',
    normalRange: 'eGFR > 90 mL/min/1.73m²',
    redFlagThreshold: 'eGFR < 30 mL/min (Severe renal impairment)',
    clinicalAction: 'CONTRAINDICATIONS: Stop Nitrofurantoin (ineffective in urine & risks peripheral neuropathy). Reduce Amoxicillin, Ciprofloxacin, and Cephalexin doses according to renal monograph.',
    cpgNotes: 'Cloxacillin does not require renal dose adjustment due to dual biliary excretion.',
    dangerLevel: 'INTERMEDIATE'
  }
];
