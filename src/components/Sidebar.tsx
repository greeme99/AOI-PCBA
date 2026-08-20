import React from 'react';
import {
  Scan,
  BarChart2,
  Sliders,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Sun,
  Moon,
  Zap,
  Smartphone,
  Compass,
  Brain,
  Database,
  Radio,
  Flame,
  Wrench,
} from 'lucide-react';
import { SMTLineStatus, PCBBoard, ThemeMode } from '../types/aoi';

interface SidebarProps {
  activeView: 'inspection' | 'spc' | 'recipe' | 'fleet' | 'anomaly' | 'autotune' | 'pdm';
  onSelectView: (view: 'inspection' | 'spc' | 'recipe' | 'fleet' | 'anomaly' | 'autotune' | 'pdm') => void;
  onOpenGerberModal: () => void;
  onOpenAutoTeachingModal?: () => void;
  onOpenSmartphoneModal?: () => void;
  onOpenDefectLearningModal?: () => void;
  onToggleAiPanel: () => void;
  isAiPanelOpen: boolean;
  onOpen8DModal: () => void;
  onOpenClosedLoopModal?: () => void;
  currentBoard: PCBBoard;
  activeLine: SMTLineStatus;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  onOpenGerberModal,
  onOpenAutoTeachingModal,
  onOpenSmartphoneModal,
  onOpenDefectLearningModal,
  onToggleAiPanel,
  isAiPanelOpen,
  onOpen8DModal,
  onOpenClosedLoopModal,
  currentBoard,
  activeLine,
  themeMode,
  onToggleTheme,
}) => {
  const isDark = themeMode === 'dark';

  return (
    <aside
      id="sleek-sidebar"
      className={`w-64 h-full flex flex-col justify-between select-none shrink-0 transition-colors duration-200 z-30 overflow-hidden ${
        isDark
          ? 'bg-[#1e293b] border-r border-slate-700 text-slate-200'
          : 'bg-white border-r border-slate-200 text-slate-700 shadow-sm'
      }`}
    >
      {/* Top Brand Header (Fixed) */}
      <div className={`p-4 border-b shrink-0 flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            A
          </div>
          <div>
            <h1 className={`text-sm font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AOI-PCBA
            </h1>
            <span className="text-[10px] font-semibold text-blue-500">Intelligence System</span>
          </div>
        </div>

        {/* Theme Quick Switcher */}
        <button
          type="button"
          onClick={onToggleTheme}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
          }`}
          title={isDark ? '화이트&그레이 모드로 전환' : '다크 모드로 전환'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation (Scrollable to ensure all items reachable on any height) */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-1">
        <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 px-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Main Inspection Views
        </div>

        <button
          type="button"
          id="sidebar-nav-inspection"
          onClick={() => onSelectView('inspection')}
          className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
            activeView === 'inspection'
              ? isDark
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-blue-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Scan className={`w-4 h-4 mr-2.5 shrink-0 ${activeView === 'inspection' ? 'text-white' : 'text-blue-500'}`} />
          <span>3D Inspection Studio</span>
        </button>

        <button
          type="button"
          id="sidebar-nav-spc"
          onClick={() => onSelectView('spc')}
          className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
            activeView === 'spc'
              ? isDark
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-emerald-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BarChart2 className={`w-4 h-4 mr-2.5 shrink-0 ${activeView === 'spc' ? 'text-white' : 'text-emerald-500'}`} />
          <span>SPC & Yield Analytics</span>
        </button>

        <button
          type="button"
          id="sidebar-nav-recipe"
          onClick={() => onSelectView('recipe')}
          className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
            activeView === 'recipe'
              ? isDark
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'bg-amber-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sliders className={`w-4 h-4 mr-2.5 shrink-0 ${activeView === 'recipe' ? 'text-white' : 'text-amber-500'}`} />
          <span>Recipe & Optic Tuning</span>
        </button>

        <button
          type="button"
          id="sidebar-nav-fleet-control"
          onClick={() => onSelectView('fleet')}
          className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
            activeView === 'fleet'
              ? isDark
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-indigo-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Radio className={`w-4 h-4 mr-2.5 shrink-0 ${activeView === 'fleet' ? 'text-white' : 'text-indigo-400'}`} />
          <div className="flex items-center justify-between w-full">
            <span>3.1 중앙 플릿 관제 (OEE)</span>
            <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
              activeView === 'fleet'
                ? 'bg-white/20 text-white'
                : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              LIVE
            </span>
          </div>
        </button>

        <button
          type="button"
          id="sidebar-nav-anomaly-engine"
          onClick={() => onSelectView('anomaly')}
          className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
            activeView === 'anomaly'
              ? isDark
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-cyan-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Flame className={`w-4 h-4 mr-2.5 shrink-0 ${activeView === 'anomaly' ? 'text-white' : 'text-cyan-400'}`} />
          <div className="flex items-center justify-between w-full">
            <span>3.2 골든 감산 & 이상감지</span>
            <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
              activeView === 'anomaly'
                ? 'bg-white/20 text-white'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              AI
            </span>
          </div>
        </button>

        <button
          type="button"
          id="sidebar-nav-autotune-engine"
          onClick={() => onSelectView('autotune')}
          className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
            activeView === 'autotune'
              ? isDark
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'bg-amber-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sparkles className={`w-4 h-4 mr-2.5 shrink-0 ${activeView === 'autotune' ? 'text-white' : 'text-amber-400'}`} />
          <div className="flex items-center justify-between w-full">
            <span>3.3 파라미터 오토튜닝</span>
            <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
              activeView === 'autotune'
                ? 'bg-white/20 text-white'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              ML
            </span>
          </div>
        </button>

        <button
          type="button"
          id="sidebar-nav-pdm-telemetry"
          onClick={() => onSelectView('pdm')}
          className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
            activeView === 'pdm'
              ? isDark
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'bg-rose-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Wrench className={`w-4 h-4 mr-2.5 shrink-0 ${activeView === 'pdm' ? 'text-white' : 'text-rose-400'}`} />
          <div className="flex items-center justify-between w-full">
            <span>3.4 설비 예지보전 (PdM)</span>
            <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
              activeView === 'pdm'
                ? 'bg-white/20 text-white'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              PdM
            </span>
          </div>
        </button>

        <div className={`text-[10px] font-bold uppercase tracking-wider mt-4 mb-2 px-2.5 pt-2 border-t ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
          Smart Factory Tools
        </div>

        <button
          type="button"
          id="sidebar-btn-cad-gerber"
          onClick={onOpenGerberModal}
          className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all text-left cursor-pointer ${
            isDark
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 mr-2.5 shrink-0 text-cyan-500" />
          <span>CAD / Gerber Manager</span>
        </button>

        {onOpenAutoTeachingModal && (
          <button
            type="button"
            id="sidebar-btn-cad-auto-teach"
            onClick={onOpenAutoTeachingModal}
            className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all text-left cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 mr-2.5 shrink-0 text-amber-500" />
            <span>CAD Auto-Teach & Fiducial</span>
          </button>
        )}

        {onOpenSmartphoneModal && (
          <button
            type="button"
            id="sidebar-btn-smartphone-cam"
            onClick={onOpenSmartphoneModal}
            className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all text-left cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 mr-2.5 shrink-0 text-emerald-500" />
            <span>Smartphone Macro / QR Cam</span>
          </button>
        )}

        {onOpenClosedLoopModal && (
          <button
            type="button"
            id="sidebar-btn-closed-loop-cfx"
            onClick={onOpenClosedLoopModal}
            className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all text-left cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 mr-2.5 shrink-0 text-blue-500" />
            <span>SMT Closed-Loop (CFX)</span>
          </button>
        )}

        {onOpenDefectLearningModal && (
          <button
            type="button"
            id="sidebar-btn-defect-learning-db"
            onClick={onOpenDefectLearningModal}
            className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
              isDark
                ? 'text-cyan-300 hover:bg-cyan-950/40 hover:text-cyan-200'
                : 'text-cyan-800 hover:bg-cyan-50 hover:text-cyan-950'
            }`}
          >
            <Brain className="w-4 h-4 mr-2.5 shrink-0 text-cyan-400" />
            <div className="flex items-center justify-between w-full">
              <span>AI 결함학습 DB</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </button>
        )}

        <button
          type="button"
          id="sidebar-btn-8d-reports"
          onClick={onOpen8DModal}
          className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all text-left cursor-pointer ${
            isDark
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2.5 shrink-0 text-indigo-500" />
          <span>8D Quality Reports</span>
        </button>

        <button
          type="button"
          id="sidebar-btn-ai-copilot"
          onClick={onToggleAiPanel}
          className={`w-full flex items-center px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
            isAiPanelOpen
              ? isDark
                ? 'bg-violet-600/25 text-violet-300 border border-violet-500/50'
                : 'bg-violet-100 text-violet-800 border border-violet-300'
              : isDark
              ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2.5 shrink-0 text-violet-500" />
          <div className="flex items-center justify-between w-full">
            <span>AI Copilot & RCA</span>
            {isAiPanelOpen && <span className="text-[10px] font-mono text-violet-400">OPEN</span>}
          </div>
        </button>
      </div>

      {/* Bottom Live SMT & Workspace Footer (Fixed at bottom) */}
      <div className={`p-3 border-t shrink-0 space-y-2 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
        <div
          className={`p-2.5 rounded-lg border text-[11px] ${
            isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={isDark ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>
              Line / FPY
            </span>
            <span className="text-emerald-500 font-bold font-mono">{activeLine.name.split(' (')[0]} ({activeLine.fpy}%)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={isDark ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>
              Active PCB
            </span>
            <span className="font-mono font-semibold text-blue-400">{currentBoard.model}</span>
          </div>
        </div>

        <div className={`text-[10px] font-mono break-all leading-tight px-2 py-1 rounded border ${
          isDark
            ? 'bg-slate-950/80 border-slate-800 text-slate-400'
            : 'bg-white border-slate-200 text-slate-600'
        }`}>
          Downloads\Workspace\AOI-PCBA
        </div>
      </div>
    </aside>
  );
};
