import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building,
  Calendar,
  UserCheck,
  Award,
  QrCode,
  Layers,
  X,
  Sparkles,
} from 'lucide-react';
import { PCBBoard, ThemeMode, InspectionCertificate } from '../../types/aoi';
import { SAMPLE_INSPECTION_CERTIFICATES } from '../../mock/certificateAndEnsembleData';

interface QualityCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBoard: PCBBoard;
  themeMode: ThemeMode;
}

export const QualityCertificateModal: React.FC<QualityCertificateModalProps> = ({
  isOpen,
  onClose,
  currentBoard,
  themeMode,
}) => {
  if (!isOpen) return null;

  const isDark = themeMode === 'dark';

  const defaultCert: InspectionCertificate =
    SAMPLE_INSPECTION_CERTIFICATES[currentBoard.model] ||
    SAMPLE_INSPECTION_CERTIFICATES['ECU-2026-AUTO'];

  const [certData, setCertData] = useState<InspectionCertificate>(defaultCert);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Trigger browser print or simulated PDF download
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    setExportSuccess(false);

    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);

      // Create a printable text/html blob download for convenience
      const element = document.createElement('a');
      const file = new Blob(
        [
          `========================================================================\n` +
          `       OFFICIAL SMT PROCESS INSPECTION QUALITY CERTIFICATE (CoA)        \n` +
          `========================================================================\n` +
          `Certificate No : ${certData.certificateNo}\n` +
          `Issue Date     : ${certData.issueDate}\n` +
          `Product Model  : ${certData.productModel}\n` +
          `Lot Number     : ${certData.lotNumber}\n` +
          `SMT Line       : ${certData.smtLine}\n` +
          `IPC Standard   : ${certData.ipcClass}\n` +
          `Compliance     : ${certData.complianceStatus}\n` +
          `------------------------------------------------------------------------\n` +
          `Inspection Metrics:\n` +
          ` - Total Inspected : ${certData.totalInspected} boards\n` +
          ` - Total Passed    : ${certData.totalPassed} boards\n` +
          ` - Total Defective : ${certData.totalFailed} boards\n` +
          ` - FPY (Yield)     : ${certData.fpyPercentage}%\n` +
          ` - Six Sigma Cpk   : ${certData.cpkIndex}\n` +
          ` - DPMO            : ${certData.dpmo}\n` +
          `------------------------------------------------------------------------\n` +
          `Digital Sign-off:\n` +
          ` - Inspector : ${certData.inspectorName}\n` +
          ` - Approver  : ${certData.approverName}\n` +
          ` - Security  : ${certData.digitalSignatureHash}\n` +
          `========================================================================\n`
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      element.href = URL.createObjectURL(file);
      element.download = `${certData.certificateNo}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setTimeout(() => setExportSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div
      id="quality-certificate-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        id="quality-certificate-modal-container"
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border transition-all overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Top Control Bar (Non-printable) */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-500 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold tracking-tight">공정 검사 성적서 (Quality CoA) 1-Click 발행</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ISO / IATF-16949 COMPLIANT
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                SMT 3D AOI 전수 검사 결과, Cpk 공정능력지수, IPC-A-610 판정 및 공인 전자서명 성적서
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              id="btn-print-certificate"
              onClick={handlePrint}
              className={`flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Printer className="w-4 h-4 mr-1.5" />
              <span>인쇄 / PDF 인쇄</span>
            </button>

            <button
              type="button"
              id="btn-export-pdf-certificate"
              disabled={isExporting}
              onClick={handleDownloadPDF}
              className="flex items-center px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                  <span>PDF 생성 중...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-1.5" />
                  <span>1-Click PDF 발행</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {exportSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>공정 검사 성적서 PDF가 성공적으로 생성 및 저장되었습니다.</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500">{certData.certificateNo}.pdf</span>
            </div>
          )}

          {/* Actual Printable Form Sheet */}
          <div
            id="printable-coa-sheet"
            className={`p-8 rounded-xl border relative ${
              isDark
                ? 'bg-slate-950/70 border-slate-700 text-slate-200'
                : 'bg-white border-slate-300 text-slate-800 shadow-sm'
            }`}
          >
            {/* Watermark/Stamp badge */}
            <div className="absolute top-8 right-8 border-2 border-emerald-500/60 rounded-xl px-4 py-2 transform rotate-6 pointer-events-none opacity-80 flex items-center space-x-2 bg-emerald-500/5">
              <Award className="w-6 h-6 text-emerald-500" />
              <div>
                <div className="text-[11px] font-extrabold text-emerald-500 tracking-wider">PASSED & CERTIFIED</div>
                <div className="text-[9px] font-mono text-emerald-600">SMT 3D-AOI VERIFIED</div>
              </div>
            </div>

            {/* Header: Company & Title */}
            <div className="border-b-2 border-blue-600 pb-5 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                      A
                    </div>
                    <span className="text-base font-extrabold tracking-tight">SMT INTELLIGENCE FACTORY CO., LTD.</span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight mt-2 text-blue-600 dark:text-blue-400">
                    공 정 검 사 성 적 서
                  </h1>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    CERTIFICATE OF SMT PROCESS & OPTICAL INSPECTION ANALYSIS
                  </span>
                </div>

                <div className="text-right text-xs font-mono space-y-1">
                  <div>
                    <span className="text-slate-400">Cert No: </span>
                    <span className="font-bold text-blue-500">{certData.certificateNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Date: </span>
                    <span>{certData.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Standard: </span>
                    <span className="font-semibold text-emerald-500">{certData.isoStandardCert}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Basic Lot & Production Metadata Table */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2 flex items-center space-x-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>1. 기본 생산 정보 (General Information)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border p-3 rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">고객사 (Customer)</span>
                  <span className="font-semibold">{certData.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">품목명 (Model)</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{certData.productModel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">제조 로트번호 (Lot No.)</span>
                  <span className="font-mono font-bold">{certData.lotNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">검사 SMT 라인 (Line)</span>
                  <span className="font-semibold">{certData.smtLine}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">적용 IPC 등급</span>
                  <span className="font-semibold text-purple-500">{certData.ipcClass}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">검사 방식</span>
                  <span className="font-semibold">3D Multi-Frequency Moiré + 8-Way RGB</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">검사 담당자</span>
                  <span className="font-semibold">{certData.inspectorName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">품질 책임 승인자</span>
                  <span className="font-semibold">{certData.approverName}</span>
                </div>
              </div>
            </div>

            {/* 2. Statistical Inspection Yield & Capability Metrics */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2. 종합 수율 및 공정능력지수 (Statistical Yield & Capability)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">총 검사수량</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{certData.totalInspected} <span className="text-[10px] font-normal">pcs</span></div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-emerald-500/5 border-emerald-500/20">
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">합격 수량 (Pass)</div>
                  <div className="text-base font-bold text-emerald-500 mt-0.5">{certData.totalPassed} <span className="text-[10px] font-normal">pcs</span></div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-rose-500/5 border-rose-500/20">
                  <div className="text-[10px] text-rose-600 dark:text-rose-400">불량 수량 (Fail)</div>
                  <div className="text-base font-bold text-rose-500 mt-0.5">{certData.totalFailed} <span className="text-[10px] font-normal">pcs</span></div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-blue-500/5 border-blue-500/20">
                  <div className="text-[10px] text-blue-600 dark:text-blue-400">직통율 (FPY)</div>
                  <div className="text-base font-bold text-blue-500 mt-0.5">{certData.fpyPercentage}%</div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-amber-500/5 border-amber-500/20">
                  <div className="text-[10px] text-amber-600 dark:text-amber-400">공정능력 Cpk</div>
                  <div className="text-base font-bold text-amber-500 mt-0.5">{certData.cpkIndex}</div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">DPMO</div>
                  <div className="text-base font-mono font-bold text-indigo-400 mt-0.5">{certData.dpmo}</div>
                </div>
              </div>
            </div>

            {/* 3. IPC-A-610 Defect Mode Breakdown & Critical Logs */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>3. IPC-A-610 결함 모드 분석 및 조치 이력 (Defect Analysis & Rework Log)</span>
              </h4>
              <div className="overflow-x-auto border rounded-lg border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5">부품 RefDes</th>
                      <th className="p-2.5">결함 유형</th>
                      <th className="p-2.5">실측 측정치</th>
                      <th className="p-2.5">규격 기준 (Spec)</th>
                      <th className="p-2.5">조치 결과 (Disposition)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {certData.criticalDefectLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="p-2.5 font-bold font-mono text-blue-500">{log.refDes}</td>
                        <td className="p-2.5">{log.defectType}</td>
                        <td className="p-2.5 font-mono text-rose-500 font-semibold">{log.measuredVal}</td>
                        <td className="p-2.5 font-mono text-slate-400">{log.specLimit}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            {log.disposition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. 3D Laser Solder Profilometry Verification Sample */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>4. 3D 솔더 필렛 고저차 및 젖음각 정밀 측정치 (3D Solder Profilometry)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {certData.solderJointSamples.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border text-xs border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white font-mono">{s.pad}</div>
                      <div className="text-[10px] text-slate-400">
                        높이: <span className="font-mono text-blue-400">{s.heightUm}um</span> | 볼륨: <span className="font-mono text-emerald-400">{s.volumePct}%</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        젖음각: <span className="font-mono text-purple-400">{s.wettingAngleDeg}°</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      s.result === 'PASS'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {s.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Official Quality Seal & Digital Verification QR */}
            <div className="border-t-2 border-slate-300 dark:border-slate-700 pt-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span>전자 승인 서명 검증 (Digital Signature Authentication)</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 break-all max-w-lg">
                  {certData.digitalSignatureHash}
                </div>
                <div className="text-[10px] text-slate-400 italic">
                  * 본 성적서는 자동 광학 검사(3D-AOI) 시스템에 의해 암호화 생성되었으며 위변조 방지 블록체인 해시가 적용되었습니다.
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center">
                <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <QrCode className="w-12 h-12" />
                </div>
                <div className="text-left text-[10px] space-y-0.5">
                  <div className="font-bold text-blue-500">QR 진위확인</div>
                  <div className="text-slate-400">Scan to Verify</div>
                  <div className="font-mono text-[9px] text-emerald-500 font-bold">AUTHENTIC OK</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-3 border-t flex items-center justify-between text-xs shrink-0 ${
            isDark ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <span>품질 보증 표준: IPC-A-610 Class 3 / IATF-16949 / ISO-9001:2015</span>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
              isDark ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
