import React, { useState } from 'react';
import {
  Wrench,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  Flame,
  Layers,
  RefreshCw,
  Send,
  ShieldAlert,
  Sliders,
  Sparkles,
  Zap,
  TrendingDown,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { ThemeMode, SMTLineStatus } from '../../types/aoi';
import {
  INITIAL_NOZZLES,
  INITIAL_SQUEEGEE,
  INITIAL_REFLOW_ZONES,
  INITIAL_PDM_ALERTS,
} from '../../mock/autotunePdmData';

interface PredictiveMaintenanceDashboardProps {
  activeLine: SMTLineStatus;
  themeMode?: ThemeMode;
}

export const PredictiveMaintenanceDashboard: React.FC<PredictiveMaintenanceDashboardProps> = ({
  activeLine,
  themeMode = 'dark',
}) => {
  const isDark = themeMode === 'dark';

  const [nozzles, setNozzles] = useState(INITIAL_NOZZLES);
  const [squeegee, setSqueegee] = useState(INITIAL_SQUEEGEE);
  const [reflowZones, setReflowZones] = useState(INITIAL_REFLOW_ZONES);
  const [alerts, setAlerts] = useState(INITIAL_PDM_ALERTS);
  const [activePdMTab, setActivePdMTab] = useState<'overview' | 'mounterNozzles' | 'spiSqueegee' | 'reflowOven'>('overview');
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Replace/Clean Nozzle Handler
  const handleServiceNozzle = (nozzleId: number) => {
    setNozzles((prev) =>
      prev.map((n) =>
        n.nozzleId === nozzleId
          ? {
              ...n,
              currentVacuumKPa: -94.8,
              pickupFailureCount24h: 0,
              wearPercentage: 0,
              remainingUsefulHours: 1000,
              status: 'HEALTHY',
              lastCleanedDate: new Date().toISOString().split('T')[0],
            }
          : n
      )
    );
    setActionToast(`노즐 #${nozzleId}의 신품 교체 및 초음파 세척/진공 교정이 완료되었습니다.`);
    setTimeout(() => setActionToast(null), 4000);
  };

  // Dispatch Work Order
  const handleDispatchWorkOrder = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, autoWorkOrderCreated: true } : a))
    );
    setActionToast(`설비 보전 작업지시서(Work Order)가 MES 정비팀으로 즉각 전송되었습니다.`);
    setTimeout(() => setActionToast(null), 4000);
  };

  // Calibrate Squeegee
  const handleCalibrateSqueegee = () => {
    setSqueegee((prev) => ({
      ...prev,
      leftRightPressureDeltaKg: 0.05,
      status: 'NORMAL',
    }));
    setActionToast('스크린프린터 스퀴지 좌우 텐션 자동 밸런싱 교정이 완료되었습니다.');
    setTimeout(() => setActionToast(null), 4000);
  };

  return (
    <div
      id="predictive-maintenance-dashboard"
      className={`h-full w-full flex flex-col overflow-y-auto transition-colors p-6 space-y-6 ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <div
        className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 shrink-0 transition-colors ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-700 text-white shadow-lg shadow-rose-600/20">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold">3.4 SMT 설비 예지보전 & 수명 예측 (PdM Telemetry)</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Predictive Maintenance
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              장착기 노즐 진공압력, 스퀴지 마모도, 리플로우 오븐 히터/팬 진동 텔레메트리를 분석하여 설비 고장 및 자재 손실을 사전 차단합니다.
            </p>
          </div>
        </div>

        {/* Global Health Index Badge */}
        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-xl border flex items-center space-x-3 ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'
          }`}>
            <Activity className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">전체 설비 건전도 (Health Index)</div>
              <div className="text-sm font-bold font-mono text-emerald-400">91.4 / 100 pts (정상 가동)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toast */}
      {actionToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{actionToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionToast(null)}
            className="text-emerald-400 hover:text-white text-xs cursor-pointer font-bold px-2"
          >
            닫기
          </button>
        </div>
      )}

      {/* Sub Tabs */}
      <div
        className={`px-3 py-2 rounded-xl border flex space-x-2 shrink-0 text-xs font-bold ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <button
          type="button"
          onClick={() => setActivePdMTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
            activePdMTab === 'overview'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>예지정비 알람 & 잔여 수명(RUL)</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePdMTab('mounterNozzles')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
            activePdMTab === 'mounterNozzles'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>마운터 12-노즐 진공 & 마모 매트릭스</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePdMTab('spiSqueegee')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
            activePdMTab === 'spiSqueegee'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>SPI 스퀴지 날 수명 & 압력 편차</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePdMTab('reflowOven')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
            activePdMTab === 'reflowOven'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>리플로우 10-존 히터 & 모터 진동</span>
        </button>
      </div>

      {/* Tab 1: Overview & Active Alerts */}
      {activePdMTab === 'overview' && (
        <div className="space-y-6">
          {/* Active PdM Alerts List */}
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm">실시간 설비 예지정비 긴급 처방 알람 (PdM Actionable Alerts)</h3>
              </div>
              <span className="text-xs text-rose-400 font-mono font-bold">
                {alerts.filter((a) => !a.autoWorkOrderCreated).length}건 조치 대기
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                    alt.severity === 'CRITICAL'
                      ? isDark ? 'bg-rose-950/30 border-rose-800/60' : 'bg-rose-50 border-rose-200'
                      : alt.severity === 'WARNING'
                      ? isDark ? 'bg-amber-950/30 border-amber-800/60' : 'bg-amber-50 border-amber-200'
                      : isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        alt.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : alt.severity === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {alt.severity}
                      </span>
                      <span className="text-xs font-bold">{alt.title}</span>
                      <span className="text-[11px] font-mono text-slate-400">({alt.componentTag})</span>
                    </div>

                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <strong>예상 영향:</strong> {alt.impactIfIgnored}
                    </p>
                    <p className="text-xs text-blue-400 font-medium">
                      <strong>권고 조치:</strong> {alt.prescribedAction}
                    </p>
                  </div>

                  {/* RUL & Action Button */}
                  <div className="flex items-center space-x-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">잔여 유효 수명 (RUL)</span>
                      <span className={`text-base font-bold font-mono ${alt.estimatedRULHours < 24 ? 'text-rose-400' : 'text-amber-400'}`}>
                        {alt.estimatedRULHours}시간 후 고장 예측
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDispatchWorkOrder(alt.id)}
                      disabled={alt.autoWorkOrderCreated}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                        alt.autoWorkOrderCreated
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                      }`}
                    >
                      {alt.autoWorkOrderCreated ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>정비 오더 발령됨</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>1-Click MES 정비 발령</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Mounter 12-Nozzle Grid */}
      {activePdMTab === 'mounterNozzles' && (
        <div
          className={`p-5 rounded-2xl border space-y-4 ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm">마운터 12개 흡착 노즐 진공 압력 및 마모 상태 매트릭스</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              기준 진공 규격: -85.0 ~ -95.0 kPa
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {nozzles.map((noz) => (
              <div
                key={noz.nozzleId}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  noz.status === 'REPLACE_REQUIRED'
                    ? isDark ? 'bg-rose-950/40 border-rose-700/80 ring-1 ring-rose-500/30' : 'bg-rose-50 border-rose-300'
                    : noz.status === 'WARNING'
                    ? isDark ? 'bg-amber-950/30 border-amber-700/60' : 'bg-amber-50 border-amber-300'
                    : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs">Nozzle #{noz.nozzleId}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      noz.status === 'REPLACE_REQUIRED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : noz.status === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {noz.status === 'REPLACE_REQUIRED' ? '교체 요망' : noz.status === 'WARNING' ? '주의' : '양호'}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">진공압력:</span>
                      <strong className={noz.currentVacuumKPa > -85 ? 'text-rose-400' : 'text-emerald-400'}>
                        {noz.currentVacuumKPa} kPa
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">자재 낙하(24h):</span>
                      <strong className={noz.pickupFailureCount24h > 10 ? 'text-rose-400' : 'text-slate-200'}>
                        {noz.pickupFailureCount24h}회
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">마모도:</span>
                      <strong className={noz.wearPercentage > 75 ? 'text-rose-400' : 'text-amber-400'}>
                        {noz.wearPercentage}%
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">잔여 수명:</span>
                      <strong className="text-cyan-400">{noz.remainingUsefulHours}h</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleServiceNozzle(noz.nozzleId)}
                  className={`w-full py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    noz.status === 'REPLACE_REQUIRED'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                      : isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  {noz.status === 'REPLACE_REQUIRED' ? '신품 즉시 교체' : '초음파 세척'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: SPI Squeegee Blade */}
      {activePdMTab === 'spiSqueegee' && (
        <div
          className={`p-5 rounded-2xl border space-y-4 ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm">스크린프린터 메탈 스퀴지 날(Blade) 마모도 & 압력 프로파일</h3>
            </div>
            <button
              type="button"
              onClick={handleCalibrateSqueegee}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
            >
              1-Click 텐션 자동 밸런싱 교정
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-xs text-slate-400 font-semibold mb-1">인쇄 스트로크 누적 횟수</div>
              <div className="text-2xl font-bold font-mono text-cyan-400">
                {squeegee.currentPrintCycles.toLocaleString()} / {squeegee.maxRatedCycles.toLocaleString()}
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 mt-3 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: `${(squeegee.currentPrintCycles / squeegee.maxRatedCycles) * 100}%` }}
                />
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-xs text-slate-400 font-semibold mb-1">스퀴지 엣지 마모 깊이 (Wear Depth)</div>
              <div className="text-2xl font-bold font-mono text-amber-400">{squeegee.bladeEdgeWearMm} mm</div>
              <div className="text-[11px] text-slate-400 mt-2">교체 권고 한계치: 0.25 mm</div>
            </div>

            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-xs text-slate-400 font-semibold mb-1">좌/우 인쇄 압력 편차 (Left/Right Delta)</div>
              <div className={`text-2xl font-bold font-mono ${squeegee.leftRightPressureDeltaKg > 0.2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {squeegee.leftRightPressureDeltaKg} kg
              </div>
              <div className="text-[11px] text-slate-400 mt-2">허용 편차: &lt;= 0.10 kg</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Reflow Oven 10-Zone */}
      {activePdMTab === 'reflowOven' && (
        <div
          className={`p-5 rounded-2xl border space-y-4 ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="font-bold text-sm">리플로우 오븐 10-Zone 열전대(TC) & 송풍 모터 진동 텔레메트리</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              납땜 피크 허용 공차: ±2.0°C
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {reflowZones.map((zone) => (
              <div
                key={zone.zoneIndex}
                className={`p-3.5 rounded-xl border transition-all ${
                  zone.status === 'DEGRADED'
                    ? isDark ? 'bg-rose-950/40 border-rose-700/80' : 'bg-rose-50 border-rose-300'
                    : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs">Zone #{zone.zoneIndex} ({zone.zoneType})</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    zone.status === 'DEGRADED'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {zone.status}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">설정/실측:</span>
                    <strong className="text-cyan-400">{zone.setpointTempC}°C / {zone.actualTempC}°C</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">온도 편차:</span>
                    <strong className={Math.abs(zone.tempDeltaC) > 2.0 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {zone.tempDeltaC > 0 ? `+${zone.tempDeltaC}` : zone.tempDeltaC}°C
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">히터 전류:</span>
                    <strong className="text-amber-400">{zone.heaterCurrentAmps} A</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">팬 진동:</span>
                    <strong className={zone.vibrationMmPerSec > 3.0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {zone.vibrationMmPerSec} mm/s
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
