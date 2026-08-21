import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import { router } from './routes/AppRouter';
import { GlobalModals } from './components/GlobalModals';

// Stores
import { useUIStore } from './stores/useUIStore';
import { useInspectionStore } from './stores/useInspectionStore';

export default function App() {
  const themeMode = useUIStore((s) => s.themeMode);
  const wsStatus = useUIStore((s) => s.wsStatus);
  const setWsStatus = useUIStore((s) => s.setWsStatus);
  
  const triggerScan = useInspectionStore((s) => s.triggerScan);

  // Sync dark mode class on <html> element at mount
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  // Mock WebSocket connection
  useEffect(() => {
    // 💡 [v1.1 Phase 1] Mock Offline 시뮬레이션 비활성화
    // 의도적인 1초 뒤 'disconnected' 에러를 막기 위해 주석 처리합니다.
    /*
    const timeout = setTimeout(() => {
      setWsStatus('disconnected');
    }, 1000);
    return () => clearTimeout(timeout);
    */
    
    // 항상 connected 상태로 유지
    setWsStatus('connected');
  }, [setWsStatus]);

  // Keyboard fallback listener for manual barcode scanning
  useEffect(() => {
    if (wsStatus === 'connected') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.target instanceof HTMLElement && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        triggerScan();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [wsStatus, triggerScan]);

  const isDark = themeMode === 'dark';

  return (
    <>
      <div
        id="aoi-app-root"
        className={`flex h-screen w-screen font-sans overflow-hidden select-none transition-colors duration-200 ${
          isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-100 text-slate-800'
        }`}
      >
        <RouterProvider router={router} />
      </div>
      
      {/* WS Disconnect Warning Banner */}
      {wsStatus === 'disconnected' && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-rose-500 text-white px-3 py-1.5 rounded-b-lg shadow-lg flex items-center space-x-2 text-xs font-semibold">
          <WifiOff className="w-3 h-3" />
          <span>WebSocket Offline: Manual HID Mode</span>
        </div>
      )}

      {/* ═══════════════ Global Modals ═══════════════ */}
      <GlobalModals />
    </>
  );
}
