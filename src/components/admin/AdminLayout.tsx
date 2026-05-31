'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  DashboardOutlined,
  TeamOutlined,
  DollarOutlined,
  RobotOutlined,
  TrophyOutlined,
  ShoppingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Layout, Spin } from 'antd';
import { useAuthStore } from '@/store/auth.store';
import imgKMATELOGO from '../../../assets/img/branding/KMATELOGO.png';

const { Sider } = Layout;

const adminNavItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan', href: '/admin/dashboard' },
  { key: '/admin/users', icon: <TeamOutlined />, label: 'Người dùng', href: '/admin/users' },
  { key: '/admin/payments', icon: <DollarOutlined />, label: 'Thanh toán', href: '/admin/payments' },
  { key: '/admin/ai-queue', icon: <RobotOutlined />, label: 'AI Queue', href: '/admin/ai-queue' },
  { key: '/admin/achievements', icon: <TrophyOutlined />, label: 'Thành tựu', href: '/admin/achievements' },
  { key: '/admin/packages', icon: <ShoppingOutlined />, label: 'Gói Coin', href: '/admin/packages' },
  { key: '/admin/logs', icon: <FileTextOutlined />, label: 'Audit Log', href: '/admin/logs' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();

  // TODO: re-enable auth guard before production
  useEffect(() => {
    // if (!_hasHydrated) return;
    // if (!isAuthenticated) {
    //   router.push('/admin/login');
    // } else if (user?.role !== 'ADMIN') {
    //   router.push('/user/dashboard');
    // }
  }, [_hasHydrated, isAuthenticated, user, router]);

  // TODO: re-enable hydration check before production
  // if (!_hasHydrated) {
  //   return (
  //     <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  // TODO: re-enable auth guard before production
  const activeKey = adminNavItems.find((item) => pathname.startsWith(item.key))?.key ?? '/admin/dashboard';

  // TODO: re-enable auth guard before production
  // if (!isAuthenticated || user?.role !== 'ADMIN') {
  //   return (
  //     <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
  //       <div className="text-white">Đang chuyển hướng...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen bg-[#0B0B0F]">
      {/* Admin Sidebar */}
      <Sider
        width={240}
        className="!bg-[#111827] border-r border-white/5"
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50 }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/5 px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image src={imgKMATELOGO} alt="K-MATE" width={110} height={28} className="object-contain" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1">
          {adminNavItems.map((item) => (
            <div
              key={item.key}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-sm font-medium ${
                activeKey === item.key
                  ? 'bg-primary/20 text-primary border border-primary/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
          <div
            onClick={() => router.push('/user/dashboard')}
            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-500 hover:bg-white/5 hover:text-white text-sm transition-all"
          >
            <span style={{ fontSize: 16 }}>←</span>
            <span>Quay về User Site</span>
          </div>
        </div>
      </Sider>

      {/* Main content */}
      <div className="flex-1 ml-60">
        {/* Admin Header */}
        <header className="h-16 border-b border-white/5 bg-[#111827] px-8 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-white font-bold text-lg capitalize">
            {adminNavItems.find((item) => activeKey === item.key)?.label || 'Admin'}
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">{user?.email}</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
