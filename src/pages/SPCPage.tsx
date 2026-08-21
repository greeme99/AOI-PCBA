import React from 'react';
import { SPCDashboard } from '../components/SPCAnalytics/SPCDashboard';
import { useInspectionStore } from '../stores/useInspectionStore';
import { useUIStore } from '../stores/useUIStore';

export default function SPCPage() {
  const activeLine = useInspectionStore((s) => s.getActiveLine());
  const smtLines = useInspectionStore((s) => s.smtLines);
  const selectLine = useInspectionStore((s) => s.selectLine);
  const themeMode = useUIStore((s) => s.themeMode);

  return (
    <SPCDashboard
      activeLine={activeLine}
      lines={smtLines}
      onSelectLine={selectLine}
      themeMode={themeMode}
    />
  );
}
