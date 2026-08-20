import React, { useState, useEffect } from 'react';
import {
  X,
  Flame,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Activity,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  Thermometer,
  Layers,
  ArrowRight,
  HelpCircle,
  Cpu,
} from 'lucide-react';
import {
  PCBBoard,
  InspectionDefect,
  PCBComponent,
  ThemeMode,
  ReworkActionRecord,
} from '../../types/aoi';

interface ReworkRepairStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defect: InspectionDefect | null;
  board: PCBBoard;
  onCompleteRework: (reworkRecord: ReworkActionRecord, resolvedDefectId: string) => void;
  themeMode?: ThemeMode;
}

export const ReworkRepairStationModal: React.FC<ReworkRepairStationModalProps> = ({
  isOpen,
  onClose,
  defect,
  board,
  onCompleteRework,
  themeMode = 'dark',
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [currentTemp, setCurrentTemp] = useState<number>(245);
  const [targetTemp, setTargetTemp] = useState<number>(245);
  const [repairMethod, setRepairMethod] = useState<'HOT_AIR_REFLOW' | 'MICRO_SOLDERING_IRON' | 'SOLDER_WICK_EXTRACT' | 'REPLACE_COMPONENT'>('MICRO_SOLDERING_IRON');
  const [solderAlloy, setSolderAlloy] = useState<string>('SAC305 (Sn96.5/Ag3.0/Cu0.5 Lead-Free)');
  const [fluxType, setFluxType] = useState<string>('ROL0 No-Clean Synthetic Flux');
  const [operatorId, setOperatorId] = useState<string>('TECH-REWORK-402');
  const [operatorNotes, setOperatorNotes] = useState<string>('Cleaned solder bridge using 1.5mm desoldering braid and reflowed joints with SAC305 wire.');
  const [isHeating, setIsHeating] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'optical' | 'thermal' | 'ipc_guide'>('optical');
  const [isReinspecting, setIsReinspecting] = useState<boolean>(false);
  const [reinspectionResult, setReinspectionResult] = useState<'IDLE' | 'PASSED' | 'FAILED'>('IDLE');

  const isDark = themeMode === 'dark';

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Heating temperature jitter simulation
  useEffect(() => {
    if (isHeating) {
      const interval = setInterval(() => {
        setCurrentTemp(targetTemp + Math.floor(Math.random() * 5 - 2));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setCurrentTemp(25);
    }
  }, [isHeating, targetTemp]);

  if (!isOpen || !defect) return null;

  const component: PCBComponent | undefined = board.components.find(
    (c) => c.id === defect.componentId
  );

  const handleStartHeating = () => {
    setIsHeating(true);
    setIsTimerRunning(true);
  };

  const handleStopHeating = () => {
    setIsHeating(false);
    setIsTimerRunning(false);
  };

  const handleRunReinspection = () => {
    setIsReinspecting(true);
    setReinspectionResult('IDLE');

    setTimeout(() => {
      setIsReinspecting(false);
      setReinspectionResult('PASSED');
    }, 1800);
  };

  const handleFinalizeRework = () => {
    const record: ReworkActionRecord = {
      id: `RWK-${Date.now()}`,
      defectId: defect.id,
      componentRefDes: defect.componentRefDes,
      operatorId,
      timestamp: new Date().toISOString(),
      standard: 'IPC-7711',
      repairMethod,
      temperatureC: targetTemp,
      solderAlloy,
      fluxType,
      reworkDurationSec: timerSeconds || 45,
      postInspectionStatus: 'PASS',
      operatorNotes,
    };

    onCompleteRework(record, defect.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className={`border rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
          isDark
            ? 'bg-[#0f172a] border-slate-700 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 px-6 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-500 rounded-xl border border-amber-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span>IPC-7711 / 7721 Precision Soldering & Rework Station</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase font-mono">
                  Target: {defect.componentRefDes} ({defect.type})
                </span>
              </div>
              <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Smart Closed-Loop Soldering Bench | Station ID: REWORK-BENCH-04 | IPC Class 3 Standard
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center space-x-2 ${
              isHeating
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
                : isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <Thermometer className="w-4 h-4" />
              <span>Iron Temp: {currentTemp}°C</span>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Visual Microscopic / Thermal Inspection Canvas (7 Cols) */}
          <div className={`lg:col-span-7 p-5 flex flex-col border-r overflow-y-auto ${
            isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50/50'
          }`}>
            {/* View Mode Toolbar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setViewMode('optical')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    viewMode === 'optical'
                      ? 'bg-blue-600 text-white font-semibold shadow'
                      : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Microscopic Pad View
                </button>
                <button
                  onClick={() => setViewMode('thermal')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    viewMode === 'thermal'
                      ? 'bg-rose-600 text-white font-semibold shadow'
                      : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Thermal Profile (IR)
                </button>
                <button
                  onClick={() => setViewMode('ipc_guide')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    viewMode === 'ipc_guide'
                      ? 'bg-amber-600 text-white font-semibold shadow'
                      : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  IPC-7711 SOP Overlay
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                Mag: 50X Zoom | Phase Contrast
              </div>
            </div>

            {/* Simulated Microscopic Canvas */}
            <div className="relative w-full h-80 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center shadow-inner select-none">
              {/* Grid Background */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* PCB Substrate simulation */}
              <div className="relative w-72 h-56 rounded-lg bg-[#064e3b] border-2 border-emerald-600/60 p-4 flex flex-col justify-between items-center shadow-2xl">
                {/* Copper Traces */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-amber-500/30" />
                <div className="absolute bottom-4 left-6 right-6 h-0.5 bg-amber-500/30" />
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-amber-500/30" />

                {/* SMT Pads (Left & Right or Quad) */}
                <div className="w-full flex justify-between items-center px-4 my-auto relative">
                  {/* Left Pad */}
                  <div className="w-12 h-20 rounded bg-gradient-to-r from-amber-400 to-amber-200 border border-amber-300 shadow-md flex items-center justify-center">
                    <span className="text-[9px] font-mono text-slate-900 font-bold">PAD 1</span>
                  </div>

                  {/* Defective Component Body (e.g. SMT 0805 or IC) */}
                  <div className={`relative w-28 h-16 rounded-md shadow-2xl flex flex-col items-center justify-center border-2 transition-all ${
                    reinspectionResult === 'PASSED'
                      ? 'bg-slate-800 border-emerald-400'
                      : defect.type === 'TOMBSTONE'
                      ? 'bg-slate-800 border-rose-500 rotate-12 translate-y-[-10px]'
                      : 'bg-slate-800 border-rose-500'
                  }`}>
                    {/* Polarity Dot */}
                    <div className="absolute top-1.5 left-2 w-2 h-2 rounded-full bg-white/80" />
                    <span className="text-white font-mono font-bold text-xs">
                      {defect.componentRefDes}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {component?.nominalValue || '10uF 25V'}
                    </span>

                    {/* Defect Solder Bridge / Tombstone graphic */}
                    {defect.type === 'SOLDER_BRIDGE' && reinspectionResult !== 'PASSED' && (
                      <div className="absolute -bottom-3 left-6 w-16 h-4 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 rounded-full border border-rose-400 shadow-lg animate-pulse" />
                    )}
                  </div>

                  {/* Right Pad */}
                  <div className="w-12 h-20 rounded bg-gradient-to-r from-amber-200 to-amber-400 border border-amber-300 shadow-md flex items-center justify-center">
                    <span className="text-[9px] font-mono text-slate-900 font-bold">PAD 2</span>
                  </div>
                </div>

                {/* Thermal View Overlay */}
                {viewMode === 'thermal' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-rose-600/50 to-amber-400/60 mix-blend-color-dodge rounded-lg flex items-center justify-center pointer-events-none">
                    <div className="text-center font-mono text-xs text-white bg-black/60 px-3 py-1 rounded backdrop-blur-sm border border-rose-400/40">
                      <span className="text-rose-400 font-bold">Solder Joint Peak:</span> {currentTemp}°C
                    </div>
                  </div>
                )}

                {/* IPC SOP Guideline Overlay */}
                {viewMode === 'ipc_guide' && (
                  <div className="absolute inset-0 bg-amber-950/20 border-2 border-dashed border-amber-400/80 rounded-lg p-2 flex flex-col justify-between pointer-events-none">
                    <span className="text-[10px] font-mono bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold self-start">
                      IPC-7711 Sec 3.3.1: Lead Solder Extraction Zone
                    </span>
                    <div className="text-[10px] font-mono text-amber-300 text-right">
                      Max Contact Time: 4.5s
                    </div>
                  </div>
                )}
              </div>

              {/* Status Overlay Badge */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] font-mono">
                <span className="text-slate-400">Defect Flag: </span>
                <span className="text-rose-400 font-bold">{defect.title}</span>
              </div>

              {reinspectionResult === 'PASSED' && (
                <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-bold text-white">3D AOI Optical Re-Inspection: PASSED</div>
                  <div className="text-xs text-emerald-300 font-mono mt-0.5">
                    Wetting Angle: 38.5° | Fillet Height: 132um | IPC Class 3 Validated
                  </div>
                </div>
              )}
            </div>

            {/* Thermal & Reflow Profile Graph Bar */}
            <div className={`mt-4 p-3.5 rounded-xl border space-y-2.5 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span>Lead-Free Reflow Solder Profile (SAC305)</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Timer: {timerSeconds}s
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                <div className={`p-2 rounded border ${isHeating && timerSeconds < 10 ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 font-bold' : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <span>1. Preheat</span>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">150°C</div>
                </div>
                <div className={`p-2 rounded border ${isHeating && timerSeconds >= 10 && timerSeconds < 25 ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 font-bold' : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <span>2. Soak</span>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">180°C</div>
                </div>
                <div className={`p-2 rounded border ${isHeating && timerSeconds >= 25 && timerSeconds < 40 ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 font-bold' : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <span>3. Peak Reflow</span>
                  <div className="text-xs font-bold text-rose-400 mt-0.5">245°C</div>
                </div>
                <div className={`p-2 rounded border ${isHeating && timerSeconds >= 40 ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 font-bold' : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <span>4. Cool-down</span>
                  <div className="text-xs font-bold text-blue-400 mt-0.5">&lt; 100°C</div>
                </div>
              </div>

              {/* Heating Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400">Target Temp:</span>
                  <select
                    value={targetTemp}
                    onChange={(e) => setTargetTemp(Number(e.target.value))}
                    className={`px-2 py-1 rounded border text-xs font-mono ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value={220}>220°C (SnPb Eutectic)</option>
                    <option value={245}>245°C (SAC305 Lead-Free Standard)</option>
                    <option value={260}>260°C (High-Mass Ground Plane)</option>
                    <option value={350}>350°C (Hot Air Nozzle Max)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  {!isHeating ? (
                    <button
                      onClick={handleStartHeating}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow transition-colors"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Start Heat Profile</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopHeating}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Stop Heating</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: IPC Rework SOP Steps & Operator Sign-off (5 Cols) */}
          <div className="lg:col-span-5 p-5 flex flex-col justify-between overflow-y-auto space-y-4">
            {/* Step Navigation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  IPC-7711 SOP Steps
                </span>
                <span className="text-xs font-mono text-amber-500 font-bold">
                  Step {activeStep} of 4
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <button
                    key={step}
                    onClick={() => setActiveStep(step)}
                    className={`h-2 rounded-full transition-all ${
                      activeStep === step
                        ? 'bg-amber-500'
                        : activeStep > step
                        ? 'bg-emerald-500'
                        : isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Step Content */}
              {activeStep === 1 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">1</span>
                    <span>Flux Application & Surface Preparation</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Apply ROL0 / REL0 synthetic no-clean liquid flux or tacky paste flux across the damaged component leads to prevent oxidation during thermal desoldering.
                  </p>

                  <div className="space-y-2 pt-2 text-xs">
                    <label className="block text-slate-400 font-mono text-[11px]">Flux Chemistry:</label>
                    <select
                      value={fluxType}
                      onChange={(e) => setFluxType(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs ${
                        isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <option value="ROL0 No-Clean Synthetic Flux">ROL0 No-Clean Synthetic Flux (Alpha OM-338)</option>
                      <option value="Water-Soluble Organic Flux (ORH1)">Water-Soluble Organic Flux (ORH1)</option>
                      <option value="RMA Mildly Activated Rosin">RMA Mildly Activated Rosin (Kester 186)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">2</span>
                    <span>Desoldering & Solder Removal</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select tool to remove excessive solder bridges or lift misaligned components without applying mechanical force exceeding 0.5N.
                  </p>

                  <div className="space-y-2 pt-2 text-xs">
                    <label className="block text-slate-400 font-mono text-[11px]">Rework Tooling:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setRepairMethod('MICRO_SOLDERING_IRON')}
                        className={`p-2.5 rounded-lg border text-left text-xs font-semibold ${
                          repairMethod === 'MICRO_SOLDERING_IRON'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        Micro Soldering Iron
                      </button>
                      <button
                        onClick={() => setRepairMethod('HOT_AIR_REFLOW')}
                        className={`p-2.5 rounded-lg border text-left text-xs font-semibold ${
                          repairMethod === 'HOT_AIR_REFLOW'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        Hot Air Nozzle
                      </button>
                      <button
                        onClick={() => setRepairMethod('SOLDER_WICK_EXTRACT')}
                        className={`p-2.5 rounded-lg border text-left text-xs font-semibold ${
                          repairMethod === 'SOLDER_WICK_EXTRACT'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        Desoldering Braid / Wick
                      </button>
                      <button
                        onClick={() => setRepairMethod('REPLACE_COMPONENT')}
                        className={`p-2.5 rounded-lg border text-left text-xs font-semibold ${
                          repairMethod === 'REPLACE_COMPONENT'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        Component Replacement
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">3</span>
                    <span>Precision Solder Fillet Rebuild</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Form clean concave solder fillets with wetting angle &lt; 90° and lead coplanarity &lt; 50um in compliance with IPC-A-610 Class 3.
                  </p>

                  <div className="space-y-2 pt-2 text-xs">
                    <label className="block text-slate-400 font-mono text-[11px]">Solder Alloy Standard:</label>
                    <select
                      value={solderAlloy}
                      onChange={(e) => setSolderAlloy(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs ${
                        isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <option value="SAC305 (Sn96.5/Ag3.0/Cu0.5 Lead-Free)">SAC305 (Sn96.5/Ag3.0/Cu0.5 Lead-Free)</option>
                      <option value="Sn63/Pb37 Eutectic Solder Wire">Sn63/Pb37 Eutectic Solder Wire (Aerospace Only)</option>
                      <option value="SN100C Lead-Free Copper Alloy">SN100C Lead-Free Copper Alloy</option>
                    </select>
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">4</span>
                    <span>Automated Optical Re-Inspection & Traceability</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Trigger 3D AOI optical laser re-scan to certify that solder joint geometry and component orientation meet Class 3 requirements.
                  </p>

                  <div className="p-3 rounded-xl border bg-slate-950/60 border-slate-800 space-y-2">
                    <button
                      onClick={handleRunReinspection}
                      disabled={isReinspecting}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center justify-center space-x-2 shadow transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isReinspecting ? 'Re-inspecting with 3D Laser...' : 'Execute 3D AOI Optical Re-Inspection'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Operator Notes & Digital Sign-off */}
            <div className={`p-3.5 rounded-xl border space-y-2.5 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Operator Sign-off & MES Trace</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>IPC Certified</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block">Operator ID:</label>
                  <input
                    type="text"
                    value={operatorId}
                    onChange={(e) => setOperatorId(e.target.value)}
                    className={`w-full px-2 py-1 rounded border text-xs font-mono ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block">Rework Duration:</label>
                  <div className={`px-2 py-1 rounded border text-xs font-mono ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                  }`}>
                    {timerSeconds} seconds
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block">Rework Log Notes:</label>
                <textarea
                  rows={2}
                  value={operatorNotes}
                  onChange={(e) => setOperatorNotes(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-xs font-sans ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                />
              </div>
            </div>

            {/* Modal Bottom Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}
                disabled={activeStep === 1}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  activeStep === 1
                    ? 'opacity-40 cursor-not-allowed border-transparent'
                    : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-700'
                }`}
              >
                Previous Step
              </button>

              {activeStep < 4 ? (
                <button
                  onClick={() => setActiveStep((prev) => Math.min(prev + 1, 4))}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow transition-colors"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleFinalizeRework}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Rework & Release PCBA</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
