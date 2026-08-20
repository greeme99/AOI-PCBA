import React, { useState } from 'react';
import {
  X,
  Cpu,
  Layers,
  Sparkles,
  AlertTriangle,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import { PCBComponent, InspectionDefect, IPCClass, ThemeMode } from '../../types/aoi';

interface ComponentInspectorModalProps {
  component: PCBComponent | null;
  defect: InspectionDefect | null;
  ipcClass: IPCClass;
  onClose: () => void;
  onOpenAIAnalysis: (defect: InspectionDefect) => void;
  themeMode?: ThemeMode;
}

export const ComponentInspectorModal: React.FC<ComponentInspectorModalProps> = ({
  component,
  defect,
  ipcClass,
  onClose,
  onOpenAIAnalysis,
  themeMode = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'stages'>('profile');

  if (!component) return null;
  const isDark = themeMode === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div
        className={`border rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col transition-colors ${
          isDark
            ? 'bg-[#1e293b] border-slate-700 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg border border-blue-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className="text-blue-500 font-mono">{component.refDes}</span>
                <span>-</span>
                <span>Component Micro-Inspector</span>
              </h2>
              <p className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Package: {component.packageType} | Value: {component.nominalValue}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle Header */}
        <div className={`px-4 pt-2 border-b flex space-x-4 text-xs font-semibold ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-500 font-bold'
                : isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Laser Profile & IPC Limits</span>
          </button>
          <button
            onClick={() => setActiveTab('stages')}
            className={`pb-2 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'stages'
                ? 'border-blue-500 text-blue-500 font-bold'
                : isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>SMT 3-Stage Lifecycle (SPI → Pre → Post)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh] text-xs">
          {activeTab === 'profile' ? (
            <>
              {/* Spatial Coordinates & Dimensions */}
              <div
                className={`grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg border text-xs font-mono ${
                  isDark
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className={isDark ? 'text-slate-500 block text-[10px]' : 'text-slate-400 block text-[10px]'}>Center X / Y:</span>
                  <span className="font-semibold">{component.x.toFixed(2)} mm, {component.y.toFixed(2)} mm</span>
                </div>
                <div>
                  <span className={isDark ? 'text-slate-500 block text-[10px]' : 'text-slate-400 block text-[10px]'}>Package Size:</span>
                  <span className="font-semibold">{component.width} x {component.height} mm</span>
                </div>
                <div>
                  <span className={isDark ? 'text-slate-500 block text-[10px]' : 'text-slate-400 block text-[10px]'}>Rotation:</span>
                  <span className="font-semibold">{component.rotation}°</span>
                </div>
                <div>
                  <span className={isDark ? 'text-slate-500 block text-[10px]' : 'text-slate-400 block text-[10px]'}>Pins:</span>
                  <span className="font-semibold">{component.pinCount || '2'} Leads</span>
                </div>
              </div>

              {/* Solder Joints & Lead Coplanarity */}
              <div
                className={`p-4 rounded-lg border space-y-3 ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Layers className="w-4 h-4 text-blue-500" />
                    <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>3D Solder Fillet & Lead Measurements</span>
                  </div>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Laser Phase Profiler</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={isDark ? 'text-slate-500 block text-[10px]' : 'text-slate-400 block text-[10px]'}>Fillet Height:</span>
                    <span className="text-emerald-500 font-bold">{defect?.measuredSolderHeight || 135} um</span>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Nominal: 130um</span>
                  </div>
                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={isDark ? 'text-slate-500 block text-[10px]' : 'text-slate-400 block text-[10px]'}>Wetting Angle:</span>
                    <span className="text-blue-500 font-bold">{defect ? '104°' : '42°'}</span>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Standard: &lt; 90°</span>
                  </div>
                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={isDark ? 'text-slate-500 block text-[10px]' : 'text-slate-400 block text-[10px]'}>Coplanarity:</span>
                    <span className="text-purple-500 font-bold">{defect ? '95 um' : '18 um'}</span>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Limit: &lt; 50um</span>
                  </div>
                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={isDark ? 'text-slate-500 block text-[10px]' : 'text-slate-400 block text-[10px]'}>Solder Volume:</span>
                    <span className="text-amber-500 font-bold">{defect?.type === 'SOLDER_BRIDGE' ? '210%' : '105%'}</span>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Target: 100±25%</span>
                  </div>
                </div>
              </div>

              {/* Associated Inspection Defect (if any) */}
              {defect ? (
                <div
                  className={`p-4 rounded-lg border space-y-2.5 ${
                    isDark
                      ? 'bg-rose-950/20 border-rose-800/40'
                      : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-bold text-rose-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Optical Defect Flagged: {defect.title}</span>
                    </div>
                    <span className="bg-rose-500/20 text-rose-600 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-500/30 uppercase">
                      {defect.severity}
                    </span>
                  </div>

                  <p className={`leading-relaxed text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {defect.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Standard: {ipcClass.split(' (')[0]}
                    </span>
                    <button
                      id="component-ai-rca-btn"
                      onClick={() => {
                        onClose();
                        onOpenAIAnalysis(defect);
                      }}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-md text-xs font-semibold shadow transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Execute Gemini RCA</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`p-4 rounded-lg border flex items-center space-x-3 ${
                    isDark ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <div className="font-bold text-xs">IPC-A-610 Compliant Pass</div>
                    <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Component joints, solder meniscus, and polarity alignment strictly meet Class 3 criteria.
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Multi-Stage SMT Inspection Timeline */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-400">SMT Sequential Stage Root-Cause Trace</span>
                <span className="text-[10px] font-mono text-slate-400">IPC-CFX Stream</span>
              </div>

              <div className="space-y-3">
                {/* Stage 1: SPI */}
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px]">STAGE 1</span>
                      <span>SPI (Solder Paste Inspection)</span>
                    </div>
                    <span className="text-emerald-400 text-[11px] flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Volume: 104% (PASS)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 mt-2">
                    <div>Paste Height: 138 um</div>
                    <div>Area Coverage: 98.6%</div>
                    <div>Printing Shift: +0.01 mm</div>
                  </div>
                </div>

                {/* Stage 2: Pre-Reflow */}
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px]">STAGE 2</span>
                      <span>Pre-Reflow AOI (Mounter Pick & Place)</span>
                    </div>
                    <span className={`text-[11px] flex items-center space-x-1 ${defect?.type === 'TOMBSTONE' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {defect?.type === 'TOMBSTONE' ? (
                        <>
                          <AlertOctagon className="w-3.5 h-3.5" />
                          <span>Shift Detected: +0.09mm</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Alignment: PASS</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 mt-2">
                    <div>Placement Theta: {defect ? '+1.4°' : '+0.1°'}</div>
                    <div>Nozzle Vacuum: 84 kPa</div>
                    <div>Feeder ID: F-04-A</div>
                  </div>
                </div>

                {/* Stage 3: Post-Reflow */}
                <div className={`p-3 rounded-xl border ${
                  defect
                    ? isDark ? 'bg-rose-950/20 border-rose-800/40' : 'bg-rose-50 border-rose-200'
                    : isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">STAGE 3</span>
                      <span>Post-Reflow 3D AOI (Soldering Final)</span>
                    </div>
                    <span className={`text-[11px] font-bold ${defect ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {defect ? `${defect.type} (${defect.severity})` : 'Class 3 PASS'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 mt-2">
                    <div>Wetting Angle: {defect ? '104°' : '38°'}</div>
                    <div>Coplanarity: {defect ? '95 um' : '12 um'}</div>
                    <div>Oven Zone: Zone 8 Peak</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

