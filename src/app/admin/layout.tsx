'use client';

import { Suspense } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  );
}
