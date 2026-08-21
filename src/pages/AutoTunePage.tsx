import React from 'react';
import { AutoThresholdOptimizer } from '../components/AutoTuning/AutoThresholdOptimizer';
import { useInspectionStore } from '../stores/useInspectionStore';
import { useUIStore } from '../stores/useUIStore';

export default function AutoTunePage() {
  const currentBoard = useInspectionStore((s) => s.getCurrentBoard());
  const currentRecipe = useInspectionStore((s) => s.getCurrentRecipe());
  const saveRecipe = useInspectionStore((s) => s.saveRecipe);
  const themeMode = useUIStore((s) => s.themeMode);

  return (
    <AutoThresholdOptimizer
      currentBoard={currentBoard}
      activeRecipe={currentRecipe}
      onUpdateRecipe={saveRecipe}
      themeMode={themeMode}
    />
  );
}
