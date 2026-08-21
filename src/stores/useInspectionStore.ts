import { create } from 'zustand';
import {
  PCBBoard,
  PCBComponent,
  InspectionDefect,
  LightingMode,
  CameraAngle,
  ReviewStatus,
  IPCClass,
  InspectionRecipe,
  SMTLineStatus,
} from '../types/aoi';
import {
  INITIAL_SMT_LINES,
  SAMPLE_BOARDS,
  INITIAL_RECIPES,
} from '../mock/pcbData';

interface InspectionState {
  // --- Line & Board ---
  smtLines: SMTLineStatus[];
  activeLineId: string;
  boards: Record<string, PCBBoard>;
  currentModelKey: string;
  selectedDefect: InspectionDefect | null;
  selectedComponent: PCBComponent | null;

  // --- Optical Controls ---
  lightingMode: LightingMode;
  cameraAngle: CameraAngle;
  showSilkscreen: boolean;
  showTraces: boolean;
  showPads: boolean;
  showDefectOverlay: boolean;
  show3DHeightMap: boolean;
  isPanelMode: boolean;
  zoomLevel: number;

  // --- Scan ---
  isScanning: boolean;
  scanProgress: number;

  // --- Standards & Recipes ---
  ipcClass: IPCClass;
  recipes: Record<string, InspectionRecipe>;

  // --- Toast ---
  learningSyncToast: { show: boolean; text: string; subText: string } | null;

  // --- Computed Getters (functions) ---
  getCurrentBoard: () => PCBBoard;
  getActiveLine: () => SMTLineStatus;
  getCurrentRecipe: () => InspectionRecipe;

  // --- Actions ---
  selectLine: (lineId: string) => void;
  selectModel: (modelKey: string) => void;
  setSelectedDefect: (defect: InspectionDefect | null) => void;
  setSelectedComponent: (component: PCBComponent | null) => void;
  setLightingMode: (mode: LightingMode) => void;
  setCameraAngle: (angle: CameraAngle) => void;
  setShowSilkscreen: (show: boolean) => void;
  setShowTraces: (show: boolean) => void;
  setShowPads: (show: boolean) => void;
  setShowDefectOverlay: (show: boolean) => void;
  setShow3DHeightMap: (show: boolean) => void;
  setIsPanelMode: (mode: boolean) => void;
  setZoomLevel: (level: number) => void;
  setIpcClass: (cls: IPCClass) => void;
  triggerScan: () => void;
  updateDefectStatus: (defectId: string, status: ReviewStatus, comment?: string) => void;
  saveRecipe: (recipe: InspectionRecipe) => void;
  importBoard: (board: PCBBoard) => void;
  importSmartphoneBoard: (board: PCBBoard) => void;
  applyAutoRecipe: (recipe: InspectionRecipe) => void;
  setLearningSyncToast: (toast: { show: boolean; text: string; subText: string } | null) => void;
}

export const useInspectionStore = create<InspectionState>()((set, get) => ({
  // --- Initial State ---
  smtLines: INITIAL_SMT_LINES,
  activeLineId: 'LINE-01',
  boards: SAMPLE_BOARDS,
  currentModelKey: 'ECU-2026-AUTO',
  selectedDefect: SAMPLE_BOARDS['ECU-2026-AUTO'].defects[0] || null,
  selectedComponent: SAMPLE_BOARDS['ECU-2026-AUTO'].components[0] || null,

  lightingMode: 'COMPOSITE_RGB',
  cameraAngle: 'TOP_COAXIAL',
  showSilkscreen: true,
  showTraces: true,
  showPads: true,
  showDefectOverlay: true,
  show3DHeightMap: false,
  isPanelMode: false,
  zoomLevel: 1.0,

  isScanning: false,
  scanProgress: 0,

  ipcClass: 'Class 3 (High Reliability / Automotive)',
  recipes: INITIAL_RECIPES,

  learningSyncToast: null,

  // --- Computed Getters ---
  getCurrentBoard: () => {
    const { boards, currentModelKey } = get();
    return boards[currentModelKey] || SAMPLE_BOARDS['ECU-2026-AUTO'];
  },

  getActiveLine: () => {
    const { smtLines, activeLineId } = get();
    return smtLines.find((l) => l.id === activeLineId) || smtLines[0];
  },

  getCurrentRecipe: () => {
    const { recipes, currentModelKey } = get();
    return recipes[currentModelKey] || INITIAL_RECIPES['ECU-2026-AUTO'];
  },

  // --- Actions ---
  selectLine: (lineId) => set({ activeLineId: lineId }),

  selectModel: (modelKey) => {
    const { boards } = get();
    const targetBoard = boards[modelKey];
    set({
      currentModelKey: modelKey,
      selectedDefect: targetBoard?.defects[0] || null,
      selectedComponent: targetBoard?.components[0] || null,
    });
  },

  setSelectedDefect: (defect) => set({ selectedDefect: defect }),
  setSelectedComponent: (component) => set({ selectedComponent: component }),
  setLightingMode: (mode) => set({ lightingMode: mode }),
  setCameraAngle: (angle) => set({ cameraAngle: angle }),
  setShowSilkscreen: (show) => set({ showSilkscreen: show }),
  setShowTraces: (show) => set({ showTraces: show }),
  setShowPads: (show) => set({ showPads: show }),
  setShowDefectOverlay: (show) => set({ showDefectOverlay: show }),
  setShow3DHeightMap: (show) => set({ show3DHeightMap: show }),
  setIsPanelMode: (mode) => set({ isPanelMode: mode }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
  setIpcClass: (cls) => set({ ipcClass: cls }),
  setLearningSyncToast: (toast) => set({ learningSyncToast: toast }),

  triggerScan: () => {
    if (get().isScanning) return;
    set({ isScanning: true, scanProgress: 0 });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      set({ scanProgress: progress });
      if (progress >= 100) {
        clearInterval(interval);
        set({ isScanning: false });
      }
    }, 45);
  },

  updateDefectStatus: (defectId, status, comment) => {
    const { currentModelKey, boards, lightingMode } = get();
    const board = boards[currentModelKey];
    if (!board) return;

    const targetDefect = board.defects.find((d) => d.id === defectId);

    // Auto-update to Defect Learning DB on backend
    if (targetDefect) {
      fetch('/api/defect-db/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardModel: board.model,
          componentRefDes: targetDefect.refDes,
          packageType: (targetDefect as any).componentType || 'SMD',
          defectType: targetDefect.type,
          severity: targetDefect.severity,
          disposition: status,
          operatorId: 'OP-441',
          operatorNotes: comment || `판정 상태: ${status} (Auto-logged from AOI Review Console)`,
          opticalLighting: lightingMode,
          measuredMetrics: {
            solderHeightUm: (targetDefect as any).solderHeight || 140,
            wettingAngleDeg: (targetDefect as any).wettingAngle || 45,
            leadCoplanarityUm: (targetDefect as any).coplanarity || 18,
            solderVolumePct: (targetDefect as any).solderVolume || 100,
            offsetX: (targetDefect as any).offsetX,
            offsetY: (targetDefect as any).offsetY,
            rotation: (targetDefect as any).rotation,
          },
        }),
      })
        .then(() => {
          set({
            learningSyncToast: {
              show: true,
              text: `[${targetDefect.refDes}] ${status === 'FALSE_CALL' ? '가성불량' : '결함'} 샘플이 AI 학습 DB에 자동 등록되었습니다.`,
              subText: '검출 가중치 최적화 데이터셋에 실시간 반영 완료 (+1 Sample)',
            },
          });
          setTimeout(() => set({ learningSyncToast: null }), 4000);
        })
        .catch((err) => console.error('Failed to auto-record to Defect DB:', err));
    }

    const updatedDefects = board.defects.map((d) =>
      d.id === defectId ? { ...d, reviewStatus: status, reviewComment: comment } : d
    );

    const hasCriticalPending = updatedDefects.some(
      (d) => d.reviewStatus === 'CONFIRMED_DEFECT' || d.reviewStatus === 'PENDING'
    );

    set({
      boards: {
        ...boards,
        [currentModelKey]: {
          ...board,
          status: hasCriticalPending ? 'FAIL' : 'PASS',
          defects: updatedDefects,
        },
      },
    });
  },

  saveRecipe: (updated) => {
    const { currentModelKey, recipes } = get();
    set({
      recipes: { ...recipes, [currentModelKey]: updated },
    });
  },

  importBoard: (newBoard) => {
    const { boards } = get();
    set({
      boards: { ...boards, [newBoard.model]: newBoard },
      currentModelKey: newBoard.model,
      selectedDefect: newBoard.defects[0] || null,
      selectedComponent: newBoard.components[0] || null,
    });
  },

  importSmartphoneBoard: (newBoard) => {
    const { boards } = get();
    set({
      boards: { ...boards, [newBoard.id]: newBoard },
      currentModelKey: newBoard.id,
      selectedDefect: newBoard.defects[0] || null,
      selectedComponent: newBoard.components[0] || null,
    });
  },

  applyAutoRecipe: (newRecipe) => {
    const { recipes } = get();
    set({
      recipes: { ...recipes, [newRecipe.modelName]: newRecipe },
    });
  },
}));
