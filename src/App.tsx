import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PCBCanvas } from './components/PCBViewer/PCBCanvas';
import { PCBToolbar } from './components/PCBViewer/PCBToolbar';
import { DefectReviewPanel } from './components/ReviewStation/DefectReviewPanel';
import { AIIntelligencePanel } from './components/AIAssistant/AIIntelligencePanel';
import { Report8DModal } from './components/AIAssistant/Report8DModal';
import { ComponentInspectorModal } from './components/PCBViewer/ComponentInspectorModal';
import { GerberBOMModal } from './components/ImportExport/GerberBOMModal';
import { SPCDashboard } from './components/SPCAnalytics/SPCDashboard';
import { RecipeEditor } from './components/RecipeManager/RecipeEditor';
import { LiveInspectionLine } from './components/ProductionLiveStream/LiveInspectionLine';
import { ClosedLoopFeedbackModal } from './components/ProductionLiveStream/ClosedLoopFeedbackModal';
import { SmartphoneCameraModal } from './components/SmartphoneBridge/SmartphoneCameraModal';
import { AutoTeachingModal } from './components/AutoTeaching/AutoTeachingModal';
import { ReworkRepairStationModal } from './components/ReworkStation/ReworkRepairStationModal';
import { DefectLearningDatabaseModal } from './components/AIAssistant/DefectLearningDatabaseModal';
import { CentralFleetDashboard } from './components/FleetControl/CentralFleetDashboard';
import { GoldenMasterDiffViewer } from './components/AnomalyEngine/GoldenMasterDiffViewer';
import { AutoThresholdOptimizer } from './components/AutoTuning/AutoThresholdOptimizer';
import { PredictiveMaintenanceDashboard } from './components/PdM/PredictiveMaintenanceDashboard';
import { QualityCertificateModal } from './components/Report/QualityCertificateModal';
import { MultiAngleLightingEnsemble } from './components/EnsembleCalibration/MultiAngleLightingEnsemble';
import {
  INITIAL_SMT_LINES,
  SAMPLE_BOARDS,
  INITIAL_RECIPES,
} from './mock/pcbData';
import {
  PCBBoard,
  PCBComponent,
  InspectionDefect,
  LightingMode,
  ReviewStatus,
  IPCClass,
  InspectionRecipe,
  SMTLineStatus,
  ThemeMode,
  CameraAngle,
} from './types/aoi';

export default function App() {
  // Theme Mode: 'dark' (Sleek Dark) or 'light' (White & Gray)
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Navigation & SMT Line State
  const [activeView, setActiveView] = useState<'inspection' | 'spc' | 'recipe' | 'fleet' | 'anomaly' | 'autotune' | 'pdm' | 'ensemble'>('inspection');
  const [smtLines, setSmtLines] = useState<SMTLineStatus[]>(INITIAL_SMT_LINES);
  const [activeLineId, setActiveLineId] = useState<string>('LINE-01');

  // Board & Inspection State
  const [boards, setBoards] = useState<Record<string, PCBBoard>>(SAMPLE_BOARDS);
  const [currentModelKey, setCurrentModelKey] = useState<string>('ECU-2026-AUTO');
  const [selectedDefect, setSelectedDefect] = useState<InspectionDefect | null>(
    SAMPLE_BOARDS['ECU-2026-AUTO'].defects[0] || null
  );
  const [selectedComponent, setSelectedComponent] = useState<PCBComponent | null>(
    SAMPLE_BOARDS['ECU-2026-AUTO'].components[0] || null
  );

  // Optical Viewing Controls
  const [lightingMode, setLightingMode] = useState<LightingMode>('COMPOSITE_RGB');
  const [cameraAngle, setCameraAngle] = useState<CameraAngle>('TOP_COAXIAL');
  const [showSilkscreen, setShowSilkscreen] = useState(true);
  const [showTraces, setShowTraces] = useState(true);
  const [showPads, setShowPads] = useState(true);
  const [showDefectOverlay, setShowDefectOverlay] = useState(true);
  const [show3DHeightMap, setShow3DHeightMap] = useState(false);
  const [isPanelMode, setIsPanelMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Standards & Recipes
  const [ipcClass, setIpcClass] = useState<IPCClass>('Class 3 (High Reliability / Automotive)');
  const [recipes, setRecipes] = useState<Record<string, InspectionRecipe>>(INITIAL_RECIPES);

  // Modals & Drawers
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [is8DModalOpen, setIs8DModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [isGerberModalOpen, setIsGerberModalOpen] = useState(false);
  const [isAutoTeachingModalOpen, setIsAutoTeachingModalOpen] = useState(false);
  const [isReworkModalOpen, setIsReworkModalOpen] = useState(false);
  const [reworkTargetDefect, setReworkTargetDefect] = useState<InspectionDefect | null>(null);
  const [isClosedLoopModalOpen, setIsClosedLoopModalOpen] = useState(false);
  const [isSmartphoneModalOpen, setIsSmartphoneModalOpen] = useState(false);
  const [isDefectLearningModalOpen, setIsDefectLearningModalOpen] = useState(false);
  const [learningSyncToast, setLearningSyncToast] = useState<{ show: boolean; text: string; subText: string } | null>(null);

  const currentBoard = boards[currentModelKey] || SAMPLE_BOARDS['ECU-2026-AUTO'];
  const activeLine = smtLines.find((l) => l.id === activeLineId) || smtLines[0];
  const currentRecipe = recipes[currentModelKey] || INITIAL_RECIPES['ECU-2026-AUTO'];

  // Switch Model
  const handleSelectModel = (modelKey: string) => {
    setCurrentModelKey(modelKey);
    const targetBoard = boards[modelKey];
    if (targetBoard) {
      setSelectedDefect(targetBoard.defects[0] || null);
      setSelectedComponent(targetBoard.components[0] || null);
    }
  };

  // Trigger Optical Scan Cycle Animation
  const handleTriggerScan = useCallback(() => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 45);
  }, [isScanning]);

  // Update Defect Review Status with Auto-Update to AI Defect Learning DB
  const handleUpdateDefectStatus = (defectId: string, status: ReviewStatus, comment?: string) => {
    const targetDefect = currentBoard?.defects?.find((d) => d.id === defectId);

    // Auto-update to Defect Learning DB on backend
    if (targetDefect) {
      fetch('/api/defect-db/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardModel: currentBoard.model,
          componentRefDes: targetDefect.refDes,
          packageType: targetDefect.componentType || 'SMD',
          defectType: targetDefect.type,
          severity: targetDefect.severity,
          disposition: status,
          operatorId: 'OP-441',
          operatorNotes: comment || `판정 상태: ${status} (Auto-logged from AOI Review Console)`,
          opticalLighting: lightingMode,
          measuredMetrics: {
            solderHeightUm: targetDefect.solderHeight || 140,
            wettingAngleDeg: targetDefect.wettingAngle || 45,
            leadCoplanarityUm: targetDefect.coplanarity || 18,
            solderVolumePct: targetDefect.solderVolume || 100,
            offsetX: targetDefect.offsetX,
            offsetY: targetDefect.offsetY,
            rotation: targetDefect.rotation,
          },
        }),
      })
        .then(() => {
          setLearningSyncToast({
            show: true,
            text: `[${targetDefect.refDes}] ${status === 'FALSE_CALL' ? '가성불량' : '결함'} 샘플이 AI 학습 DB에 자동 등록되었습니다.`,
            subText: '검출 가중치 최적화 데이터셋에 실시간 반영 완료 (+1 Sample)',
          });
          setTimeout(() => setLearningSyncToast(null), 4000);
        })
        .catch((err) => console.error('Failed to auto-record to Defect DB:', err));
    }

    setBoards((prev) => {
      const board = prev[currentModelKey];
      if (!board) return prev;
      const updatedDefects = board.defects.map((d) =>
        d.id === defectId ? { ...d, reviewStatus: status, reviewComment: comment } : d
      );

      const hasCriticalPending = updatedDefects.some(
        (d) => d.reviewStatus === 'CONFIRMED_DEFECT' || d.reviewStatus === 'PENDING'
      );
      return {
        ...prev,
        [currentModelKey]: {
          ...board,
          status: hasCriticalPending ? 'FAIL' : 'PASS',
          defects: updatedDefects,
        },
      };
    });
  };

  // Save updated recipe
  const handleSaveRecipe = (updated: InspectionRecipe) => {
    setRecipes((prev) => ({
      ...prev,
      [currentModelKey]: updated,
    }));
  };

  // Import custom board from CAD CSV
  const handleImportCustomBoard = (newBoard: PCBBoard) => {
    setBoards((prev) => ({
      ...prev,
      [newBoard.model]: newBoard,
    }));
    setCurrentModelKey(newBoard.model);
    setSelectedDefect(newBoard.defects[0] || null);
    setSelectedComponent(newBoard.components[0] || null);
  };

  // Import captured board from Smartphone Camera / Live Video Bridge
  const handleImportSmartphoneBoard = (newBoard: PCBBoard) => {
    setBoards((prev) => ({
      ...prev,
      [newBoard.id]: newBoard,
    }));
    setCurrentModelKey(newBoard.id);
    setSelectedDefect(newBoard.defects[0] || null);
    setSelectedComponent(newBoard.components[0] || null);
  };

  // Deploy auto-taught recipe
  const handleApplyAutoRecipe = (newRecipe: InspectionRecipe) => {
    setRecipes((prev) => ({
      ...prev,
      [newRecipe.modelName]: newRecipe,
    }));
  };

  // Open Rework & Repair Station
  const handleOpenReworkStation = (defect: InspectionDefect) => {
    setReworkTargetDefect(defect);
    setIsReworkModalOpen(true);
  };

  // Complete Rework & Update Defect
  const handleCompleteRework = (reworkRecord: any, resolvedDefectId: string) => {
    handleUpdateDefectStatus(
      resolvedDefectId,
      'REWORK_COMPLETED',
      `Repaired via ${reworkRecord.repairMethod} (${reworkRecord.temperatureC}°C) by ${reworkRecord.operatorId}`
    );
  };

  const isDark = themeMode === 'dark';

  return (
    <div
      id="aoi-app-root"
      className={`flex h-screen w-screen font-sans overflow-hidden select-none transition-colors duration-200 ${
        isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-100 text-slate-800'
      }`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenGerberModal={() => setIsGerberModalOpen(true)}
        onOpenAutoTeachingModal={() => setIsAutoTeachingModalOpen(true)}
        onOpenSmartphoneModal={() => setIsSmartphoneModalOpen(true)}
        onOpenClosedLoopModal={() => setIsClosedLoopModalOpen(true)}
        onOpenDefectLearningModal={() => setIsDefectLearningModalOpen(true)}
        onToggleAiPanel={() => setIsAiPanelOpen(!isAiPanelOpen)}
        isAiPanelOpen={isAiPanelOpen}
        onOpen8DModal={() => setIs8DModalOpen(true)}
        currentBoard={currentBoard}
        activeLine={activeLine}
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          activeView={activeView}
          onSelectView={setActiveView}
          activeLine={activeLine}
          lines={smtLines}
          onSelectLine={setActiveLineId}
          currentBoard={currentBoard}
          onSelectBoardModel={handleSelectModel}
          ipcClass={ipcClass}
          onChangeIPCClass={setIpcClass}
          isAiPanelOpen={isAiPanelOpen}
          onToggleAiPanel={() => setIsAiPanelOpen(!isAiPanelOpen)}
          onOpenGerberModal={() => setIsGerberModalOpen(true)}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
        />

        {/* View Router */}
        <section className="flex-1 flex flex-col overflow-hidden relative">
          {activeView === 'inspection' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Live Conveyor Stream with 3-Card KPI Summary */}
              <LiveInspectionLine
                activeLine={activeLine}
                currentBoard={currentBoard}
                isScanning={isScanning}
                scanProgress={scanProgress}
                onTriggerScan={handleTriggerScan}
                onSelectBoard={handleSelectModel}
                onOpenClosedLoopModal={() => setIsClosedLoopModalOpen(true)}
                themeMode={themeMode}
              />

              {/* Sub-toolbar for Lighting & Layer Overlays */}
              <PCBToolbar
                lightingMode={lightingMode}
                onLightingChange={setLightingMode}
                cameraAngle={cameraAngle}
                onCameraAngleChange={setCameraAngle}
                showSilkscreen={showSilkscreen}
                onToggleSilkscreen={() => setShowSilkscreen(!showSilkscreen)}
                showTraces={showTraces}
                onToggleTraces={() => setShowTraces(!showTraces)}
                showPads={showPads}
                onTogglePads={() => setShowPads(!showPads)}
                showDefectOverlay={showDefectOverlay}
                onToggleDefectOverlay={() => setShowDefectOverlay(!showDefectOverlay)}
                show3DHeightMap={show3DHeightMap}
                onToggle3DHeightMap={() => setShow3DHeightMap(!show3DHeightMap)}
                isPanelMode={isPanelMode}
                onTogglePanelMode={() => setIsPanelMode(!isPanelMode)}
                onOpenSmartphoneModal={() => setIsSmartphoneModalOpen(true)}
                zoomLevel={zoomLevel}
                onZoomIn={() => setZoomLevel((z) => Math.min(Number((z * 1.2).toFixed(2)), 6.0))}
                onZoomOut={() => setZoomLevel((z) => Math.max(Number((z * 0.8).toFixed(2)), 0.5))}
                onResetView={() => setZoomLevel(1.0)}
                themeMode={themeMode}
              />

              {/* Split Inspection View: Left Canvas + Right Triage Review Panel */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Canvas Viewport */}
                <div className="flex-1 h-full relative">
                  <PCBCanvas
                    board={currentBoard}
                    selectedDefect={selectedDefect}
                    onSelectDefect={setSelectedDefect}
                    selectedComponent={selectedComponent}
                    onSelectComponent={(comp) => {
                      setSelectedComponent(comp);
                      if (comp) setIsComponentModalOpen(true);
                    }}
                    lightingMode={lightingMode}
                    cameraAngle={cameraAngle}
                    isPanelMode={isPanelMode}
                    showSilkscreen={showSilkscreen}
                    showTraces={showTraces}
                    showPads={showPads}
                    showDefectOverlay={showDefectOverlay}
                    show3DHeightMap={show3DHeightMap}
                    isScanning={isScanning}
                    scanProgress={scanProgress}
                    zoomLevel={zoomLevel}
                    onZoomChange={setZoomLevel}
                    themeMode={themeMode}
                  />
                </div>

                {/* Right Review Panel */}
                <div className="w-96 h-full shrink-0">
                  <DefectReviewPanel
                    board={currentBoard}
                    selectedDefect={selectedDefect}
                    onSelectDefect={setSelectedDefect}
                    onUpdateDefectStatus={handleUpdateDefectStatus}
                    onOpenAIAnalysis={(defect) => {
                      setSelectedDefect(defect);
                      setIsAiPanelOpen(true);
                    }}
                    onOpenReworkStation={handleOpenReworkStation}
                    ipcClass={ipcClass}
                    themeMode={themeMode}
                  />
                </div>
              </div>
            </div>
          )}

          {activeView === 'spc' && (
            <SPCDashboard
              activeLine={activeLine}
              lines={smtLines}
              onSelectLine={setActiveLineId}
              themeMode={themeMode}
            />
          )}

          {activeView === 'recipe' && (
            <RecipeEditor
              recipe={currentRecipe}
              onSaveRecipe={handleSaveRecipe}
              ipcClass={ipcClass}
              onChangeIPCClass={setIpcClass}
              themeMode={themeMode}
            />
          )}

          {activeView === 'fleet' && (
            <CentralFleetDashboard
              lines={smtLines}
              activeLineId={activeLineId}
              onSelectLine={setActiveLineId}
              recipes={recipes}
              currentBoard={currentBoard}
              themeMode={themeMode}
            />
          )}

          {activeView === 'anomaly' && (
            <GoldenMasterDiffViewer
              currentBoard={currentBoard}
              themeMode={themeMode}
            />
          )}

          {activeView === 'autotune' && (
            <AutoThresholdOptimizer
              currentBoard={currentBoard}
              activeRecipe={currentRecipe}
              onUpdateRecipe={handleSaveRecipe}
              themeMode={themeMode}
            />
          )}

          {activeView === 'pdm' && (
            <PredictiveMaintenanceDashboard
              activeLine={activeLine}
              themeMode={themeMode}
            />
          )}

          {/* AI Intelligence Drawer (Right overlay) */}
          {isAiPanelOpen && (
            <div className="absolute top-0 right-0 bottom-0 w-[420px] shadow-2xl z-40 animate-in slide-in-from-right duration-200">
              <AIIntelligencePanel
                board={currentBoard}
                selectedDefect={selectedDefect}
                selectedComponent={selectedComponent}
                ipcClass={ipcClass}
                onOpen8DReport={() => setIs8DModalOpen(true)}
                onClose={() => setIsAiPanelOpen(false)}
                themeMode={themeMode}
              />
            </div>
          )}
        </section>
      </main>

      {/* 8D Quality Investigation Report Modal */}
      <Report8DModal
        isOpen={is8DModalOpen}
        onClose={() => setIs8DModalOpen(false)}
        board={currentBoard}
        themeMode={themeMode}
      />

      {/* Microscopic Component Inspector Modal */}
      <ComponentInspectorModal
        component={selectedComponent}
        defect={selectedDefect}
        ipcClass={ipcClass}
        onClose={() => setIsComponentModalOpen(false)}
        onOpenAIAnalysis={(def) => {
          setSelectedDefect(def);
          setIsAiPanelOpen(true);
        }}
        themeMode={themeMode}
      />

      {/* CAD / Pick & Place CSV Import/Export Modal */}
      <GerberBOMModal
        isOpen={isGerberModalOpen}
        onClose={() => setIsGerberModalOpen(false)}
        currentBoard={currentBoard}
        onImportCustomBoard={handleImportCustomBoard}
        themeMode={themeMode}
      />

      {/* SMT Closed-Loop M2M Feedback & Auto-Correction Modal */}
      <ClosedLoopFeedbackModal
        isOpen={isClosedLoopModalOpen}
        onClose={() => setIsClosedLoopModalOpen(false)}
        activeLine={activeLine}
        currentBoard={currentBoard}
        themeMode={themeMode}
      />

      {/* Smartphone Macro Camera & Video AOI Bridge Modal */}
      <SmartphoneCameraModal
        isOpen={isSmartphoneModalOpen}
        onClose={() => setIsSmartphoneModalOpen(false)}
        onImportCapturedBoard={handleImportSmartphoneBoard}
        themeMode={themeMode}
      />

      {/* CAD-to-AOI Auto-Teaching & Fiducial Alignment Modal */}
      <AutoTeachingModal
        isOpen={isAutoTeachingModalOpen}
        onClose={() => setIsAutoTeachingModalOpen(false)}
        currentBoard={currentBoard}
        onApplyRecipe={handleApplyAutoRecipe}
        themeMode={themeMode}
      />

      {/* IPC-7711 / 7721 Precision Soldering & Rework Repair Bench */}
      <ReworkRepairStationModal
        isOpen={isReworkModalOpen}
        onClose={() => setIsReworkModalOpen(false)}
        defect={reworkTargetDefect || selectedDefect}
        board={currentBoard}
        onCompleteRework={handleCompleteRework}
        themeMode={themeMode}
      />

      {/* AI Defect Learning DB & Active Learning Optimizer */}
      <DefectLearningDatabaseModal
        isOpen={isDefectLearningModalOpen}
        onClose={() => setIsDefectLearningModalOpen(false)}
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
    </div>
  );
}
