import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  Flame,
  Layers,
  PauseCircle,
  PlayCircle,
  Radio,
  RefreshCw,
  Send,
  ShieldAlert,
  Sliders,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import { SMTLineStatus, ThemeMode, LineOEEBreakdown, ShiftHandoverRecord, PCBBoard, InspectionRecipe } from '../../types/aoi';

interface CentralFleetDashboardProps {
  lines: SMTLineStatus[];
  activeLineId: string;
  onSelectLine: (lineId: string) => void;
  recipes: Record<string, InspectionRecipe>;
  currentBoard: PCBBoard;
  themeMode?: ThemeMode;
}

export const CentralFleetDashboard: React.FC<CentralFleetDashboardProps> = ({
  lines,
  activeLineId,
  onSelectLine,
  recipes,
  currentBoard,
  themeMode = 'dark',
}) => {
  const isDark = themeMode === 'dark';
  const [activeSubTab, setActiveSubTab] = useState<'oeeFleet' | 'recipeSync' | 'shiftHandover'>('oeeFleet');
  const [selectedFleetLine, setSelectedFleetLine] = useState<string>(activeLineId);
  const [interlockModalLine, setInterlockModalLine] = useState<string | null>(null);
  const [broadcastRecipeModel, setBroadcastRecipeModel] = useState<string>('ECU-2026-AUTO');
  const [targetLinesForSync, setTargetLinesForSync] = useState<string[]>(['LINE-01', 'LINE-02', 'LINE-03']);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null);

  // Line OEE State
  const [oeeData, setOeeData] = useState<Record<string, LineOEEBreakdown>>({
    'LINE-01': {
      lineId: 'LINE-01',
      availabilityPct: 96.4,
      performancePct: 94.2,
      qualityPct: 99.2,
      oeeTotalPct: 89.9,
      operatingMinutes: 460,
      plannedDowntimeMin: 20,
      unplannedDowntimeMin: 8,
      targetCount: 1400,
      actualCount: 1342,
      defectCount: 11,
      interlockStatus: 'NORMAL',
      currentRecipeVersion: 'v2.5.4',
    },
    'LINE-02': {
      lineId: 'LINE-02',
      availabilityPct: 98.1,
      performancePct: 97.5,
      qualityPct: 99.8,
      oeeTotalPct: 95.4,
      operatingMinutes: 472,
      plannedDowntimeMin: 15,
      unplannedDowntimeMin: 0,
      targetCount: 1600,
      actualCount: 1580,
      defectCount: 3,
      interlockStatus: 'NORMAL',
      currentRecipeVersion: 'v2.5.4',
    },
    'LINE-03': {
      lineId: 'LINE-03',
      availabilityPct: 88.5,
      performancePct: 85.0,
      qualityPct: 96.5,
      oeeTotalPct: 72.6,
      operatingMinutes: 410,
      plannedDowntimeMin: 30,
      unplannedDowntimeMin: 25,
      targetCount: 900,
      actualCount: 780,
      defectCount: 27,
      interlockStatus: 'WARNING_PPM',
      currentRecipeVersion: 'v2.4.9',
    },
  });

  // Shift Handover Log State
  const [shiftRecords, setShiftRecords] = useState<ShiftHandoverRecord[]>([
    {
      id: 'HO-20260818-D',
      timestamp: '2026-08-18 20:00:00',
      outgoingShift: 'Shift A (Day: 08:00-20:00)',
      incomingShift: 'Shift B (Night: 20:00-08:00)',
      outgoingSupervisor: 'Park Min-Seok (Process Lead)',
      incomingSupervisor: 'Kim Dong-Hoon (Night Lead)',
      lineId: 'LINE-01 & LINE-02',
      boardModel: 'ECU-2026-AUTO',
      shiftProductionCount: 2922,
      shiftDefectCount: 14,
      pendingReworkUnits: 3,
      activeEquipmentAlerts: [
        'Line 3 Screen Printer Squeegee blade #2 wear alert (replace within 48h)',
        'Line 1 Feeder slot #14 0402 reel splice completed at 16:40',
      ],
      maintenanceRemarks: 'Line 2 passed AEC-Q100 audit with zero escape defects. Line 3 recipe requires v2.5.4 update.',
      signedOff: true,
    },
  ]);

  const [newHandoverNotes, setNewHandoverNotes] = useState('');
  const [newSupervisorName, setNewSupervisorName] = useState('Lee Jung-Woo');

  // Broadcast Recipe to Fleet
  const handleBroadcastRecipe = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setOeeData((prev) => {
        const updated = { ...prev };
        targetLinesForSync.forEach((lid) => {
          if (updated[lid]) {
            updated[lid] = { ...updated[lid], currentRecipeVersion: 'v2.5.4' };
          }
        });
        return updated;
      });
      setSyncSuccessToast(`마스터 레시피 [${broadcastRecipeModel} v2.5.4]가 ${targetLinesForSync.join(', ')}에 즉각 무중단 동기화되었습니다.`);
      setTimeout(() => setSyncSuccessToast(null), 5000);
    }, 1200);
  };

  // Toggle Line Interlock
  const handleToggleInterlock = (lineId: string) => {
    setOeeData((prev) => {
      const current = prev[lineId];
      if (!current) return prev;
      const nextStatus = current.interlockStatus === 'EMERGENCY_STOP' ? 'NORMAL' : 'EMERGENCY_STOP';
      return {
        ...prev,
        [lineId]: {
          ...current,
          interlockStatus: nextStatus,
        },
      };
    });
    setInterlockModalLine(null);
  };

  // Add Handover Log
  const handleAddHandover = () => {
    if (!newHandoverNotes.trim()) return;
    const newRecord: ShiftHandoverRecord = {
      id: `HO-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      outgoingShift: 'Shift A (Day: 08:00-20:00)',
      incomingShift: 'Shift B (Night: 20:00-08:00)',
      outgoingSupervisor: newSupervisorName,
      incomingSupervisor: 'Next Lead Assigned',
      lineId: selectedFleetLine,
      boardModel: currentBoard.model,
      shiftProductionCount: oeeData[selectedFleetLine]?.actualCount || 1200,
      shiftDefectCount: oeeData[selectedFleetLine]?.defectCount || 5,
      pendingReworkUnits: 2,
      activeEquipmentAlerts: ['Routine optical glass calibration verified.'],
      maintenanceRemarks: newHandoverNotes,
      signedOff: true,
    };
    setShiftRecords([newRecord, ...shiftRecords]);
    setNewHandoverNotes('');
  };

  return (
    <div
      id="central-fleet-dashboard"
      className={`h-full w-full flex flex-col overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <div
        className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold">SMT 다중 라인 원격 중앙 관제 센터 (Fleet Control)</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Phase 3.1 Live Fleet Central
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              공장 내 모든 SMT AOI 검사 라인의 종합 설비 효율(OEE), 직통율(FPY), 레시피 플릿 배포 및 교대 인수인계를 통합 관리합니다.
            </p>
          </div>
        </div>

        {/* Global Summary Badges */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 ${
            isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-300'
          }`}>
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>가동 중 라인: <strong className="text-emerald-400">3 / 3 Lines</strong></span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 ${
            isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-300'
          }`}>
            <Zap className="w-4 h-4 text-amber-400" />
            <span>플릿 평균 OEE: <strong className="text-cyan-400">86.0%</strong></span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div
        className={`px-6 pt-3 border-b flex space-x-6 shrink-0 ${
          isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-white'
        }`}
      >
        <button
          type="button"
          onClick={() => setActiveSubTab('oeeFleet')}
          className={`pb-3 px-1 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'oeeFleet'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>라인별 실시간 OEE 및 텔레메트리</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('recipeSync')}
          className={`pb-3 px-1 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'recipeSync'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>마스터 레시피 플릿 일괄 배포</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('shiftHandover')}
          className={`pb-3 px-1 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'shiftHandover'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>교대 근무 인수인계 관리 (Shift Handover)</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Sync Toast Notification */}
        {syncSuccessToast && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center space-x-3 text-xs font-bold animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{syncSuccessToast}</span>
          </div>
        )}

        {/* Tab 1: Line OEE Telemetry Grid */}
        {activeSubTab === 'oeeFleet' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {lines.map((line) => {
                const lineOEE = oeeData[line.id] || oeeData['LINE-01'];
                const isSelected = selectedFleetLine === line.id;
                const isInterlocked = lineOEE.interlockStatus === 'EMERGENCY_STOP';
                const isWarning = lineOEE.interlockStatus === 'WARNING_PPM';

                return (
                  <div
                    key={line.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                      isInterlocked
                        ? 'bg-red-950/40 border-red-500/70 shadow-lg shadow-red-950/40'
                        : isWarning
                        ? 'bg-amber-950/20 border-amber-500/50 shadow-md'
                        : isDark
                        ? isSelected
                          ? 'bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-950/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        : isSelected
                        ? 'bg-blue-50/50 border-blue-400 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                          <h3 className="font-extrabold text-sm tracking-tight">{line.name}</h3>
                        </div>

                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                            isInterlocked
                              ? 'bg-red-500/20 text-red-400 border-red-500/40'
                              : isWarning
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          }`}
                        >
                          {isInterlocked ? 'EMERGENCY STOP' : isWarning ? 'WARNING (PPM)' : 'RUNNING NORMAL'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs mb-4">
                        <span className="text-slate-400 font-mono text-[11px]">모델: {line.currentModel}</span>
                        <span className="text-xs font-mono text-cyan-400 font-bold">레시피: {lineOEE.currentRecipeVersion}</span>
                      </div>

                      {/* Total OEE Hero Stat */}
                      <div className={`p-4 rounded-xl border mb-4 ${
                        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-xs text-slate-400 font-semibold">종합 설비 효율 (OEE)</span>
                          <span className="text-2xl font-black font-mono text-cyan-400">{lineOEE.oeeTotalPct}%</span>
                        </div>

                        {/* OEE 3-Component Progress Bars */}
                        <div className="space-y-2 mt-3 text-[11px] font-mono">
                          <div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>가동률 (Availability):</span>
                              <strong className="text-slate-200">{lineOEE.availabilityPct}%</strong>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${lineOEE.availabilityPct}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>성능 효율 (Performance):</span>
                              <strong className="text-slate-200">{lineOEE.performancePct}%</strong>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${lineOEE.performancePct}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>품질 직통율 (FPY Quality):</span>
                              <strong className="text-emerald-400">{lineOEE.qualityPct}%</strong>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${lineOEE.qualityPct}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Line Counts & Defect Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                        <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className="text-[10px] text-slate-400 block font-sans">생산 실적 (Actual/Target)</span>
                          <span className="font-extrabold text-slate-200">{lineOEE.actualCount} / {lineOEE.targetCount}</span>
                        </div>

                        <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <span className="text-[10px] text-slate-400 block font-sans">누적 결함수 (Defects)</span>
                          <span className={`font-extrabold ${lineOEE.defectCount > 15 ? 'text-red-400' : 'text-slate-200'}`}>
                            {lineOEE.defectCount} EA
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedFleetLine(line.id);
                          onSelectLine(line.id);
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md'
                            : isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isSelected ? '현재 관제 라인 선택됨' : '관제 라인 전환'}
                      </button>

                      <button
                        onClick={() => handleToggleInterlock(line.id)}
                        className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                          isInterlocked
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                        }`}
                        title={isInterlocked ? '인터락 해제 및 재가동' : '원격 비상 라인 정지 (Interlock)'}
                      >
                        {isInterlocked ? <PlayCircle className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Master Recipe Fleet Broadcast */}
        {activeSubTab === 'recipeSync' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Recipe Broadcast Config */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-sm font-bold flex items-center space-x-2">
                <Send className="w-4 h-4 text-blue-400" />
                <span>마스터 검사 레시피 플릿 일괄 배포</span>
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                품질 부서에서 최종 승인된 골든 검사 파라미터를 복수 SMT 라인의 AOI 머신으로 실시간 무중단 동기화합니다.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">배포할 마스터 레시피 모델:</label>
                  <select
                    value={broadcastRecipeModel}
                    onChange={(e) => setBroadcastRecipeModel(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="ECU-2026-AUTO">ECU-2026-AUTO (Rev 4.2 - Automotive Class 3)</option>
                    <option value="PHONE-MB-2026">PHONE-MB-2026 (Rev 2.1 - High-Density 0201)</option>
                    <option value="SERVER-BLADE-V4">SERVER-BLADE-V4 (Rev 5.0 - Multi-BGA)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5">동기화 대상 라인 선택:</label>
                  <div className="space-y-2">
                    {lines.map((l) => (
                      <label
                        key={l.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs ${
                          targetLinesForSync.includes(l.id)
                            ? isDark
                              ? 'bg-blue-950/30 border-blue-500 text-blue-300'
                              : 'bg-blue-50 border-blue-300 text-blue-800'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={targetLinesForSync.includes(l.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTargetLinesForSync([...targetLinesForSync, l.id]);
                              } else {
                                setTargetLinesForSync(targetLinesForSync.filter((id) => id !== l.id));
                              }
                            }}
                            className="rounded border-slate-700 text-blue-600 focus:ring-0"
                          />
                          <span className="font-bold">{l.name}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">현재 버전: {oeeData[l.id]?.currentRecipeVersion || 'v2.4.9'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleBroadcastRecipe}
                  disabled={isSyncing || targetLinesForSync.length === 0}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-950/30 transition-all disabled:opacity-50"
                >
                  <Send className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                  <span>{isSyncing ? '플릿 동기화 패킷 전송 중...' : `선택된 ${targetLinesForSync.length}개 라인에 레시피 일괄 배포`}</span>
                </button>
              </div>
            </div>

            {/* Right: Recipe Version Integrity Check */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-sm font-bold flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>레시피 파라미터 무결성 &amp; 안전 검증 (Integrity Check)</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[11px] font-bold text-slate-400 block">QFP / BGA 솔더 브릿지 감지 임계치</span>
                  <span className="font-mono font-extrabold text-cyan-400 text-sm">Gap Threshold: 45 µm (Class 3 엄격 기준)</span>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[11px] font-bold text-slate-400 block">0402 / 0201 칩 톰스톤 기립 각도 컷오프</span>
                  <span className="font-mono font-extrabold text-amber-400 text-sm">Max Angle: 6.2 deg (AEC-Q100 호환)</span>
                </div>

                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[11px] font-bold text-slate-400 block">다각 조명 프로파일</span>
                  <span className="font-mono font-extrabold text-blue-400 text-sm">Top Coaxial (85%) + High Red (70%) + Mid Green (40%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Shift Handover Management */}
        {activeSubTab === 'shiftHandover' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Create Handover (Cols 5) */}
            <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-sm font-bold flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>교대 근무 인수인계 전자 서명</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">인계 작업자 / 라인 책임자:</label>
                  <input
                    type="text"
                    value={newSupervisorName}
                    onChange={(e) => setNewSupervisorName(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">인수인계 특이사항 및 설비 점검 메모:</label>
                  <textarea
                    rows={4}
                    value={newHandoverNotes}
                    onChange={(e) => setNewHandoverNotes(e.target.value)}
                    placeholder="예: Line 3 스퀴지 블레이드 마모 주의, 잔여 리워크 2건 Shift B 전달, 야간 생산 수량 1,500대 목표 등..."
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  />
                </div>

                <button
                  onClick={handleAddHandover}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>인수인계 로그 등록 및 전자 서명 완료</span>
                </button>
              </div>
            </div>

            {/* Right Column: Handover History Logs (Cols 7) */}
            <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-4 overflow-y-auto ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-sm font-bold flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>최근 인수인계 이력 로그 ({shiftRecords.length})</span>
              </h3>

              <div className="space-y-3">
                {shiftRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-4 rounded-xl border space-y-2 text-xs ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-400">{rec.outgoingShift} → {rec.incomingShift}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{rec.timestamp}</span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      인계자: <strong className="text-slate-200">{rec.outgoingSupervisor}</strong> | 인수자:{' '}
                      <strong className="text-slate-200">{rec.incomingSupervisor}</strong>
                    </div>

                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {rec.maintenanceRemarks}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                      <span>생산 실적: {rec.shiftProductionCount}대 (불량 {rec.shiftDefectCount}대)</span>
                      <span className="text-emerald-400 font-bold">✓ 전자 서명 완료</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
