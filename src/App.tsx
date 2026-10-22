import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Menu, 
  Moon, 
  Sun, 
  FileDown, 
  Wifi, 
  WifiOff, 
  Calculator, 
  Search, 
  AlertTriangle, 
  GitFork, 
  FlaskConical, 
  Sparkles, 
  FileText,
  Building2,
  Flame,
  FileCheck
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { CentorCalculator } from './components/CentorCalculator';
import { DiseaseLookup } from './components/DiseaseLookup';
import { AllergyEngine } from './components/AllergyEngine';
import { ClinicalFlowcharts } from './components/ClinicalFlowcharts';
import { InvestigationMatrix } from './components/InvestigationMatrix';
import { AiConsultCopilot } from './components/AiConsultCopilot';
import { LeafletExport } from './components/LeafletExport';
import { CaseSummaryModal } from './components/CaseSummaryModal';
import { ClinicalSetting, CaseConsultResponse, DiseaseProtocol } from './types/clinical';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('centor');
  const [clinicalSetting, setClinicalSetting] = useState<ClinicalSetting>('GP_CLINIC');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Cross-component communication data
  const [copilotInitialData, setCopilotInitialData] = useState<any>(null);
  const [leafletCondition, setLeafletCondition] = useState<string>('Acute Upper Respiratory Tract Infection (Viral)');
  const [activeConsultData, setActiveConsultData] = useState<CaseConsultResponse | null>(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState<boolean>(false);

  // Theme synchronization
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode(prev => !prev);
  };

  const handleSendToCopilotFromCentor = (data: any) => {
    setCopilotInitialData({
      complaint: 'Sore throat & pharyngitis',
      ageGroup: data.ageGroup,
      symptoms: data.symptoms,
      centorScore: data.score
    });
    setCurrentTab('copilot');
  };

  const handleSelectDiseaseForConsult = (disease: DiseaseProtocol) => {
    setCopilotInitialData({
      complaint: disease.name,
      symptoms: [disease.organ, `Suspected: ${disease.commonPathogens}`]
    });
    setCurrentTab('copilot');
  };

  const handleGenerateLeafletFromDisease = (disease: DiseaseProtocol) => {
    setLeafletCondition(disease.name);
    setCurrentTab('leaflet');
  };

  const handleOpenLeafletFromConsult = (condition: string) => {
    setLeafletCondition(condition);
    setCurrentTab('leaflet');
  };

  const handleOpenCaseSummary = (consult?: CaseConsultResponse) => {
    if (consult) {
      setActiveConsultData(consult);
    }
    setIsCaseModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Clinical Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          {/* Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-950">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base tracking-tight">AntibioticGuard</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    MOH NAG Malaysia
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Rational Primary Care &amp; Emergency Antimicrobial Stewardship Decision Support
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {/* Setting Tag */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
              {clinicalSetting === 'GP_CLINIC' ? (
                <>
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300">GP Clinic</span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-slate-300">Emergency Dept</span>
                </>
              )}
            </div>

            {/* Offline Indicator */}
            {isOfflineMode && (
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-800">
                <WifiOff className="w-3 h-3" />
                <span className="hidden sm:inline">Offline Mode</span>
              </span>
            )}

            {/* Export PDF Button */}
            <button
              onClick={() => handleOpenCaseSummary()}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Case PDF</span>
              <span className="sm:hidden">Case PDF</span>
            </button>

            {/* Dark / Low Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
              title="Toggle Low-Light Night Mode"
            >
              {isDarkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Layout Container (Sidebar + Content) */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex">
        
        {/* Docked Sidebar (Desktop) / Slide-over (Mobile) */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          clinicalSetting={clinicalSetting}
          setClinicalSetting={setClinicalSetting}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isOfflineMode={isOfflineMode}
          toggleOfflineMode={toggleOfflineMode}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          onOpenCaseExport={() => handleOpenCaseSummary()}
        />

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 sm:pb-8 w-full max-w-full">
          {currentTab === 'centor' && (
            <CentorCalculator onSendToCopilot={handleSendToCopilotFromCentor} />
          )}

          {currentTab === 'lookup' && (
            <DiseaseLookup
              onSelectForConsult={handleSelectDiseaseForConsult}
              onGenerateLeaflet={handleGenerateLeafletFromDisease}
            />
          )}

          {currentTab === 'allergy' && (
            <AllergyEngine />
          )}

          {currentTab === 'flowcharts' && (
            <ClinicalFlowcharts />
          )}

          {currentTab === 'investigations' && (
            <InvestigationMatrix />
          )}

          {currentTab === 'copilot' && (
            <AiConsultCopilot
              clinicalSetting={clinicalSetting}
              initialData={copilotInitialData}
              onExportPdf={(consult) => handleOpenCaseSummary(consult)}
              onOpenLeaflet={handleOpenLeafletFromConsult}
              isOfflineMode={isOfflineMode}
            />
          )}

          {currentTab === 'leaflet' && (
            <LeafletExport initialCondition={leafletCondition} />
          )}
        </main>

      </div>

      {/* Docked Bottom Navigation Bar for Mobile ER/Clinic Shifts */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-slate-900/95 border-t border-slate-800 z-30 backdrop-blur-md flex items-center justify-around p-1.5 safe-area-pb">
        <button
          onClick={() => setCurrentTab('centor')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
            currentTab === 'centor' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Calculator className="w-4 h-4 mb-0.5" />
          <span>Centor</span>
        </button>

        <button
          onClick={() => setCurrentTab('lookup')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
            currentTab === 'lookup' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span>Lookup</span>
        </button>

        <button
          onClick={() => setCurrentTab('allergy')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
            currentTab === 'allergy' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <AlertTriangle className="w-4 h-4 mb-0.5" />
          <span>Allergy</span>
        </button>

        <button
          onClick={() => setCurrentTab('flowcharts')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
            currentTab === 'flowcharts' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <GitFork className="w-4 h-4 mb-0.5" />
          <span>Flowchart</span>
        </button>

        <button
          onClick={() => setCurrentTab('copilot')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
            currentTab === 'copilot' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Copilot</span>
        </button>

        <button
          onClick={() => setCurrentTab('leaflet')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition ${
            currentTab === 'leaflet' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>Leaflet</span>
        </button>
      </nav>

      {/* Case Summary PDF Export Modal */}
      <CaseSummaryModal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        consultData={activeConsultData}
      />

    </div>
  );
}
