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
} from 'lucide-react';
import { SMTLineStatus, PCBBoard, ThemeMode } from '../../types/aoi';

interface LiveInspectionLineProps {
  activeLine: SMTLineStatus;
  currentBoard: PCBBoard;
  isScanning: boolean;
  scanProgress: number;
  onTriggerScan: () => void;
  onSelectBoard: (modelKey: string) => void;
  onOpenClosedLoopModal?: () => void;
  themeMode?: ThemeMode;
}

export const LiveInspectionLine: React.FC<LiveInspectionLineProps> = ({
  activeLine,
  currentBoard,
  isScanning,
  scanProgress,
  onTriggerScan,
  onOpenClosedLoopModal,
  themeMode = 'dark',
}) => {
  const [autoRun, setAutoRun] = useState(true);
  const isDark = themeMode === 'dark';

  // Auto-scan cycle simulation
  useEffect(() => {
    if (!autoRun) return;
    const interval = setInterval(() => {
      onTriggerScan();
    }, 9000);
    return () => clearInterval(interval);
  }, [autoRun, onTriggerScan]);

  return (
    <div
      id="live-inspection-stream"
      className={`border-b p-4 select-none transition-colors duration-200 ${
        isDark
          ? 'bg-[#1e293b]/40 border-slate-700'
          : 'bg-slate-50/70 border-slate-200'
      }`}
    >
      {/* Sleek 3-Card KPI Summary from Design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
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
          <div className="text-xl font-bold text-rose-500 font-mono">{currentBoard.defects.length}</div>
          <div className="text-[10px] text-rose-500/80 mt-0.5">Requires manual review</div>
        </div>

        {/* Scan Trigger Controls Box */}
        <div
          className={`p-3 rounded-xl border shadow-xs flex flex-col justify-between ${
            isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Conveyor Status
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <button
              id="toggle-auto-run-btn"
              onClick={() => setAutoRun(!autoRun)}
              className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                autoRun
                  ? isDark
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {autoRun ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoRun ? 'Auto' : 'Paused'}</span>
            </button>

            <button
              id="manual-scan-btn"
              onClick={onTriggerScan}
              disabled={isScanning}
              className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow transition-all disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Trigger'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SMT Production Line Station Flow Pipeline */}
      <div
        className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark
            ? 'bg-[#1e293b] border-slate-700'
            : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-blue-600 rounded text-white">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              SMT Line Pipeline:
            </span>{' '}
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Printer → SPI → Mounter → Reflow Oven →{' '}
              <strong className="text-blue-500 font-mono">3D AOI (Station 05)</strong>
            </span>
          </div>
        </div>

        {/* Real-time Conveyor Board Progress */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Active Lot:</span>
            <span className={`font-mono font-semibold px-2 py-0.5 rounded border text-[11px] ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-blue-400'
                : 'bg-slate-100 border-slate-200 text-blue-600'
            }`}>
              {currentBoard.lotNumber}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Board Status:</span>
            <span
              className={`flex items-center space-x-1 font-bold text-[11px] px-2 py-0.5 rounded border ${
                currentBoard.status === 'PASS'
                  ? isDark
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isDark
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {currentBoard.status === 'PASS' ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>PASS</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  <span>FAIL ({currentBoard.defects.length})</span>
                </>
              )}
            </span>
          </div>

          {/* Closed-Loop Quick Trigger */}
          {onOpenClosedLoopModal && (
            <button
              onClick={onOpenClosedLoopModal}
              className="flex items-center space-x-1 px-2.5 py-1 bg-blue-600/15 hover:bg-blue-600/25 text-blue-500 hover:text-blue-400 border border-blue-500/30 rounded-md font-bold text-[11px] transition-colors cursor-pointer"
              title="Open SMT Closed-Loop Feedback & Machine Offset Auto-Correction"
            >
              <Zap className="w-3 h-3 text-blue-500 animate-pulse" />
              <span>Closed-Loop M2M</span>
            </button>
          )}

          {/* Optical Scan Progress Bar */}
          {isScanning && (
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-blue-500 font-mono font-semibold">
                Scanning: {scanProgress}%
              </span>
              <div className={`w-24 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}>
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-75"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
