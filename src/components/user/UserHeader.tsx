'use client';

import { Input, Badge, Dropdown, Avatar, Button } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useSidebarStore } from '@/store/sidebar.store';
import { notificationService } from '@/lib/api-services';

export function UserHeader() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { collapsed, toggle } = useSidebarStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    notificationService.list({ limit: 1 })
      .then((r) => {
        const total = r.data.pagination.total;
        const hasUnread = (r.data.data[0] && !r.data.data[0].isRead);
        setUnreadCount(hasUnread ? total : 0);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
      onClick: () => router.push('/user/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => router.push('/user/settings'),
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Thông báo',
      onClick: () => router.push('/user/notifications'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      router.push('/');
    }
  };

  return (
    <header className="user-glass-header fixed top-0 right-0 h-16 flex items-center justify-between px-6 z-50"
            style={{ left: collapsed ? '0px' : '0px', transition: 'left 0.3s ease' }}>
      <div className="flex items-center gap-6">
        <Button
          type="text"
          onClick={toggle}
          className="!text-white"
        />

        <div className="relative w-full max-w-md group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            <SearchOutlined />
          </span>
          <Input
            placeholder="Tìm kiếm bài học, từ vựng..."
            className="!bg-white/5 !border !border-white/10 !text-sm !text-white !rounded-xl !pl-10 !pr-4 !py-2 placeholder:!text-gray-500 focus:!border-primary/50 focus:!bg-white/5"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-secondary/20 px-3 py-1.5 rounded-full border border-secondary/30">
          <DollarOutlined className="text-secondary text-sm" />
          <span className="text-sm font-bold text-slate-100">{user?.coinBalance ?? 25} Xu</span>
        </div>

        <Badge count={unreadCount} size="small" offset={[-2, 2]}>
          <Button type="text" icon={<BellOutlined />} className="!text-white" onClick={() => router.push('/user/notifications')} />
        </Badge>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-white leading-none">{user?.name ?? 'Alex Park'}</p>
            <p className="text-[10px] text-slate-400">Cấp 14 - Người học</p>
          </div>

          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1.5 rounded-xl transition-all">
              <div className="size-10 rounded-full border-2 border-primary/50 overflow-hidden p-0.5">
                {user?.avatar ? (
                  <Avatar src={user.avatar} className="w-full h-full" />
                ) : (
                  <Avatar icon={<UserOutlined />} className="!bg-primary-600 w-full h-full" />
                )}
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
