import { Suspense } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { AppPlayer } from '@/components/layout/app-player';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>

      {/* Mini Player */}
      <AppPlayer />
    </div>
  );
}
