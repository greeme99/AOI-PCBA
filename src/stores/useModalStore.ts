import { create } from 'zustand';
import { InspectionDefect } from '../types/aoi';

export type ModalName =
  | 'component-inspector'
  | 'gerber-bom'
  | 'report-8d'
  | 'rework-station'
  | 'auto-teaching'
  | 'smartphone-camera'
  | 'closed-loop'
  | 'defect-learning'
  | 'quality-certificate';

interface ModalState {
  activeModal: ModalName | null;
  modalProps: Record<string, any>;

  // Rework-specific (needs defect data passed at open time)
  reworkTargetDefect: InspectionDefect | null;

  // Actions
  open: (name: ModalName, props?: Record<string, any>) => void;
  close: () => void;
  openRework: (defect: InspectionDefect) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  activeModal: null,
  modalProps: {},
  reworkTargetDefect: null,

  open: (name, props = {}) =>
    set({
      activeModal: name,
      modalProps: props,
    }),

  close: () =>
    set({
      activeModal: null,
      modalProps: {},
    }),

  openRework: (defect) =>
    set({
      activeModal: 'rework-station',
      modalProps: {},
      reworkTargetDefect: defect,
    }),
}));
