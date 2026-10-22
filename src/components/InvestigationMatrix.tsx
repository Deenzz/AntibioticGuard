import React, { useState } from 'react';
import { 
  FlaskConical, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  Activity, 
  Info, 
  Search,
  Filter
} from 'lucide-react';
import { INFECTION_BIOMARKERS } from '../data/cpgData';

export const InvestigationMatrix: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredMarkers = INFECTION_BIOMARKERS.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.normalRange.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.redFlagThreshold.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.clinicalAction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Infection Biomarkers, Normal Ranges &amp; Red Flag Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Clinical Practice Guidelines (MOH Malaysia) • Diagnostic thresholds, point-of-care cutoffs, and hospital referral triggers
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search biomarker or lab..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-sky-500 transition"
          />
        </div>
      </div>

      {/* Malaysian Endemic Dengue Screening Alert */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Malaysian Primary Care Clinical Rule: Dengue vs Bacterial Sepsis</span>
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed">
          In any febrile patient with body aches, retro-orbital pain, or flushed skin in Malaysia: <b>Always check Full Blood Count (FBC)</b>. A drop in White Cell Count (&lt;4.0 × 10⁹/L) or sudden thrombocytopenia represents the febrile/critical phase of <b>Dengue Virus</b>. Giving empiric antibiotics obscures the picture and delays mandatory hematocrit / fluid monitoring. Avoid NSAIDs (Ibuprofen / Mefenamic Acid) to prevent catastrophic GI hemorrhage.
        </p>
      </div>

      {/* Main Table View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono text-[10px]">
                <th className="p-3.5 font-bold">Investigation / Score</th>
                <th className="p-3.5 font-bold">Normal / Target Range</th>
                <th className="p-3.5 font-bold text-rose-400">Critical Red Flag Trigger</th>
                <th className="p-3.5 font-bold">Primary Care Action &amp; Stewardship Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredMarkers.map((marker, index) => (
                <tr key={index} className="hover:bg-slate-950/50 transition">
                  <td className="p-3.5 font-bold text-white align-top">
                    <div className="flex items-center gap-1.5">
                      <span>{marker.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 align-top text-slate-300 font-mono text-[11px]">
                    {marker.normalRange}
                  </td>
                  <td className="p-3.5 align-top text-rose-300 font-semibold bg-rose-950/10 text-[11px] leading-relaxed">
                    {marker.redFlagThreshold}
                  </td>
                  <td className="p-3.5 align-top space-y-1">
                    <div className="text-slate-200 leading-relaxed">
                      {marker.clinicalAction}
                    </div>
                    <div className="text-[10px] text-slate-400 italic pt-1">
                      CPG Note: {marker.cpgNotes}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
