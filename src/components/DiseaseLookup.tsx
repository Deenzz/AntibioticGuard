import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Pill, 
  AlertTriangle, 
  Baby, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  SlidersHorizontal,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { CPG_DISEASE_DATABASE } from '../data/cpgData';
import { DiseaseProtocol } from '../types/clinical';

interface DiseaseLookupProps {
  onSelectForConsult?: (disease: DiseaseProtocol) => void;
  onGenerateLeaflet?: (disease: DiseaseProtocol) => void;
}

export const DiseaseLookup: React.FC<DiseaseLookupProps> = ({ 
  onSelectForConsult,
  onGenerateLeaflet
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOrgan, setSelectedOrgan] = useState<string>('ALL');

  const organCategories = [
    { id: 'ALL', label: 'All Conditions' },
    { id: 'URTI / Throat', label: 'Throat & URTI' },
    { id: 'Ear / ENT', label: 'Ear & ENT' },
    { id: 'Lower Respiratory', label: 'Chest & CAP' },
    { id: 'Urinary Tract (UTI)', label: 'UTI & Pyelo' },
    { id: 'Skin / Soft Tissue', label: 'Skin & Cellulitis' },
    { id: 'Infected Wounds', label: 'Bites & Wounds' },
    { id: 'Gastrointestinal', label: 'Gastro / Diarrhea' },
    { id: 'Dental / Head & Neck', label: 'Dental & Neck' },
  ];

  const filteredDiseases = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return CPG_DISEASE_DATABASE.filter(d => {
      const matchesOrgan = selectedOrgan === 'ALL' || d.organ === selectedOrgan;
      if (!matchesOrgan) return false;

      if (!q) return true;

      return (
        d.name.toLowerCase().includes(q) ||
        d.organ.toLowerCase().includes(q) ||
        d.commonPathogens.toLowerCase().includes(q) ||
        d.firstLine.drug.toLowerCase().includes(q) ||
        d.firstLine.instructions.toLowerCase().includes(q) ||
        d.secondLineOrAllergy.drug.toLowerCase().includes(q) ||
        d.stewardshipPearl.toLowerCase().includes(q) ||
        d.cpgSource.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, selectedOrgan]);

  return (
    <div className="space-y-6">
      {/* Header and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Indication-Specific Antibiotic Dosing Database
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              National Antimicrobial Guideline (NAG 3rd Edition, MOH Malaysia) • Primary Care &amp; ED Regimens
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              {filteredDiseases.length} Protocol{filteredDiseases.length !== 1 ? 's' : ''} Active
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Quick search condition, symptom (e.g., 'cough', 'kencing', 'bite', 'ear'), or drug ('amoxicillin', 'augmentin', 'cloxacillin')..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-emerald-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Organ Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
          {organCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedOrgan(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition ${
                selectedOrgan === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      {filteredDiseases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs space-y-2">
          <p className="font-semibold text-slate-300">No matching clinical protocols found for "{searchTerm}".</p>
          <p className="text-[11px]">Try searching for common terms like "pharyngitis", "aom", "uti", "cellulitis", "penicillin", or "cough".</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedOrgan('ALL'); }}
            className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-400 font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDiseases.map(disease => (
            <div 
              key={disease.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3.5"
            >
              {/* Card Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                    {disease.organ}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900">
                    {disease.firstLine.duration}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-white pt-1">
                  {disease.name}
                </h3>
                <p className="text-[11px] text-slate-400 italic">
                  Pathogen(s): {disease.commonPathogens}
                </p>
              </div>

              {/* 1st Line Regimen Box */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <Pill className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1st-Line Regimen (MOH NAG):</span>
                </div>
                <div className="text-white font-semibold">
                  {disease.firstLine.drug}
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Dose: {disease.firstLine.dose} • {disease.firstLine.frequency}
                </div>
                <p className="text-[10px] text-emerald-200/80 pt-0.5 leading-snug">
                  {disease.firstLine.instructions}
                </p>
              </div>

              {/* 2nd Line / Penicillin Allergy Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>2nd-Line / Penicillin Allergy:</span>
                </div>
                <div className="text-slate-200">
                  {disease.secondLineOrAllergy.drug}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {disease.secondLineOrAllergy.dose} • {disease.secondLineOrAllergy.frequency}
                </div>
                {disease.secondLineOrAllergy.note && (
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {disease.secondLineOrAllergy.note}
                  </p>
                )}
              </div>

              {/* Pediatric Dosing & Renal Notes */}
              <div className="space-y-1.5 text-[11px] pt-1">
                <div className="flex items-start gap-1.5 text-slate-300">
                  <Baby className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">Paediatric: </span>
                    <span className="text-slate-300">{disease.pediatricDose}</span>
                  </div>
                </div>

                {disease.renalAdjustment && (
                  <div className="flex items-start gap-1.5 text-amber-300/90 text-[10px]">
                    <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><b>Renal Note:</b> {disease.renalAdjustment}</span>
                  </div>
                )}
              </div>

              {/* Stewardship Clinical Pearl */}
              <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed">
                <span className="font-bold text-amber-300">Stewardship Clinical Pearl: </span>
                {disease.stewardshipPearl}
              </div>

              {/* Red Flags Accordion / List */}
              {disease.redFlags && disease.redFlags.length > 0 && (
                <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-800/40 text-[10px] space-y-1 text-rose-200/90">
                  <span className="font-bold text-rose-300 flex items-center gap-1">
                    <AlertOctagon className="w-3 h-3 text-rose-400" />
                    <span>Emergency Referral Red Flags:</span>
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {disease.redFlags.map((rf, i) => (
                      <li key={i}>{rf}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                {onSelectForConsult && (
                  <button
                    onClick={() => onSelectForConsult(disease)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Reasoning</span>
                  </button>
                )}
                {onGenerateLeaflet && (
                  <button
                    onClick={() => onGenerateLeaflet(disease)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Patient Leaflet</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
