import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  Crosshair,
  Grid,
  CheckCircle2,
  Play,
  RotateCw,
  Sparkles,
  Layers,
  ArrowRight,
  Maximize2,
  Database,
  Cpu,
  TrendingUp,
} from 'lucide-react';
import {
  PCBBoard,
  FiducialMark,
  FOVScanStep,
  WarpageMeshPoint,
  InspectionRecipe,
  ThemeMode,
} from '../../types/aoi';

interface AutoTeachingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBoard: PCBBoard;
  onApplyRecipe: (recipe: InspectionRecipe) => void;
  themeMode?: ThemeMode;
}

const INITIAL_FIDUCIALS: FiducialMark[] = [
  {
    id: 'FID-01',
    name: 'FID1 (Origin Ref)',
    xMm: 12.5,
    yMm: 10.0,
    shape: 'ROUND',
    diameterMm: 1.0,
    found: true,
    score: 0.998,
    measuredOffset: { dxUm: 8.5, dyUm: -4.2 },
  },
  {
    id: 'FID-02',
    name: 'FID2 (X-Axis Align)',
    xMm: 105.0,
    yMm: 10.0,
    shape: 'ROUND',
    diameterMm: 1.0,
    found: true,
    score: 0.994,
    measuredOffset: { dxUm: 14.2, dyUm: -3.8 },
  },
  {
    id: 'FID-03',
    name: 'FID3 (Diagonal Warpage Ref)',
    xMm: 105.0,
    yMm: 72.0,
    shape: 'CROSS',
    diameterMm: 1.2,
    found: true,
    score: 0.989,
    measuredOffset: { dxUm: 19.5, dyUm: 6.2 },
  },
];

const INITIAL_WARPAGE_GRID: WarpageMeshPoint[] = [
  { gridX: 0, gridY: 0, xMm: 10, yMm: 10, zOffsetUm: 0, status: 'FLAT' },
  { gridX: 1, gridY: 0, xMm: 40, yMm: 10, zOffsetUm: 15, status: 'FLAT' },
  { gridX: 2, gridY: 0, xMm: 70, yMm: 10, zOffsetUm: 35, status: 'FLAT' },
  { gridX: 3, gridY: 0, xMm: 105, yMm: 10, zOffsetUm: 18, status: 'FLAT' },

  { gridX: 0, gridY: 1, xMm: 10, yMm: 30, zOffsetUm: -20, status: 'FLAT' },
  { gridX: 1, gridY: 1, xMm: 40, yMm: 30, zOffsetUm: 65, status: 'WARPED_HIGH' },
  { gridX: 2, gridY: 1, xMm: 70, yMm: 30, zOffsetUm: 82, status: 'WARPED_HIGH' },
  { gridX: 3, gridY: 1, xMm: 105, yMm: 30, zOffsetUm: 24, status: 'FLAT' },

  { gridX: 0, gridY: 2, xMm: 10, yMm: 50, zOffsetUm: -45, status: 'WARPED_LOW' },
  { gridX: 1, gridY: 2, xMm: 40, yMm: 50, zOffsetUm: 45, status: 'FLAT' },
  { gridX: 2, gridY: 2, xMm: 70, yMm: 50, zOffsetUm: 90, status: 'WARPED_HIGH' },
  { gridX: 3, gridY: 2, xMm: 105, yMm: 50, zOffsetUm: 32, status: 'FLAT' },

  { gridX: 0, gridY: 3, xMm: 10, yMm: 75, zOffsetUm: 10, status: 'FLAT' },
  { gridX: 1, gridY: 3, xMm: 40, yMm: 75, zOffsetUm: 30, status: 'FLAT' },
  { gridX: 2, gridY: 3, xMm: 70, yMm: 75, zOffsetUm: 48, status: 'FLAT' },
  { gridX: 3, gridY: 3, xMm: 105, yMm: 75, zOffsetUm: 22, status: 'FLAT' },
];

const INITIAL_FOV_STEPS: FOVScanStep[] = [
  { fovIndex: 1, x: 20, y: 20, widthMm: 30, heightMm: 25, componentCount: 14, scanTimeMs: 180, status: 'DONE' },
  { fovIndex: 2, x: 55, y: 20, widthMm: 30, heightMm: 25, componentCount: 22, scanTimeMs: 210, status: 'DONE' },
  { fovIndex: 3, x: 90, y: 20, widthMm: 30, heightMm: 25, componentCount: 18, scanTimeMs: 195, status: 'DONE' },
  { fovIndex: 4, x: 90, y: 50, widthMm: 30, heightMm: 25, componentCount: 16, scanTimeMs: 175, status: 'SCANNING' },
  { fovIndex: 5, x: 55, y: 50, widthMm: 30, heightMm: 25, componentCount: 28, scanTimeMs: 240, status: 'PLANNED' },
  { fovIndex: 6, x: 20, y: 50, widthMm: 30, heightMm: 25, componentCount: 19, scanTimeMs: 190, status: 'PLANNED' },
  { fovIndex: 7, x: 20, y: 70, widthMm: 30, heightMm: 25, componentCount: 8, scanTimeMs: 140, status: 'PLANNED' },
  { fovIndex: 8, x: 55, y: 70, widthMm: 30, heightMm: 25, componentCount: 12, scanTimeMs: 160, status: 'PLANNED' },
  { fovIndex: 9, x: 90, y: 70, widthMm: 30, heightMm: 25, componentCount: 10, scanTimeMs: 150, status: 'PLANNED' },
];

export const AutoTeachingModal: React.FC<AutoTeachingModalProps> = ({
  isOpen,
  onClose,
  currentBoard,
  onApplyRecipe,
  themeMode = 'dark',
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isTeachingRunning, setIsTeachingRunning] = useState<boolean>(false);
  const [teachingProgress, setTeachingProgress] = useState<number>(0);
  const [goldenSamplesCount, setGoldenSamplesCount] = useState<number>(10);
  const [autoSigmaTolerance, setAutoSigmaTolerance] = useState<'3_SIGMA' | '6_SIGMA'>('6_SIGMA');
  const [fovSteps, setFovSteps] = useState<FOVScanStep[]>(INITIAL_FOV_STEPS);
  const [currentFovScanIdx, setCurrentFovScanIdx] = useState<number>(3);
  const [fiducials, setFiducials] = useState<FiducialMark[]>(INITIAL_FIDUCIALS);
  const [warpageMesh, setWarpageMesh] = useState<WarpageMeshPoint[]>(INITIAL_WARPAGE_GRID);

  const isDark = themeMode === 'dark';

  // Calculate Board Skew & Scale Factor
  const calculatedThetaDeg = 0.082;
  const calculatedScaleStretchX = 1.00045; // 45 ppm stretch
  const calculatedScaleStretchY = 0.99982;

  // Run Step-by-Step Auto-Teaching Simulation
  const handleRunAutoTeach = () => {
    setIsTeachingRunning(true);
    setTeachingProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setTeachingProgress(progress);

      // Advance FOV scanning animation
      if (progress >= 30 && progress < 70) {
        setCurrentFovScanIdx((prev) => (prev + 1) % fovSteps.length);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setIsTeachingRunning(false);
        setFovSteps((prev) => prev.map((s) => ({ ...s, status: 'DONE' })));
      }
    }, 280);
  };

  // Generate & Deploy Auto-Calibrated Recipe
  const handleDeployGeneratedRecipe = () => {
    const generatedRecipe: InspectionRecipe = {
      id: 'RECIPE-AUTO-' + currentBoard.model,
      modelName: currentBoard.model,
      version: 'v2.4-AUTOTEACH',
      ipcClass: 'Class 3 (High Reliability / Automotive)',
      lightingPreset: {
        topCoaxial: 85,
        highRed: 75,
        midGreen: 60,
        lowBlue: 50,
      },
      algorithms: {
        solderBridgeThreshold: autoSigmaTolerance === '6_SIGMA' ? 88 : 80,
        missingPartContrast: 65,
        tombstoneMaxAngleDeg: 12,
        polarityMatchConfidence: 94,
        placementToleranceMm: 0.08,
        solderHeightMinUm: 70,
        solderHeightMaxUm: 210,
        coplanarityMaxUm: 45,
      },
    };

    onApplyRecipe(generatedRecipe);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="auto-teaching-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div
        id="auto-teaching-modal-container"
        className={`border rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-200 ${
          isDark ? 'bg-[#0f172a] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner">
              <Compass className="w-6 h-6 text-blue-500 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center space-x-2">
                <span>CAD-to-AOI Auto-Teaching & Fiducial Alignment</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono border border-blue-500/30">
                  AI Auto-Calibration
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Automated Gerber parsing, 3-point fiducial registration, warpage compensation mesh, and multi-board statistical threshold learning.
              </p>
            </div>
          </div>

          <button
            id="close-auto-teaching-modal"
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progression Bar */}
        <div
          className={`px-6 py-3 border-b flex items-center justify-between text-xs font-semibold ${
            isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-100/70 border-slate-200'
          }`}
        >
          {[
            { step: 1, title: '1. CAD Ingestion & ROIs', icon: Database },
            { step: 2, title: '2. Fiducials & Warpage Mesh', icon: Crosshair },
            { step: 3, title: '3. FOV Path Optimization', icon: Grid },
            { step: 4, title: '4. Golden Learning & Deploy', icon: Sparkles },
          ].map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.step;
            const isCompleted = activeStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : isCompleted
                    ? isDark
                      ? 'text-emerald-400 hover:bg-slate-800'
                      : 'text-emerald-700 hover:bg-slate-200'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.title}</span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Modal Main Body Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {/* STEP 1: CAD Ingestion & ROIs */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold flex items-center space-x-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    <span>Gerber Layer & Component Package Auto-Matching</span>
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    CAD Pick & Place coordinates have been mapped to standardized IPC footprint libraries.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                  Board: {currentBoard.model} ({currentBoard.dimensions.widthMm} x {currentBoard.dimensions.heightMm} mm)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-xs font-semibold text-blue-400 mb-1">Extracted Components</div>
                  <div className="text-2xl font-bold font-mono">{currentBoard.components.length} Items</div>
                  <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ICs: 4 | Passives (0402/0603): 38 | Connectors: 6
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-xs font-semibold text-emerald-400 mb-1">Inspection ROIs Built</div>
                  <div className="text-2xl font-bold font-mono">142 Windows</div>
                  <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Lead Pads, Solder Meniscus, Body Shift, Polarity
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-xs font-semibold text-purple-400 mb-1">Library Match Rate</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">100.0%</div>
                  <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Zero unmatched custom footprints detected
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="text-xs font-bold mb-3 flex items-center justify-between">
                  <span>Standard Package Algorithm Assignment</span>
                  <span className="text-[11px] text-slate-400 font-mono">IPC-7351B Standard</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  {[
                    { pkg: '0402 / 0603 Chip Resistor/Cap', algo: 'Dual-Pad Solder Volume + Tombstone Angle Laser Profiler', toll: '±0.06mm / < 12°' },
                    { pkg: 'QFP-64 / SOIC-8 Lead IC', algo: 'Multi-Lead Pitch Bridge + Lifted Lead Coplanarity', toll: 'Zero Bridge / < 45um' },
                    { pkg: 'BGA-64 Array / QFN-32', algo: 'Corner Joint Wetting + Body Rotation Theta', toll: '±0.08mm / ±0.5°' },
                  ].map((row, idx) => (
                    <div key={idx} className={`p-2.5 rounded-lg border flex items-center justify-between ${isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="font-semibold text-blue-400">{row.pkg}</span>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{row.algo}</span>
                      <span className="text-emerald-400 font-bold">{row.toll}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Fiducials & Warpage Mesh */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold flex items-center space-x-2">
                    <Crosshair className="w-4 h-4 text-emerald-500" />
                    <span>3-Point Optical Fiducial Alignment & 3D Warpage Heightmap</span>
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Calculates board position offset ($\Delta X, \Delta Y$), rotation skew ($\Delta\theta$), and compensates PCB thermal warpage.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Theta Skew: +{calculatedThetaDeg}°
                  </span>
                </div>
              </div>

              {/* Fiducials List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {fiducials.map((fid) => (
                  <div
                    key={fid.id}
                    className={`p-3.5 rounded-xl border ${
                      fid.found
                        ? isDark
                          ? 'bg-slate-900/80 border-emerald-500/30'
                          : 'bg-emerald-50/50 border-emerald-200'
                        : isDark
                        ? 'bg-slate-900 border-slate-800'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold font-mono text-emerald-400">{fid.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        NCC {(fid.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-[11px] font-mono space-y-0.5 text-slate-400">
                      <div>CAD Pos: ({fid.xMm.toFixed(1)}, {fid.yMm.toFixed(1)}) mm</div>
                      <div className="text-emerald-400 font-semibold">
                        Offset: dX={fid.measuredOffset.dxUm}um, dY={fid.measuredOffset.dyUm}um
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 4x4 Warpage Compensation Surface Matrix */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold">16-Point 3D Laser Warpage Elevation Grid (um)</span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-400">
                    Max Warpage: +90um / -45um (Auto-Z Focused)
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  {warpageMesh.map((pt, idx) => {
                    const isHigh = pt.zOffsetUm > 50;
                    const isLow = pt.zOffsetUm < -20;
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border transition-all ${
                          isHigh
                            ? isDark
                              ? 'bg-purple-950/40 border-purple-500/40 text-purple-300'
                              : 'bg-purple-50 border-purple-200 text-purple-700'
                            : isLow
                            ? isDark
                              ? 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                              : 'bg-blue-50 border-blue-200 text-blue-700'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="text-[10px] text-slate-500">
                          ({pt.xMm}, {pt.yMm})mm
                        </div>
                        <div className="font-bold text-sm mt-0.5">
                          {pt.zOffsetUm > 0 ? `+${pt.zOffsetUm}` : pt.zOffsetUm} um
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FOV Path Optimization */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold flex items-center space-x-2">
                    <Grid className="w-4 h-4 text-blue-500" />
                    <span>Snake Trajectory FOV Camera Route Optimization</span>
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Traveling Salesman optimization minimizes optical head acceleration/deceleration tact time.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Est. Tact Time: 3.8 sec / PCB
                  </span>
                </div>
              </div>

              {/* FOV Scan Grid Simulation Display */}
              <div className={`p-4 rounded-xl border relative overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="grid grid-cols-3 gap-3">
                  {fovSteps.map((step) => {
                    const isScanning = isTeachingRunning && step.fovIndex === currentFovScanIdx + 1;
                    return (
                      <div
                        key={step.fovIndex}
                        className={`p-3.5 rounded-lg border transition-all duration-300 relative ${
                          isScanning
                            ? 'bg-blue-600/30 border-blue-400 shadow-lg scale-102 ring-2 ring-blue-500/50'
                            : step.status === 'DONE'
                            ? isDark
                              ? 'bg-slate-900 border-emerald-500/30 text-slate-300'
                              : 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                            : isDark
                            ? 'bg-slate-900/50 border-slate-800 text-slate-500'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                          <span className={isScanning ? 'text-blue-400' : 'text-slate-300'}>FOV #{step.fovIndex}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                            step.status === 'DONE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          <div>Pos: ({step.x}, {step.y}) mm</div>
                          <div>Components: {step.componentCount} | {step.scanTimeMs}ms</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  id="run-fov-simulation-btn"
                  onClick={handleRunAutoTeach}
                  disabled={isTeachingRunning}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all ${
                    isTeachingRunning
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {isTeachingRunning ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Optimizing FOV Trajectory ({teachingProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Run Optical Scan Simulation</span>
                    </>
                  )}
                </button>

                <div className="text-xs font-mono text-slate-400">
                  Total 9 Optical Snapshots • Zero Blind Spots
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Golden Learning & Deploy */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Golden Board Statistical Learning & Recipe Deployment</span>
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Learns natural solder meniscus variance from multiple reference boards to automatically prevent false calls.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                  Zero Escape / Minimum False Call Mode
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="text-xs font-bold text-slate-300">Golden Board Sample Count</div>
                  <div className="flex items-center space-x-2">
                    {[5, 10, 20, 50].map((count) => (
                      <button
                        key={count}
                        onClick={() => setGoldenSamplesCount(count)}
                        className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                          goldenSamplesCount === count
                            ? 'bg-blue-600 text-white border-blue-500'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {count} Boards
                      </button>
                    ))}
                  </div>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Calculates average color reflectance, solder fillet volume distribution, and component body placement noise.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="text-xs font-bold text-slate-300">Statistical Tolerance Band</div>
                  <div className="flex items-center space-x-2">
                    {[
                      { key: '3_SIGMA', label: '±3 Sigma (Standard SMT)' },
                      { key: '6_SIGMA', label: '±6 Sigma (Automotive ECU)' },
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        onClick={() => setAutoSigmaTolerance(mode.key as any)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          autoSigmaTolerance === mode.key
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ±6 Sigma tightens solder wetting tolerances while filtering out harmless flux residue shadows.
                  </p>
                </div>
              </div>

              {/* Recipe Summary Card */}
              <div className={`p-4 rounded-xl border space-y-2.5 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Auto-Taught Recipe Ready: {currentBoard.model}-AUTOTEACH</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">Cpk Target &gt; 1.67</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] text-slate-500 block">Bridge Threshold:</span>
                    <span className="text-emerald-400 font-bold">{autoSigmaTolerance === '6_SIGMA' ? '88%' : '80%'}</span>
                  </div>
                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] text-slate-500 block">Max Tombstone Angle:</span>
                    <span className="text-blue-400 font-bold">12.0°</span>
                  </div>
                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] text-slate-500 block">Solder Height Window:</span>
                    <span className="text-purple-400 font-bold">70 - 210 um</span>
                  </div>
                  <div className={`p-2 rounded border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] text-slate-500 block">Placement Tolerance:</span>
                    <span className="text-amber-400 font-bold">±0.08 mm</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          className={`p-4 sm:p-5 border-t flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {activeStep > 1 && (
              <button
                id="auto-teaching-prev-step-btn"
                onClick={() => setActiveStep((s) => s - 1)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Previous Step
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {activeStep < 4 ? (
              <button
                id="auto-teaching-next-step-btn"
                onClick={() => setActiveStep((s) => s + 1)}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <span>Proceed to Step {activeStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="deploy-auto-recipe-btn"
                onClick={handleDeployGeneratedRecipe}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Deploy & Activate Auto-Taught Recipe</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
