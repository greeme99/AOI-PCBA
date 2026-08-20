import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Cpu,
  HelpCircle,
  Activity,
  Barcode,
  Layers,
  CheckCheck,
  Flame,
  Wrench,
} from 'lucide-react';
import { InspectionDefect, ReviewStatus, PCBBoard, IPCClass, ThemeMode } from '../../types/aoi';
import { LaserProfileGauge } from './LaserProfileGauge';
import { MESTraceabilityLog } from './MESTraceabilityLog';

interface DefectReviewPanelProps {
  board: PCBBoard;
  selectedDefect: InspectionDefect | null;
  onSelectDefect: (defect: InspectionDefect) => void;
  onUpdateDefectStatus: (defectId: string, status: ReviewStatus, comment?: string) => void;
  onOpenAIAnalysis: (defect: InspectionDefect) => void;
  onOpenReworkStation?: (defect: InspectionDefect) => void;
  ipcClass: IPCClass;
  themeMode?: ThemeMode;
}

export const DefectReviewPanel: React.FC<DefectReviewPanelProps> = ({
  board,
  selectedDefect,
  onSelectDefect,
  onUpdateDefectStatus,
  onOpenAIAnalysis,
  onOpenReworkStation,
  ipcClass,
  themeMode = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'triage' | 'laserProfile' | 'mesTrace'>('triage');
  const [operatorComment, setOperatorComment] = useState('');
  const isDark = themeMode === 'dark';

  const getSeverityBadge = (sev: InspectionDefect['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return isDark ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-red-50 text-red-700 border-red-200';
      case 'MAJOR':
        return isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MINOR':
        return isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getReviewStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'CONFIRMED_DEFECT':
        return (
          <span className="text-red-500 flex items-center font-bold">
            <XCircle className="w-3.5 h-3.5 mr-1" /> DEFECT REJECT
          </span>
        );
      case 'FALSE_CALL':
        return (
          <span className="text-emerald-500 flex items-center font-bold">
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> FALSE CALL (PASS)
          </span>
        );
      case 'REWORK_SENT':
        return (
          <span className="text-blue-500 flex items-center font-bold">
            <Clock className="w-3.5 h-3.5 mr-1" /> REWORK ASSIGNED
          </span>
        );
      default:
        return (
          <span className="text-amber-500 flex items-center font-semibold">
            <HelpCircle className="w-3.5 h-3.5 mr-1" /> REVIEW PENDING
          </span>
        );
    }
  };

  // Batch Auto-Pass All False Calls
  const handleBatchPassFalseCalls = () => {
    board.defects.forEach((d) => {
      if (d.severity === 'MINOR' && d.reviewStatus === 'PENDING') {
        onUpdateDefectStatus(d.id, 'FALSE_CALL', 'Auto-calibrated tolerance threshold');
      }
    });
  };

  return (
    <div
      id="defect-review-panel"
      className={`h-full flex flex-col border-l transition-colors duration-200 ${
        isDark
          ? 'bg-[#1e293b] border-slate-700 text-slate-200'
          : 'bg-white border-slate-200 text-slate-700 shadow-sm'
      }`}
    >
      {/* Header with Title & Defect Count */}
      <div
        className={`p-3.5 border-b ${
          isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50/70'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Operator Triage Station
            </h2>
          </div>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded border font-semibold ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-blue-400'
                : 'bg-slate-100 border-slate-200 text-blue-600'
            }`}
          >
            {board.defects.length} Defects Found
          </span>
        </div>
        <div className={`text-[11px] mt-1 flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>
            Standard: <strong className={isDark ? 'text-slate-300' : 'text-slate-700'}>IPC-A-610</strong>
          </span>
          <span className="text-blue-500 font-mono">{ipcClass.split(' (')[0]}</span>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className={`flex border-b text-[11px] ${isDark ? 'border-slate-700 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
        <button
          onClick={() => setActiveTab('triage')}
          className={`flex-1 py-2 text-center font-semibold border-b-2 transition-colors flex items-center justify-center space-x-1 ${
            activeTab === 'triage'
              ? 'border-blue-500 text-blue-500 bg-blue-500/10'
              : isDark
              ? 'border-transparent text-slate-400 hover:text-slate-200'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3 h-3 mr-0.5" />
          <span>Triage</span>
        </button>

        <button
          onClick={() => setActiveTab('laserProfile')}
          className={`flex-1 py-2 text-center font-semibold border-b-2 transition-colors flex items-center justify-center space-x-1 ${
            activeTab === 'laserProfile'
              ? 'border-blue-500 text-blue-500 bg-blue-500/10'
              : isDark
              ? 'border-transparent text-slate-400 hover:text-slate-200'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3 h-3 mr-0.5 text-cyan-500" />
          <span>3D Profiler</span>
        </button>

        <button
          onClick={() => setActiveTab('mesTrace')}
          className={`flex-1 py-2 text-center font-semibold border-b-2 transition-colors flex items-center justify-center space-x-1 ${
            activeTab === 'mesTrace'
              ? 'border-blue-500 text-blue-500 bg-blue-500/10'
              : isDark
              ? 'border-transparent text-slate-400 hover:text-slate-200'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Barcode className="w-3 h-3 mr-0.5 text-indigo-500" />
          <span>MES Audit</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'triage' && (
          <>
            {/* Fast Batch Action */}
            {board.defects.some((d) => d.severity === 'MINOR' && d.reviewStatus === 'PENDING') && (
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                  isDark ? 'bg-blue-950/20 border-blue-800/40 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                <span className="text-[11px]">Minor offset within tolerance?</span>
                <button
                  onClick={handleBatchPassFalseCalls}
                  className="flex items-center space-x-1 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold shadow transition-colors"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Pass Minor (False Call)</span>
                </button>
              </div>
            )}

            {/* Defect Cards List */}
            {board.defects.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center space-y-2 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
                <div className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Zero Defects Detected
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Board conforms with IPC-A-610 Class 3 standard criteria.
                </p>
              </div>
            ) : (
              board.defects.map((def) => {
                const isSelected = selectedDefect?.id === def.id;
                return (
                  <div
                    key={def.id}
                    onClick={() => onSelectDefect(def)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                          : 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                        : isDark
                        ? 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-700/80'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded border ${
                            isDark
                              ? 'bg-slate-950 border-slate-800 text-blue-400'
                              : 'bg-white border-slate-200 text-blue-600'
                          }`}
                        >
                          {def.refDes}
                        </span>
                        <span className={`font-semibold text-xs ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {def.title}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getSeverityBadge(def.severity)}`}>
                        {def.severity}
                      </span>
                    </div>

                    <p className={`text-[11px] line-clamp-2 leading-relaxed mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {def.description}
                    </p>

                    {/* 3D Measurement & Limits */}
                    <div
                      className={`grid grid-cols-2 gap-1.5 text-[10px] font-mono p-2 rounded border mb-2 ${
                        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div>
                        <span className={isDark ? 'text-slate-500 block' : 'text-slate-400 block'}>Measured:</span>
                        <span className="text-amber-500 font-semibold">
                          {def.measuredSolderHeight ? `${def.measuredSolderHeight}um` : `θ: ${def.measuredOffset?.theta}°`}
                        </span>
                      </div>
                      <div>
                        <span className={isDark ? 'text-slate-500 block' : 'text-slate-400 block'}>IPC Standard:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{def.standardLimit}</span>
                      </div>
                    </div>

                    <div className={`flex items-center justify-between text-[11px] pt-1 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
                      <div className="text-[10px]">{getReviewStatusBadge(def.reviewStatus)}</div>
                      <div className="flex items-center text-blue-500 font-semibold text-[11px] group">
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === 'laserProfile' && (
          <LaserProfileGauge defect={selectedDefect} ipcClass={ipcClass} themeMode={themeMode} />
        )}

        {activeTab === 'mesTrace' && <MESTraceabilityLog themeMode={themeMode} />}
      </div>

      {/* Operator Disposition Actions Footer */}
      {selectedDefect && activeTab === 'triage' && (
        <div
          className={`p-4 border-t space-y-3 ${
            isDark ? 'border-slate-700 bg-slate-900/90' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Cpu className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
              Disposition for <span className="text-blue-500 font-mono ml-1">{selectedDefect.refDes}</span>
            </span>
            <button
              id="trigger-ai-rca-btn"
              onClick={() => onOpenAIAnalysis(selectedDefect)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-violet-500/15 hover:bg-violet-500/25 text-violet-600 border border-violet-500/30 rounded text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              <span>AI RCA</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              id="btn-confirm-defect"
              onClick={() => onUpdateDefectStatus(selectedDefect.id, 'CONFIRMED_DEFECT', operatorComment)}
              className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                selectedDefect.reviewStatus === 'CONFIRMED_DEFECT'
                  ? 'bg-red-600 text-white shadow-md'
                  : isDark
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>Confirm NG</span>
            </button>

            <button
              id="btn-false-call"
              onClick={() => onUpdateDefectStatus(selectedDefect.id, 'FALSE_CALL', operatorComment)}
              className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                selectedDefect.reviewStatus === 'FALSE_CALL'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : isDark
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>False Call</span>
            </button>

            <button
              id="btn-rework-assign"
              onClick={() => onUpdateDefectStatus(selectedDefect.id, 'REWORK_SENT', operatorComment)}
              className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                selectedDefect.reviewStatus === 'REWORK_SENT'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDark
                  ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Rework</span>
            </button>
          </div>

          {onOpenReworkStation && (
            <button
              id="btn-open-rework-station"
              onClick={() => onOpenReworkStation(selectedDefect)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-sm ${
                isDark
                  ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Launch IPC-7711 Soldering Rework Bench</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
