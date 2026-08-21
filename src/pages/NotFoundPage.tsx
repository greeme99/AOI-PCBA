import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchX, ArrowLeft, Home } from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const themeMode = useUIStore((s) => s.themeMode);
  const isDark = themeMode === 'dark';

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center p-8 text-center h-full ${
        isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-800'
      }`}
    >
      <div className="mb-6 relative">
        <div className={`absolute -inset-4 rounded-full blur-xl opacity-50 ${isDark ? 'bg-blue-900/30' : 'bg-blue-200'}`} />
        <div className={`relative p-6 rounded-full shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <SearchX className={`w-16 h-16 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold mb-2 tracking-tight">404</h1>
      <h2 className="text-xl font-bold mb-4 opacity-90">Page Not Found</h2>
      
      <p className={`text-sm mb-8 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        요청하신 페이지를 찾을 수 없거나 이동되었습니다.
        주소를 다시 확인하시거나 메인 페이지로 돌아가 주세요.
      </p>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
            isDark
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로 가기</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30"
        >
          <Home className="w-4 h-4" />
          <span>메인으로</span>
        </button>
      </div>
    </div>
  );
}
