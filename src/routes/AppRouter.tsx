import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AnalyticsLayout } from './layouts/AnalyticsLayout';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy loading pages
const InspectionPage = lazy(() => import('../pages/InspectionPage'));
const RecipePage = lazy(() => import('../pages/RecipePage'));
const SPCPage = lazy(() => import('../pages/SPCPage'));
const FleetPage = lazy(() => import('../pages/FleetPage'));
const AnomalyPage = lazy(() => import('../pages/AnomalyPage'));
const AutoTunePage = lazy(() => import('../pages/AutoTunePage'));
const PdMPage = lazy(() => import('../pages/PdMPage'));
const EnsemblePage = lazy(() => import('../pages/EnsemblePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/inspection" replace /> },
      {
        path: 'inspection',
        element: (
          <React.Suspense fallback={<div className="p-8 text-slate-500">Loading Inspection...</div>}>
            <InspectionPage />
          </React.Suspense>
        ),
      },
      {
        path: 'recipe',
        element: (
          <React.Suspense fallback={<div className="p-8 text-slate-500">Loading Recipe Editor...</div>}>
            <RecipePage />
          </React.Suspense>
        ),
      },
      {
        path: 'analytics',
        element: <AnalyticsLayout />,
        children: [
          { index: true, element: <Navigate to="/analytics/spc" replace /> },
          {
            path: 'spc',
            element: (
              <React.Suspense fallback={<div className="p-8 text-slate-500">Loading SPC...</div>}>
                <SPCPage />
              </React.Suspense>
            ),
          },
          {
            path: 'fleet',
            element: (
              <React.Suspense fallback={<div className="p-8 text-slate-500">Loading Fleet...</div>}>
                <FleetPage />
              </React.Suspense>
            ),
          },
          {
            path: 'anomaly',
            element: (
              <React.Suspense fallback={<div className="p-8 text-slate-500">Loading Anomaly...</div>}>
                <AnomalyPage />
              </React.Suspense>
            ),
          },
          {
            path: 'autotune',
            element: (
              <React.Suspense fallback={<div className="p-8 text-slate-500">Loading AutoTune...</div>}>
                <AutoTunePage />
              </React.Suspense>
            ),
          },
          {
            path: 'pdm',
            element: (
              <React.Suspense fallback={<div className="p-8 text-slate-500">Loading PdM...</div>}>
                <PdMPage />
              </React.Suspense>
            ),
          },
          {
            path: 'ensemble',
            element: (
              <React.Suspense fallback={<div className="p-8 text-slate-500">Loading Ensemble...</div>}>
                <EnsemblePage />
              </React.Suspense>
            ),
          },
        ],
      },
      {
        path: '*',
        element: (
          <React.Suspense fallback={<div className="p-8 text-slate-500">Loading...</div>}>
            <NotFoundPage />
          </React.Suspense>
        ),
      },
    ],
  },
]);
