'use client';

import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import { 
  HomeOutlined, 
  SearchOutlined, 
  PlaySquareOutlined,
  PlusSquareOutlined,
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  DollarOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function AppSidebar({ collapsed = false, onCollapse }: AppSidebarProps) {
  const router = useRouter();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: 'Search Videos',
    },
    {
      key: '/library',
      icon: <PlaySquareOutlined />,
      label: 'My Library',
    },
    {
      key: '/flashcards',
      icon: <BookOutlined />,
      label: 'Flashcards',
    },
    {
      key: '/wallet',
      icon: <DollarOutlined />,
      label: 'Wallet',
    },
  ];

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={onCollapse}
      className="!bg-dark-400 border-r border-dark-200"
      width={240}
      collapsedWidth={80}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-dark-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🇰🇷</span>
          {!collapsed && (
            <span className="text-xl font-bold text-white">K-MATE</span>
          )}
        </Link>
      </div>

      {/* Menu */}
      <Menu 
        mode="inline" 
        theme="dark"
        className="!bg-transparent !border-0"
        items={menuItems.map(item => ({
          ...item,
          className: '!text-gray-300 hover:!bg-dark-200 hover:!text-white rounded-lg mx-2 my-1',
        }))}
        onClick={({ key }) => router.push(key)}
      />

      {/* User section at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-200">
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} className="!bg-primary-600" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">User Name</p>
              <p className="text-gray-400 text-xs flex items-center gap-1">
                <DollarOutlined className="text-yellow-400" />
                <span>100 coins</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Sider>
  );
}
