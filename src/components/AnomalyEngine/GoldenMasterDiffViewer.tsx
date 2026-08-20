import React, { useState, useRef, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Eye,
  Flame,
  Layers,
  Maximize2,
  RefreshCw,
  Search,
  Settings2,
  Sliders,
  Sparkles,
  Split,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { PCBBoard, ThemeMode, AnomalyRegion, GoldenDiffResult, DefectSeverity } from '../../types/aoi';

interface GoldenMasterDiffViewerProps {
  currentBoard: PCBBoard;
  themeMode?: ThemeMode;
}

export const GoldenMasterDiffViewer: React.FC<GoldenMasterDiffViewerProps> = ({
  currentBoard,
  themeMode = 'dark',
}) => {
  const isDark = themeMode === 'dark';

  // Viewer modes: 'diffHeatmap' | 'curtainSplit' | 'sideBySide' | 'subtractionOnly'
  const [viewMode, setViewMode] = useState<'diffHeatmap' | 'curtainSplit' | 'sideBySide' | 'subtractionOnly'>('diffHeatmap');
  const [colorMap, setColorMap] = useState<'jet' | 'inferno' | 'viridis' | 'turbo'>('jet');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Sensitivity Tuning Parameters
  const [noiseFilterSigma, setNoiseFilterSigma] = useState<number>(1.5);
  const [anomalyCutoffScore, setAnomalyCutoffScore] = useState<number>(35);
  const [patchSizePx, setPatchSizePx] = useState<number>(16);
  const [colorWeight, setColorWeight] = useState<number>(65);

  // Selected Anomaly Region
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>('anom-1');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Mock Anomaly Regions for the Current Board
  const rawAnomalyList: AnomalyRegion[] = useMemo(() => [
    {
      id: 'anom-1',
      x: 320,
      y: 190,
      width: 45,
      height: 38,
      anomalyScore: 84.5,
      category: 'FLUX_RESIDUE',
      severity: 'MAJOR',
      description: '리플로우 후 U1 근방 투명 플럭스 잔여물(Flux Splatter) 반사 이상 포착',
      pixelDifferencePct: 42.8,
      suggestedAction: '초음파 세척기 노즐 압력 15% 상향 및 플럭스 도포량 10% 감축',
    },
    {
      id: 'anom-2',
      x: 480,
      y: 110,
      width: 55,
      height: 25,
      anomalyScore: 68.2,
      category: 'PCB_SCRATCH',
      severity: 'CRITICAL',
      description: 'C14 패드 인근 솔더마스크 미세 스크래치 (동박 노출 위험 4.5µm)',
      pixelDifferencePct: 34.1,
      suggestedAction: '매거진 로더 핸들러 진공 픽업 핑거 표면 테프론 패드 교체',
    },
    {
      id: 'anom-3',
      x: 180,
      y: 280,
      width: 32,
      height: 32,
      anomalyScore: 52.0,
      category: 'SOLDER_SPLATTER',
      severity: 'MINOR',
      description: 'R4 저항 인근 직경 0.12mm 미세 솔더 비산 볼(Solder Ball Spatter)',
      pixelDifferencePct: 22.4,
      suggestedAction: '질소 리플로우 2차 프리히트 승온 속도 1.2℃/s로 완만 조정',
    },
    {
      id: 'anom-4',
      x: 520,
      y: 310,
      width: 40,
      height: 40,
      anomalyScore: 38.6,
      category: 'FOREIGN_OBJECT',
      severity: 'MINOR',
      description: '실크스크린 영역 무기질 섬유 보풀(FOD) 잔류',
      pixelDifferencePct: 18.9,
      suggestedAction: '크린룸 이오나이저 에어 블로우 노즐 청소',
    },
  ], []);

  // Filtered by Cutoff Score
  const activeAnomalies = useMemo(() => {
    return rawAnomalyList.filter((a) => a.anomalyScore >= anomalyCutoffScore);
  }, [rawAnomalyList, anomalyCutoffScore]);

  const selectedAnomaly = activeAnomalies.find((a) => a.id === selectedAnomalyId) || activeAnomalies[0];

  // Overall Match Similarity
  const overallSimilarity = useMemo(() => {
    const penalty = activeAnomalies.reduce((sum, a) => sum + (a.anomalyScore * 0.04), 0);
    return Math.max(88, Number((99.6 - penalty).toFixed(1)));
  }, [activeAnomalies]);

  // Color map gradient mapping
  const getColormapGradient = () => {
    switch (colorMap) {
      case 'inferno':
        return 'linear-gradient(to right, #000004, #57106e, #bb3754, #f98e09, #fcffa4)';
      case 'viridis':
        return 'linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)';
      case 'turbo':
        return 'linear-gradient(to right, #30123b, #4582ec, #1ae4b6, #a4fc3c, #fb8022, #7a0403)';
      case 'jet':
      default:
        return 'linear-gradient(to right, #00007f, #0000ff, #00ffff, #ffff00, #ff0000, #7f0000)';
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSlider || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPos = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(newPos);
  };

  return (
    <div
      id="golden-master-diff-engine"
      className={`h-full w-full flex flex-col overflow-hidden select-none transition-colors ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDraggingSlider(false)}
    >
      {/* Top Header Controls */}
      <div
        className={`px-6 py-3.5 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-md shadow-cyan-500/20">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold">비지도 딥러닝 이상 감지 &amp; 골든 마스터 감산 비교 엔진</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Phase 3.2 Deep Anomaly Diff
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              규칙 기반 비전이 놓치기 쉬운 미세 스크래치, 플럭스 잔여물, 미세 동박 크랙, 이물질(FOD)을 골든 레퍼런스 차분 픽셀 맵으로 검출합니다.
            </p>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded-xl border flex space-x-1 ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              type="button"
              onClick={() => setViewMode('diffHeatmap')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'diffHeatmap'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>히트맵 오버레이</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('curtainSplit')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'curtainSplit'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>커튼 분할 비교</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('sideBySide')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'sideBySide'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>1:1 비교 (Side-by-Side)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace (Split Grid) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center: Interactive Optical PCB Canvas with Golden Diff View */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden bg-[#080d1a]">
          {/* Top Canvas Toolbar */}
          <div className="absolute top-4 left-6 z-20 flex items-center space-x-3">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-xs font-mono flex items-center space-x-2 backdrop-blur-md">
              <span className="text-slate-400">모델:</span>
              <strong className="text-cyan-400">{currentBoard.model}</strong>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">골든 레퍼런스:</span>
              <strong className="text-emerald-400">MASTER-REF-01</strong>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-xs font-mono flex items-center space-x-2 backdrop-blur-md">
              <span className="text-slate-400">골든 일치율:</span>
              <strong className={`font-extrabold ${overallSimilarity > 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {overallSimilarity}%
              </strong>
            </div>
          </div>

          {/* Top Right Zoom Controls */}
          <div className="absolute top-4 right-6 z-20 flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700 rounded-lg p-1 text-white backdrop-blur-md">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, Number((z - 0.1).toFixed(1))))}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.0, Number((z + 0.1).toFixed(1))))}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Canvas Render Container */}
          <div
            ref={containerRef}
            className="w-[720px] h-[480px] bg-[#0b1329] border border-slate-700/80 rounded-2xl relative shadow-2xl overflow-hidden transition-transform"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* 1. Underlying PCB Traces & Base Layer */}
            <div className="absolute inset-0 bg-[#091811] opacity-90">
              {/* Copper Traces Pattern */}
              <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-traces" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 0 20 L 40 20 M 20 0 L 20 40" fill="none" stroke="#22c55e" strokeWidth="0.8" />
                    <circle cx="20" cy="20" r="3" fill="#eab308" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-traces)" />
              </svg>
            </div>

            {/* Render Components on Canvas */}
            {currentBoard.components.map((comp) => (
              <div
                key={comp.id}
                style={{
                  position: 'absolute',
                  left: `${comp.x * 0.9}px`,
                  top: `${comp.y * 0.9}px`,
                  width: `${comp.width * 0.9}px`,
                  height: `${comp.height * 0.9}px`,
                }}
                className="bg-slate-800/90 border border-slate-500 rounded-sm flex items-center justify-center text-[9px] font-mono text-slate-200 shadow-sm"
              >
                {comp.refDes}
              </div>
            ))}

            {/* 2. Anomaly Heatmap Glow Layer (when diffHeatmap is active) */}
            {viewMode === 'diffHeatmap' && (
              <div className="absolute inset-0 pointer-events-none">
                {activeAnomalies.map((anom) => (
                  <div
                    key={anom.id}
                    className="rounded-full blur-md opacity-80 animate-pulse"
                    style={{
                      position: 'absolute',
                      left: `${anom.x - 15}px`,
                      top: `${anom.y - 15}px`,
                      width: `${anom.width + 30}px`,
                      height: `${anom.height + 30}px`,
                      background:
                        colorMap === 'jet'
                          ? 'radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,255,0,0.6) 40%, rgba(0,255,255,0.3) 70%, transparent 100%)'
                          : 'radial-gradient(circle, rgba(253,231,37,0.9) 0%, rgba(94,201,98,0.6) 40%, rgba(68,1,84,0.3) 70%, transparent 100%)',
                    }}
                  />
                ))}
              </div>
            )}

            {/* 3. Curtain Split Mask (when curtainSplit is active) */}
            {viewMode === 'curtainSplit' && (
              <>
                {/* Right Side: Inspected Target with Heatmap */}
                <div
                  className="absolute inset-y-0 right-0 overflow-hidden pointer-events-none"
                  style={{ width: `${100 - sliderPosition}%` }}
                >
                  <div className="absolute right-3 top-3 px-2 py-1 bg-red-950/80 border border-red-500 text-red-300 text-[10px] font-bold rounded">
                    검사 대상 PCB (Target Unit)
                  </div>
                  {activeAnomalies.map((anom) => (
                    <div
                      key={anom.id}
                      style={{
                        position: 'absolute',
                        left: `${anom.x}px`,
                        top: `${anom.y}px`,
                        width: `${anom.width}px`,
                        height: `${anom.height}px`,
                        background: 'rgba(239, 68, 68, 0.4)',
                        border: '2px solid #ef4444',
                      }}
                      className="rounded animate-pulse"
                    />
                  ))}
                </div>

                {/* Left Side: Golden Master Clean Board */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div className="absolute left-3 top-3 px-2 py-1 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-[10px] font-bold rounded">
                    골든 마스터 기준 (Golden Master Reference)
                  </div>
                </div>

                {/* Draggable Divider Line */}
                <div
                  style={{ left: `${sliderPosition}%` }}
                  onMouseDown={() => setIsDraggingSlider(true)}
                  className="absolute inset-y-0 w-1 bg-cyan-400 cursor-ew-resize z-30 shadow-[0_0_10px_#22d3ee] flex items-center justify-center"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg">
                    <Split className="w-3.5 h-3.5" />
                  </div>
                </div>
              </>
            )}

            {/* 4. Interactive Anomaly Click Bounding Boxes */}
            {activeAnomalies.map((anom) => {
              const isSelected = selectedAnomalyId === anom.id;
              return (
                <div
                  key={anom.id}
                  onClick={() => setSelectedAnomalyId(anom.id)}
                  style={{
                    position: 'absolute',
                    left: `${anom.x}px`,
                    top: `${anom.y}px`,
                    width: `${anom.width}px`,
                    height: `${anom.height}px`,
                  }}
                  className={`cursor-pointer border-2 rounded transition-all z-20 flex flex-col justify-between p-1 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/20 ring-2 ring-cyan-400/50 shadow-lg'
                      : 'border-amber-400/70 bg-amber-500/10 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[8px] font-extrabold text-white">
                    <span className="bg-slate-900/90 px-1 rounded">{anom.category}</span>
                    <span className="bg-red-600 px-1 rounded">{anom.anomalyScore.toFixed(0)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Colormap Legend Bar */}
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-xs text-slate-400 font-mono">0.0 (Normal Match)</span>
            <div
              className="w-64 h-3 rounded-full border border-slate-700"
              style={{ background: getColormapGradient() }}
            />
            <span className="text-xs text-red-400 font-bold font-mono">100.0 (High Deviation)</span>

            <select
              value={colorMap}
              onChange={(e) => setColorMap(e.target.value as any)}
              className="ml-3 px-2 py-1 text-xs rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none"
            >
              <option value="jet">Jet Heatmap</option>
              <option value="viridis">Viridis Heatmap</option>
              <option value="inferno">Inferno Heatmap</option>
              <option value="turbo">Turbo Colormap</option>
            </select>
          </div>
        </div>

        {/* Right Sidebar: Anomaly Inspector & Parameter Tuner (Width 380px) */}
        <div
          className={`w-96 border-l flex flex-col justify-between overflow-y-auto shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="p-5 space-y-5">
            {/* Selected Anomaly Feature Card */}
            {selectedAnomaly ? (
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-900/80 border-cyan-500/40 shadow-lg shadow-cyan-950/20' : 'bg-cyan-50/50 border-cyan-300 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {selectedAnomaly.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-red-400">
                    이상 점수: {selectedAnomaly.anomalyScore} / 100
                  </span>
                </div>

                <h3 className="font-extrabold text-sm leading-snug">{selectedAnomaly.description}</h3>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] text-slate-400 block font-sans">픽셀 차분 편차</span>
                    <span className="font-bold text-cyan-400">{selectedAnomaly.pixelDifferencePct}% Diff</span>
                  </div>

                  <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] text-slate-400 block font-sans">이상 심각도</span>
                    <span className={`font-bold ${selectedAnomaly.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>
                      {selectedAnomaly.severity}
                    </span>
                  </div>
                </div>

                {/* Engineering Corrective Action */}
                <div className={`p-3 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">SMT 라인 권장 조치 (Corrective Action):</span>
                  <p className="leading-relaxed font-sans">{selectedAnomaly.suggestedAction}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed text-center text-xs text-slate-500">
                선택된 이상 영역이 없습니다.
              </div>
            )}

            {/* Anomaly Detection Sensitivity Tuner */}
            <div className={`p-4 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="text-xs font-bold flex items-center space-x-2 text-slate-200">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>딥러닝 이상 감지 알고리즘 파라미터 튜닝</span>
              </h4>

              {/* Slider 1: Anomaly Score Cutoff */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">이상 감지 컷오프 임계치 (Threshold)</span>
                  <span className="font-mono font-bold text-cyan-400">{anomalyCutoffScore} pts</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={anomalyCutoffScore}
                  onChange={(e) => setAnomalyCutoffScore(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Slider 2: Noise Filter Sigma */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">노이즈 필터 가우시안 시그마 (σ)</span>
                  <span className="font-mono font-bold text-cyan-400">{noiseFilterSigma} px</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={noiseFilterSigma}
                  onChange={(e) => setNoiseFilterSigma(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Slider 3: Patch Size */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">패치 코어 크기 (Patch Size)</span>
                  <span className="font-mono font-bold text-cyan-400">{patchSizePx} × {patchSizePx} px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="32"
                  step="4"
                  value={patchSizePx}
                  onChange={(e) => setPatchSizePx(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            {/* List of Detected Anomaly Regions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block">검출된 이상 영역 목록 ({activeAnomalies.length}개)</span>
              <div className="space-y-1.5">
                {activeAnomalies.map((anom) => (
                  <div
                    key={anom.id}
                    onClick={() => setSelectedAnomalyId(anom.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      selectedAnomalyId === anom.id
                        ? isDark
                          ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                          : 'bg-cyan-50 border-cyan-400 text-cyan-900'
                        : isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="font-bold">{anom.category}</span>
                    </div>
                    <span className="font-mono text-red-400 font-bold">{anom.anomalyScore.toFixed(1)} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
