import React, { useState } from 'react';
import {
  X,
  Upload,
  FileCode,
  FileSpreadsheet,
  CheckCircle,
  Layers,
} from 'lucide-react';
import { PCBBoard, PCBComponent, ThemeMode } from '../../types/aoi';

interface GerberBOMModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBoard: PCBBoard;
  onImportCustomBoard: (board: PCBBoard) => void;
  themeMode?: ThemeMode;
}

export const GerberBOMModal: React.FC<GerberBOMModalProps> = ({
  isOpen,
  onClose,
  currentBoard,
  onImportCustomBoard,
  themeMode = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [csvContent, setCsvContent] = useState(
    `RefDes,Package,Value,PosX_mm,PosY_mm,Rotation,Side\nU1,QFP-64,STM32F407,48.0,42.0,0,TOP\nU2,SOIC-8,TJA1051,112.0,28.0,0,TOP\nC34,0402,0.1uF,72.0,38.0,38.4,TOP\nR12,0603,10k,72.0,56.0,8.5,TOP\nD2,SOD-123,PESD2CAN,128.0,38.0,180,TOP`
  );
  const [importedStatus, setImportedStatus] = useState(false);
  const isDark = themeMode === 'dark';

  const handleParseAndImport = () => {
    try {
      const lines = csvContent.trim().split('\n');
      const parsedComponents: PCBComponent[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length >= 6) {
          const refDes = cols[0].trim();
          const pkg = cols[1].trim();
          const val = cols[2].trim();
          const x = parseFloat(cols[3].trim()) || 50;
          const y = parseFloat(cols[4].trim()) || 50;
          const rot = parseFloat(cols[5].trim()) || 0;

          parsedComponents.push({
            id: `IMP_${refDes}`,
            refDes,
            packageType: pkg,
            nominalValue: val,
            x,
            y,
            width: pkg.includes('QFP') ? 14 : pkg.includes('0402') ? 1.6 : 2.5,
            height: pkg.includes('QFP') ? 14 : pkg.includes('0402') ? 0.9 : 1.5,
            rotation: rot,
          });
        }
      }

      const newBoard: PCBBoard = {
        id: `BOARD_${Date.now()}`,
        barcode: `SN-IMP-${Math.floor(100000 + Math.random() * 900000)}`,
        model: 'Custom-Imported-PCB',
        smtLine: currentBoard.smtLine,
        lotNumber: `LOT-2026-IMP`,
        side: 'TOP',
        dimensions: { widthMm: 160, heightMm: 95 },
        status: 'FAIL',
        tactTimeSec: 14.8,
        inspectionTimestamp: new Date().toLocaleTimeString(),
        fpyAtInspection: 97.4,
        gerberLayers: {
          silkscreen: true,
          copperTraces: true,
          soldermask: true,
          pads: true,
          fiducials: true,
        },
        components: parsedComponents,
        defects: [
          {
            id: `DEF_IMP_1`,
            componentId: parsedComponents[2]?.id || 'IMP_C34',
            refDes: parsedComponents[2]?.refDes || 'C34',
            type: 'TOMBSTONE',
            severity: 'CRITICAL',
            title: 'Tombstone Part Lift (>15 deg)',
            description: 'Passive component lifted vertically on one terminal pad after reflow.',
            measuredSolderHeight: 32,
            standardLimit: 'Max Lift: 5 deg',
            ipcClause: 'IPC-A-610H 8.3.2.9 Tombstoning',
            reviewStatus: 'PENDING',
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
      };

      onImportCustomBoard(newBoard);
      setImportedStatus(true);
      setTimeout(() => {
        setImportedStatus(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentBoard, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentBoard.barcode}_AOI_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    let csv = 'Defect_ID,RefDes,Type,Severity,IPC_Clause,Review_Status,Measured_Solder_um,Timestamp\n';
    currentBoard.defects.forEach((d) => {
      csv += `${d.id},${d.refDes},${d.type},${d.severity},"${d.ipcClause || ''}",${d.reviewStatus},${d.measuredSolderHeight || ''},${d.timestamp}\n`;
    });

    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentBoard.barcode}_Defects.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div
        className={`border rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col transition-colors ${
          isDark
            ? 'bg-[#1e293b] border-slate-700 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                CAD / Gerber Data Import & Inspection Audit Export
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Pick & Place (Centroid) CSV / Gerber layer synchronizer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b text-xs ${isDark ? 'border-slate-700 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2.5 text-center font-medium border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-blue-500 text-blue-500 bg-blue-500/10 font-semibold'
                : isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Import CAD / Pick & Place CSV
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2.5 text-center font-medium border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-blue-500 text-blue-500 bg-blue-500/10 font-semibold'
                : isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Export Inspection Audit Reports
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh] text-xs">
          {activeTab === 'import' ? (
            <div className="space-y-4">
              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Paste Centroid (XY Coordinates) / BOM CSV:
                </label>
                <textarea
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  rows={6}
                  className={`w-full p-3 rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 border ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Columns: RefDes, Package, Value, PosX_mm, PosY_mm, Rotation, Side
                </div>
                <button
                  id="import-pcb-csv-btn"
                  onClick={handleParseAndImport}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow transition-colors"
                >
                  {importedStatus ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-300" />
                      <span>Loaded into AOI!</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Load into 3D AOI Canvas</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border flex items-center justify-between ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div>
                  <h4 className={`font-bold text-sm flex items-center space-x-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <FileCode className="w-4 h-4 text-blue-500" />
                    <span>Complete AOI Board State (JSON)</span>
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Full package including 3D height data, component coordinates, and defect logs.
                  </p>
                </div>
                <button
                  onClick={handleExportJSON}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
                >
                  Download JSON
                </button>
              </div>

              <div
                className={`p-4 rounded-lg border flex items-center justify-between ${
                  isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div>
                  <h4 className={`font-bold text-sm flex items-center space-x-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <span>Defect Triage & IPC Disposition (CSV)</span>
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    IPC-A-610 clauses, solder height limits, and operator reject dispositions for MES import.
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors"
                >
                  Download CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
