import React, { useState } from 'react';
import { X, FileDown, ShieldCheck, Printer, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import { CaseConsultResponse } from '../types/clinical';

interface CaseSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultData?: CaseConsultResponse | null;
}

export const CaseSummaryModal: React.FC<CaseSummaryModalProps> = ({
  isOpen,
  onClose,
  consultData
}) => {
  if (!isOpen) return null;

  const [patientName, setPatientName] = useState<string>('En. Patient Sample');
  const [mrnNumber, setMrnNumber] = useState<string>(`MRN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [icNumber, setIcNumber] = useState<string>('940812-14-5567');
  const [clinicName, setClinicName] = useState<string>('Klinik Primer & Kecemasan (Malaysia)');
  const [doctorName, setDoctorName] = useState<string>('Dr. Medical Officer');
  const [notes, setNotes] = useState<string>(
    consultData?.clinicalReasoning || 'Patient assessed according to MOH Malaysia NAG guidelines. Antibiotic decision justified by clinical criteria.'
  );

  const handleDownloadPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const clean = (t: string) => String(t)
      .replace(/≥/g, '>=')
      .replace(/≤/g, '<=')
      .replace(/[–—]/g, '-')
      .replace(/[•●]/g, '-')
      .replace(/\s+/g, ' ')
      .trim();

    let y = 45;
    const left = 48;
    const width = 499;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(5, 150, 105);
    doc.text('CLINICAL ENCOUNTER CASE SUMMARY - ANTIMICROBIAL STEWARDSHIP', left, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Facility: ${clean(clinicName)} | Date: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, left, y);
    y += 14;

    doc.setDrawColor(203, 213, 225);
    doc.line(left, y, left + width, y);
    y += 16;

    // Patient Bio Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`Patient Name: ${clean(patientName)}`, left, y);
    doc.text(`MRN: ${clean(mrnNumber)}`, left + 260, y);
    y += 14;
    doc.text(`MyKad / IC No: ${clean(icNumber)}`, left, y);
    doc.text(`Attending Doctor: ${clean(doctorName)}`, left + 260, y);
    y += 20;

    // Clinical Diagnosis & Stewardship Verdict
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(5, 150, 105);
    doc.text('1. CLINICAL DIAGNOSIS & STEWARDSHIP DECISION', left, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const cond = consultData?.condition || 'Upper Respiratory Tract Assessment';
    const abxInd = consultData?.antibioticIndicated
      ? 'ANTIBIOTIC THERAPY INDICATED (Bacterial etiology confirmed)'
      : 'ANTIBIOTIC WITHHELD (Viral etiology / Low bacterial probability)';

    doc.text(`Working Diagnosis: ${clean(cond)}`, left, y);
    y += 14;
    doc.setFont('helvetica', 'bold');
    doc.text(`Stewardship Verdict: ${clean(abxInd)}`, left, y);
    y += 18;

    // Clinical Reasoning
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(5, 150, 105);
    doc.text('2. CLINICAL REASONING & GUIDELINE JUSTIFICATION', left, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const reasoning = consultData?.clinicalReasoning || notes;
    doc.splitTextToSize(clean(reasoning), width).forEach((line: string) => {
      doc.text(line, left, y);
      y += 13;
    });
    y += 8;

    // Prescribed Regimen or Symptomatic Plan
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(5, 150, 105);
    doc.text('3. PRESCRIBED REGIMEN / MANAGEMENT PLAN', left, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);

    if (consultData?.primaryRegimen) {
      doc.text(`Drug: ${clean(consultData.primaryRegimen.drug)}`, left, y);
      y += 12;
      doc.text(`Dosage & Frequency: ${clean(consultData.primaryRegimen.dose)} - ${clean(consultData.primaryRegimen.frequency)} x ${clean(consultData.primaryRegimen.duration)}`, left, y);
      y += 12;
      doc.text(`Instructions: ${clean(consultData.primaryRegimen.instructions)}`, left, y);
      y += 16;
    } else {
      doc.text('Prescription: No antibiotics indicated. Symptomatic relief only (Paracetamol, lozenges, saline gargles).', left, y);
      y += 16;
    }

    // Reference Standard
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Reference: ${clean(consultData?.cpgReference || 'MOH Malaysia National Antimicrobial Guideline 3rd Ed. & CPG URTI')}`, left, y);
    y += 24;

    // Sign-off
    doc.setDrawColor(203, 213, 225);
    doc.line(left, y, left + width, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Signed digitally for Medical Records / Electronic Medical Record (EMR) Integration.', left, y);
    doc.text(`Verified by: ${clean(doctorName)}`, left + 300, y);

    doc.save(`CaseSummary-${mrnNumber}-${new Date().toISOString().slice(0,10)}.pdf`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Export Case Summary for Patient Record</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">MRN / Record ID</label>
              <input
                type="text"
                value={mrnNumber}
                onChange={(e) => setMrnNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">IC / Identification No.</label>
              <input
                type="text"
                value={icNumber}
                onChange={(e) => setIcNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Attending Doctor</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Clinical Notes &amp; Stewardship Justification</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs resize-none"
            />
          </div>

          {/* Diagnosis Preview */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono block">Encounter Assessment:</span>
            <div className="text-white font-bold">{consultData?.condition || 'Upper Respiratory Infection / Pharyngitis'}</div>
            <div className={`text-[11px] font-semibold ${consultData?.antibioticIndicated ? 'text-amber-400' : 'text-emerald-400'}`}>
              {consultData?.antibioticIndicated ? 'Antibiotic Indicated (Documented bacterial criteria)' : 'Antibiotic Withheld (Viral / Self-limiting)'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
          >
            <FileDown className="w-4 h-4" />
            <span>Generate PDF for EMR</span>
          </button>
        </div>

      </div>
    </div>
  );
};
