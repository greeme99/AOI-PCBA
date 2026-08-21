import React from 'react';
import { GoldenMasterDiffViewer } from '../components/AnomalyEngine/GoldenMasterDiffViewer';
import { useInspectionStore } from '../stores/useInspectionStore';
import { useUIStore } from '../stores/useUIStore';

export default function AnomalyPage() {
  const currentBoard = useInspectionStore((s) => s.getCurrentBoard());
  const themeMode = useUIStore((s) => s.themeMode);

  return (
    <GoldenMasterDiffViewer
      currentBoard={currentBoard}
      themeMode={themeMode}
    />
  );
}
