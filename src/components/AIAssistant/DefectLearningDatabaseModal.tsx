import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Brain,
  Zap,
  TrendingUp,
  ShieldCheck,
  Filter,
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  ArrowUpRight,
  Sliders,
  Send,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { DefectLearningRecord, ActiveLearningStats, ThemeMode, InspectionDefect } from '../../types/aoi';

interface DefectLearningDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode?: ThemeMode;
}

export const DefectLearningDatabaseModal: React.FC<DefectLearningDatabaseModalProps> = ({
  isOpen,
  onClose,
  themeMode = 'dark',
}) => {
  const isDark = themeMode === 'dark';
  const [activeTab, setActiveTab] = useState<'dataset' | 'activeLearning' | 'exportSync'>('dataset');
  const [records, setRecords] = useState<DefectLearningRecord[]>([]);
  const [metrics, setMetrics] = useState<ActiveLearningStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [reTrainProgress, setReTrainProgress] = useState(0);
  const [trainingMessage, setTrainingMessage] = useState('');
  const [filterDisposition, setFilterDisposition] = useState<string>('ALL');
  const [filterDefectType, setFilterDefectType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DefectLearningRecord | null>(null);
  const [exportFormat, setExportFormat] = useState<'json' | 'coco' | 'csv'>('coco');
  const [isExporting, setIsExporting] = useState(false);

  // Fetch defect records from server
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filterDisposition !== 'ALL') queryParams.append('disposition', filterDisposition);
      if (filterDefectType !== 'ALL') queryParams.append('defectType', filterDefectType);
      if (searchQuery) queryParams.append('search', searchQuery);

      const res = await fetch(`/api/defect-db/list?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
        setMetrics(data.metrics || null);
        if (data.records?.length > 0 && !selectedRecord) {
          setSelectedRecord(data.records[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching defect learning DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
    }
  }, [isOpen, filterDisposition, filterDefectType, searchQuery]);

  // Trigger Active Learning Re-Training
  const handleTriggerReTraining = async () => {
    setIsRetraining(true);
    setReTrainProgress(0);
    setTrainingMessage('Extracting sub-pixel optical features & 3D point cloud vectors...');

    const stages = [
      { p: 25, msg: 'Normalizing multi-angle RGB hue distribution & glare indices...' },
      { p: 55, msg: 'Running Gradient Boosted Active Learning loss minimization...' },
      { p: 80, msg: 'Tuning QFP/0402/BGA inspection algorithm decision boundaries...' },
      { p: 100, msg: 'Model Vision Core weights updated. Re-evaluating validation set...' },
    ];

    for (let i = 0; i < stages.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setReTrainProgress(stages[i].p);
      setTrainingMessage(stages[i].msg);
    }

    try {
      const res = await fetch('/api/defect-db/train-feedback', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        await fetchRecords();
      }
    } catch (err) {
      console.error('Failed to trigger training:', err);
    } finally {
      setIsRetraining(false);
    }
  };

  // Export dataset
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/defect-db/export?format=${exportFormat}`);
      const data = await res.json();
      const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonStr);
      downloadAnchor.setAttribute('download', `AOI_Defect_Training_Dataset_${exportFormat.toUpperCase()}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="defect-learning-db-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        className={`w-full max-w-6xl h-[88vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-700/80 text-slate-100 shadow-cyan-950/20'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">AI 결함 학습 DB & 검출력 자동 고도화 시스템</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  Live Auto-Learning Active
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                판정된 결함 및 가성 불량(False Call) 이미지를 실시간 데이터셋에 적재하여 검출 정확도를 자율 개선합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchRecords}
              className={`p-2 rounded-lg transition-colors text-xs font-semibold flex items-center space-x-1 ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="데이터 새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Continuous Active Learning KPI Stats Bar */}
        <div
          className={`px-6 py-3 border-b grid grid-cols-2 md:grid-cols-5 gap-3 text-xs ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-100/70'
          }`}
        >
          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 block font-semibold">학습 데이터셋 누적</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-base font-extrabold text-cyan-400">{metrics?.totalSamplesTrained || records.length}</span>
              <span className="text-[10px] text-slate-400">Samples</span>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 block font-semibold">결함 검출 정확도 (Recall)</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-base font-extrabold text-emerald-400">{metrics?.detectionRate || 99.42}%</span>
              <span className="text-[10px] text-emerald-500 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +0.08%
              </span>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 block font-semibold">가성 불량률 (False Alarm)</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-base font-extrabold text-amber-400">{metrics?.falseCallRate || 0.38}%</span>
              <span className="text-[10px] text-emerald-400 font-semibold">↓ -0.15% 개선</span>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 block font-semibold">유출 결함률 (Escape DPMO)</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-base font-extrabold text-blue-400">{metrics?.escapeRatePpm || 12}</span>
              <span className="text-[10px] text-slate-400">PPM (Target &lt; 20)</span>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 block font-semibold">활성 비전 코어 엔진</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-xs font-mono font-bold text-violet-400 truncate">
                {metrics?.currentModelVersion || 'AOI-Vision-v2.5'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className={`px-6 pt-3 border-b flex space-x-4 ${
            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={() => setActiveTab('dataset')}
            className={`pb-3 px-1 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'dataset'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>오류 및 가성불량 데이터 레이크 ({records.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('activeLearning')}
            className={`pb-3 px-1 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'activeLearning'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Active Learning & 검출력 최적화 엔진</span>
          </button>

          <button
            onClick={() => setActiveTab('exportSync')}
            className={`pb-3 px-1 text-xs font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'exportSync'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>데이터셋 내보내기 & 엣지 OTA 배포</span>
          </button>
        </div>

        {/* Tab 1: Dataset Lake Explorer */}
        {activeTab === 'dataset' && (
          <div className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 flex-1 min-w-[280px]">
                <div className={`relative flex-1 rounded-lg border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="RefDes (U1, C14), 패키지, 결함 유형 검색..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-transparent focus:outline-none"
                  />
                </div>

                <select
                  value={filterDisposition}
                  onChange={(e) => setFilterDisposition(e.target.value)}
                  className={`px-3 py-1.5 text-xs rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="ALL">모든 판정 상태</option>
                  <option value="CONFIRMED_DEFECT">실제 불량 (Confirmed NG)</option>
                  <option value="FALSE_CALL">가성 불량 (False Call)</option>
                  <option value="REWORK_COMPLETED">리워크 수리 완료</option>
                </select>

                <select
                  value={filterDefectType}
                  onChange={(e) => setFilterDefectType(e.target.value)}
                  className={`px-3 py-1.5 text-xs rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="ALL">모든 결함 유형</option>
                  <option value="SOLDER_BRIDGE">솔더 브릿지 (Bridge)</option>
                  <option value="TOMBSTONE">톰스톤 (Tombstone)</option>
                  <option value="INSUFFICIENT_SOLDER">납량 부족 (Insufficient)</option>
                  <option value="MISSING_COMPONENT">부품 미삽 (Missing)</option>
                  <option value="POLARITY_REVERSED">극성 역삽 (Polarity)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTriggerReTraining}
                  disabled={isRetraining}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
                  <span>{isRetraining ? '학습 가중치 최적화 중...' : '신규 샘플로 모델 재학습'}</span>
                </button>
              </div>
            </div>

            {/* Split View: Record List & Inspector */}
            <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
              {/* Record Cards (Cols 7) */}
              <div
                className={`col-span-7 rounded-xl border overflow-y-auto p-3 space-y-2.5 ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                {records.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <Database className="w-10 h-10 mb-2 opacity-40 text-cyan-400" />
                    <p className="text-xs font-semibold">조건에 일치하는 학습 데이터가 없습니다.</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      검사 스테이션에서 불량/가성불량을 판정하면 자동으로 이곳에 적재됩니다.
                    </p>
                  </div>
                ) : (
                  records.map((rec) => {
                    const isSelected = selectedRecord?.id === rec.id;
                    const isNG = rec.disposition === 'CONFIRMED_DEFECT';
                    const isFalseCall = rec.disposition === 'FALSE_CALL';

                    return (
                      <div
                        key={rec.id}
                        onClick={() => setSelectedRecord(rec)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-cyan-950/30 border-cyan-500/60 shadow-md shadow-cyan-950/30'
                              : 'bg-cyan-50 border-cyan-300 shadow-sm'
                            : isDark
                            ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-extrabold text-cyan-400">{rec.componentRefDes}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {rec.packageType}
                            </span>
                            <span className="text-xs font-semibold">{rec.defectType}</span>
                          </div>

                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                              isNG
                                ? 'bg-red-500/15 text-red-400 border-red-500/30'
                                : isFalseCall
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            }`}
                          >
                            {isNG ? 'Confirmed NG' : isFalseCall ? 'False Call (양품)' : 'Reworked'}
                          </span>
                        </div>

                        <p className={`text-[11px] mt-1.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {rec.operatorNotes || '자동 적재된 검사 샘플'}
                        </p>

                        <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] ${
                          isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                        }`}>
                          <div className="flex items-center space-x-2 font-mono">
                            <span>신뢰도: {(rec.aiConfidenceBefore * 100).toFixed(0)}% → {(rec.aiConfidenceAfter * 100).toFixed(0)}%</span>
                            <span>•</span>
                            <span>{rec.opticalLighting}</span>
                          </div>

                          <span className={`px-1.5 py-0.5 rounded font-mono ${
                            rec.trainingStatus === 'TRAINED_OPTIMIZED'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-amber-400 bg-amber-500/10'
                          }`}>
                            {rec.trainingStatus === 'TRAINED_OPTIMIZED' ? '✓ 모델 반영 완료' : '대기열 적재'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Detail Inspector Panel (Cols 5) */}
              <div
                className={`col-span-5 rounded-xl border p-4 flex flex-col justify-between overflow-y-auto ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                {selectedRecord ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">{selectedRecord.id}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(selectedRecord.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold mt-1 flex items-center space-x-2">
                        <span>{selectedRecord.componentRefDes}</span>
                        <span className="text-xs text-slate-400 font-normal">({selectedRecord.packageType})</span>
                        <span className="text-xs text-cyan-400 font-semibold">• {selectedRecord.defectType}</span>
                      </h3>
                    </div>

                    {/* Optical & Feature Extraction Card */}
                    <div className={`p-3 rounded-xl border text-xs space-y-2 ${
                      isDark ? 'bg-slate-900 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className="text-[11px] font-bold text-cyan-400 flex items-center">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        추출된 광학 특성 벡터 (Optical Feature Vectors)
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">글레어 반사 지수:</span>
                          <span className="font-mono font-bold">{selectedRecord.features.glareIndex}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">엣지 대비도 (Contrast):</span>
                          <span className="font-mono font-bold">{selectedRecord.features.edgeContrast}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">대칭성 점수:</span>
                          <span className="font-mono font-bold">{selectedRecord.features.symmetryScore}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">우세 조명 채널:</span>
                          <span className="font-mono text-[10px] truncate">{selectedRecord.features.rgbHueDominance}</span>
                        </div>
                      </div>
                    </div>

                    {/* 3D Profilometry Measurements */}
                    <div className={`p-3 rounded-xl border text-xs space-y-2 ${
                      isDark ? 'bg-slate-900 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className="text-[11px] font-bold text-blue-400 flex items-center">
                        <Sliders className="w-3.5 h-3.5 mr-1" />
                        3D 정밀 계측값 (Ground-Truth Metrics)
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">솔더 높이:</span>
                          <span className="font-mono font-bold">{selectedRecord.measuredMetrics.solderHeightUm || 140} µm</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">접촉각 (Wetting):</span>
                          <span className="font-mono font-bold">{selectedRecord.measuredMetrics.wettingAngleDeg || 45}°</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">리드 코플래너리티:</span>
                          <span className="font-mono font-bold">{selectedRecord.measuredMetrics.leadCoplanarityUm || 18} µm</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">솔더 체적율:</span>
                          <span className="font-mono font-bold">{selectedRecord.measuredMetrics.solderVolumePct || 105}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Operator Disposition Details */}
                    <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      isDark ? 'bg-slate-900 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className="text-[11px] font-bold text-amber-400 flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                        작업자 최종 판정 &amp; 소견
                      </span>
                      <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {selectedRecord.operatorNotes}
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono pt-1">
                        판정 작업자: {selectedRecord.operatorId}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                    샘플을 선택하여 상세 정보를 확인하세요.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Active Learning & Detection Power Optimizer */}
        {activeTab === 'activeLearning' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Re-training simulation & Progress */}
              <div className={`p-5 rounded-xl border space-y-4 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>실시간 Active Learning 가중치 최적화</span>
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400">Continuous Loop</span>
                </div>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  현장 작업자가 '가성 불량(False Call)' 또는 '진성 불량(Confirmed NG)'으로 라벨링한 데이터셋을 바탕으로,
                  조명 반사 간섭 필터 및 높이 임계치 알고리즘을 자동 재조정합니다.
                </p>

                {isRetraining && (
                  <div className="space-y-2 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs">
                    <div className="flex justify-between font-mono text-[11px] text-cyan-400 font-bold">
                      <span>{trainingMessage}</span>
                      <span>{reTrainProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                        style={{ width: `${reTrainProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleTriggerReTraining}
                  disabled={isRetraining}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-950/40 transition-all disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
                  <span>{isRetraining ? '신규 데이터셋 학습 최적화 실행 중...' : '신규 판정 데이터셋 즉각 학습 (Model Re-Train)'}</span>
                </button>

                <div className="border-t pt-3 space-y-2 text-xs">
                  <span className="font-bold text-[11px] text-slate-400 block">검출력 개선 성과 요약</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <span className="block text-[10px]">진성 결함 포착률 (Recall):</span>
                      <span className="font-extrabold text-sm font-mono">99.42% → 99.95%</span>
                    </div>
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <span className="block text-[10px]">가성 알람률 (False Calls):</span>
                      <span className="font-extrabold text-sm font-mono">0.38% → 0.12%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Algorithm Parameters Tuning Table */}
              <div className={`p-5 rounded-xl border space-y-4 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-sm font-bold flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>자동 튜닝된 검사 파라미터 가중치</span>
                </h3>

                <div className="space-y-2.5">
                  {(metrics?.weightsOptimized || [
                    { parameter: 'QFP_Lead_Bridge_Threshold', oldVal: 0.65, newVal: 0.94, gain: '+29%' },
                    { parameter: '0402_Flux_Glare_Suppression', oldVal: 0.45, newVal: 0.97, gain: '+52%' },
                    { parameter: 'BGA_Coplanarity_Z_Weight', oldVal: 0.55, newVal: 0.93, gain: '+38%' },
                    { parameter: 'Tombstone_Tilt_Angle_Cutoff', oldVal: '12 deg', newVal: '6.2 deg', gain: '+48%' },
                  ]).map((w, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-bold text-cyan-400 block text-[11px]">{w.parameter}</span>
                        <span className="text-[10px] text-slate-400">
                          이전: {w.oldVal} → <strong className="text-emerald-400">신규: {w.newVal}</strong>
                        </span>
                      </div>

                      <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold font-mono">
                        {w.gain} 개선
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Dataset Export & Edge Fleet OTA Sync */}
        {activeTab === 'exportSync' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dataset Export Box */}
              <div className={`p-5 rounded-xl border space-y-4 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-sm font-bold flex items-center space-x-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>딥러닝 학습용 데이터셋 내보내기</span>
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  축적된 결함 및 가성불량 ROI 어노테이션 데이터를 외부 AI 프레임워크(PyTorch, YOLOv8/v10, Detectron2) 학습 규격으로 내보냅니다.
                </p>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block">포맷 선택:</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['coco', 'json', 'csv'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setExportFormat(fmt)}
                        className={`py-2 px-3 rounded-lg border font-bold uppercase text-[11px] transition-all ${
                          exportFormat === fmt
                            ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            : 'bg-slate-100 border-slate-300 text-slate-600'
                        }`}
                      >
                        {fmt === 'coco' ? 'COCO JSON' : fmt === 'json' ? 'Raw JSON' : 'CSV Matrix'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{isExporting ? '데이터셋 생성 중...' : `데이터셋 다운로드 (${exportFormat.toUpperCase()})`}</span>
                </button>
              </div>

              {/* SMT Line Edge AOI OTA Sync Box */}
              <div className={`p-5 rounded-xl border space-y-4 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-sm font-bold flex items-center space-x-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>SMT 라인 엣지 AOI 장비 실시간 OTA 배포</span>
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  최신 가중치 모델({metrics?.currentModelVersion || 'AOI-Vision-Core-v2.5'})을 가동 중인 SMT 1, 2, 3호기 엣지 인퍼런스 서버로 실시간 무중단(Zero-Downtime) 동기화합니다.
                </p>

                <div className="space-y-2 text-xs">
                  <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <span className="font-semibold">Line 1 (High-Speed SMT AOI)</span>
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Synced v2.5.4
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <span className="font-semibold">Line 2 (Automotive High-Reliability AOI)</span>
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Synced v2.5.4
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <span className="font-semibold">Line 3 (Prototype Flex AOI)</span>
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Synced v2.5.4
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div
          className={`px-6 py-3 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-slate-800 bg-slate-950/70 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>오류 판독 리뷰 시 해당 이미지 및 계측값이 결함 DB에 즉시 자동 업데이트됩니다.</span>
          </div>

          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg font-bold transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
