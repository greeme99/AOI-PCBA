import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  Menu,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  Sliders,
  Maximize,
  Minimize,
} from 'lucide-react';
import { IPCClass } from '../types/aoi';
import { useUIStore } from '../stores/useUIStore';
import { useInspectionStore } from '../stores/useInspectionStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchParams, setSearchParams] = useSearchParams();

  const themeMode = useUIStore((s) => s.themeMode);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);
  const isAiPanelOpen = useUIStore((s) => s.isAiPanelOpen);
  const toggleAiPanel = useUIStore((s) => s.toggleAiPanel);

  const lines = useInspectionStore((s) => s.smtLines);
  const activeLine = useInspectionStore((s) => s.getActiveLine());
  const selectLine = useInspectionStore((s) => s.selectLine);
  
  const currentBoard = useInspectionStore((s) => s.getCurrentBoard());
  const selectModel = useInspectionStore((s) => s.selectModel);

  const ipcClass = useInspectionStore((s) => s.ipcClass);
  const setIpcClass = useInspectionStore((s) => s.setIpcClass);

  const isDark = themeMode === 'dark';
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error attempting to toggle fullscreen:', err);
    }
  };

  const getViewTitle = () => {
    if (currentPath.includes('inspection')) return '3D Optical Inspection Studio';
    if (currentPath.includes('spc')) return 'Statistical Process Control & SPC';
    if (currentPath.includes('recipe')) return 'Recipe Tuning & 3D Optics Calibration';
    if (currentPath.includes('fleet')) return '3.1 SMT Fleet Command';
    if (currentPath.includes('anomaly')) return '3.2 Golden Master Diff';
    if (currentPath.includes('autotune')) return '3.3 Auto-Threshold Optimizer';
    if (currentPath.includes('pdm')) return '3.4 Predictive Maintenance';
    if (currentPath.includes('ensemble')) return '3.6 Multi-Angle Ensemble';
    return 'AOI-PCBA Intelligence';
  };

  return (
    <header
      id="sleek-header"
      className={`h-14 border-b flex items-center justify-between px-3 sm:px-5 select-none shrink-0 transition-colors duration-200 ${
        isDark
          ? 'bg-[#1e293b] border-slate-700 text-slate-200'
          : 'bg-white border-slate-200 text-slate-700 shadow-xs'
      }`}
    >
      {/* Left: Mobile Hamburger + Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs shrink-0 overflow-hidden">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className={`lg:hidden p-1.5 rounded-lg border transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title="전체 메뉴 열기"
        >
          <Menu className="w-4 h-4" />
        </button>

        <span className={`font-bold px-2 py-0.5 rounded text-[11px] shrink-0 ${isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          AOI-PCBA
        </span>
        <ChevronRight className={`w-3.5 h-3.5 shrink-0 hidden sm:inline ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
        <span className={`font-semibold text-xs truncate max-w-[120px] sm:max-w-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {getViewTitle()}
        </span>
      </div>

      {/* Right Controls Container */}
      <div className="flex items-center space-x-2.5 relative ml-auto">
        {/* Mobile Settings Toggle */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`lg:hidden flex items-center p-1.5 rounded-lg border transition-all ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Desktop inline controls & Mobile absolute dropdown */}
        <div
          className={`${
            isSettingsOpen ? 'flex' : 'hidden lg:flex'
          } flex-col lg:flex-row items-end lg:items-center space-y-3 lg:space-y-0 lg:space-x-2.5 absolute lg:relative top-12 lg:top-auto right-0 lg:right-auto p-3 lg:p-0 rounded-lg lg:rounded-none border lg:border-none shadow-xl lg:shadow-none z-50 ${
            isDark ? 'bg-slate-800 lg:bg-transparent border-slate-700' : 'bg-white lg:bg-transparent border-slate-200'
          }`}
        >
          {/* SMT Line Selector */}
          <div className="flex items-center space-x-1 text-xs">
            <span className={isDark ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>
              Line:
            </span>
            <select
              value={activeLine.id}
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('line', e.target.value);
                setSearchParams(newParams);
              }}
              className={`text-xs rounded-md px-2 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
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
          <div className="flex items-center space-x-1 text-xs">
            <span className={isDark ? 'text-slate-400 font-medium' : 'text-slate-500 font-medium'}>
              PCB:
            </span>
            <select
              value={currentBoard.model}
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('model', e.target.value);
                setSearchParams(newParams);
              }}
              className={`text-xs rounded-md px-2 py-1 font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                isDark
                  ? 'bg-slate-900 border border-slate-700 text-emerald-400'
                  : 'bg-slate-50 border border-slate-200 text-emerald-600'
              }`}
            >
              <option value="ECU-2026-AUTO">ECU-2026-AUTO</option>
              <option value="IOT-GATEWAY-V3">IOT-GATEWAY-V3</option>
              <option value="POWER-SUPPLY-MOD">POWER-SUPPLY-MOD</option>
            </select>
          </div>

          {/* IPC Standard Badge / Selector */}
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-md border text-xs ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <select
              value={ipcClass}
              onChange={(e) => setIpcClass(e.target.value as IPCClass)}
              className="bg-transparent text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="Class 3 (High Reliability / Automotive)">IPC Class 3</option>
              <option value="Class 2 (Dedicated Service)">IPC Class 2</option>
              <option value="Class 1 (General Electronic)">IPC Class 1</option>
            </select>
          </div>
        </div>

        {/* AI Copilot Button */}
        <button
          onClick={toggleAiPanel}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold shadow-xs transition-all ${
            isAiPanelOpen
              ? 'bg-violet-600 text-white shadow-violet-500/20'
              : isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-violet-400 border border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-violet-600 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI</span>
        </button>

        <div className={`h-4 w-[1px] hidden sm:block ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className={`hidden sm:flex items-center justify-center p-1.5 rounded-lg border shadow-xs transition-all ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
          title={isFullscreen ? 'Exit Full Screen (ESC)' : 'Enter Full Screen'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Theme Mode Toggle */}
        <div
          id="theme-mode-segmented-control"
          className={`hidden sm:flex items-center p-0.5 rounded-xl border shadow-xs transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-700'
              : 'bg-slate-100 border-slate-300'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (isDark) toggleTheme();
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isDark
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200 ring-1 ring-slate-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span className={!isDark ? 'text-slate-900' : ''}>라이트</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isDark) toggleTheme();
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-600 ring-1 ring-amber-400/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400 fill-blue-400' : 'text-slate-500'}`} />
            <span className={isDark ? 'text-slate-100' : ''}>다크</span>
          </button>
        </div>
      </div>
    </header>
  );
};