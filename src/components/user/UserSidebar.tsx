'use client';

import { Layout, Menu, Tooltip, Button } from 'antd';
import {
  DashboardOutlined,
  PlaySquareOutlined,
  BookOutlined,
  QuestionOutlined,
  LineChartOutlined,
  WalletOutlined,
  UserOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import imgKMATELOGO from '../../../assets/img/branding/KMATELOGO.png';
import imgKMATEICO from '../../../assets/img/branding/KMATEICO.ico';
import { useSidebarStore } from '@/store/sidebar.store';

const { Sider } = Layout;

const navItems = [
  { key: '/user/dashboard', icon: <DashboardOutlined />, label: 'Bảng điều khiển', href: '/user/dashboard' },
  { key: '/user/explore', icon: <PlaySquareOutlined />, label: 'Khám phá video', href: '/user/explore' },
  { key: '/user/flashcards', icon: <BookOutlined />, label: 'Flashcard', href: '/user/flashcards' },
  { key: '/user/quiz', icon: <QuestionOutlined />, label: 'Luyện quiz', href: '/user/quiz' },
  { key: '/user/progress', icon: <LineChartOutlined />, label: 'Tiến độ của tôi', href: '/user/progress' },
  { key: '/user/wallet', icon: <WalletOutlined />, label: 'Ví xu', href: '/user/wallet' },
  { key: '/user/profile', icon: <UserOutlined />, label: 'Trang cá nhân', href: '/user/profile' },
  { key: '/user/notifications', icon: <BellOutlined />, label: 'Thông báo', href: '/user/notifications' },
];

export function UserSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarStore();

  const activeKey = navItems.find((item) => pathname.startsWith(item.key))?.key ?? '/user/dashboard';

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="!user-glass-sidebar"
      width={260}
      collapsedWidth={80}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        overflow: 'hidden',
      }}
      trigger={null}
    >
      <div className="h-16 flex items-center justify-center border-b border-white/10">
        <Link href="/user/dashboard">
          {collapsed ? (
            <Image src={imgKMATEICO} alt="K-MATE" width={32} height={32} className="object-contain" />
          ) : (
            <Image src={imgKMATELOGO} alt="K-MATE" width={120} height={40} className="object-contain" />
          )}
        </Link>
      </div>

      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const menuItem = {
            key: item.href,
            icon: item.icon,
            label: item.label,
            className: `!text-gray-300 hover:!bg-white/5 hover:!text-white rounded-xl mx-0 my-1 transition-all !text-sm ${activeKey === item.href ? '!bg-primary/10 !text-primary !border !border-primary/20' : ''}`,
          };

          if (collapsed) {
            return (
              <Tooltip key={item.key} title={item.label} placement="right">
                <div
                  className={`cursor-pointer flex items-center justify-center h-10 rounded-xl transition-all !text-sm ${activeKey === item.key ? '!bg-primary/10 !text-primary' : '!text-gray-300 hover:!bg-white/5 hover:!text-white'}`}
                  onClick={() => router.push(item.href)}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                </div>
              </Tooltip>
            );
          }

          return (
            <Menu
              key={item.key}
              mode="inline"
              theme="dark"
              className="!bg-transparent !border-0"
              items={[menuItem]}
              onClick={() => router.push(item.href)}
            />
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
        {!collapsed && (
          <div className="glass rounded-2xl p-4 border border-primary/10 relative overflow-hidden group">
            <div className="absolute -right-2 -top-2 w-16 h-16 bg-primary/10 blur-2xl rounded-full" />
            <p className="text-xs text-slate-400 mb-2">Trợ lý AI của bạn</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-white">Sẵn sàng hỗ trợ</span>
            </div>
          </div>
        )}

        <Tooltip title={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'} placement="right">
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            className="!w-full !h-10 !flex !items-center !justify-center !rounded-xl !text-gray-400 hover:!bg-white/5 hover:!text-white transition-all"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            {!collapsed && <span className="ml-3 text-sm">Thu gọn</span>}
          </Button>
        </Tooltip>
      </div>
    </Sider>
  );
}
