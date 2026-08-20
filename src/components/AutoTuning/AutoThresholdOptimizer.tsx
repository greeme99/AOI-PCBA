import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Cpu,
  Layers,
  HelpCircle,
  BarChart3,
  Check,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  ComposedChart,
  Area,
} from 'recharts';
import { ThemeMode, PCBBoard, InspectionRecipe } from '../../types/aoi';
import { INITIAL_AUTOTUNE_RUNS } from '../../mock/autotunePdmData';

interface AutoThresholdOptimizerProps {
  currentBoard: PCBBoard;
  activeRecipe: InspectionRecipe;
  onUpdateRecipe: (updated: InspectionRecipe) => void;
  themeMode?: ThemeMode;
}

export const AutoThresholdOptimizer: React.FC<AutoThresholdOptimizerProps> = ({
  currentBoard,
  activeRecipe,
  onUpdateRecipe,
  themeMode = 'dark',
}) => {
  const isDark = themeMode === 'dark';
  const tuneData = INITIAL_AUTOTUNE_RUNS[currentBoard.model] || INITIAL_AUTOTUNE_RUNS['ECU-2026-AUTO'];

  const [selectedRocIndex, setSelectedRocIndex] = useState<number>(5);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  const currentPoint = tuneData.rocPoints.find((p) => p.thresholdIndex === selectedRocIndex) || tuneData.rocPoints[4];

  // Run AI Simulation
  const handleRunOptimizer = () => {
    setIsSimulating(true);
    setSimulationProgress(0);

    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          setSelectedRocIndex(5);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  // Apply to Active Recipe
  const handleApplyToRecipe = () => {
    const updated: InspectionRecipe = {
      ...activeRecipe,
      version: `${activeRecipe.version.split('-')[0]}.1-AI-Optimized`,
      algorithms: {
        ...activeRecipe.algorithms,
        solderHeightMinUm: 62,
        solderBridgeThreshold: 24,
        placementToleranceMm: 0.055,
        tombstoneMaxAngleDeg: 4.5,
      },
    };
    onUpdateRecipe(updated);
    setAppliedToast(`AI 최적화 임계치 파라미터가 활성 레시피 [${updated.version}]에 성공적으로 반영되었습니다!`);
    setTimeout(() => setAppliedToast(null), 5000);
  };

  return (
    <div
      id="auto-threshold-optimizer-view"
      className={`h-full w-full flex flex-col overflow-y-auto transition-colors p-6 space-y-6 ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Header Banner */}
      <div
        className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 shrink-0 transition-colors ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold">3.3 AI 검사 파라미터 자동 튜닝 (Auto-Threshold Optimizer)</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ROC-AUC Machine Learning
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              과거 {tuneData.sampleCount.toLocaleString()}장 PCBA 검사 실측 빅데이터를 기반으로 가성 불량률을 최소화하고 직통율(FPY)을 극대화하는 파레토 임계치를 자동 도출합니다.
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleRunOptimizer}
            disabled={isSimulating}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
              isSimulating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? `최적화 연산 중 (${simulationProgress}%)` : '1-Click 파라미터 재최적화'}</span>
          </button>

          <button
            type="button"
            onClick={handleApplyToRecipe}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>최적화 파라미터 레시피 즉시 적용</span>
          </button>
        </div>
      </div>

      {/* Applied Toast */}
      {appliedToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{appliedToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setAppliedToast(null)}
            className="text-emerald-400 hover:text-white text-xs cursor-pointer font-bold px-2"
          >
            닫기
          </button>
        </div>
      )}

      {/* Key Metric Comparison Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* FPY Improvement */}
        <div
          className={`p-4 rounded-xl border relative overflow-hidden ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="text-xs font-semibold mb-1 flex items-center justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>시뮬레이션 FPY (직통율)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{currentPoint.fpySimulated}%</span>
            <span className="text-xs font-mono text-emerald-500 font-semibold">(+{((currentPoint.fpySimulated - tuneData.baselineFPY)).toFixed(1)}%)</span>
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            기준 FPY: <strong className="font-mono">{tuneData.baselineFPY}%</strong>
          </div>
        </div>

        {/* False Call Rate Reduction */}
        <div
          className={`p-4 rounded-xl border relative overflow-hidden ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="text-xs font-semibold mb-1 flex items-center justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>가성 불량률 (False Alarm)</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">{currentPoint.falsePositiveRate}%</span>
            <span className="text-xs font-mono text-cyan-500 font-semibold">(-{((tuneData.baselineFalseCallRate - currentPoint.falsePositiveRate)).toFixed(1)}%)</span>
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            기준 가성률: <strong className="font-mono">{tuneData.baselineFalseCallRate}%</strong>
          </div>
        </div>

        {/* Escape Risk PPM */}
        <div
          className={`p-4 rounded-xl border relative overflow-hidden ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="text-xs font-semibold mb-1 flex items-center justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>미검출 유출 위험도 (Escape Risk)</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">{currentPoint.escapeRiskPpm} PPM</div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            IPC-A-610 Class 3 허용치: &lt;= 5.0 PPM
          </div>
        </div>

        {/* ROC AUC Score */}
        <div
          className={`p-4 rounded-xl border relative overflow-hidden ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="text-xs font-semibold mb-1 flex items-center justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>ROC-AUC 최적 적합도</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{tuneData.aucScore}</div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            분류 신뢰도: <strong>Very High (우수)</strong>
          </div>
        </div>
      </div>

      {/* Main ML Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Interactive ROC Curve */}
        <div
          className={`p-5 rounded-2xl border flex flex-col ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm flex items-center">
                <Activity className="w-4 h-4 mr-1.5 text-amber-400" />
                <span>ROC 곡선 & 최적 동작점 (Pareto Frontier)</span>
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                가성 불량(False Alarm)과 진성 검출률(True Positive) 간의 최적 타협점을 탐색합니다.
              </p>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold">
              현재 선택: Point #{selectedRocIndex}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={tuneData.rocPoints} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <XAxis
                  dataKey="falsePositiveRate"
                  name="가성 불량률(%)"
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  fontSize={10}
                  unit="%"
                />
                <YAxis
                  dataKey="truePositiveRate"
                  name="진성 검출률(%)"
                  domain={[90, 100]}
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  fontSize={10}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    fontSize: '11px',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="truePositiveRate" fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="truePositiveRate" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
                <ReferenceDot
                  x={currentPoint.falsePositiveRate}
                  y={currentPoint.truePositiveRate}
                  r={8}
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Threshold Index Step Slider */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-400 shrink-0">임계치 단계:</span>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={selectedRocIndex}
              onChange={(e) => setSelectedRocIndex(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
              Lv.{selectedRocIndex}
            </span>
          </div>
        </div>

        {/* Chart 2: FPY vs Escape Risk PPM Curve */}
        <div
          className={`p-5 rounded-2xl border flex flex-col ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-1.5 text-emerald-400" />
                <span>FPY 직통율 vs 미검출 유출(PPM) 트레이드오프</span>
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                공정 임계치 완화 시 직통율 상승치와 자동차 전장 규격(IPC Class 3) 허용 리스크 관계
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tuneData.rocPoints} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <XAxis dataKey="thresholdIndex" name="단계" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={10} />
                <YAxis yAxisId="left" domain={[90, 100]} unit="%" stroke="#10b981" fontSize={10} />
                <YAxis yAxisId="right" orientation="right" unit=" PPM" stroke="#ef4444" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    fontSize: '11px',
                    borderRadius: '8px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line yAxisId="left" type="monotone" dataKey="fpySimulated" name="시뮬레이션 FPY (%)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="escapeRiskPpm" name="유출 위험도 (PPM)" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">골든 추천 최적점:</span>
            <span className="text-emerald-400 font-bold font-mono">
              Level 5 (FPY: 99.4%, 가성비: 0.4%, PPM: 2.0)
            </span>
          </div>
        </div>
      </div>

      {/* Parameter Recommendation Table */}
      <div
        className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm">알고리즘 파라미터 세부 최적화 내역 (Current vs Recommended)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            IPC-A-610 Class 3 규격 기준 완전 정합
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase ${isDark ? 'border-slate-800 text-slate-400 bg-slate-900/60' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                <th className="py-3 px-4">검사 파라미터 항목</th>
                <th className="py-3 px-4">현재 레시피 값</th>
                <th className="py-3 px-4">AI 추천 최적값</th>
                <th className="py-3 px-4">FPY 기여도</th>
                <th className="py-3 px-4">가성 불량 감소</th>
                <th className="py-3 px-4">신뢰도</th>
                <th className="py-3 px-4">최적화 통계적 근거</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tuneData.parameters.map((param) => (
                <tr key={param.paramKey} className={`hover:bg-slate-800/40 transition-colors ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  <td className="py-3.5 px-4 font-semibold">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>{param.paramName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-400">
                    {param.currentValue} {param.unit}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    <div className="flex items-center space-x-1.5">
                      <span>{param.recommendedValue} {param.unit}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        OPTIMAL
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    +{param.fpyGainPct}%
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                    -{param.falseCallReductionPct}%
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">
                    {param.confidenceScore}%
                  </td>
                  <td className={`py-3.5 px-4 text-[11px] leading-relaxed max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {param.reasoning}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
