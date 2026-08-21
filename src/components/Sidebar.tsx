import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Scan,
  BarChart2,
  Sliders,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Zap,
  Smartphone,
  Compass,
  Database,
  Radio,
  Flame,
  FileText,
  Camera,
  X,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';
import { useInspectionStore } from '../stores/useInspectionStore';
import { useModalStore } from '../stores/useModalStore';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const themeMode = useUIStore((s) => s.themeMode);
  const isMobileOpen = useUIStore((s) => s.isMobileSidebarOpen);
  const setMobileOpen = useUIStore((s) => s.setMobileSidebarOpen);
  
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const isAiPanelOpen = useUIStore((s) => s.isAiPanelOpen);
  const toggleAiPanel = useUIStore((s) => s.toggleAiPanel);

  const currentBoard = useInspectionStore((s) => s.getCurrentBoard());
  const activeLine = useInspectionStore((s) => s.getActiveLine());

  const openModal = useModalStore((s) => s.open);

  const isDark = themeMode === 'dark';

  const handleNav = (path: string) => {
    navigate({ pathname: path, search: location.search });
    setMobileOpen(false);
  };

  const handleAction = (action: () => void) => {
    action();
    setMobileOpen(false);
  };

  const isActive = (path: string) => currentPath.startsWith(path);

  // 컨텐츠 숨김/표시 여부 헬퍼 클래스
  const textVisibilityClass = sidebarCollapsed ? 'md:hidden' : 'md:block';

  const sidebarContent = (
    <aside
      id="sleek-sidebar"
      className={`w-64 ${sidebarCollapsed ? 'md:w-16' : 'md:w-64'} h-full flex flex-col justify-between select-none shrink-0 transition-all duration-200 z-30 overflow-hidden ${
        isDark
          ? 'bg-[#1e293b] border-r border-slate-700 text-slate-200'
          : 'bg-white border-r border-slate-200 text-slate-700 shadow-sm'
      }`}
    >
      {/* Top Brand Header (Fixed) */}
      <div className={`h-16 px-4 border-b shrink-0 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 shrink-0">
              A
            </div>
            <div>
              <h1 className={`text-sm font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                AOI-PCBA
              </h1>
              <span className="text-[10px] font-semibold text-blue-500 whitespace-nowrap">Intelligence System</span>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-1 shrink-0">
          {/* Sidebar Toggle Button (Desktop) */}
          <button
            onClick={toggleSidebar}
            className={`hidden md:flex items-center justify-center p-1.5 rounded-md transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title="Toggle Sidebar"
          >
            {sidebarCollapsed ? <PanelLeft className="w-5 h-5 text-blue-500" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
          
          {/* Mobile Close Button */}
          <button
            className="md:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent py-4 px-2.5 space-y-6">
        
        {/* Section: Core Modules */}
        <div>
          <h3 className={`text-[10px] font-bold uppercase tracking-wider mb-2 px-1.5 ${textVisibilityClass} ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Core Modules
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleNav('/inspection')}
                className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg transition-all ${
                  isActive('/inspection')
                    ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-bold'
                    : 'hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <Scan className="w-4 h-4 shrink-0" />
                <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>3D 검사 캔버스</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('/analytics/spc')}
                className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg transition-all ${
                  isActive('/analytics/spc')
                    ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-bold'
                    : 'hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <BarChart2 className="w-4 h-4 shrink-0" />
                <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>SPC 품질 관리도</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('/recipe')}
                className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg transition-all ${
                  isActive('/recipe')
                    ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-bold'
                    : 'hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <Sliders className="w-4 h-4 shrink-0" />
                <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>검사 레시피 편집기</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('/analytics/fleet')}
                className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg transition-all ${
                  isActive('/analytics/fleet')
                    ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-bold'
                    : 'hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <Radio className="w-4 h-4 shrink-0" />
                <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>Central Fleet Control</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Section: Intelligence (Modals) */}
        <div>
          <h3 className={`text-[10px] font-bold uppercase tracking-wider mb-2 px-1.5 ${textVisibilityClass} ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Intelligence
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleAction(toggleAiPanel)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all ${
                  isAiPanelOpen
                    ? 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 font-bold'
                    : 'hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>AI Assistant</span>
                </div>
                {isAiPanelOpen && (
                  <div className={`w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse ${textVisibilityClass}`} />
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleAction(() => openModal('auto-teaching'))}
                className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg transition-all hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400`}
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>Auto-Teaching (CAD)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleAction(() => openModal('smartphone-camera'))}
                className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg transition-all hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400`}
              >
                <Smartphone className="w-4 h-4 shrink-0 text-cyan-500" />
                <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>Smartphone AOI</span>
              </button>
            </li>
             <li>
              <button
                onClick={() => handleAction(() => openModal('defect-learning'))}
                className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg transition-all hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400`}
              >
                <Database className="w-4 h-4 shrink-0 text-fuchsia-500" />
                <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>Defect Learning DB</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleAction(() => openModal('closed-loop'))}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400`}
              >
                <div className="flex items-center space-x-3">
                  <Flame className="w-4 h-4 shrink-0 text-orange-500" />
                  <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>Closed-Loop SMT</span>
                </div>
              </button>
            </li>
          </ul>
        </div>

        {/* Section: Data & Reports (Modals) */}
        <div>
          <h3 className={`text-[10px] font-bold uppercase tracking-wider mb-2 px-1.5 ${textVisibilityClass} ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Data & Reports
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleAction(() => openModal('gerber-bom'))}
                className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg transition-all hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>CAD / BOM Import</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleAction(() => openModal('report-8d'))}
                className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg transition-all hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400`}
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>8D Quality Report</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleAction(() => openModal('quality-certificate'))}
                className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg transition-all hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400`}
              >
                <FileText className="w-4 h-4 shrink-0 text-emerald-500" />
                <span className={`text-xs whitespace-nowrap ${textVisibilityClass}`}>공정 검사 성적서</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Status Section (Fixed) */}
      <div className={`p-4 border-t shrink-0 ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'}`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div className={`overflow-hidden ${textVisibilityClass}`}>
            <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeLine.name}</h4>
            <p className="text-[10px] text-slate-500 truncate">OEE: {((activeLine.oee || 0.85) * 100).toFixed(1)}% | {activeLine.operatorId || 'OP-209'}</p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar (Always visible md and up) */}
      <div className="hidden md:block h-full transition-all duration-200">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30 transition-opacity backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
