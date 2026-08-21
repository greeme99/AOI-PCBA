import React from 'react';
import { PredictiveMaintenanceDashboard } from '../components/PdM/PredictiveMaintenanceDashboard';
import { useInspectionStore } from '../stores/useInspectionStore';
import { useUIStore } from '../stores/useUIStore';

export default function PdMPage() {
  const activeLine = useInspectionStore((s) => s.getActiveLine());
  const themeMode = useUIStore((s) => s.themeMode);

  return (
    <PredictiveMaintenanceDashboard
      activeLine={activeLine}
      themeMode={themeMode}
    />
  );
}
