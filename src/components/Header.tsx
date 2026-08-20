import React from 'react';
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Sun,
  Moon,
} from 'lucide-react';
import { SMTLineStatus, PCBBoard, IPCClass, ThemeMode } from '../types/aoi';

interface HeaderProps {
  activeView: 'inspection' | 'spc' | 'recipe' | 'fleet' | 'anomaly' | 'autotune' | 'pdm';
  onSelectView: (view: 'inspection' | 'spc' | 'recipe' | 'fleet' | 'anomaly' | 'autotune' | 'pdm') => void;
  activeLine: SMTLineStatus;
  lines: SMTLineStatus[];
  onSelectLine: (lineId: string) => void;
  currentBoard: PCBBoard;
  onSelectBoardModel: (modelKey: string) => void;
  ipcClass: IPCClass;
  onChangeIPCClass: (newClass: IPCClass) => void;
  isAiPanelOpen: boolean;
  onToggleAiPanel: () => void;
  onOpenGerberModal: () => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  activeLine,
  lines,
  onSelectLine,
  currentBoard,
  onSelectBoardModel,
  ipcClass,
  onChangeIPCClass,
  isAiPanelOpen,
  onToggleAiPanel,
  onOpenGerberModal,
  themeMode,
  onToggleTheme,
}) => {
  const isDark = themeMode === 'dark';

  const viewTitles = {
    inspection: '3D Optical Inspection Studio',
    spc: 'Statistical Process Control & SPC',
    recipe: 'Recipe Tuning & 3D Optics Calibration',
    fleet: '3.1 SMT Fleet Central Command (OEE & Recipe Dispatch)',
    anomaly: '3.2 Golden Master Diff & Deep Anomaly Map',
    autotune: '3.3 AI Auto-Threshold Optimizer (ROC-AUC Tuning)',
    pdm: '3.4 SMT Equipment Predictive Maintenance (PdM Telemetry)',
  };

  return (
    <header
      id="sleek-header"
      className={`h-14 border-b flex items-center justify-between px-6 select-none shrink-0 transition-colors duration-200 ${
        isDark
          ? 'bg-[#1e293b] border-slate-700 text-slate-200'
          : 'bg-white border-slate-200 text-slate-700 shadow-xs'
      }`}
    >
      {/* Left: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs shrink-0">
        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          AOI-PCBA
        </span>
        <ChevronRight className={`w-3.5 h-3.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
        <span className={`font-semibold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {viewTitles[activeView]}
        </span>
      </div>

      {/* Center: Top View Switcher Tabs for direct 1-click access */}
      <div className={`hidden lg:flex items-center p-1 rounded-lg border text-xs font-semibold space-x-1 ${
        isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          type="button"
          onClick={() => onSelectView('inspection')}
          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
            activeView === 'inspection'
              ? isDark ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-blue-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3D Studio
        </button>
        <button
          type="button"
          onClick={() => onSelectView('spc')}
          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
            activeView === 'spc'
              ? isDark ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-emerald-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          SPC
        </button>
        <button
          type="button"
          onClick={() => onSelectView('recipe')}
          className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
            activeView === 'recipe'
              ? isDark ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-amber-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Recipe
        </button>
        <button
          type="button"
          onClick={() => onSelectView('fleet')}
          className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
            activeView === 'fleet'
              ? isDark ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-indigo-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>3.1 Fleet</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectView('anomaly')}
          className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
            activeView === 'anomaly'
              ? isDark ? 'bg-cyan-600 text-white shadow-xs' : 'bg-white text-cyan-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>3.2 Anomaly</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectView('autotune')}
          className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
            activeView === 'autotune'
              ? isDark ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-amber-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>3.3 Auto-Tune</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectView('pdm')}
          className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
            activeView === 'pdm'
              ? isDark ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-rose-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>3.4 PdM</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* SMT Line Selector */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className={isDark ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>
            Line:
          </span>
          <select
            value={activeLine.id}
            onChange={(e) => onSelectLine(e.target.value)}
            className={`text-xs rounded-md px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
              isDark
                ? 'bg-slate-900 border border-slate-700 text-blue-400'
                : 'bg-slate-50 border border-slate-200 text-blue-600'
            }`}
          >
            {lines.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Board Model Quick Switcher */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className={isDark ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>
            PCB:
          </span>
          <select
            value={currentBoard.model}
            onChange={(e) => onSelectBoardModel(e.target.value)}
            className={`text-xs rounded-md px-2.5 py-1 font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
              isDark
                ? 'bg-slate-900 border border-slate-700 text-emerald-400'
                : 'bg-slate-50 border border-slate-200 text-emerald-600'
            }`}
          >
            <option value="ECU-2026-AUTO">ECU-2026-AUTO (Automotive)</option>
            <option value="IOT-GATEWAY-V3">IOT-GATEWAY-V3 (Smart Home)</option>
            <option value="POWER-SUPPLY-MOD">POWER-SUPPLY-MOD (Industrial)</option>
          </select>
        </div>

        {/* IPC Standard Badge / Selector */}
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border text-xs ${
            isDark
              ? 'bg-slate-800/80 border-slate-700 text-slate-300'
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <select
            value={ipcClass}
            onChange={(e) => onChangeIPCClass(e.target.value as IPCClass)}
            className="bg-transparent text-xs focus:outline-none cursor-pointer font-medium"
          >
            <option value="Class 3 (High Reliability / Automotive)">IPC-A-610 Class 3</option>
            <option value="Class 2 (Dedicated Service)">IPC-A-610 Class 2</option>
            <option value="Class 1 (General Electronic)">IPC-A-610 Class 1</option>
          </select>
        </div>

        {/* AI Copilot Button */}
        <button
          onClick={onToggleAiPanel}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition-all ${
            isAiPanelOpen
              ? 'bg-violet-600 text-white shadow-violet-500/20'
              : isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-violet-400 border border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-violet-600 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Copilot</span>
        </button>

        {/* Active System Pulse */}
        <div
          className={`flex items-center space-x-1.5 px-2 py-1 rounded-full border text-[11px] font-semibold ${
            isDark
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ACTIVE</span>
        </div>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow">
          QC
        </div>

        <div className={`h-4 w-[1px] ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />

        {/* Prominent Top-Right Screen Mode Switcher */}
        <button
          id="theme-mode-toggle-btn"
          onClick={onToggleTheme}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border shadow-xs transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700/90 text-amber-300 border-amber-500/30 hover:border-amber-400/60 ring-1 ring-amber-400/20'
              : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800 ring-1 ring-slate-900/20'
          }`}
          title={isDark ? '화이트&그레이 모드로 전환 (현재: 다크 모드)' : '다크 모드로 전환 (현재: 화이트&그레이 모드)'}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>화이트/그레이</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-300" />
              <span>다크 모드</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
