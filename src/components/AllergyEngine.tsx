import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  AlertOctagon, 
  HelpCircle, 
  Pill, 
  CheckCircle2, 
  Info,
  RefreshCw
} from 'lucide-react';

export const AllergyEngine: React.FC = () => {
  const [onset, setOnset] = useState<'immediate' | 'delayed' | 'childhood'>('immediate');
  const [hasWheeze, setHasWheeze] = useState<boolean>(true);
  const [hasAngio, setHasAngio] = useState<boolean>(true);
  const [hasHypotension, setHasHypotension] = useState<boolean>(false);
  const [skinType, setSkinType] = useState<'urticaria' | 'maculopapular' | 'scar' | 'none'>('urticaria');

  const isScar = skinType === 'scar';
  const isAnaphylactic = !isScar && (
    onset === 'immediate' && (hasWheeze || hasAngio || hasHypotension || skinType === 'urticaria')
  );
  const isMildDelayed = !isScar && !isAnaphylactic && (
    skinType === 'maculopapular' || onset === 'delayed' || onset === 'childhood'
  );
  const isIntolerance = !isScar && !isAnaphylactic && !isMildDelayed;

  const handleReset = () => {
    setOnset('immediate');
    setHasWheeze(true);
    setHasAngio(true);
    setHasHypotension(false);
    setSkinType('urticaria');
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Penicillin Allergy De-Labeling &amp; Alternative Selector
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Over 90% of labeled penicillin allergies are false or non-IgE mediated. De-labeling safely protects against inappropriate reserve antibiotic use.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>
      </div>

      {/* Main Grid: Form Left, Evaluation Output Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Column (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
            Patient Reaction Assessment
          </div>

          {/* Onset Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              1. Time of Onset After First Dose
            </label>
            <select
              value={onset}
              onChange={(e) => setOnset(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-emerald-500"
            >
              <option value="immediate">Immediate (&lt; 1 Hour from first dose)</option>
              <option value="delayed">Delayed (&gt; 48 Hours to days of therapy)</option>
              <option value="childhood">Vague childhood event (&gt; 10 years ago, unverified)</option>
            </select>
          </div>

          {/* Severe Anaphylaxis Signs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              2. Systemic &amp; Respiratory Anaphylaxis Signs
            </label>
            <div className="space-y-2 text-xs">
              <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                hasWheeze ? 'bg-rose-950/20 border-rose-600/50 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={hasWheeze}
                  onChange={(e) => setHasWheeze(e.target.checked)}
                  className="rounded text-rose-600 bg-slate-900 border-slate-700"
                />
                <span className="font-medium">Wheezing / Dyspnea / Throat tightness / Stridor</span>
              </label>

              <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                hasAngio ? 'bg-rose-950/20 border-rose-600/50 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={hasAngio}
                  onChange={(e) => setHasAngio(e.target.checked)}
                  className="rounded text-rose-600 bg-slate-900 border-slate-700"
                />
                <span className="font-medium">Facial, lip, tongue, or eyelid angioedema</span>
              </label>

              <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                hasHypotension ? 'bg-rose-950/20 border-rose-600/50 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <input
                  type="checkbox"
                  checked={hasHypotension}
                  onChange={(e) => setHasHypotension(e.target.checked)}
                  className="rounded text-rose-600 bg-slate-900 border-slate-700"
                />
                <span className="font-medium">Circulatory collapse / Hypotension / Syncope</span>
              </label>
            </div>
          </div>

          {/* Cutaneous Manifestations */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              3. Cutaneous / Skin Manifestation
            </label>
            <select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-medium focus:border-emerald-500"
            >
              <option value="urticaria">Urticaria (Itchy, raised wheals / hives)</option>
              <option value="maculopapular">Maculopapular / Morbilliform rash (Flat, non-itchy)</option>
              <option value="scar">Severe Blistering / Mucosal ulcers / SJS / TEN / DRESS</option>
              <option value="none">No rash (Isolated nausea, vomiting, or diarrhea only)</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 block">De-Labeling Evidence:</span>
            <p>
              IgE antibodies to penicillin decay with time (~50% lost after 5 years, &gt;80% after 10 years). Patients with vague childhood rash &gt;10 years ago almost universally tolerate beta-lactams safely under oral challenge protocols.
            </p>
          </div>

        </div>

        {/* Output Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Classification Banner */}
          <div className={`p-5 rounded-2xl border-2 transition space-y-4 ${
            isScar 
              ? 'bg-purple-950/30 border-purple-600'
              : isAnaphylactic
              ? 'bg-rose-950/30 border-rose-600'
              : isMildDelayed
              ? 'bg-emerald-950/20 border-emerald-500'
              : 'bg-blue-950/20 border-blue-500'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-lg ${
                isScar
                  ? 'bg-purple-700 text-white animate-pulse'
                  : isAnaphylactic
                  ? 'bg-rose-600 text-white animate-pulse'
                  : isMildDelayed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {isScar
                  ? 'SCAR / SJS / TEN / DRESS (CRITICAL ALLERGY)'
                  : isAnaphylactic
                  ? 'TRUE TYPE I IgE ANAPHYLAXIS RISK'
                  : isMildDelayed
                  ? 'MILD NON-IgE DELAYED RASH (LOW RISK)'
                  : 'NON-ALLERGIC INTOLERANCE (SAFE)'}
              </span>

              <span className="text-xs font-mono font-bold text-slate-300">
                {isScar
                  ? 'All Beta-Lactams: STRICTLY BANNED'
                  : isAnaphylactic
                  ? 'Cephalosporin Cross-Reactivity: ~1%'
                  : 'Cephalosporins: SAFE TO PRESCRIBE'}
              </span>
            </div>

            {/* Verdict Box */}
            <div className="space-y-2 text-xs">
              {isScar && (
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800 text-purple-200 space-y-1.5">
                  <div className="font-bold text-purple-300 text-sm flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-purple-400" />
                    <span>Severe Cutaneous Adverse Reaction (SCAR)</span>
                  </div>
                  <p className="leading-relaxed">
                    <b>ABSOLUTE CONTRAINDICATION:</b> Strictly avoid ALL penicillins, ALL cephalosporins, carbapenems, and monobactams for life. Re-exposure can trigger fatal Stevens-Johnson Syndrome (SJS), Toxic Epidermal Necrolysis (TEN), or DRESS.
                  </p>
                  <p className="text-white font-semibold pt-1">
                    Safe Non-Beta-Lactam Options: Doxycycline, Azithromycin, Clindamycin, Ciprofloxacin, Levofloxacin, or Vancomycin.
                  </p>
                </div>
              )}

              {isAnaphylactic && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 space-y-1.5">
                  <div className="font-bold text-rose-300 text-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>True IgE-Mediated Immediate Anaphylaxis</span>
                  </div>
                  <p className="leading-relaxed">
                    <b>Contraindicated:</b> All Penicillins (Amoxicillin, Augmentin, Cloxacillin, Pen V, Ampicillin) and 1st-generation Cephalosporins (Cephalexin shares identical R1 side-chain).
                  </p>
                  <p className="leading-relaxed">
                    <b>Cephalosporin Cross-Reactivity:</b> 3rd-generation cephalosporins (e.g. Ceftriaxone, Ceftazidime) have unique side chains; cross-reactivity is &lt;1%. If critical in inpatient ED/ICU, may be administered under monitored conditions.
                  </p>
                  <p className="text-white font-semibold pt-1">
                    Recommended Primary Care Alternatives: Oral Azithromycin, Oral Doxycycline, Oral Clindamycin, or Fluoroquinolones.
                  </p>
                </div>
              )}

              {isMildDelayed && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 space-y-1.5">
                  <div className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Mild Delayed Non-IgE Maculopapular Rash</span>
                  </div>
                  <p className="leading-relaxed">
                    <b>Cephalosporins are SAFE:</b> Patients with a mild delayed rash (without hives, angioedema, or blistering) can safely receive 2nd- and 3rd-generation Cephalosporins (Cefuroxime axetil, Cefixime) and Cephalexin without increased anaphylaxis risk.
                  </p>
                  <p className="text-white font-semibold pt-1">
                    First-line choices: Oral Cephalexin 500mg BD (for skin/UTI) or Cefuroxime 250-500mg BD.
                  </p>
                </div>
              )}

              {isIntolerance && (
                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800 text-blue-200 space-y-1.5">
                  <div className="font-bold text-blue-300 text-sm flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span>Non-Immune Pharmacological Side-Effect (Intolerance)</span>
                  </div>
                  <p className="leading-relaxed">
                    Isolated nausea, loose stools, or mild vomiting without rash or respiratory symptoms is a predictable pharmacological side-effect, NOT an allergy. The patient is NOT allergic and can safely receive penicillins and cephalosporins with meals.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Reference Table: Indications & Safe Alternatives */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-emerald-400" />
                <span>Indication-Specific Safe Alternative Prescribing (MOH NAG):</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-mono">
                      <th className="p-2">Infection Type</th>
                      <th className="p-2">Standard Penicillin</th>
                      <th className="p-2 text-emerald-400 font-bold">Safe Alternative (Allergy)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr className="hover:bg-slate-950/50">
                      <td className="p-2 font-semibold text-white">Strep Pharyngitis</td>
                      <td className="p-2">Penicillin V / Amoxicillin</td>
                      <td className="p-2 text-emerald-400">Oral Azithromycin 500mg OD x 5d OR Cephalexin 500mg BD x 10d (if non-IgE)</td>
                    </tr>
                    <tr className="hover:bg-slate-950/50">
                      <td className="p-2 font-semibold text-white">Acute Otitis Media</td>
                      <td className="p-2">Amoxicillin (High dose)</td>
                      <td className="p-2 text-emerald-400">Oral Azithromycin 10mg/kg OD x 3d OR Cefuroxime (if non-anaphylactic)</td>
                    </tr>
                    <tr className="hover:bg-slate-950/50">
                      <td className="p-2 font-semibold text-white">Outpatient CAP</td>
                      <td className="p-2">Amoxicillin 1g TDS</td>
                      <td className="p-2 text-emerald-400">Oral Doxycycline 100mg BD x 5-7d OR Oral Azithromycin 500mg OD</td>
                    </tr>
                    <tr className="hover:bg-slate-950/50">
                      <td className="p-2 font-semibold text-white">Uncomplicated UTI</td>
                      <td className="p-2">Augmentin / Ampicillin</td>
                      <td className="p-2 text-emerald-400">Oral Nitrofurantoin 100mg BD x 5d OR Fosfomycin 3g stat (Non-beta-lactams!)</td>
                    </tr>
                    <tr className="hover:bg-slate-950/50">
                      <td className="p-2 font-semibold text-white">Cellulitis / SSTI</td>
                      <td className="p-2">Cloxacillin 500mg QID</td>
                      <td className="p-2 text-emerald-400">Oral Clindamycin 300mg TDS x 5-7d OR Cephalexin 500mg QID (if non-IgE)</td>
                    </tr>
                    <tr className="hover:bg-slate-950/50">
                      <td className="p-2 font-semibold text-white">Animal / Dog / Cat Bites</td>
                      <td className="p-2">Augmentin 625mg TDS</td>
                      <td className="p-2 text-emerald-400">Oral Doxycycline 100mg BD + Oral Metronidazole 400mg TDS x 7d</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Cross-Reactivity Education Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Scientific Basis of Cephalosporin Cross-Reactivity</span>
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Historical textbooks cited a 10% cross-reactivity rate because early 1st-generation cephalosporins (produced in the 1960s-1970s) were contaminated with trace penicillin fungus during fermentation. Modern synthetic cephalosporins have a true cross-reactivity rate of &lt;1% for 2nd and 3rd generations. Cross-reactivity is mediated by <b>identical R1 side-chains</b> (shared between Ampicillin/Amoxicillin and Cephalexin/Cefaclor), not the core beta-lactam ring.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
