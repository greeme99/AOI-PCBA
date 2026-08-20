import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Sun,
  Camera,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  SlidersHorizontal,
  Zap,
  Info,
  Maximize2,
} from 'lucide-react';
import {
  PCBBoard,
  ThemeMode,
  CameraAngle,
  EnsembleCalibrationState,
  MultiAngleLightingConfig,
  GoldenSampleBoardRecord,
} from '../../types/aoi';
import { INITIAL_ENSEMBLE_STATE } from '../../mock/certificateAndEnsembleData';

interface MultiAngleLightingEnsembleProps {
  currentBoard: PCBBoard;
  themeMode: ThemeMode;
}

export const MultiAngleLightingEnsemble: React.FC<MultiAngleLightingEnsembleProps> = ({
  currentBoard,
  themeMode,
}) => {
  const isDark = themeMode === 'dark';

  const [ensembleState, setEnsembleState] = useState<EnsembleCalibrationState>(INITIAL_ENSEMBLE_STATE);
  const [selectedAngle, setSelectedAngle] = useState<CameraAngle | 'ENSEMBLE_HDR'>('ENSEMBLE_HDR');
  const [activeTab, setActiveTab] = useState<'visual' | 'lighting' | 'samples'>('visual');
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationSuccess, setCalibrationSuccess] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Update lighting slider weights
  const handleLightingChange = (key: keyof MultiAngleLightingConfig, val: any) => {
    setEnsembleState((prev) => ({
      ...prev,
      lightingConfig: {
        ...prev.lightingConfig,
        [key]: val,
      },
    }));
  };

  // Trigger Automatic Multi-Angle Calibration Run
  const handleRunAutoCalibration = () => {
    setIsCalibrating(true);
    setCalibrationSuccess(false);

    setTimeout(() => {
      setIsCalibrating(false);
      setCalibrationSuccess(true);
      setEnsembleState((prev) => ({
        ...prev,
        confidenceCoverage: 99.94,
        glareArtifactReductionPct: 92.1,
        solderEdgeGradientGainPct: 48.5,
        lightingConfig: {
          ...prev.lightingConfig,
          coaxialWeight: 85,
          highRedWeight: 90,
          midGreenWeight: 78,
          lowBlueWeight: 95,
          obliqueQuadWeight: 70,
          antiGlareSuppressionPct: 92,
        },
      }));

      setTimeout(() => setCalibrationSuccess(false), 4000);
    }, 1500);
  };

  // Add current board snapshot as a new Golden sample
  const handleAddGoldenSample = () => {
    const newSample: GoldenSampleBoardRecord = {
      id: `GOLDEN-SMT-${String(ensembleState.samples.length + 1).padStart(3, '0')}`,
      sampleNumber: ensembleState.samples.length + 1,
      capturedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      snrDb: Number((48 + Math.random() * 2).toFixed(1)),
      surfaceReflectanceVariance: Number((0.03 + Math.random() * 0.015).toFixed(3)),
      coaxialLuma: Math.floor(180 + Math.random() * 10),
      ringLuma: Math.floor(210 + Math.random() * 10),
      status: 'ACTIVE_IN_ENSEMBLE',
    };

    setEnsembleState((prev) => ({
      ...prev,
      totalGoldenSamples: prev.totalGoldenSamples + 1,
      samples: [...prev.samples, newSample],
    }));
  };

  // Remove or toggle sample status
  const handleRemoveSample = (sampleId: string) => {
    setEnsembleState((prev) => ({
      ...prev,
      totalGoldenSamples: Math.max(1, prev.totalGoldenSamples - 1),
      samples: prev.samples.filter((s) => s.id !== sampleId),
    }));
  };

  const { lightingConfig } = ensembleState;

  return (
    <div
      id="multi-angle-ensemble-view"
      className={`h-full flex flex-col overflow-hidden select-none transition-colors duration-200 ${
        isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Top Banner & Control Bar */}
      <div
        className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 shrink-0 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold tracking-tight">
                멀티 앵글 / 조명 보정 골든 샘플 앙상블 (Multi-Angle & Lighting Ensemble)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                8-CHANNEL HDR FUSION
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              동축 백색광 + 3단 RGB 링 + 4방향 45° 사각 경사광 다채널 융합으로 난반사(Glare) 및 그림자 완전 제거
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            id="btn-run-auto-ensemble-calib"
            disabled={isCalibrating}
            onClick={handleRunAutoCalibration}
            className="flex items-center px-4 py-2 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-all shadow-md shadow-purple-500/20 cursor-pointer disabled:opacity-50"
          >
            {isCalibrating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                <span>앙상블 가중치 최적화 중...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                <span>1-Click 앙상블 자동 보정</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="btn-add-golden-sample"
            onClick={handleAddGoldenSample}
            className={`flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
            <span>골든 보드 등록 (+1)</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-0">
        {/* Left / Center Viewport: Interactive Multi-Angle Visualizer */}
        <div className={`lg:col-span-8 flex flex-col border-r overflow-hidden ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          {/* Viewport Sub-header: Angle Switchers */}
          <div
            className={`p-3 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100/70 border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-1.5 overflow-x-auto">
              <span className={`text-[11px] font-bold uppercase tracking-wider mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                시야각 (Angle Mode):
              </span>

              {[
                { key: 'ENSEMBLE_HDR', label: '8-CH HDR 앙상블', badge: 'PRO' },
                { key: 'TOP_COAXIAL', label: 'Top 0° Coaxial', badge: null },
                { key: 'OBLIQUE_NORTH', label: 'North 45°', badge: null },
                { key: 'OBLIQUE_EAST', label: 'East 45°', badge: null },
                { key: 'OBLIQUE_SOUTH', label: 'South 45°', badge: null },
                { key: 'OBLIQUE_WEST', label: 'West 45°', badge: null },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedAngle(item.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                    selectedAngle === item.key
                      ? 'bg-purple-600 text-white shadow-xs'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Camera className="w-3 h-3 mr-1" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1 rounded bg-purple-400/30 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                Samples: <strong className="text-purple-400">{ensembleState.totalGoldenSamples}</strong>
              </span>
            </div>
          </div>

          {/* Visual Canvas Stage */}
          <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center p-6 select-none">
            {calibrationSuccess && (
              <div className="absolute top-4 left-4 z-30 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2 backdrop-blur-md animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>멀티 앵글 / 조명 앙상블 캘리브레이션이 성공적으로 적용되었습니다.</span>
              </div>
            )}

            {/* Simulated Photometric Multi-Lighting PCB Board Canvas */}
            <div
              className="w-full max-w-2xl aspect-4/3 rounded-2xl relative overflow-hidden border-2 shadow-2xl transition-all duration-300 flex flex-col justify-between p-6"
              style={{
                backgroundColor: '#0d3824', // Rich PCB Green substrate
                borderColor: selectedAngle === 'ENSEMBLE_HDR' ? '#a855f7' : '#334155',
                boxShadow:
                  selectedAngle === 'ENSEMBLE_HDR'
                    ? '0 0 35px rgba(168, 85, 247, 0.25)'
                    : '0 0 20px rgba(0,0,0,0.8)',
              }}
            >
              {/* Copper Traces Background Graphic */}
              <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <pattern id="traces-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 10 L 20 10 L 30 20 L 40 20 M 10 0 L 10 15 L 25 30 L 40 30" fill="none" stroke="#d97706" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#traces-pattern)" />
              </svg>

              {/* Lighting Glow Overlay based on Sliders */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                style={{
                  background:
                    selectedAngle === 'ENSEMBLE_HDR'
                      ? `radial-gradient(circle at 50% 50%, rgba(255,255,255,${(lightingConfig.coaxialWeight / 100) * 0.15}), rgba(239,68,68,${(lightingConfig.highRedWeight / 100) * 0.08}) 40%, rgba(34,197,94,${(lightingConfig.midGreenWeight / 100) * 0.08}) 70%, rgba(59,130,246,${(lightingConfig.lowBlueWeight / 100) * 0.15}) 100%)`
                      : selectedAngle === 'TOP_COAXIAL'
                      ? 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4), transparent 80%)'
                      : selectedAngle === 'OBLIQUE_NORTH'
                      ? 'linear-gradient(to bottom, rgba(239,68,68,0.35), transparent 70%)'
                      : selectedAngle === 'OBLIQUE_EAST'
                      ? 'linear-gradient(to left, rgba(59,130,246,0.35), transparent 70%)'
                      : selectedAngle === 'OBLIQUE_SOUTH'
                      ? 'linear-gradient(to top, rgba(34,197,94,0.35), transparent 70%)'
                      : 'linear-gradient(to right, rgba(168,85,247,0.35), transparent 70%)',
                }}
              />

              {/* Top Board Silkscreen Text */}
              <div className="relative z-10 flex items-center justify-between text-white/80 font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white tracking-wider">{currentBoard.model}</span>
                  <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] text-amber-300">GOLDEN MASTER ENSEMBLE</span>
                </div>
                <div className="text-[10px] text-white/60">
                  {selectedAngle === 'ENSEMBLE_HDR' ? '8-CH FUSED HDR' : selectedAngle}
                </div>
              </div>

              {/* PCB Components Layout Grid on Board */}
              <div className="relative z-10 grid grid-cols-3 gap-6 p-4 my-auto">
                {/* U1: Microcontroller QFP */}
                <div
                  onClick={() => setSelectedComponentId('U1')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                    selectedComponentId === 'U1'
                      ? 'bg-slate-900/90 border-purple-400 ring-2 ring-purple-500/50'
                      : 'bg-slate-900/70 border-slate-600 hover:border-purple-400/50'
                  }`}
                >
                  <div className="absolute -top-2 left-2 text-[9px] font-mono font-bold text-amber-300 bg-black/60 px-1 rounded">
                    U1 (QFP-64)
                  </div>
                  <div className="w-14 h-14 bg-slate-950 border border-slate-700 rounded-md flex items-center justify-center relative">
                    <span className="text-[9px] font-mono text-slate-300 font-bold text-center leading-tight">STM32<br />AUTO</span>
                    {/* Simulated 4-side solder pins */}
                    <div className="absolute -top-1 inset-x-2 h-1 bg-amber-400/80 rounded-xs" />
                    <div className="absolute -bottom-1 inset-x-2 h-1 bg-amber-400/80 rounded-xs" />
                    <div className="absolute -left-1 inset-y-2 w-1 bg-amber-400/80 rounded-xs" />
                    <div className="absolute -right-1 inset-y-2 w-1 bg-amber-400/80 rounded-xs" />
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 font-bold mt-1.5 flex items-center space-x-1">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Fillet Wetting 100%</span>
                  </div>
                </div>

                {/* U2: SOIC-8 Driver */}
                <div
                  onClick={() => setSelectedComponentId('U2')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                    selectedComponentId === 'U2'
                      ? 'bg-slate-900/90 border-purple-400 ring-2 ring-purple-500/50'
                      : 'bg-slate-900/70 border-slate-600 hover:border-purple-400/50'
                  }`}
                >
                  <div className="absolute -top-2 left-2 text-[9px] font-mono font-bold text-amber-300 bg-black/60 px-1 rounded">
                    U2 (SOIC-8)
                  </div>
                  <div className="w-12 h-10 bg-slate-950 border border-slate-700 rounded-md flex items-center justify-center relative">
                    <span className="text-[8px] font-mono text-slate-300">CAN-BUS</span>
                    <div className="absolute -left-1 inset-y-1 w-1 bg-amber-400/80 rounded-xs" />
                    <div className="absolute -right-1 inset-y-1 w-1 bg-amber-400/80 rounded-xs" />
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 font-bold mt-1.5">
                    Co-planarity 12um
                  </div>
                </div>

                {/* C12, C14, R08 Passive Array */}
                <div className="p-3 rounded-xl border border-slate-600 bg-slate-900/70 flex flex-col justify-around">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-amber-300">C12 (0603)</span>
                    <span className="text-emerald-400 font-bold">100% PASS</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-amber-300">C14 (0603)</span>
                    <span className="text-emerald-400 font-bold">100% PASS</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-amber-300">R08 (0402)</span>
                    <span className="text-emerald-400 font-bold">100% PASS</span>
                  </div>
                </div>
              </div>

              {/* Bottom Canvas Stats Bar */}
              <div className="relative z-10 flex items-center justify-between text-xs text-white/80 border-t border-white/10 pt-3">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-white/50 text-[10px] block">난반사(Glare) 억제율</span>
                    <span className="font-bold text-emerald-400 font-mono">+{ensembleState.glareArtifactReductionPct}%</span>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] block">솔더 엣지 기울기 이득</span>
                    <span className="font-bold text-purple-400 font-mono">+{ensembleState.solderEdgeGradientGainPct}%</span>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] block">신뢰도 포괄률 (Coverage)</span>
                    <span className="font-bold text-blue-400 font-mono">{ensembleState.confidenceCoverage}%</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 bg-black/50 px-2.5 py-1 rounded-lg border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">CALIBRATED ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Lighting Sliders & Registered Golden Samples */}
        <div className={`lg:col-span-4 flex flex-col overflow-y-auto ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
          {/* Sub-tab Navigation */}
          <div className={`p-2 border-b flex items-center space-x-1 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
            <button
              type="button"
              onClick={() => setActiveTab('lighting')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'lighting'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>조명 가중치 제어</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('samples')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'samples'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>골든 보드 DB ({ensembleState.samples.length})</span>
            </button>
          </div>

          {/* Tab 1: Lighting Weights & Fusion Algorithm */}
          {activeTab === 'lighting' && (
            <div className="p-5 space-y-5 flex-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center space-x-1.5">
                  <Sun className="w-3.5 h-3.5" />
                  <span>멀티 티어 조명 채널 밸런스</span>
                </h4>

                <div className="space-y-4">
                  {/* Coaxial White */}
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400 inline-block" />
                        <span>동축 수직 백색광 (Top Coaxial)</span>
                      </span>
                      <span className="font-mono font-bold text-white">{lightingConfig.coaxialWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lightingConfig.coaxialWeight}
                      onChange={(e) => handleLightingChange('coaxialWeight', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  {/* High Angle Red */}
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                        <span>고각 적색 링 조명 (High-Angle Red)</span>
                      </span>
                      <span className="font-mono font-bold text-red-400">{lightingConfig.highRedWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lightingConfig.highRedWeight}
                      onChange={(e) => handleLightingChange('highRedWeight', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>

                  {/* Mid Angle Green */}
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        <span>중각 녹색 링 조명 (Mid-Angle Green)</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-400">{lightingConfig.midGreenWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lightingConfig.midGreenWeight}
                      onChange={(e) => handleLightingChange('midGreenWeight', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Low Angle Blue */}
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                        <span>저각 청색 링 조명 (Low-Angle Blue)</span>
                      </span>
                      <span className="font-mono font-bold text-blue-400">{lightingConfig.lowBlueWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lightingConfig.lowBlueWeight}
                      onChange={(e) => handleLightingChange('lowBlueWeight', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Oblique Quad Flood */}
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                        <span>4방향 45° 사각 투광 (Oblique Quad)</span>
                      </span>
                      <span className="font-mono font-bold text-purple-400">{lightingConfig.obliqueQuadWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lightingConfig.obliqueQuadWeight}
                      onChange={(e) => handleLightingChange('obliqueQuadWeight', Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* HDR Fusion & Polarization Options */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  HDR 이미지 융합 알고리즘
                </h4>

                <div className="space-y-2 text-xs">
                  {[
                    { key: 'EXPOSURE_FUSION', title: '노출 융합 (Exposure Fusion)', desc: 'Mertens 알고리즘 기반 최적 콘트라스트 결합' },
                    { key: 'DIFFUSE_SPECULAR_SPLIT', title: '확산/정반사 분리 (Specular Split)', desc: '솔더 광택 하이라이트와 실크스크린 분리' },
                    { key: 'SHADOW_REMOVAL', title: '다방향 그림자 제거 (Shadow Removal)', desc: '높은 부품 후면 블라인드 영역 보정' },
                    { key: 'WETTING_CONTOUR', title: '메니스커스 젖음각 등고선 융합', desc: '솔더 필렛 곡률 3D 컬러 맵 렌더링' },
                  ].map((mode) => (
                    <label
                      key={mode.key}
                      className={`p-2.5 rounded-xl border flex items-start space-x-2.5 cursor-pointer transition-all ${
                        lightingConfig.hdrFusionMode === mode.key
                          ? 'bg-purple-600/20 border-purple-500 text-white'
                          : isDark
                          ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="hdr-fusion-mode"
                        checked={lightingConfig.hdrFusionMode === mode.key}
                        onChange={() => handleLightingChange('hdrFusionMode', mode.key)}
                        className="mt-0.5 accent-purple-500"
                      />
                      <div>
                        <div className="font-bold">{mode.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{mode.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Registered Golden Samples DB */}
          {activeTab === 'samples' && (
            <div className="p-5 space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-purple-400">등록된 골든 샘플 ({ensembleState.samples.length}매)</h4>
                  <p className="text-[10px] text-slate-400">N매 평균($\mu$) + 편차($3\sigma$) 서피스 맵 구축</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddGoldenSample}
                  className="px-2.5 py-1 rounded text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition-all"
                >
                  + 샘플 추가
                </button>
              </div>

              <div className="space-y-2.5">
                {ensembleState.samples.map((s) => (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-purple-400">{s.id}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                          {s.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        SNR: <strong className="text-slate-200">{s.snrDb} dB</strong> | 반사율 편차: <strong className="text-slate-200">{s.surfaceReflectanceVariance}</strong>
                      </div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{s.capturedAt}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSample(s.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="골든 샘플 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
