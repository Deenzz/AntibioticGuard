import React, { useState } from 'react';
import { 
  GitFork, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Pill, 
  BookOpen, 
  Info,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  Droplets,
  Shield
} from 'lucide-react';
import { CLINICAL_FLOWCHARTS } from '../data/flowcharts';
import { FlowchartGraph, FlowchartStep } from '../types/clinical';

export const ClinicalFlowcharts: React.FC = () => {
  const [selectedChartId, setSelectedChartId] = useState<string>(CLINICAL_FLOWCHARTS[0].id);
  const [history, setHistory] = useState<string[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string>(CLINICAL_FLOWCHARTS[0].initialStepId);
  const [outcome, setOutcome] = useState<FlowchartStep['options'][0]['actionOutcome'] | null>(null);

  const activeChart = CLINICAL_FLOWCHARTS.find(c => c.id === selectedChartId) || CLINICAL_FLOWCHARTS[0];
  const currentStep = activeChart.steps[currentStepId] || activeChart.steps[activeChart.initialStepId];

  const handleSelectChart = (chartId: string) => {
    setSelectedChartId(chartId);
    const newChart = CLINICAL_FLOWCHARTS.find(c => c.id === chartId) || CLINICAL_FLOWCHARTS[0];
    setCurrentStepId(newChart.initialStepId);
    setHistory([]);
    setOutcome(null);
  };

  const handleOptionClick = (option: FlowchartStep['options'][0]) => {
    if (option.actionOutcome) {
      setOutcome(option.actionOutcome);
    } else if (option.nextStepId) {
      setHistory(prev => [...prev, currentStepId]);
      setCurrentStepId(option.nextStepId);
      setOutcome(null);
    }
  };

  const handleRestart = () => {
    setCurrentStepId(activeChart.initialStepId);
    setHistory([]);
    setOutcome(null);
  };

  const handleBack = () => {
    if (outcome) {
      setOutcome(null);
      return;
    }
    if (history.length > 0) {
      const prevStep = history[history.length - 1];
      setHistory(prev => prev.slice(0, prev.length - 1));
      setCurrentStepId(prevStep);
      setOutcome(null);
    }
  };

  const getChartIcon = (iconName: string) => {
    switch (iconName) {
      case 'stethoscope': return <Stethoscope className="w-4 h-4" />;
      case 'activity': return <Activity className="w-4 h-4" />;
      case 'droplets': return <Droplets className="w-4 h-4" />;
      case 'shield': return <Shield className="w-4 h-4" />;
      default: return <GitFork className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <GitFork className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Interactive Clinical Triage Flowcharts
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Step-by-step diagnostic decision trees based on MOH Malaysia CPGs with clinical reasoning and evidence-based referrals
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Tree</span>
        </button>
      </div>

      {/* Flowchart Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {CLINICAL_FLOWCHARTS.map(chart => {
          const isSelected = chart.id === selectedChartId;
          return (
            <button
              key={chart.id}
              onClick={() => handleSelectChart(chart.id)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-emerald-950/30 border-emerald-500 text-white shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {getChartIcon(chart.icon)}
                </span>
                {isSelected && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Active</span>
                )}
              </div>
              <div>
                <div className="font-bold text-xs text-white line-clamp-1">{chart.title}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{chart.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Flowchart Interactive Player */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        
        {/* Flowchart Breadcrumb & Description */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>{activeChart.title}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeChart.description}</p>
          </div>
          {(history.length > 0 || outcome) && (
            <button
              onClick={handleBack}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              &larr; Back
            </button>
          )}
        </div>

        {/* Dynamic Step or Outcome Render */}
        {!outcome ? (
          <div className="space-y-5 max-w-2xl mx-auto py-2">
            {/* Step Question Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Decision Point
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                {currentStep.question}
              </h4>
              {currentStep.hint && (
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {currentStep.hint}
                </p>
              )}
            </div>

            {/* Step Options (Buttons) */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Select Clinical Finding:
              </span>
              {currentStep.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(opt)}
                  className="w-full p-4 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 hover:border-emerald-500/60 text-left transition flex items-center justify-between group"
                >
                  <div className="pr-4">
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300 transition">
                      {opt.label}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Final Decision Outcome Card */
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className={`p-5 rounded-2xl border-2 space-y-4 transition ${
              outcome.status === 'VIRAL_WITHHOLD'
                ? 'bg-emerald-950/20 border-emerald-500'
                : outcome.status === 'DELAYED_SCRIPT'
                ? 'bg-blue-950/20 border-blue-500'
                : outcome.status === 'BACTERIAL_INDICATED'
                ? 'bg-amber-950/20 border-amber-500'
                : 'bg-rose-950/30 border-rose-600'
            }`}>
              {/* Badge */}
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-lg ${
                  outcome.status === 'VIRAL_WITHHOLD'
                    ? 'bg-emerald-600 text-white'
                    : outcome.status === 'DELAYED_SCRIPT'
                    ? 'bg-blue-600 text-white'
                    : outcome.status === 'BACTERIAL_INDICATED'
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-600 text-white animate-pulse'
                }`}>
                  {outcome.status === 'VIRAL_WITHHOLD'
                    ? 'WITHHOLD ANTIBIOTICS (VIRAL)'
                    : outcome.status === 'DELAYED_SCRIPT'
                    ? 'DELAYED PRESCRIPTION PROTOCOL'
                    : outcome.status === 'BACTERIAL_INDICATED'
                    ? 'ANTIBIOTIC THERAPY INDICATED'
                    : 'URGENT HOSPITAL / ED REFERRAL'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  MOH CPG Pathway Complete
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                {outcome.title}
              </h3>

              {/* Drug Choice if any */}
              {outcome.drugChoice && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-emerald-400 block flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5" />
                    <span>Recommended Regimen:</span>
                  </span>
                  <div className="text-white font-semibold">{outcome.drugChoice}</div>
                </div>
              )}

              {/* Clinical Reasoning (for Doctors) */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <span className="font-bold text-slate-300 block flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>Clinical Reasoning (Decision Logic Behind This):</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {outcome.reasoning}
                </p>
              </div>

              {/* Guideline Reference */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-0.5">
                <span className="font-bold text-slate-300 block flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Guideline &amp; Action Directives:</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {outcome.references}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Run Another Case</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
