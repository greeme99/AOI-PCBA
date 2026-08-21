import React from 'react';
import { MultiAngleLightingEnsemble } from '../components/EnsembleCalibration/MultiAngleLightingEnsemble';
import { useInspectionStore } from '../stores/useInspectionStore';
import { useUIStore } from '../stores/useUIStore';

export default function EnsemblePage() {
  const currentBoard = useInspectionStore((s) => s.getCurrentBoard());
  const themeMode = useUIStore((s) => s.themeMode);

  return (
    <MultiAngleLightingEnsemble
      currentBoard={currentBoard}
      themeMode={themeMode}
    />
  );
}
