import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Camera } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useModalStore } from '../../stores/useModalStore';

export function AnalyticsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  const themeMode = useUIStore((s) => s.themeMode);
  const isDark = themeMode === 'dark';

  const openModal = useModalStore((s) => s.open);

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
      {/* Analytics Sub-Navigation */}
      <div
        className={`flex items-center px-4 py-2 border-b text-xs font-semibold space-x-1 shrink-0 overflow-x-auto ${
          isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <button
          type="button"
          onClick={() => navigate({ pathname: '/analytics/spc', search: location.search })}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
            isActive('/analytics/spc')
              ? isDark ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-emerald-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          SPC
        </button>
        <button
          type="button"
          onClick={() => navigate({ pathname: '/analytics/fleet', search: location.search })}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center space-x-1 whitespace-nowrap ${
            isActive('/analytics/fleet')
              ? isDark ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-indigo-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>3.1 Fleet</span>
        </button>
        <button
          type="button"
          onClick={() => navigate({ pathname: '/analytics/anomaly', search: location.search })}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center space-x-1 whitespace-nowrap ${
            isActive('/analytics/anomaly')
              ? isDark ? 'bg-cyan-600 text-white shadow-xs' : 'bg-white text-cyan-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>3.2 Anomaly</span>
        </button>
        <button
          type="button"
          onClick={() => navigate({ pathname: '/analytics/autotune', search: location.search })}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center space-x-1 whitespace-nowrap ${
            isActive('/analytics/autotune')
              ? isDark ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-amber-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>3.3 Auto-Tune</span>
        </button>
        <button
          type="button"
          onClick={() => navigate({ pathname: '/analytics/pdm', search: location.search })}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center space-x-1 whitespace-nowrap ${
            isActive('/analytics/pdm')
              ? isDark ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-rose-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>3.4 PdM</span>
        </button>
        
        <div className={`h-4 w-[1px] mx-2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />

        <button
          type="button"
          onClick={() => openModal('quality-certificate')}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center space-x-1 whitespace-nowrap ${
            isDark ? 'text-emerald-400 hover:text-emerald-200 hover:bg-slate-800' : 'text-emerald-700 hover:text-emerald-900 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-500" />
          <span>3.5 성적서(PDF)</span>
        </button>
        <button
          type="button"
          onClick={() => navigate({ pathname: '/analytics/ensemble', search: location.search })}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center space-x-1 whitespace-nowrap ${
            isActive('/analytics/ensemble')
              ? isDark ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-purple-600 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-purple-400" />
          <span>3.6 앙상블</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <Outlet />
      </div>
    </div>
  );
}
