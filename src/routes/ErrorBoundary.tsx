import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';

export function ErrorBoundary() {
  const error = useRouteError();
  const themeMode = useUIStore((s) => s.themeMode);
  const isDark = themeMode === 'dark';

  let errorMessage = 'An unexpected error occurred.';
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center p-8 text-center h-full ${
        isDark ? 'bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'
      }`}
    >
      <div className="bg-rose-500/10 p-4 rounded-full mb-4 text-rose-500">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Application Error</h1>
      <p className="text-sm mb-6 max-w-md opacity-80">{errorMessage}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Reload Page
      </button>
    </div>
  );
}
