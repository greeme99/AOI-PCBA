import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  BarChart3,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import { SMTLineStatus, ThemeMode } from '../../types/aoi';
import { SPC_SAMPLE_SERIES, PARETO_DEFECT_DATA } from '../../mock/pcbData';

interface SPCDashboardProps {
  activeLine: SMTLineStatus;
  lines: SMTLineStatus[];
  onSelectLine: (lineId: string) => void;
  themeMode?: ThemeMode;
}

export const SPCDashboard: React.FC<SPCDashboardProps> = ({
  activeLine,
  lines,
  onSelectLine,
  themeMode = 'dark',
}) => {
  const [activeParameter, setActiveParameter] = useState<'shiftX' | 'solderHeight' | 'rotationTheta'>('shiftX');
  const isDark = themeMode === 'dark';

  // Compute Cp & Cpk
  const mean =
    SPC_SAMPLE_SERIES.reduce((acc, p) => acc + (p[activeParameter] as number), 0) / SPC_SAMPLE_SERIES.length;
  const variance =
    SPC_SAMPLE_SERIES.reduce((acc, p) => acc + Math.pow((p[activeParameter] as number) - mean, 2), 0) /
    (SPC_SAMPLE_SERIES.length - 1);
  const stdDev = Math.sqrt(variance);

  const usl = activeParameter === 'shiftX' ? 0.08 : activeParameter === 'rotationTheta' ? 4.0 : 160;
  const lsl = activeParameter === 'shiftX' ? -0.08 : activeParameter === 'rotationTheta' ? -4.0 : 60;

  const cp = (usl - lsl) / (6 * stdDev);
  const cpu = (usl - mean) / (3 * stdDev);
  const cpl = (mean - lsl) / (3 * stdDev);
  const cpk = Math.min(cpu, cpl);

  return (
    <div
      id="spc-analytics-dashboard"
      className={`h-full overflow-y-auto p-6 space-y-6 transition-colors duration-200 ${
        isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Top SMT Line Switcher Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border transition-colors ${
          isDark
            ? 'bg-[#1e293b] border-slate-700'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              SMT Statistical Process Control (SPC) & Yield Intelligence
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Real-time Six Sigma Cpk, Pareto Defect Modes, X-bar R Control Charts, and First Pass Yield (FPY)
          </p>
        </div>

        {/* Line Selector Buttons */}
        <div
          className={`flex items-center space-x-1.5 p-1 rounded-lg border ${
            isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {lines.map((line) => (
            <button
              type="button"
              key={line.id}
              onClick={() => onSelectLine(line.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeLine.id === line.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {line.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* FPY */}
        <div
          className={`p-4 rounded-xl border shadow-sm relative overflow-hidden ${
            isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-xs font-semibold mb-1 flex items-center justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>First Pass Yield (FPY)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-500">{activeLine.fpy}%</div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Target: &gt;= 99.0%</div>
          <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeLine.fpy}%` }} />
          </div>
        </div>

        {/* Cpk */}
        <div
          className={`p-4 rounded-xl border shadow-sm relative overflow-hidden ${
            isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-xs font-semibold mb-1 flex items-center justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Process Capability (Cpk)</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-500">{cpk.toFixed(2)}</div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {cpk >= 1.33 ? 'Capable Process (Six Sigma)' : 'Caution: Process Center Shift'}
          </div>
          <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <div
              className={`h-full rounded-full ${cpk >= 1.33 ? 'bg-blue-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min((cpk / 2.0) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Defect DPMO */}
        <div
          className={`p-4 rounded-xl border shadow-sm relative overflow-hidden ${
            isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-xs font-semibold mb-1 flex items-center justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>DPMO (Defects/Million)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-500">{activeLine.dpmO}</div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Total Inspected: {activeLine.totalInspected.toLocaleString()}
          </div>
        </div>

        {/* Tact Time */}
        <div
          className={`p-4 rounded-xl border shadow-sm relative overflow-hidden ${
            isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-xs font-semibold mb-1 flex items-center justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Average Tact Time</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-500">{activeLine.tactTime}s</div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Throughput: {activeLine.currentPph} PPH
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: X-bar Statistical Control Chart */}
        <div
          className={`p-5 rounded-xl border flex flex-col ${
            isDark
              ? 'bg-[#1e293b] border-slate-700'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-bold text-sm flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Activity className="w-4 h-4 mr-1.5 text-blue-500" />
                X-bar Control Chart (Western Electric Rules)
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Sequential SMT Component Placement Shift
              </p>
            </div>

            {/* Parameter Selector */}
            <div
              className={`flex flex-wrap p-0.5 rounded-lg border text-xs ${
                isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => setActiveParameter('shiftX')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeParameter === 'shiftX'
                    ? 'bg-blue-600 text-white font-semibold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                X-Shift (mm)
              </button>
              <button
                onClick={() => setActiveParameter('solderHeight')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeParameter === 'solderHeight'
                    ? 'bg-blue-600 text-white font-semibold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Solder (um)
              </button>
              <button
                onClick={() => setActiveParameter('rotationTheta')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeParameter === 'rotationTheta'
                    ? 'bg-blue-600 text-white font-semibold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Theta (deg)
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPC_SAMPLE_SERIES} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="timestamp" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontSize: '11px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

                <Line type="stepAfter" dataKey="ucl" name="UCL (+3σ)" stroke="#ef4444" strokeDasharray="4 4" dot={false} />
                <Line type="stepAfter" dataKey="lcl" name="LCL (-3σ)" stroke="#ef4444" strokeDasharray="4 4" dot={false} />
                <Line type="stepAfter" dataKey="mean" name="Center (CL)" stroke="#10b981" strokeDasharray="2 2" dot={false} />

                <Line
                  type="monotone"
                  dataKey={activeParameter}
                  name="Sample Value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#3b82f6' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Pareto Defect Mode Breakdown */}
        <div
          className={`p-5 rounded-xl border flex flex-col ${
            isDark
              ? 'bg-[#1e293b] border-slate-700'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-bold text-sm flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <BarChart3 className="w-4 h-4 mr-1.5 text-amber-500" />
                Defect Mode Pareto Distribution (80/20 Rule)
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Cumulative % and Occurrence Count by Defect Type
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={PARETO_DEFECT_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis
                  dataKey="defectType"
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  fontSize={9}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={40}
                />
                <YAxis yAxisId="left" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} />
                <YAxis yAxisId="right" orientation="right" unit="%" stroke="#f59e0b" domain={[0, 100]} fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontSize: '11px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="count" name="Defect Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="cumulative" name="Cumulative %" stroke="#f59e0b" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
