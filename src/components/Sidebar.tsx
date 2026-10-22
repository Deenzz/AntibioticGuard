import React from 'react';
import { 
  ShieldCheck, 
  Calculator, 
  Search, 
  AlertTriangle, 
  GitFork, 
  FlaskConical, 
  Sparkles, 
  FileText, 
  Moon, 
  Sun, 
  Wifi, 
  WifiOff, 
  Building2, 
  Flame,
  FileCheck
} from 'lucide-react';
import { ClinicalSetting } from '../types/clinical';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  clinicalSetting: ClinicalSetting;
  setClinicalSetting: (setting: ClinicalSetting) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenCaseExport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  clinicalSetting,
  setClinicalSetting,
  isDarkMode,
  toggleDarkMode,
  isOfflineMode,
  toggleOfflineMode,
  isMobileOpen,
  setIsMobileOpen,
  onOpenCaseExport,
}) => {
  const menuItems = [
    { id: 'centor', label: 'Centor / McIsaac Triage', icon: Calculator, badge: 'High Yield' },
    { id: 'lookup', label: 'Indication Drug Look-Up', icon: Search, badge: 'MOH NAG' },
    { id: 'allergy', label: 'Penicillin Allergy Engine', icon: AlertTriangle, badge: 'Safety' },
    { id: 'flowcharts', label: 'Clinical Flowcharts', icon: GitFork, badge: 'Interactive' },
    { id: 'investigations', label: 'Biomarkers & Red Flags', icon: FlaskConical, badge: 'Lab Ranges' },
    { id: 'copilot', label: 'AI Clinical Copilot', icon: Sparkles, badge: 'Gemini + NAG' },
    { id: 'leaflet', label: 'Viral Patient Leaflet', icon: FileText, badge: 'EN / BM' },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header / Branding */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">AntibioticGuard</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">MY</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">MOH NAG Stewardship Engine</p>
            </div>
          </div>

          {/* Clinical Setting Switcher */}
          <div className="mt-4 bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setClinicalSetting('GP_CLINIC')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                clinicalSetting === 'GP_CLINIC'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>GP Clinic</span>
            </button>
            <button
              onClick={() => setClinicalSetting('EMERGENCY_DEPT')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                clinicalSetting === 'EMERGENCY_DEPT'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Emergency (ED)</span>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Clinical Modules & Protocols
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Action: Export Case Record */}
          <div className="pt-3 border-t border-slate-800 mt-3">
            <button
              onClick={onOpenCaseExport}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Export Case Summary PDF</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">EMR</span>
            </button>
          </div>
        </div>

        {/* Bottom Utility Controls */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
          {/* Offline Mode Indicator / Toggle */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              {isOfflineMode ? (
                <WifiOff className="w-4 h-4 text-amber-400" />
              ) : (
                <Wifi className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-slate-300 text-[11px] font-medium">
                {isOfflineMode ? 'Offline Database' : 'Cloud Connected'}
              </span>
            </div>
            <button
              onClick={toggleOfflineMode}
              title="Toggle Simulated Offline Mode"
              className={`text-[10px] font-bold px-2 py-1 rounded transition ${
                isOfflineMode 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isOfflineMode ? 'Offline Active' : 'Go Offline'}
            </button>
          </div>

          {/* Dark / Low-light mode toggle */}
          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-400">
            <span className="text-[11px]">Night / Low-Light ER Mode</span>
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>

          <div className="text-[9px] text-slate-400 text-center pt-1 font-mono">
            Calibrated to MOH Malaysia NAG (3rd Ed.) &amp; CPG URTI
          </div>
        </div>
      </aside>
    </>
  );
};
