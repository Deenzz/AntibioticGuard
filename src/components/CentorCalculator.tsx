import React, { useState } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  AlertOctagon, 
  CheckCircle, 
  Clock, 
  Ban, 
  Pill, 
  HelpCircle, 
  Baby, 
  Copy, 
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';

interface CentorCalculatorProps {
  onSendToCopilot?: (data: { ageGroup: string; score: number; symptoms: string[]; verdict: string }) => void;
}

export const CentorCalculator: React.FC<CentorCalculatorProps> = ({ onSendToCopilot }) => {
  const [ageGroup, setAgeGroup] = useState<'child' | 'adult' | 'older'>('adult');
  const [fever, setFever] = useState<boolean>(true);
  const [noCough, setNoCough] = useState<boolean>(true);
  const [nodes, setNodes] = useState<boolean>(false);
  const [exudate, setExudate] = useState<boolean>(false);

  // Pediatric weight helper
  const [paedsWeight, setPaedsWeight] = useState<number>(15);
  const [syrupStrength, setSyrupStrength] = useState<'125' | '250'>('250');
  const [copied, setCopied] = useState<boolean>(false);

  // Calculate score
  let score = 0;
  if (ageGroup === 'child') score += 1;
  else if (ageGroup === 'older') score -= 1;

  if (fever) score += 1;
  if (noCough) score += 1;
  if (nodes) score += 1;
  if (exudate) score += 1;

  // Strep risk stats
  let riskPct = '';
  let riskLevel: 'LOW' | 'INTERMEDIATE' | 'HIGH' = 'LOW';
  let title = '';
  let description = '';

  if (score <= 1) {
    riskLevel = 'LOW';
    riskPct = score <= 0 ? '1 – 3%' : '5 – 10%';
    title = 'Viral Pharyngitis (Antibiotics Withheld)';
    description = 'Group A Strep (GABHS) is highly improbable. Prescribing antibiotics exposes the patient to allergic reactions and diarrhea without clinical benefit. Prescribe symptomatic analgesia.';
  } else if (score === 2 || score === 3) {
    riskLevel = 'INTERMEDIATE';
    riskPct = score === 2 ? '15 – 17%' : '28 – 32%';
    title = 'Equivocal: Rapid Strep Antigen or Delayed Script';
    description = 'Intermediate probability of bacterial etiology. MOH NAG recommends performing a throat swab / RADT if available, or providing a 48–72 hour Delayed Prescription (Preskripsi Tertangguh).';
  } else {
    riskLevel = 'HIGH';
    riskPct = '40 – 60%';
    title = 'Empiric Antibiotic Therapy Indicated (10-Day Course)';
    description = 'High probability of Group A Strep. A full 10-day course of narrow-spectrum penicillin or amoxicillin is indicated to prevent post-streptococcal Acute Rheumatic Fever (ARF).';
  }

  const handleReset = () => {
    setAgeGroup('adult');
    setFever(true);
    setNoCough(true);
    setNodes(false);
    setExudate(false);
  };

  // Pediatric amoxicillin calculation: 50 mg/kg/day divided BD
  const dailyDoseMg = Math.round(paedsWeight * 50);
  const singleDoseMg = Math.round(dailyDoseMg / 2);
  const syrupMlPerDose = syrupStrength === '125'
    ? (singleDoseMg / 125) * 5
    : (singleDoseMg / 250) * 5;

  const copySummary = () => {
    const text = `[Centor / McIsaac Sore Throat Assessment]
- Age Group: ${ageGroup === 'child' ? '3-14 yrs (+1)' : ageGroup === 'adult' ? '15-44 yrs (0)' : '>=45 yrs (-1)'}
- Fever >38°C: ${fever ? 'Yes' : 'No'}
- Absence of Cough/Cold: ${noCough ? 'Yes' : 'No'}
- Swollen Tender Cervical Nodes: ${nodes ? 'Yes' : 'No'}
- Tonsillar Exudate/Swelling: ${exudate ? 'Yes' : 'No'}
- Total McIsaac Score: ${score} Points (Strep Risk: ${riskPct})
- Verdict: ${title}
- Guideline: MOH Malaysia NAG (3rd Ed.) & CPG URTI`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Centor / McIsaac Sore Throat Triage Calculator</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            MOH Malaysia NAG &amp; CPG URTI • Differentiates self-limiting viral sore throat from Group A Strep (GABHS)
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={copySummary}
            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Clinical Note'}</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Computed Result Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Form Column (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-5">
          
          {/* Section 1: McIsaac Age Group */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Patient Age Category (McIsaac Modifier)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAgeGroup('child')}
                className={`p-3 rounded-xl border text-left transition ${
                  ageGroup === 'child'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-white">3 to 14 Years</div>
                <div className="text-[11px] text-emerald-400 mt-0.5 font-mono">+1 Point</div>
                <div className="text-[10px] text-slate-400 mt-1">Peak GABHS incidence</div>
              </button>

              <button
                type="button"
                onClick={() => setAgeGroup('adult')}
                className={`p-3 rounded-xl border text-left transition ${
                  ageGroup === 'adult'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-white">15 to 44 Years</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">0 Points</div>
                <div className="text-[10px] text-slate-400 mt-1">Standard baseline</div>
              </button>

              <button
                type="button"
                onClick={() => setAgeGroup('older')}
                className={`p-3 rounded-xl border text-left transition ${
                  ageGroup === 'older'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-white">&ge; 45 Years</div>
                <div className="text-[11px] text-blue-400 mt-0.5 font-mono">-1 Point</div>
                <div className="text-[10px] text-slate-400 mt-1">Strep very rare</div>
              </button>
            </div>
          </div>

          {/* Section 2: Clinical Signs (1 Pt each) */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              2. Clinical Findings Present (1 Point Each)
            </label>

            <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
              fever ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}>
              <input
                type="checkbox"
                checked={fever}
                onChange={(e) => setFever(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-900"
              />
              <div className="flex-1">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>History of High Fever or Measured Temp &gt; 38.0°C</span>
                  <span className="text-[10px] text-emerald-400 font-mono">+1 pt</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Sudden acute spike in fever with chills or shivering</p>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
              noCough ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}>
              <input
                type="checkbox"
                checked={noCough}
                onChange={(e) => setNoCough(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-900"
              />
              <div className="flex-1">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Absence of Cough / Rhinitis / Conjunctivitis</span>
                  <span className="text-[10px] text-emerald-400 font-mono">+1 pt</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Cough, runny nose, sneezing, and hoarseness strongly indicate a VIRAL infection</p>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
              nodes ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}>
              <input
                type="checkbox"
                checked={nodes}
                onChange={(e) => setNodes(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-900"
              />
              <div className="flex-1">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Tender / Swollen Anterior Cervical Lymphadenopathy</span>
                  <span className="text-[10px] text-emerald-400 font-mono">+1 pt</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Palpably enlarged, tender nodes along anterior sternocleidomastoid triangle</p>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
              exudate ? 'bg-emerald-950/20 border-emerald-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}>
              <input
                type="checkbox"
                checked={exudate}
                onChange={(e) => setExudate(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-900"
              />
              <div className="flex-1">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Tonsillar Swelling or Confluent Purulent Exudate</span>
                  <span className="text-[10px] text-emerald-400 font-mono">+1 pt</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Erythematous enlarged palatine tonsils with follicular or confluent yellowish patches</p>
              </div>
            </label>
          </div>

          {/* Emergency Airway Red Flag Alert */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/60 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
              <span>EMERGENCY EXCLUSION: Peritonsillar Abscess (Quinsy) &amp; Epiglottitis</span>
            </div>
            <p className="text-[11px] text-rose-200/90 leading-relaxed">
              If the patient has <b>trismus (cannot open mouth), hot-potato muffled voice, unilateral tonsillar bulge with uvular deviation, drooling, or stridor</b>: Do NOT treat as simple sore throat! Immediately refer to Hospital ED / ENT specialist for urgent drainage and airway protection.
            </p>
          </div>

        </div>

        {/* Computed Decision Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className={`p-5 rounded-2xl border-2 transition-all duration-300 space-y-4 ${
            riskLevel === 'LOW' 
              ? 'bg-emerald-950/20 border-emerald-500/80' 
              : riskLevel === 'INTERMEDIATE'
              ? 'bg-amber-950/20 border-amber-500/80'
              : 'bg-rose-950/30 border-rose-500'
          }`}>
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-lg tracking-wide ${
                riskLevel === 'LOW'
                  ? 'bg-emerald-600 text-white'
                  : riskLevel === 'INTERMEDIATE'
                  ? 'bg-amber-600 text-white'
                  : 'bg-rose-600 text-white animate-pulse'
              }`}>
                SCORE {score} • {riskLevel === 'LOW' ? 'VERY LOW RISK' : riskLevel === 'INTERMEDIATE' ? 'INTERMEDIATE RISK' : 'HIGH PROBABILITY'}
              </span>

              <span className="text-xs font-mono font-bold text-slate-300">
                Strep Probability: <span className="text-white">{riskPct}</span>
              </span>
            </div>

            {/* Verdict Title */}
            <div>
              <h3 className="text-base font-extrabold text-white leading-snug">
                {title}
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Score Metrics Matrix */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Calculated Score</span>
                <span className="text-base font-extrabold text-white">{score} Point{score !== 1 ? 's' : ''}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">GABHS Incidence</span>
                <span className={`text-base font-extrabold ${
                  riskLevel === 'LOW' ? 'text-emerald-400' : riskLevel === 'INTERMEDIATE' ? 'text-amber-400' : 'text-rose-400'
                }`}>{riskPct}</span>
              </div>
            </div>

            {/* MOH NAG Stewardship Action Protocol */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-emerald-400" />
                <span>MOH Malaysia Action Plan:</span>
              </div>

              {riskLevel === 'LOW' && (
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>Symptomatic Relief:</b> Paracetamol 500–1000 mg QID PRN (max 4g/day) + warm saline gargles + Difflam / benzydamine spray.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Ban className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><b>Withhold Antibiotics:</b> Do not prescribe Amoxicillin or Augmentin. Explain that viruses resolve spontaneously in 5–7 days.</span>
                  </div>
                </div>
              )}

              {riskLevel === 'INTERMEDIATE' && (
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><b>Diagnostic Test:</b> Perform Rapid Strep Antigen Test (RADT) or throat swab if available in clinic.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span><b>Delayed Prescribing Protocol:</b> Issue script with strict instructions to fill ONLY if no improvement after 48–72 hours or fever worsens.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-400">
                    <Pill className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>If Antibiotic Given:</b> Oral Phenoxymethylpenicillin 500mg QID x 10 days OR Oral Amoxicillin 500mg BD x 10 days.</span>
                  </div>
                </div>
              )}

              {riskLevel === 'HIGH' && (
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>1st-Line (MOH NAG):</b> Oral Phenoxymethylpenicillin (Pen V) 500 mg QID on EMPTY STOMACH x 10 DAYS (Full course prevents rheumatic fever).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Pill className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><b>Alternative 1st-Line:</b> Oral Amoxicillin 500 mg BD (or 1 g BD) x 10 DAYS. Paeds: 50 mg/kg/day divided BD x 10 days.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><b>Penicillin Allergy:</b> Oral Azithromycin 500 mg OD x 5 days OR Oral Cephalexin 500 mg BD x 10 days (if non-anaphylactic).</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Link to AI Copilot */}
            {onSendToCopilot && (
              <button
                type="button"
                onClick={() => onSendToCopilot({
                  ageGroup,
                  score,
                  symptoms: [
                    fever ? 'Fever >38C' : '',
                    noCough ? 'Absence of cough' : 'Cough present',
                    nodes ? 'Tender cervical lymphadenopathy' : '',
                    exudate ? 'Tonsillar exudate' : ''
                  ].filter(Boolean),
                  verdict: title
                })}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <span>Deep Clinical Reasoning in AI Copilot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

          </div>

          {/* Pediatric Dosing Aid Card (for children with sore throat) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Baby className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-bold text-white">Pediatric Amoxicillin Dosing Aid</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">50 mg/kg/day</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Child Weight (kg)</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={paedsWeight}
                  onChange={(e) => setPaedsWeight(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Suspension Strength</label>
                <select
                  value={syrupStrength}
                  onChange={(e) => setSyrupStrength(e.target.value as any)}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value="250">250 mg / 5 mL</option>
                  <option value="125">125 mg / 5 mL</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">Prescription:</span>
                <span className="text-white font-bold">{singleDoseMg} mg BD (Every 12 hrs)</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] block">Volume to Dispense:</span>
                <span className="text-emerald-400 font-bold text-sm">{syrupMlPerDose.toFixed(1)} mL BD × 10d</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
