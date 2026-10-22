import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  Pill, 
  Ban, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  BookOpen, 
  MessageSquare, 
  Activity, 
  AlertOctagon, 
  ShieldCheck,
  Languages,
  Copy,
  Check
} from 'lucide-react';
import { CaseConsultResponse, ClinicalSetting } from '../types/clinical';

interface AiConsultCopilotProps {
  clinicalSetting: ClinicalSetting;
  initialData?: any;
  onExportPdf?: (consult: CaseConsultResponse) => void;
  onOpenLeaflet?: (condition: string, antibioticGiven: boolean, drug?: string) => void;
  isOfflineMode: boolean;
}

export const AiConsultCopilot: React.FC<AiConsultCopilotProps> = ({
  clinicalSetting,
  initialData,
  onExportPdf,
  onOpenLeaflet,
  isOfflineMode
}) => {
  const [patientAge, setPatientAge] = useState<string>(initialData?.ageGroup === 'child' ? '7' : '32');
  const [chiefComplaint, setChiefComplaint] = useState<string>(initialData?.complaint || 'Sore throat & painful swallowing');
  const [durationDays, setDurationDays] = useState<string>('3');
  const [temperature, setTemperature] = useState<string>('38.4');
  const [systolicBp, setSystolicBp] = useState<string>('120/80');
  const [heartRate, setHeartRate] = useState<string>('88');
  const [respiratoryRate, setRespiratoryRate] = useState<string>('16');
  const [spO2, setSpO2] = useState<string>('98');
  const [penicillinAllergy, setPenicillinAllergy] = useState<boolean>(false);
  const [allergyDetails, setAllergyDetails] = useState<string>('Hives and facial swelling to amoxicillin 2 years ago');
  const [investigations, setInvestigations] = useState<string>('CRP 12 mg/L, WCC 8.5 x 10^9/L');
  const [symptomsText, setSymptomsText] = useState<string>(
    initialData?.symptoms?.join(', ') || 'Severe odynophagia, fever, mild headache, no cough, no rhinorrhea'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [consultResult, setConsultResult] = useState<CaseConsultResponse | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // Quick preset case templates
  const presets = [
    {
      title: 'Sore Throat (Centor 2)',
      complaint: 'Sore throat with fever',
      age: '24',
      days: '2',
      temp: '38.2',
      bp: '118/75',
      symptoms: 'Fever, sore throat, mild tender cervical lymph node, no cough, no runny nose',
      labs: 'Throat swab negative for RADT, CRP 15 mg/L'
    },
    {
      title: 'Acute Cough / Green Sputum',
      complaint: 'Cough with green thick phlegm',
      age: '35',
      days: '5',
      temp: '37.3',
      bp: '124/82',
      symptoms: 'Productive cough with purulent green sputum, nasal congestion, normal breath sounds bilaterally',
      labs: 'CRP 8 mg/L, WCC 7.2 x 10^9/L'
    },
    {
      title: 'Acute Cystitis (Dysuria)',
      complaint: 'Painful urination and frequency',
      age: '29',
      days: '2',
      temp: '36.8',
      bp: '115/72',
      symptoms: 'Burning dysuria, frequency every 30 mins, suprapubic ache, no flank pain, no fever',
      labs: 'UFEME: WBC 25-50/hpf, Nitrite positive, RBC 5-10/hpf'
    },
    {
      title: 'Spreading Red Leg (Cellulitis)',
      complaint: 'Painful hot red swelling on right calf',
      age: '54',
      days: '3',
      temp: '38.1',
      bp: '135/85',
      symptoms: 'Expanding warm erythematous plaque on right lower leg, distinct margins, tender, no fluctuance',
      labs: 'WCC 13.8 x 10^9/L (Neutrophils 82%), CRP 65 mg/L'
    },
    {
      title: 'Cat Bite Puncture',
      complaint: 'Cat bite wound to left index finger',
      age: '40',
      days: '1',
      temp: '37.1',
      bp: '122/78',
      symptoms: 'Deep puncture wound from pet cat 12 hours ago, mild erythema, tender, full finger extension maintained',
      labs: 'Tetanus vaccination 7 years ago'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setChiefComplaint(p.complaint);
    setPatientAge(p.age);
    setDurationDays(p.days);
    setTemperature(p.temp);
    setSystolicBp(p.bp);
    setSymptomsText(p.symptoms);
    setInvestigations(p.labs);
  };

  const handleRunConsult = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        patientAge,
        chiefComplaint,
        durationDays,
        symptoms: symptomsText.split(',').map(s => s.trim()),
        temperature,
        systolicBp,
        heartRate,
        respiratoryRate,
        spO2,
        penicillinAllergy,
        allergyDetails: penicillinAllergy ? allergyDetails : '',
        investigations,
        setting: clinicalSetting,
      };

      const response = await fetch('/api/clinical-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Consultation request failed');
      }

      const data: CaseConsultResponse = await response.json();
      setConsultResult(data);
    } catch (err) {
      console.error('Consultation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyScriptText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(type);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              AI Clinical Decision Copilot &amp; Case Reasoning Assistant
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Senior Infectious Disease Consultant calibrated to MOH Malaysia National Antimicrobial Guideline (NAG) &amp; CPGs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Mode: {isOfflineMode ? 'Local NAG Rules (Offline)' : 'Gemini + MOH Guidelines'}
          </span>
        </div>
      </div>

      {/* Case Presets Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 shrink-0 font-medium">Quick Presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-semibold shrink-0 transition"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Main Grid: Form Left, Output Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Case Input Form (5 Cols) */}
        <form onSubmit={handleRunConsult} className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Patient Encounter Data</span>
            <span className="text-[10px] text-emerald-400 font-mono">{clinicalSetting}</span>
          </div>

          {/* Age & Duration */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Patient Age (Years)</label>
              <input
                type="text"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="e.g. 28 or 4"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Illness Duration</label>
              <input
                type="text"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="e.g. 3 days"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">Chief Complaint</label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="e.g. Sore throat, productive cough, burning urination"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              required
            />
          </div>

          {/* Clinical Symptoms */}
          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">Clinical Signs &amp; Symptoms</label>
            <textarea
              rows={2}
              value={symptomsText}
              onChange={(e) => setSymptomsText(e.target.value)}
              placeholder="e.g. High fever, tonsil exudates, no cough, cervical nodes tender"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs resize-none"
            />
          </div>

          {/* Vital Signs Row */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-0.5">Temp (°C)</label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="38.2"
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-0.5">BP (mmHg)</label>
              <input
                type="text"
                value={systolicBp}
                onChange={(e) => setSystolicBp(e.target.value)}
                placeholder="120/80"
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-0.5">RR (/min)</label>
              <input
                type="text"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(e.target.value)}
                placeholder="16"
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-center"
              />
            </div>
          </div>

          {/* Penicillin Allergy Switch */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-slate-200">Patient Has Penicillin Allergy?</span>
              <input
                type="checkbox"
                checked={penicillinAllergy}
                onChange={(e) => setPenicillinAllergy(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-700"
              />
            </label>

            {penicillinAllergy && (
              <input
                type="text"
                value={allergyDetails}
                onChange={(e) => setAllergyDetails(e.target.value)}
                placeholder="Specify reaction (e.g. hives <1h, facial swelling, delayed rash)"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium"
              />
            )}
          </div>

          {/* Investigations / Labs */}
          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">Investigations / Point-of-Care Tests</label>
            <input
              type="text"
              value={investigations}
              onChange={(e) => setInvestigations(e.target.value)}
              placeholder="e.g. CRP 12 mg/L, UFEME nitrites +ve, FBC normal"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
            />
          </div>

          {/* Submit Consult Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/50 transition cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Consulting MOH NAG Guidelines...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Stewardship &amp; Clinical Reasoning</span>
              </>
            )}
          </button>
        </form>

        {/* Output Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!consultResult ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Clinical Decision Support Standby</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Enter your patient's symptoms or select a quick template on the left. The internal decision engine evaluates Group A Strep probability, lower respiratory criteria, UTI algorithms, and penicillin allergy cross-reactivity according to MOH Malaysia National Antimicrobial Guidelines.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Verdict Card */}
              <div className={`p-5 rounded-2xl border-2 space-y-4 transition ${
                !consultResult.antibioticIndicated
                  ? 'bg-emerald-950/20 border-emerald-500'
                  : 'bg-amber-950/20 border-amber-500'
              }`}>
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-lg ${
                    !consultResult.antibioticIndicated
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}>
                    {!consultResult.antibioticIndicated ? 'ANTIBIOTIC WITHHELD (VIRAL)' : 'ANTIBIOTIC THERAPY INDICATED'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Confidence: {consultResult.confidence}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {consultResult.condition}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    CPG Standard: {consultResult.cpgReference}
                  </p>
                </div>

                {/* Structured Clinical Reasoning for Doctors */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-200 block flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Clinical Reasoning (Evidence-Based Decision Logic):</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {consultResult.clinicalReasoning}
                  </p>
                </div>

                {/* Primary Regimen if Indicated */}
                {consultResult.primaryRegimen && (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 text-xs">
                    <span className="font-bold text-emerald-300 block flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-emerald-400" />
                      <span>1st-Line Recommended Regimen (MOH NAG):</span>
                    </span>
                    <div className="text-white font-bold text-sm">
                      {consultResult.primaryRegimen.drug}
                    </div>
                    <div className="text-slate-300 font-mono text-[11px]">
                      {consultResult.primaryRegimen.dose} • {consultResult.primaryRegimen.frequency} • {consultResult.primaryRegimen.duration}
                    </div>
                    <p className="text-emerald-200/90 text-[11px] leading-snug">
                      {consultResult.primaryRegimen.instructions}
                    </p>
                    {consultResult.primaryRegimen.pearl && (
                      <div className="text-[10px] text-amber-300 font-medium pt-1">
                        <b>Clinical Pearl:</b> {consultResult.primaryRegimen.pearl}
                      </div>
                    )}
                  </div>
                )}

                {/* Penicillin Allergy Alternative if applicable */}
                {consultResult.alternativeRegimen && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <span className="font-bold text-amber-300 block flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Safe Alternative for Penicillin Allergy:</span>
                    </span>
                    <div className="text-white font-semibold">
                      {consultResult.alternativeRegimen.drug} ({consultResult.alternativeRegimen.dose})
                    </div>
                    <div className="text-slate-400 text-[11px] font-mono">
                      {consultResult.alternativeRegimen.frequency} • {consultResult.alternativeRegimen.duration}
                    </div>
                  </div>
                )}

                {/* Symptomatic Care Plan */}
                {consultResult.symptomaticCare && consultResult.symptomaticCare.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-200 block">Symptomatic Relief &amp; Home Care:</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                      {consultResult.symptomaticCare.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Emergency Red Flags */}
                {consultResult.redFlags && consultResult.redFlags.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-1 text-[11px] text-rose-200">
                    <span className="font-bold text-rose-300 flex items-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                      <span>Hospital / Specialist Referral Red Flags:</span>
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {consultResult.redFlags.map((rf, i) => (
                        <li key={i}>{rf}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* Malaysian Doctor-to-Patient Communication Scripts (English & Bahasa Melayu) */}
              {consultResult.malaysianDoctorScript && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Patient Counseling Scripts (Malaysian Practice)
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Anti-Doctor-Shopping Protocol</span>
                  </div>

                  <div className="space-y-3">
                    {/* English Doctor Script */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400">English Counseling:</span>
                        <button
                          onClick={() => copyScriptText(consultResult.malaysianDoctorScript.english, 'en')}
                          className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedScript === 'en' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedScript === 'en' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed italic">
                        "{consultResult.malaysianDoctorScript.english}"
                      </p>
                    </div>

                    {/* Bahasa Melayu Doctor Script */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-400">Bahasa Melayu (Klinik &amp; Kecemasan):</span>
                        <button
                          onClick={() => copyScriptText(consultResult.malaysianDoctorScript.bahasaMelayu, 'bm')}
                          className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedScript === 'bm' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedScript === 'bm' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-slate-300 leading-relaxed italic">
                        "{consultResult.malaysianDoctorScript.bahasaMelayu}"
                      </p>
                    </div>
                  </div>

                  {/* Actions for Leaflet and Case Export */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {onOpenLeaflet && (
                      <button
                        onClick={() => onOpenLeaflet(
                          consultResult.condition,
                          consultResult.antibioticIndicated,
                          consultResult.primaryRegimen?.drug
                        )}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-rose-400" />
                        <span>Print Patient Leaflet</span>
                      </button>
                    )}
                    {onExportPdf && (
                      <button
                        onClick={() => onExportPdf(consultResult)}
                        className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Save Case Summary PDF</span>
                      </button>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
