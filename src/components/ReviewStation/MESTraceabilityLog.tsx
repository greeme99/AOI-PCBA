import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Barcode,
} from 'lucide-react';
import { ThemeMode, ReviewStatus } from '../../types/aoi';

interface MESLogEntry {
  serialNumber: string;
  lotNumber: string;
  smtLine: string;
  model: string;
  side: 'TOP' | 'BOTTOM';
  timestamp: string;
  status: 'PASS' | 'FAIL' | 'REWORK';
  defectCount: number;
  tactTimeSec: number;
  operatorId: string;
  ipcClass: string;
}

const INITIAL_MES_LOGS: MESLogEntry[] = [
  {
    serialNumber: 'SN-2026-883491',
    lotNumber: 'LOT-2026-A09',
    smtLine: 'LINE-01 (Automotive SMT)',
    model: 'ECU-2026-AUTO',
    side: 'TOP',
    timestamp: '20:04:12',
    status: 'FAIL',
    defectCount: 2,
    tactTimeSec: 14.8,
    operatorId: 'OP-4821 (K. Kim)',
    ipcClass: 'Class 3',
  },
  {
    serialNumber: 'SN-2026-883490',
    lotNumber: 'LOT-2026-A09',
    smtLine: 'LINE-01 (Automotive SMT)',
    model: 'ECU-2026-AUTO',
    side: 'TOP',
    timestamp: '20:03:57',
    status: 'PASS',
    defectCount: 0,
    tactTimeSec: 14.2,
    operatorId: 'AUTO-AOI-01',
    ipcClass: 'Class 3',
  },
  {
    serialNumber: 'SN-2026-883489',
    lotNumber: 'LOT-2026-A09',
    smtLine: 'LINE-01 (Automotive SMT)',
    model: 'ECU-2026-AUTO',
    side: 'TOP',
    timestamp: '20:03:42',
    status: 'PASS',
    defectCount: 0,
    tactTimeSec: 14.4,
    operatorId: 'AUTO-AOI-01',
    ipcClass: 'Class 3',
  },
  {
    serialNumber: 'SN-2026-883488',
    lotNumber: 'LOT-2026-A08',
    smtLine: 'LINE-01 (Automotive SMT)',
    model: 'ECU-2026-AUTO',
    side: 'TOP',
    timestamp: '20:03:26',
    status: 'REWORK',
    defectCount: 1,
    tactTimeSec: 15.1,
    operatorId: 'OP-4821 (K. Kim)',
    ipcClass: 'Class 3',
  },
  {
    serialNumber: 'SN-2026-883487',
    lotNumber: 'LOT-2026-A08',
    smtLine: 'LINE-01 (Automotive SMT)',
    model: 'ECU-2026-AUTO',
    side: 'TOP',
    timestamp: '20:03:10',
    status: 'PASS',
    defectCount: 0,
    tactTimeSec: 14.0,
    operatorId: 'AUTO-AOI-01',
    ipcClass: 'Class 3',
  },
];

interface MESTraceabilityLogProps {
  themeMode?: ThemeMode;
}

export const MESTraceabilityLog: React.FC<MESTraceabilityLogProps> = ({
  themeMode = 'dark',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASS' | 'FAIL' | 'REWORK'>('ALL');
  const isDark = themeMode === 'dark';

  const filteredLogs = INITIAL_MES_LOGS.filter((log) => {
    const matchesSearch =
      log.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportMES = () => {
    let csv = 'SerialNumber,LotNumber,SMTLine,Model,Side,Timestamp,Status,DefectCount,TactTimeSec,OperatorId,IPCClass\n';
    filteredLogs.forEach((l) => {
      csv += `${l.serialNumber},${l.lotNumber},"${l.smtLine}",${l.model},${l.side},${l.timestamp},${l.status},${l.defectCount},${l.tactTimeSec},"${l.operatorId}",${l.ipcClass}\n`;
    });
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `MES_Traceability_Audit_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      className={`p-3.5 rounded-xl border space-y-3 transition-colors ${
        isDark
          ? 'bg-slate-900/80 border-slate-700/80 text-slate-200'
          : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
      }`}
    >
      {/* Top Header & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 text-xs font-bold">
          <Barcode className="w-4 h-4 text-blue-500" />
          <span>MES Serialized Traceability & Audit Trail</span>
        </div>

        <button
          onClick={handleExportMES}
          className="flex items-center space-x-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-semibold transition-colors"
        >
          <Download className="w-3 h-3" />
          <span>Export MES CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center space-x-2 text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Serial No, Lot, Model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 border ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Filter Pills */}
        <div
          className={`flex p-0.5 rounded-lg border text-[11px] ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {(['ALL', 'PASS', 'FAIL', 'REWORK'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div
        className={`border rounded-lg overflow-hidden text-xs ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="overflow-x-auto max-h-48">
          <table className="w-full text-left">
            <thead className={`border-b text-[10px] uppercase tracking-wider font-semibold ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <tr>
                <th className="p-2">Serial No.</th>
                <th className="p-2">Timestamp</th>
                <th className="p-2">Status</th>
                <th className="p-2">Defects</th>
                <th className="p-2">Tact</th>
                <th className="p-2">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-[11px] font-mono">
              {filteredLogs.map((log, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-blue-500/5 transition-colors ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  <td className="p-2 font-bold text-blue-500">{log.serialNumber}</td>
                  <td className="p-2 text-slate-500">{log.timestamp}</td>
                  <td className="p-2">
                    <span
                      className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'PASS'
                          ? isDark
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : log.status === 'FAIL'
                          ? isDark
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                          : isDark
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {log.status === 'PASS' ? (
                        <CheckCircle className="w-2.5 h-2.5" />
                      ) : log.status === 'FAIL' ? (
                        <XCircle className="w-2.5 h-2.5" />
                      ) : (
                        <Clock className="w-2.5 h-2.5" />
                      )}
                      <span>{log.status}</span>
                    </span>
                  </td>
                  <td className="p-2 text-rose-500 font-bold">{log.defectCount}</td>
                  <td className="p-2">{log.tactTimeSec}s</td>
                  <td className="p-2 text-[10px] text-slate-400">{log.operatorId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
