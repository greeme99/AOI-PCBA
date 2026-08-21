import React from 'react';
import { CentralFleetDashboard } from '../components/FleetControl/CentralFleetDashboard';
import { useInspectionStore } from '../stores/useInspectionStore';
import { useUIStore } from '../stores/useUIStore';

export default function FleetPage() {
  const smtLines = useInspectionStore((s) => s.smtLines);
  const activeLineId = useInspectionStore((s) => s.activeLineId);
  const selectLine = useInspectionStore((s) => s.selectLine);
  const recipes = useInspectionStore((s) => s.recipes);
  const currentBoard = useInspectionStore((s) => s.getCurrentBoard());
  const themeMode = useUIStore((s) => s.themeMode);

  return (
    <CentralFleetDashboard
      lines={smtLines}
      activeLineId={activeLineId}
      onSelectLine={selectLine}
      recipes={recipes}
      currentBoard={currentBoard}
      themeMode={themeMode}
    />
  );
}
