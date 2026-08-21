import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode } from '../types/aoi';

interface UIState {
  // --- Persisted ---
  themeMode: ThemeMode;
  sidebarCollapsed: boolean;

  // --- Session-only ---
  isMobileSidebarOpen: boolean;
  mobileInspectionTab: 'canvas' | 'review';
  wsStatus: 'connected' | 'disconnected';
  isAiPanelOpen: boolean;

  // --- Computed helper ---
  get isDark(): boolean;

  // --- Actions ---
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setMobileInspectionTab: (tab: 'canvas' | 'review') => void;
  setWsStatus: (status: 'connected' | 'disconnected') => void;
  toggleAiPanel: () => void;
  setAiPanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Persisted defaults
      themeMode: (() => {
        // Initial theme detection (only runs once at store creation)
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('themeMode');
          if (saved === 'dark' || saved === 'light') return saved as ThemeMode;
          if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
        }
        return 'light';
      })(),
      sidebarCollapsed: false,

      // Session-only defaults
      isMobileSidebarOpen: false,
      mobileInspectionTab: 'canvas',
      wsStatus: 'disconnected',
      isAiPanelOpen: false,

      // Computed
      get isDark() {
        return get().themeMode === 'dark';
      },

      // Actions
      toggleTheme: () =>
        set((state) => {
          const next = state.themeMode === 'dark' ? 'light' : 'dark';
          // Sync dark class on <html>
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next === 'dark');
          }
          return { themeMode: next };
        }),

      setThemeMode: (mode) =>
        set(() => {
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', mode === 'dark');
          }
          return { themeMode: mode };
        }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
      setMobileInspectionTab: (tab) => set({ mobileInspectionTab: tab }),
      setWsStatus: (status) => set({ wsStatus: status }),

      toggleAiPanel: () =>
        set((state) => ({ isAiPanelOpen: !state.isAiPanelOpen })),

      setAiPanelOpen: (open) => set({ isAiPanelOpen: open }),
    }),
    {
      name: 'aoi-ui-store', // localStorage key
      partialize: (state) => ({
        themeMode: state.themeMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
