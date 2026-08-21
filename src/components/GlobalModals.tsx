import React from 'react';

// Modals
import { Report8DModal } from './AIAssistant/Report8DModal';
import { ComponentInspectorModal } from './PCBViewer/ComponentInspectorModal';
import { GerberBOMModal } from './ImportExport/GerberBOMModal';
import { ClosedLoopFeedbackModal } from './ProductionLiveStream/ClosedLoopFeedbackModal';
import { SmartphoneCameraModal } from './SmartphoneBridge/SmartphoneCameraModal';
import { AutoTeachingModal } from './AutoTeaching/AutoTeachingModal';
import { ReworkRepairStationModal } from './ReworkStation/ReworkRepairStationModal';
import { DefectLearningDatabaseModal } from './AIAssistant/DefectLearningDatabaseModal';
import { QualityCertificateModal } from './Report/QualityCertificateModal';

// Stores
import { useUIStore } from '../stores/useUIStore';
import { useInspectionStore } from '../stores/useInspectionStore';
import { useModalStore } from '../stores/useModalStore';

export const GlobalModals: React.FC = () => {
  const themeMode = useUIStore((s) => s.themeMode);
  const setAiPanelOpen = useUIStore((s) => s.setAiPanelOpen);

  const currentBoard = useInspectionStore((s) => s.getCurrentBoard());
  const activeLine = useInspectionStore((s) => s.getActiveLine());
  const ipcClass = useInspectionStore((s) => s.ipcClass);
  const selectedDefect = useInspectionStore((s) => s.selectedDefect);
  const setSelectedDefect = useInspectionStore((s) => s.setSelectedDefect);
  const selectedComponent = useInspectionStore((s) => s.selectedComponent);
  const setSelectedComponent = useInspectionStore((s) => s.setSelectedComponent);
  const importBoard = useInspectionStore((s) => s.importBoard);
  const importSmartphoneBoard = useInspectionStore((s) => s.importSmartphoneBoard);
  const applyAutoRecipe = useInspectionStore((s) => s.applyAutoRecipe);
  const updateDefectStatus = useInspectionStore((s) => s.updateDefectStatus);
  const learningSyncToast = useInspectionStore((s) => s.learningSyncToast);

  const activeModal = useModalStore((s) => s.activeModal);
  const closeModal = useModalStore((s) => s.close);
  const reworkTargetDefect = useModalStore((s) => s.reworkTargetDefect);

  return (
    <>
      <Report8DModal
        isOpen={activeModal === 'report-8d'}
        onClose={closeModal}
        board={currentBoard}
        themeMode={themeMode}
      />

      {activeModal === 'component-inspector' && (
        <ComponentInspectorModal
          component={selectedComponent}
          defect={selectedDefect}
          ipcClass={ipcClass}
          onClose={() => {
            closeModal();
            setSelectedComponent(null);
          }}
          onOpenAIAnalysis={(def) => {
            setSelectedDefect(def);
            setAiPanelOpen(true);
          }}
          themeMode={themeMode}
        />
      )}

      <GerberBOMModal
        isOpen={activeModal === 'gerber-bom'}
        onClose={closeModal}
        currentBoard={currentBoard}
        onImportCustomBoard={importBoard}
        themeMode={themeMode}
      />

      <ClosedLoopFeedbackModal
        isOpen={activeModal === 'closed-loop'}
        onClose={closeModal}
        activeLine={activeLine}
        currentBoard={currentBoard}
        themeMode={themeMode}
      />

      <SmartphoneCameraModal
        isOpen={activeModal === 'smartphone-camera'}
        onClose={closeModal}
        onImportCapturedBoard={importSmartphoneBoard}
        themeMode={themeMode}
      />

      <AutoTeachingModal
        isOpen={activeModal === 'auto-teaching'}
        onClose={closeModal}
        currentBoard={currentBoard}
        onApplyRecipe={applyAutoRecipe}
        themeMode={themeMode}
      />

      <ReworkRepairStationModal
        isOpen={activeModal === 'rework-station'}
        onClose={closeModal}
        defect={reworkTargetDefect || selectedDefect}
        board={currentBoard}
        onCompleteRework={(reworkRecord: any, resolvedDefectId: string) => {
          updateDefectStatus(
            resolvedDefectId,
            'REWORK_COMPLETED',
            `Repaired via ${reworkRecord.repairMethod} (${reworkRecord.temperatureC}°C) by ${reworkRecord.operatorId}`
          );
        }}
        themeMode={themeMode}
      />

      <DefectLearningDatabaseModal
        isOpen={activeModal === 'defect-learning'}
        onClose={closeModal}
        themeMode={themeMode}
      />

      <QualityCertificateModal
        isOpen={activeModal === 'quality-certificate'}
        onClose={closeModal}
        currentBoard={currentBoard}
        themeMode={themeMode}
      />

      {/* Floating Real-Time Defect DB Auto-Learning Toast */}
      {learningSyncToast?.show && (
        <div
          id="learning-sync-toast"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border bg-slate-900/95 border-cyan-500/50 text-white flex items-start space-x-3 animate-fade-in max-w-md backdrop-blur-md"
        >
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 block animate-ping" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-cyan-300">AI 오류 학습 DB 자동 동기화</h4>
              <span className="text-[10px] text-cyan-400 font-mono">+1 Sample Saved</span>
            </div>
            <p className="text-xs font-medium text-slate-200 mt-1">{learningSyncToast.text}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{learningSyncToast.subText}</p>
          </div>
        </div>
      )}
    </>
  );
};
