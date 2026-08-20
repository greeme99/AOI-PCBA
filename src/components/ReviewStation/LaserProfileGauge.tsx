import React from 'react';
import {
  Activity,
  Layers,
  CheckCircle,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { InspectionDefect, ThemeMode, IPCClass } from '../../types/aoi';

interface LaserProfileGaugeProps {
  defect: InspectionDefect | null;
  ipcClass: IPCClass;
  themeMode?: ThemeMode;
}

export const LaserProfileGauge: React.FC<LaserProfileGaugeProps> = ({
  defect,
  ipcClass,
  themeMode = 'dark',
}) => {
  const isDark = themeMode === 'dark';

  if (!defect) {
    return (
      <div
        className={`p-4 rounded-xl border text-center text-xs flex flex-col items-center justify-center h-44 ${
          isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}
      >
        <Compass className="w-6 h-6 mb-2 opacity-50 text-blue-500" />
        <span>Select a defect or component to view 3D Laser Solder Fillet Cross-Section</span>
      </div>
    );
  }

  // Generate laser profile curve points based on defect type & measured height
  const measuredH = defect.measuredSolderHeight || 120;
  const isTombstone = defect.type === 'TOMBSTONE';
  const isBridge = defect.type === 'SOLDER_BRIDGE';
  const isInsufficient = defect.type === 'INSUFFICIENT_SOLDER';

  // Profile curve coordinates (width 280, height 100)
  // X: 20 -> 260
  const points = [];
  const targetH = 110; // Nominal 110 um
  const baselineY = 80;

  for (let x = 20; x <= 260; x += 6) {
    let yVal = 0;
    if (isTombstone) {
      // One side high, other side zero
      const t = (x - 20) / 240;
      yVal = Math.sin(t * Math.PI * 0.5) * (measuredH * 0.45);
    } else if (isBridge) {
      // Bulge across whole span
      const t = (x - 20) / 240;
      yVal = Math.sin(t * Math.PI) * 48 + 20;
    } else if (isInsufficient) {
      // Flat low concave
      const t = (x - 20) / 240;
      yVal = Math.pow(Math.sin(t * Math.PI), 2) * 14;
    } else {
      // Standard concave fillet curve
      const t = (x - 20) / 240;
      yVal = Math.pow(Math.sin(t * Math.PI), 1.8) * (measuredH * 0.38);
    }
    points.push(`${x},${baselineY - yVal}`);
  }

  const pathD = `M 20,${baselineY} L ${points.join(' L ')} L 260,${baselineY} Z`;
  const lineD = `M 20,${baselineY} L ${points.join(' L ')}`;

  // IPC Standard min requirement (e.g. 50 um min fillet height for Class 3)
  const minRequiredHeight = ipcClass.includes('Class 3') ? 65 : 45;
  const minFilletY = baselineY - minRequiredHeight * 0.38;

  const wettingAngle = defect.type === 'COLD_SOLDER' ? 98 : isTombstone ? 74 : 32.5;
  const isWettingPass = wettingAngle <= 90;

  return (
    <div
      className={`p-3.5 rounded-xl border space-y-3 transition-colors ${
        isDark
          ? 'bg-slate-900/80 border-slate-700/80 text-slate-200'
          : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
      }`}
    >
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs font-bold">
          <Activity className="w-4 h-4 text-blue-500" />
          <span>3D Laser Triangulation Cross-Section Profiler</span>
        </div>
        <span
          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
            isDark ? 'bg-slate-950 border-slate-800 text-blue-400' : 'bg-slate-100 border-slate-200 text-blue-700'
          }`}
        >
          {defect.refDes} - {defect.type}
        </span>
      </div>

      {/* SVG Solder Fillet Cross-Section Diagram */}
      <div
        className={`relative p-2 rounded-lg border overflow-hidden ${
          isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <svg viewBox="0 0 280 95" className="w-full h-24 select-none">
          {/* Grid lines */}
          <line x1="20" y1="20" x2="260" y2="20" stroke={isDark ? '#334155' : '#cbd5e1'} strokeDasharray="2 2" strokeWidth="0.8" />
          <line x1="20" y1="50" x2="260" y2="50" stroke={isDark ? '#334155' : '#cbd5e1'} strokeDasharray="2 2" strokeWidth="0.8" />
          <line x1="20" y1="80" x2="260" y2="80" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="1.2" />

          {/* IPC Min Fillet Limit (Dashed Red Line) */}
          <line
            x1="20"
            y1={minFilletY}
            x2="260"
            y2={minFilletY}
            stroke="#ef4444"
            strokeDasharray="4 3"
            strokeWidth="1.2"
          />
          <text x="262" y={minFilletY + 3} fill="#ef4444" fontSize="7" fontFamily="monospace">
            IPC Min ({minRequiredHeight}µm)
          </text>

          {/* Solder Paste Area Fill & Shading */}
          <defs>
            <linearGradient id="laserFilletGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <path d={pathD} fill="url(#laserFilletGrad)" />
          <path d={lineD} fill="none" stroke="#60a5fa" strokeWidth="2" />

          {/* Pad Base markers */}
          <rect x="18" y="80" width="60" height="4" fill="#d97706" rx="1" />
          <rect x="202" y="80" width="60" height="4" fill="#d97706" rx="1" />
          <text x="24" y="90" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="6" fontFamily="monospace">
            PAD A
          </text>
          <text x="208" y="90" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="6" fontFamily="monospace">
            PAD B
          </text>

          {/* Dynamic Apex Height Marker */}
          <circle cx="140" cy={points[Math.floor(points.length / 2)]?.split(',')[1] || 45} r="3" fill="#f59e0b" />
        </svg>

        <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-slate-500">
          <span>0 µm (Substrate)</span>
          <span className="text-amber-500 font-bold">Peak: {measuredH} µm</span>
          <span>Target: {targetH} µm</span>
        </div>
      </div>

      {/* Quantitative Laser Measurements Grid */}
      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div
          className={`p-2 rounded-lg border flex flex-col justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Fillet Height:</span>
          <span className="font-mono font-bold text-sm text-blue-500">{measuredH} µm</span>
          <span className="text-[10px] text-slate-500">Nominal: {targetH} µm</span>
        </div>

        <div
          className={`p-2 rounded-lg border flex flex-col justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Wetting Angle (θ):</span>
          <span className={`font-mono font-bold text-sm ${isWettingPass ? 'text-emerald-500' : 'text-rose-500'}`}>
            {wettingAngle}°
          </span>
          <span className="text-[10px] text-slate-500">Limit: ≤ 90.0°</span>
        </div>

        <div
          className={`p-2 rounded-lg border flex flex-col justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Coplanarity:</span>
          <span className="font-mono font-bold text-sm text-emerald-500">12.4 µm</span>
          <span className="text-[10px] text-slate-500">Limit: &lt; 50 µm</span>
        </div>
      </div>

      {/* IPC Standard Fillet Clause Banner */}
      <div
        className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
          defect.reviewStatus === 'CONFIRMED_DEFECT' || defect.severity === 'CRITICAL'
            ? isDark
              ? 'bg-rose-950/30 border-rose-800/40 text-rose-300'
              : 'bg-rose-50 border-rose-200 text-rose-700'
            : isDark
            ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}
      >
        <div className="flex items-center space-x-1.5">
          {defect.reviewStatus === 'CONFIRMED_DEFECT' ? (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          )}
          <span className="font-medium text-[11px] truncate">
            {defect.ipcClause || 'IPC-A-610 8.3 SMT Solder Fillet Minimum Dimensional Requirements'}
          </span>
        </div>
      </div>
    </div>
  );
};
