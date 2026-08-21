import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Radio,
  ArrowRight,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useInspectionStore } from '../../stores/useInspectionStore';
import { useUIStore } from '../../stores/useUIStore';
import { useModalStore } from '../../stores/useModalStore';

export const LiveInspectionLine: React.FC = () => {
  const [autoRun, setAutoRun] = useState(true);
  const [isKpiExpanded, setIsKpiExpanded] = useState(false);
  
  const themeMode = useUIStore((s) => s.themeMode);
  const isDark = themeMode === 'dark';

  const activeLine = useInspectionStore((s) => s.getActiveLine());
  const currentBoard = useInspectionStore((s) => s.getCurrentBoard());
  const isScanning = useInspectionStore((s) => s.isScanning);
  const scanProgress = useInspectionStore((s) => s.scanProgress);
  const triggerScan = useInspectionStore((s) => s.triggerScan);

  const openModal = useModalStore((s) => s.open);

  // Auto-scan cycle simulation
  useEffect(() => {
    if (!autoRun) return;
    const interval = setInterval(() => {
      triggerScan();
    }, 9000);
    return () => clearInterval(interval);
  }, [autoRun, triggerScan]);

  return (
    <div
      id="live-inspection-stream"
      className={`border-b p-2 select-none transition-colors duration-200 shrink-0 ${
        isDark
          ? 'bg-[#1e293b]/40 border-slate-700'
          : 'bg-slate-50/70 border-slate-200'
      }`}
    >
      {/* Live Stream Conveyor Control Bar (Always visible) */}
      <div
        className={`flex items-center justify-between rounded-lg border px-3 sm:px-4 py-1.5 ${
          isDark
            ? 'bg-slate-900/50 border-slate-800'
            : 'bg-slate-100 border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Radio className={`w-4 h-4 ${isDark ? 'text-rose-400 animate-pulse' : 'text-rose-500 animate-pulse'}`} />
            <span className={`text-[10px] sm:text-xs font-bold font-mono tracking-widest ${isDark ? 'text-white' : 'text-slate-800'}`}>
              LIVE STREAM
            </span>
          </div>

          <div className={`h-4 w-[1px] ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />

          <button
            onClick={() => setAutoRun(!autoRun)}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-[10px] sm:text-xs font-bold transition-all ${
              autoRun
                ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                : isDark ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
            }`}
          >
            {autoRun ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            <span>{autoRun ? 'AUTO-SCAN PAUSE' : 'AUTO-SCAN START'}</span>
          </button>
          
          <div className={`hidden sm:block h-4 w-[1px] ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
          
          {/* KPI Toggle Button */}
          <button
            onClick={() => setIsKpiExpanded(!isKpiExpanded)}
            className={`hidden sm:flex items-center space-x-1 px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{isKpiExpanded ? 'Hide KPIs' : 'Show KPIs'}</span>
            {isKpiExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 justify-end">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800/50 border border-slate-700">
            {currentBoard.status === 'PASS' ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            ) : currentBoard.status === 'FAIL' ? (
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentBoard.status === 'PASS'
                  ? 'text-emerald-500'
                  : currentBoard.status === 'FAIL'
                  ? 'text-rose-500'
                  : 'text-amber-500'
              }`}
            >
              {currentBoard.status === 'PASS' ? 'BOARD PASS' : currentBoard.status === 'FAIL' ? 'DEFECT FOUND' : 'REVIEW PENDING'}
            </span>
          </div>

          {/* Trigger Scan Button (Manual) */}
          <button
            onClick={triggerScan}
            disabled={isScanning || autoRun}
            className={`relative flex items-center justify-center space-x-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg font-bold text-[10px] sm:text-xs transition-all overflow-hidden ${
              isScanning || autoRun
                ? isDark ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            <div
              className="absolute inset-0 bg-blue-400/20 transition-all duration-[45ms]"
              style={{ width: `${scanProgress}%`, display: isScanning ? 'block' : 'none' }}
            />
            <div className="relative z-10 flex items-center space-x-1 sm:space-x-1.5">
              <Zap className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isScanning ? 'animate-pulse text-blue-300' : ''}`} />
              <span>{isScanning ? 'SCANNING...' : 'MANUAL SCAN'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Sleek 3-Card KPI Summary from Design (Collapsible) */}
      <div 
        className={`grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 transition-all duration-300 origin-top overflow-hidden ${
          isKpiExpanded ? 'mt-3 opacity-100 max-h-40' : 'mt-0 opacity-0 max-h-0'
        }`}
      >
        {/* Avg. Yield Rate */}
        <div
          className={`p-3 rounded-xl border shadow-xs flex flex-col justify-between ${
            isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Avg. Yield Rate (FPY)
          </div>
          <div className={`text-xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeLine.fpy}%</div>
          <div className="text-[10px] text-emerald-500 font-medium mt-0.5 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>+0.2% vs Line Target</span>
          </div>
        </div>

        {/* Inspection Speed */}
        <div
          className={`p-3 rounded-xl border shadow-xs flex flex-col justify-between ${
            isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Inspection Speed
          </div>
          <div className={`text-xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {(activeLine.tactTime * 1000).toFixed(0)} ms
          </div>
          <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current Tact Cycle Time</div>
        </div>

        {/* Active Defects */}
        <div
          className={`p-3 rounded-xl border shadow-xs flex flex-col justify-between ${
            isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Active Defects
          </div>
          <div className={`text-xl font-bold font-mono ${currentBoard.defects.length > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {currentBoard.defects.length}
          </div>
          <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Requires manual review
          </div>
        </div>

        {/* M2M Feedback Status */}
        <div
          className={`hidden lg:flex p-3 rounded-xl border shadow-xs flex-col justify-between cursor-pointer transition-colors ${
            isDark
              ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
          onClick={() => openModal('closed-loop')}
        >
          <div className={`text-[10px] font-semibold uppercase tracking-wider flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>M2M Closed-Loop</span>
            <ArrowRight className="w-3 h-3" />
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`text-sm font-bold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>ACTIVE</span>
          </div>
          <div className={`text-[10px] mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Auto-tuning SPI & Pick-and-Place
          </div>
        </div>
      </div>
    </div>
  );
};
