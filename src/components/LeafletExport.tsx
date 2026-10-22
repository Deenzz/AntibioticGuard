import React, { useState } from 'react';
import { 
  FileDown, 
  Printer, 
  ShieldCheck, 
  HeartHandshake, 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  Share2 
} from 'lucide-react';
import jsPDF from 'jspdf';

interface LeafletExportProps {
  initialCondition?: string;
}

export const LeafletExport: React.FC<LeafletExportProps> = ({ initialCondition }) => {
  const [patientName, setPatientName] = useState<string>('');
  const [clinicName, setClinicName] = useState<string>('Klinik Primer & Kecemasan (Malaysia)');
  const [diagnosis, setDiagnosis] = useState<string>(initialCondition || 'Jangkitan Virus Saluran Pernafasan / Viral URTI');
  const [doctorName, setDoctorName] = useState<string>('Dr. On-Duty Medical Officer');
  const [delayedDays, setDelayedDays] = useState<string>('3');

  const handlePrint = () => {
    window.print();
  };

  const handleSavePdf = () => {
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
    doc.setFontSize(16);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text('KEMENTERIAN KESIHATAN MALAYSIA (MOH)', left, y);
    y += 18;

    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('Antibiotic Stewardship Patient Leaflet / Risalah Preskripsi Tertangguh', left, y);
    y += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Klinik: ${clean(clinicName)} | Tarikh: ${new Date().toLocaleDateString('en-GB')}`, left, y);
    y += 14;
    doc.text(`Pesakit: ${patientName ? clean(patientName) : 'Rawatan Pesakit Luar'} | Diagnosis: ${clean(diagnosis)}`, left, y);
    y += 18;

    // Divider
    doc.setDrawColor(203, 213, 225);
    doc.line(left, y, left + width, y);
    y += 16;

    // Section 1: English
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(5, 150, 105);
    doc.text('1. WHY ANTIBIOTICS ARE NOT PRESCRIBED TODAY (ENGLISH)', left, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const enText = 'Your infection is caused by a VIRUS (Common Cold, Viral Pharyngitis, Flu, or Acute Bronchitis). Antibiotics kill bacteria, not viruses. Taking an antibiotic for a viral illness does not help you recover faster, but exposes you to stomach upset, rashes, diarrhea, and creates dangerous antibiotic-resistant superbugs.';
    doc.splitTextToSize(clean(enText), width).forEach((line: string) => {
      doc.text(line, left, y);
      y += 12;
    });
    y += 6;

    // Section 2: Bahasa Melayu
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(5, 150, 105);
    doc.text('2. KENAPA ANDA TIDAK DIBERIKAN ANTIBIOTIK HARI INI (BAHASA MELAYU)', left, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const bmText = 'Penyakit anda berpunca daripada jangkitan VIRUS (selsema, batuk virus, atau sakit tekak biasa). Antibiotik HANYA membunuh bakteria dan tidak berkesan untuk virus. Mengambil antibiotik tanpa keperluan mendatangkan kesan sampingan seperti cirit-birit, alahan, dan melahirkan kuman kebal (bakteria rintang) yang sukar diubati.';
    doc.splitTextToSize(clean(bmText), width).forEach((line: string) => {
      doc.text(line, left, y);
      y += 12;
    });
    y += 10;

    // Section 3: Home care
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(5, 150, 105);
    doc.text('3. CARA MELEGAKAN GEJALA DI RUMAH / EFFECTIVE SYMPTOM RELIEF', left, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const reliefLines = [
      '- Demam / Sakit Tekak: Paracetamol 500-1000mg setiap 6 jam jika perlu (tidak melebihi 4,000mg sehari). Kumur air garam suam.',
      '- Hidung Tersumbat / Batuk: Sedut wap air panas, semburan hidung saline, minuman madu dan lemon suam.',
      '- Rehat & Air: Minum sekurang-kurangnya 2 liter air kosong sehari dan dapatkan rehat secukupnya.'
    ];
    reliefLines.forEach((l: string) => {
      doc.text(clean(l), left, y);
      y += 12;
    });
    y += 8;

    // Section 4: Delayed Prescription
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(217, 119, 6); // amber-600
    doc.text(`4. PROTOKOL PRESKRIPSI TERTANGGUH (${delayedDays} HARI) / DELAYED PRESCRIPTION`, left, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const delayText = `Sekiranya gejala anda TIDAK mula beransur pulih selepas ${delayedDays} HARI, atau demam menjadi semakin tinggi, sila hubungi klinik semula untuk penilaian antibiotik susulan (If your symptoms do not start to improve after ${delayedDays} days, return to clinic).`;
    doc.splitTextToSize(clean(delayText), width).forEach((line: string) => {
      doc.text(line, left, y);
      y += 12;
    });
    y += 8;

    // Section 5: Red Flags
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(225, 29, 72); // rose-600
    doc.text('5. TANDA BAHAYA KECEMASAN / EMERGENCY DANGER SIGNS', left, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(159, 18, 57);
    const redFlagText = 'SEGERA KE JABATAN KECEMASAN HOSPITAL jika: Sesak nafas, tidak boleh menelan air liur sendiri, bibir kebiruan, batuk berdarah, atau sakit dada yang teruk.';
    doc.splitTextToSize(clean(redFlagText), width).forEach((line: string) => {
      doc.text(line, left, y);
      y += 12;
    });

    doc.save(`AntibioticGuard-Leaflet-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Bilingual Viral Infection &amp; Delayed Prescription Leaflet
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            MOH Antibiotic Stewardship Patient Handout • English &amp; Bahasa Melayu • Print or Export PDF
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSavePdf}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <FileDown className="w-4 h-4" />
            <span>Save PDF Leaflet</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Leaflet</span>
          </button>
        </div>
      </div>

      {/* Customizer Panel */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 no-print text-xs">
        <span className="font-bold text-slate-300 uppercase tracking-wider block">
          Customize Patient Details Before Printing:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Patient Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Encik Ahmad Bin Ali"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
            />
          </div>
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Clinic Name</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
            />
          </div>
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Clinical Diagnosis</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
            />
          </div>
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Delayed Period</label>
            <select
              value={delayedDays}
              onChange={(e) => setDelayedDays(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
            >
              <option value="2">2 Days (48 Hours)</option>
              <option value="3">3 Days (72 Hours)</option>
              <option value="5">5 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaflet Preview (Bilingual Side-by-Side or Stacked) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                MOH Malaysia Antibiotic Stewardship
              </span>
              <span className="text-xs text-slate-400">Date: {new Date().toLocaleDateString('en-GB')}</span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">
              Patient Care Information: {diagnosis}
            </h3>
            {patientName && (
              <p className="text-xs text-slate-300 font-medium">Patient: {patientName}</p>
            )}
          </div>
          <div className="text-right text-xs text-slate-400 hidden sm:block">
            <span className="block font-semibold text-slate-200">{clinicName}</span>
            <span className="text-[11px]">Primary Care Stewardship Initiative</span>
          </div>
        </div>

        {/* Bilingual Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs leading-relaxed">
          
          {/* ENGLISH COLUMN */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5">
            <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-white">English Information Sheet</h4>
              <span className="text-[10px] text-emerald-400 font-mono">Evidence-Based</span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 font-semibold text-[11px]">
              YOUR INFECTION IS CAUSED BY A VIRUS:
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-emerald-400 block">WHY ANTIBIOTICS DO NOT HELP:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                <li><b>Antibiotics ONLY kill bacteria.</b> They have zero effect against viruses that cause colds, flu, sore throats, or bronchitis.</li>
                <li>Taking antibiotics for viral illnesses exposes you to drug side effects: stomach cramps, diarrhea, fungal thrush, and severe allergic reactions.</li>
                <li>Overuse creates <b>Superbugs (Resistant Bacteria)</b> in your body, meaning antibiotics may not work when you really need them in the future.</li>
              </ul>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="font-bold text-emerald-400 block">HOW TO RELIEVE SYMPTOMS SAFELY:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                <li><b>Fever / Sore Throat:</b> Paracetamol 500–1000 mg every 6 hours PRN (max 4,000 mg/day). Warm salt water gargles.</li>
                <li><b>Cough &amp; Congestion:</b> Saline nasal rinses, steam inhalation, and warm honey-lemon drinks.</li>
                <li><b>Rest &amp; Fluids:</b> Drink at least 2 liters of water daily and rest adequately.</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-200 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>Delayed Prescription ({delayedDays} Days):</span>
              </div>
              <p>
                If your symptoms do NOT begin to improve after <b>{delayedDays} days</b>, or if new high fever develops, contact our clinic to discuss whether a secondary bacterial infection has arisen.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/50 text-rose-200 text-[11px] space-y-1">
              <span className="font-bold text-rose-300 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>DANGER SIGNS - SEEK IMMEDIATE HOSPITAL CARE:</span>
              </span>
              <p>
                Difficulty breathing, inability to swallow saliva, chest pain, coughing up blood, or blue discoloration of lips.
              </p>
            </div>
          </div>

          {/* BAHASA MELAYU COLUMN */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5">
            <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-white">Risalah Panduan Pesakit (Bahasa Melayu)</h4>
              <span className="text-[10px] text-blue-400 font-mono">Bahasa Kebangsaan</span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 font-semibold text-[11px]">
              JANGKITAN ANDA BERPUNCA DARIPADA VIRUS:
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-blue-400 block">FAKTA PENTING TENTANG ANTIBIOTIK:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                <li><b>Antibiotik HANYA membunuh bakteria.</b> Ia langsung tidak berkesan terhadap jangkitan virus seperti selsema, batuk, dan sakit tekak biasa.</li>
                <li>Mengambil antibiotik tanpa keperluan mendatangkan kesan sampingan: cirit-birit, alahan kulit, dan gangguan bakteria baik usus.</li>
                <li>Penggunaan berlebihan melahirkan <b>Kuman Kebal (Bakteria Rintang)</b> yang tidak lagi dapat diubati dengan ubat biasa pada masa hadapan.</li>
              </ul>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="font-bold text-blue-400 block">CARA MELEGAKAN GEJALA DI RUMAH:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                <li><b>Demam / Sakit Tekak:</b> Ambil Paracetamol jika perlu (tidak melebihi 4,000 mg sehari). Kumur air garam suam.</li>
                <li><b>Hidung Tersumbat / Batuk:</b> Semburan hidung saline, sedut wap air panas, dan minuman madu suam.</li>
                <li><b>Rehat &amp; Minum Air:</b> Minum sekurang-kurangnya 2 liter air kosong sehari dan dapatkan rehat secukupnya.</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-200 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>Preskripsi Tertangguh ({delayedDays} Hari):</span>
              </div>
              <p>
                Sekiranya keadaan anda tidak bertambah baik selepas <b>{delayedDays} hari</b>, atau demam semakin tinggi, hubungi klinik semula untuk penilaian antibiotik susulan.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/50 text-rose-200 text-[11px] space-y-1">
              <span className="font-bold text-rose-300 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>TANDA BAHAYA - SEGERA KE KECEMASAN HOSPITAL:</span>
              </span>
              <p>
                Susah bernafas, tidak boleh menelan air liur sendiri, bibir membiru, batuk berdarah, atau sakit dada yang mencucuk.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
