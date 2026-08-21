import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { LiveInspectionLine } from '../../components/ProductionLiveStream/LiveInspectionLine';
import { useSyncUrlState } from '../../hooks/useSyncUrlState';

export function MainLayout() {
  useSyncUrlState();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-transparent">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <Header />

        {/* Global Live Inspection Line Ticker */}
        <LiveInspectionLine />

        {/* View Router Outlet */}
        <section className="flex-1 flex flex-col overflow-hidden relative min-h-0">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
