import React from 'react';
import { Scan, ListChecks } from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';
import { useInspectionStore } from '../stores/useInspectionStore';
import { useModalStore } from '../stores/useModalStore';

import { PCBToolbar } from '../components/PCBViewer/PCBToolbar';
import { PCBCanvas } from '../components/PCBViewer/PCBCanvas';
import { DefectReviewPanel } from '../components/ReviewStation/DefectReviewPanel';
import { AIIntelligencePanel } from '../components/AIAssistant/AIIntelligencePanel';

export default function InspectionPage() {
  const themeMode = useUIStore((s) => s.themeMode);
  const mobileInspectionTab = useUIStore((s) => s.mobileInspectionTab);
  const setMobileInspectionTab = useUIStore((s) => s.setMobileInspectionTab);
  const isAiPanelOpen = useUIStore((s) => s.isAiPanelOpen);
  const setAiPanelOpen = useUIStore((s) => s.setAiPanelOpen);

  const isDark = themeMode === 'dark';

  const currentBoard = useInspectionStore((s) => s.getCurrentBoard());
  const selectedDefect = useInspectionStore((s) => s.selectedDefect);
  const setSelectedDefect = useInspectionStore((s) => s.setSelectedDefect);
  const selectedComponent = useInspectionStore((s) => s.selectedComponent);
  const setSelectedComponent = useInspectionStore((s) => s.setSelectedComponent);
  
  const lightingMode = useInspectionStore((s) => s.lightingMode);
  const setLightingMode = useInspectionStore((s) => s.setLightingMode);
  const cameraAngle = useInspectionStore((s) => s.cameraAngle);
  const setCameraAngle = useInspectionStore((s) => s.setCameraAngle);
  
  const showSilkscreen = useInspectionStore((s) => s.showSilkscreen);
  const setShowSilkscreen = useInspectionStore((s) => s.setShowSilkscreen);
  const showTraces = useInspectionStore((s) => s.showTraces);
  const setShowTraces = useInspectionStore((s) => s.setShowTraces);
  const showPads = useInspectionStore((s) => s.showPads);
  const setShowPads = useInspectionStore((s) => s.setShowPads);
  const showDefectOverlay = useInspectionStore((s) => s.showDefectOverlay);
  const setShowDefectOverlay = useInspectionStore((s) => s.setShowDefectOverlay);
  const show3DHeightMap = useInspectionStore((s) => s.show3DHeightMap);
  const setShow3DHeightMap = useInspectionStore((s) => s.setShow3DHeightMap);
  const isPanelMode = useInspectionStore((s) => s.isPanelMode);
  const setIsPanelMode = useInspectionStore((s) => s.setIsPanelMode);
  
  const zoomLevel = useInspectionStore((s) => s.zoomLevel);
  const setZoomLevel = useInspectionStore((s) => s.setZoomLevel);
  const isScanning = useInspectionStore((s) => s.isScanning);
  const scanProgress = useInspectionStore((s) => s.scanProgress);
  const ipcClass = useInspectionStore((s) => s.ipcClass);
  const updateDefectStatus = useInspectionStore((s) => s.updateDefectStatus);

  const openModal = useModalStore((s) => s.open);
  const openRework = useModalStore((s) => s.openRework);

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">


      {/* Mobile / Tablet Segmented Subview Switcher */}
      <div
        className={`md:hidden flex items-center border-b p-1.5 gap-2 shrink-0 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <button
          type="button"
          onClick={() => setMobileInspectionTab('canvas')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            mobileInspectionTab === 'canvas'
              ? 'bg-blue-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Scan className="w-3.5 h-3.5" />
          <span>3D 검사 캔버스</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileInspectionTab('review')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
            mobileInspectionTab === 'review'
              ? 'bg-rose-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <ListChecks className="w-3.5 h-3.5" />
          <span>결함 판정 ({currentBoard.defects.length}건)</span>
        </button>
      </div>

      {/* Inspection Workspace: Desktop Side-by-Side / Mobile Single-Tab */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Left Canvas Viewport */}
        <div
          className={`flex-1 h-full relative ${
            mobileInspectionTab === 'canvas' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <PCBCanvas
            board={currentBoard}
            selectedDefect={selectedDefect}
            onSelectDefect={setSelectedDefect}
            selectedComponent={selectedComponent}
            onSelectComponent={(comp) => {
              setSelectedComponent(comp);
              if (comp) openModal('component-inspector');
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
        <div
          className={`h-full shrink-0 ${
            mobileInspectionTab === 'review'
              ? 'w-full flex'
              : 'hidden md:flex md:w-[340px] lg:w-96'
          }`}
        >
          <DefectReviewPanel
            board={currentBoard}
            selectedDefect={selectedDefect}
            onSelectDefect={setSelectedDefect}
            onUpdateDefectStatus={updateDefectStatus}
            onOpenAIAnalysis={(defect) => {
              setSelectedDefect(defect);
              setAiPanelOpen(true);
            }}
            onOpenReworkStation={(defect) => openRework(defect)}
            ipcClass={ipcClass}
            themeMode={themeMode}
          />
        </div>

        {/* Floating Sub-toolbar for Lighting & Layer Overlays (Full Screen Bounds) */}
        <div className={`absolute inset-0 pointer-events-none z-30 ${mobileInspectionTab === 'review' ? 'hidden md:block' : 'block'}`}>
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
            onOpenSmartphoneModal={() => openModal('smartphone-camera')}
            zoomLevel={zoomLevel}
            onZoomIn={() => setZoomLevel(Math.min(Number((zoomLevel * 1.2).toFixed(2)), 6.0))}
            onZoomOut={() => setZoomLevel(Math.max(Number((zoomLevel * 0.8).toFixed(2)), 0.5))}
            onResetView={() => setZoomLevel(1.0)}
            themeMode={themeMode}
          />
        </div>
      </div>

      {/* AI Intelligence Drawer (Right overlay) */}
      {isAiPanelOpen && (
        <div className="fixed sm:absolute top-0 right-0 bottom-0 w-full sm:w-[420px] max-w-full shadow-2xl z-40 animate-in slide-in-from-right duration-200">
          <AIIntelligencePanel
            board={currentBoard}
            selectedDefect={selectedDefect}
            selectedComponent={selectedComponent}
            ipcClass={ipcClass}
            onOpen8DReport={() => openModal('report-8d')}
            onClose={() => setAiPanelOpen(false)}
            themeMode={themeMode}
          />
        </div>
      )}
    </div>
  );
}
