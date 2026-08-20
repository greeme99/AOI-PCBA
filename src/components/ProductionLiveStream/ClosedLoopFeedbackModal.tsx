import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  RefreshCw,
  Cpu,
  Flame,
  Layers,
  X,
  Radio,
  Sliders,
  Check,
} from 'lucide-react';
import { ThemeMode, SMTLineStatus, PCBBoard } from '../../types/aoi';

interface ClosedLoopFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLine: SMTLineStatus;
  currentBoard: PCBBoard;
  themeMode?: ThemeMode;
}

export const ClosedLoopFeedbackModal: React.FC<ClosedLoopFeedbackModalProps> = ({
  isOpen,
  onClose,
  activeLine,
  currentBoard,
  themeMode = 'dark',
}) => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);
  const isDark = themeMode === 'dark';

  if (!isOpen) return null;

  const handleTransmit = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setTransmitted(true);
      setTimeout(() => setTransmitted(false), 3500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#0f172a] border-slate-700 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                SMT Closed-Loop M2M Feedback & Auto-Correction Center
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                IPC-CFX-2591 & SECS/GEM Real-time Feedforward & Feedback Offset Control
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`text-[11px] font-mono px-2.5 py-1 rounded-full border font-semibold flex items-center space-x-1.5 ${
                isDark
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>CFX LIVE M2M CONNECTED</span>
            </span>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900 border-slate-200'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Target Line Info Card */}
          <div
            className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <div className="font-semibold text-blue-500">{activeLine.name}</div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Active Board: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{currentBoard.name}</strong> ({currentBoard.modelCode})
              </div>
            </div>

            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <div>FPY: <strong className="text-emerald-500">{activeLine.fpy}%</strong></div>
              <div className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</div>
              <div>Tact: <strong className="text-blue-500">{activeLine.tactTime}s</strong></div>
              <div className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</div>
              <div>Defects: <strong className="text-amber-500">{currentBoard.defects.length} items</strong></div>
            </div>
          </div>

          {/* 3 Machine Feedback Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Screen Solder Paste Printer */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Layers className="w-4 h-4 text-cyan-500" />
                  <h3 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    1. Screen Printer (SPI Closed-Loop)
                  </h3>
                </div>
                <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Auto-compensates stencil registration alignment based on 3D SPI volume & area variance.
                </p>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Offset Alignment (X/Y):</div>
                    <div className="text-cyan-400 font-bold">X: +0.012 mm / Y: -0.008 mm</div>
                  </div>

                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Squeegee Pressure:</div>
                    <div className="text-emerald-400 font-bold">+0.3 kgf/cm² (Nominal: 4.2 kgf)</div>
                  </div>

                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Stencil Wiper Cycle:</div>
                    <div className="text-amber-400 font-bold">Trigger Clean in 3 Boards (Wet/Vac/Dry)</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-emerald-500 font-semibold">
                <span className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Printer Ready
                </span>
                <span className="font-mono text-slate-500">DEK-Horizon-01</span>
              </div>
            </div>

            {/* 2. High-Speed Mounter / Pick & Place */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <h3 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    2. Pick & Place Mounter
                  </h3>
                </div>
                <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Real-time feeder slot X/Y/Theta micro-shift correction and nozzle vacuum health monitoring.
                </p>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Feeder #12 (C12 0402 Cap):</div>
                    <div className="text-amber-400 font-bold">Shift X: -0.018mm, θ: +0.22°</div>
                  </div>

                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Feeder #18 (U1 QFN IC):</div>
                    <div className="text-blue-400 font-bold">Nozzle #4 Vacuum: 94.2% (Normal)</div>
                  </div>

                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Feeder #24 (R8 0603 Res):</div>
                    <div className="text-emerald-400 font-bold">Pick Rate: 99.98% (Zero Offset)</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-emerald-500 font-semibold">
                <span className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Mounter Synced
                </span>
                <span className="font-mono text-slate-500">Panasonic-NPM-D3</span>
              </div>
            </div>

            {/* 3. Reflow Oven Thermal Profiler */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h3 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    3. Reflow Oven Zones
                  </h3>
                </div>
                <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Auto-adjusts convection heating zone temperatures to eliminate cold solder and tombstoning.
                </p>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Soak Zone 4 (Flux Activate):</div>
                    <div className="text-amber-400 font-bold">Set +2.5°C (Target: 178°C)</div>
                  </div>

                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Peak Liquidus Zone 7:</div>
                    <div className="text-cyan-400 font-bold">Set -1.5°C (Target: 243.5°C)</div>
                  </div>

                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Cooling Zone 9 Slope:</div>
                    <div className="text-emerald-400 font-bold">-3.2°C/sec (IPC-7530 Compliant)</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-emerald-500 font-semibold">
                <span className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Oven Connected
                </span>
                <span className="font-mono text-slate-500">Heller-1913-MK5</span>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {transmitted && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center space-x-2 text-emerald-400 text-xs font-semibold animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                CFX-2591 Message successfully broadcasted to SMT Line equipment! Upstream machines calibrated.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Standard: <strong>IPC-CFX-2591 / SEMI E5 (SECS-II) / SEMI E37 (HSMS)</strong>
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              Close
            </button>

            <button
              id="transmit-cfx-btn"
              onClick={handleTransmit}
              disabled={isTransmitting}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              {isTransmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Transmitting CFX Offsets...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Offsets to SMT Line</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
