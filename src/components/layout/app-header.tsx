'use client';

import { Layout, Input, Badge, Dropdown, Avatar, Button } from 'antd';
import { 
  SearchOutlined, 
  BellOutlined, 
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Header } = Layout;

interface AppHeaderProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AppHeader({ collapsed, onToggle }: AppHeaderProps) {
  const router = useRouter();

  const notificationItems = [
    {
      key: '1',
      label: (
        <div className="py-2">
          <p className="font-medium">Video Ready!</p>
          <p className="text-gray-500 text-sm">Your video is ready to watch</p>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className="py-2">
          <p className="font-medium">Flashcard Reminder</p>
          <p className="text-gray-500 text-sm">You have 15 cards due for review</p>
        </div>
      ),
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  return (
    <Header className="!bg-dark-300 !px-4 !h-16 flex items-center justify-between border-b border-dark-200">
      {/* Left: Toggle + Search */}
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="!text-white"
        />
        <Input
          placeholder="Search videos..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="!w-80 !bg-dark-200 !border-dark-100 !text-white placeholder:!text-gray-500"
        />
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Dropdown menu={{ items: notificationItems }} placement="bottomRight" trigger={['click']}>
          <Badge count={3} size="small">
            <Button type="text" icon={<BellOutlined />} className="!text-white" />
          </Badge>
        </Dropdown>

        {/* User Menu */}
        <Dropdown menu={{ 
          items: userMenuItems,
          onClick: ({ key }) => {
            if (key === 'logout') {
              router.push('/');
            }
          }
        }} placement="bottomRight" trigger={['click']}>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-dark-200 px-3 py-1 rounded-lg">
            <Avatar icon={<UserOutlined />} size="small" className="!bg-primary-600" />
            <span className="text-white text-sm hidden md:inline">User</span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}
