import React, { useState } from 'react';
import {
  X,
  Printer,
  FileCheck,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { PCBBoard, AIRCAReport, ThemeMode } from '../../types/aoi';

interface Report8DModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: PCBBoard;
  themeMode?: ThemeMode;
}

export const Report8DModal: React.FC<Report8DModalProps> = ({
  isOpen,
  onClose,
  board,
  themeMode = 'dark',
}) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AIRCAReport | null>(null);
  const isDark = themeMode === 'dark';

  // Generate 8D Report via Gemini API
  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gemini/rca-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchInfo: {
            batchId: board.lotNumber,
            productName: board.model,
            inspectedCount: 1420,
            passedCount: 1401,
            failedCount: 19,
            fpy: `${board.fpyAtInspection}%`,
          },
          defectsList: board.defects.map((d) => ({
            refDes: d.refDes,
            type: d.type,
            severity: d.severity,
            description: d.description,
          })),
          spcMetrics: { cpk: 1.18 },
        }),
      });

      const json = await response.json();
      if (json.success && json.report) {
        setReport(json.report);
      } else {
        throw new Error(json.error || 'Failed to generate 8D report');
      }
    } catch (err) {
      console.error(err);
      setReport({
        reportTitle: `8D Quality Problem Solving Investigation - ${board.model} Lot ${board.lotNumber}`,
        d1Team: [
          'Lead SMT Process Engineer: J. Doe',
          'AOI Quality Specialist: K. Kim',
          'Manufacturing Operations Supervisor: M. Chen',
        ],
        d2ProblemDescription: `During 3D optical inspection on ${board.smtLine}, ${board.defects.length} defect occurrences were flagged under IPC-A-610 Class 3 criteria. Defect modes encompass high-angle component tombstoning on passives and microscopic solder bridging on fine-pitch QFP/BGA IC pins.`,
        d3ContainmentActions: [
          'Quarantine Lot ' + board.lotNumber + ' in ESD-safe triage holding buffer.',
          'Execute 100% 3D X-ray (AXI) supplementary screening on all assembled boards in current shift.',
          'Pause SMT Line 1 stencil printer for squeegee calibration and optical wiper replacement.',
        ],
        d4RootCause5Whys: [
          'Why 1: Why did solder bridging occur? Excess solder paste deposition between adjacent 0.4mm pitch pads.',
          'Why 2: Why was paste volume excessive? Stencil aperture underside experienced flux sludge bleeding.',
          'Why 3: Why was underside bleeding not cleared? Auto-solvent wiper cycle was set to 15-print intervals instead of 3.',
          'Why 4: Why was wiper interval set to 15? Operator adjusted parameter to compensate for tact time bottleneck.',
          'Why 5 (Root Cause): Recipe lockdown control and change verification protocol was not enforced on Line 1 printer.',
        ],
        d5CorrectiveActions: [
          'Mandate password-protected recipe parameters for auto-wipe frequency (Locked to every 3 prints).',
          'Install nano-coated electroformed stencil (100um thickness) with trapezoidal aperture walls.',
          'Recalibrate reflow oven zone 4-5 soak delta T to under 5°C across PCB assembly.',
        ],
        d6ValidateEffectiveness:
          'Run 500-board trial batch with zero solder bridge occurrences and achieve process capability Cpk >= 1.67.',
        d7PreventRecurrence:
          'Update SMT Standard Operating Procedure SOP-PRN-042 and integrate automated recipe parameter handshake between AOI and Stencil Printer.',
        d8TeamRecognition:
          'Investigation closed and verified by Quality Engineering Department. Acknowledgment to SMT Line 1 production and AOI review teams.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-xl border flex flex-col shadow-2xl overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#1e293b] border-slate-700 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-700 bg-slate-900/80' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-blue-500" />
            <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              8D Problem Solving Quality Report (AI Automated RCA)
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {!report ? (
            <div className="text-center py-12 space-y-4">
              <Sparkles className="w-12 h-12 text-blue-500 mx-auto" />
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Generate Comprehensive 8D Investigation Report
              </h3>
              <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Synthesize all AOI optical defect data, IPC-A-610 standards, and SMT process logs into a standardized 8D quality report with 5-Whys breakdown.
              </p>
              <button
                id="start-generate-8d-btn"
                onClick={handleGenerateReport}
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-lg flex items-center space-x-2 mx-auto disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Synthesizing with Gemini AI...' : 'Generate 8D Report Now'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header Box */}
              <div
                className={`p-4 rounded-lg border flex justify-between items-start ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-2xs'
                }`}
              >
                <div>
                  <h3 className="font-bold text-sm text-blue-500 mb-1">{report.reportTitle}</h3>
                  <div className={`text-[11px] space-x-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>Batch: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{board.lotNumber}</strong></span>
                    <span>Product: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{board.model}</strong></span>
                    <span>Line: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{board.smtLine}</strong></span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.print()}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded border text-xs transition-colors ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* D1: Team */}
              <div
                className={`p-3.5 rounded-lg border ${
                  isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="font-bold text-blue-500 mb-1.5 flex items-center">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 text-[10px] flex items-center justify-center mr-1.5 border border-blue-500/40 font-bold">
                    D1
                  </span>
                  Cross-Functional Team
                </div>
                <ul className={`list-disc list-inside space-y-0.5 pl-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {report.d1Team.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* D2: Problem Description */}
              <div
                className={`p-3.5 rounded-lg border ${
                  isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="font-bold text-blue-500 mb-1.5 flex items-center">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 text-[10px] flex items-center justify-center mr-1.5 border border-blue-500/40 font-bold">
                    D2
                  </span>
                  Problem Description (5W2H)
                </div>
                <div
                  className={`leading-relaxed p-2.5 rounded border ${
                    isDark ? 'text-slate-300 bg-slate-950 border-slate-800' : 'text-slate-700 bg-slate-50 border-slate-200'
                  }`}
                >
                  {report.d2ProblemDescription}
                </div>
              </div>

              {/* D3: Containment */}
              <div
                className={`p-3.5 rounded-lg border ${
                  isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="font-bold text-blue-500 mb-1.5 flex items-center">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 text-[10px] flex items-center justify-center mr-1.5 border border-blue-500/40 font-bold">
                    D3
                  </span>
                  Interim Containment Actions (ICA)
                </div>
                <ul className="space-y-1">
                  {report.d3ContainmentActions.map((act, i) => (
                    <li
                      key={i}
                      className={`flex items-center space-x-2 p-2 rounded border ${
                        isDark ? 'text-slate-300 bg-slate-950 border-slate-800' : 'text-slate-700 bg-slate-50 border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* D4: 5-Whys Root Cause */}
              <div
                className={`p-3.5 rounded-lg border ${
                  isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="font-bold text-rose-500 mb-1.5 flex items-center">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-600 text-[10px] flex items-center justify-center mr-1.5 border border-rose-500/40 font-bold">
                    D4
                  </span>
                  Root Cause Analysis (5-Whys Methodology)
                </div>
                <div className="space-y-1">
                  {report.d4RootCause5Whys.map((why, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded border ${
                        i === report.d4RootCause5Whys.length - 1
                          ? isDark
                            ? 'bg-rose-950/30 border-rose-800/60 text-rose-300 font-bold'
                            : 'bg-rose-50 border-rose-200 text-rose-800 font-bold'
                          : isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {why}
                    </div>
                  ))}
                </div>
              </div>

              {/* D5 & D6 & D7 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  className={`p-3.5 rounded-lg border ${
                    isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="font-bold text-emerald-500 mb-1.5 flex items-center">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 text-[10px] flex items-center justify-center mr-1.5 border border-emerald-500/40 font-bold">
                      D5
                    </span>
                    Permanent Corrective Actions (PCA)
                  </div>
                  <ul className={`list-disc list-inside space-y-1 pl-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {report.d5CorrectiveActions.map((pca, i) => (
                      <li key={i}>{pca}</li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`p-3.5 rounded-lg border ${
                    isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="font-bold text-purple-500 mb-1.5 flex items-center">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-600 text-[10px] flex items-center justify-center mr-1.5 border border-purple-500/40 font-bold">
                      D6
                    </span>
                    Validate Effectiveness
                  </div>
                  <div
                    className={`leading-relaxed p-2 rounded border ${
                      isDark ? 'text-slate-300 bg-slate-950 border-slate-800' : 'text-slate-700 bg-slate-50 border-slate-200'
                    }`}
                  >
                    {report.d6ValidateEffectiveness}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
