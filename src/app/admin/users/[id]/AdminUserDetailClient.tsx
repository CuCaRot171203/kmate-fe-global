'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, Tag, Button, Spin, message, Descriptions, Tabs, Card } from 'antd';
import { ArrowLeftOutlined, StopOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService, type AdminUserDetail } from '@/lib/api-services';

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    adminService.getUser(id)
      .then((r) => setUser(r.data.data))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleBan = async () => {
    setActionLoading(true);
    try {
      await adminService.banUser(params.id as string);
      setUser((u) => u ? { ...u, isBanned: true } : u);
      message.success('Đã ban user');
    } catch { message.error('Lỗi'); }
    finally { setActionLoading(false); }
  };

  const handleUnban = async () => {
    setActionLoading(true);
    try {
      await adminService.unbanUser(params.id as string);
      setUser((u) => u ? { ...u, isBanned: false } : u);
      message.success('Đã unban user');
    } catch { message.error('Lỗi'); }
    finally { setActionLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#0B0B0F]">
      <Spin size="large" />
    </div>
  );
  if (!user) return <div className="p-8 text-white">Không tìm thấy user</div>;

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => router.back()}
          className="!rounded-xl"
        >
          <ArrowLeftOutlined /> Quay lại
        </Button>
        <h1 className="text-2xl font-bold text-white">Chi tiết User</h1>
        <Tag color={user.isBanned ? 'red' : 'green'}>
          {user.isBanned ? 'Banned' : 'Active'}
        </Tag>
      </div>

      {/* Profile Card */}
      <Card className="!bg-[#151c2a] !border-white/10 mb-6">
        <div className="flex items-center gap-6">
          <Avatar size={80} src={user.avatar} icon={<UserOutlined />} className="!bg-primary/20 !text-primary !text-2xl" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user.name || '—'}</h2>
            <p className="text-slate-400">{user.role}</p>
            <p className="text-slate-500 text-sm">{user.email}</p>
            <div className="flex gap-6 mt-3">
              <span className="text-sm text-slate-400">Coins: <span className="text-primary font-bold">{user.coinBalance}</span></span>
              <span className="text-sm text-slate-400">Streak: <span className="text-primary font-bold">{user.streak} ngày</span></span>
              <span className="text-sm text-slate-400">Flashcards: <span className="text-primary font-bold">{user._count.flashcards}</span></span>
              <span className="text-sm text-slate-400">Quizzes: <span className="text-primary font-bold">{user._count.quizzes}</span></span>
            </div>
            <p className="text-slate-500 text-sm mt-2">Tham gia {dayjs(user.createdAt).format('DD/MM/YYYY')}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {user.isBanned ? (
            <Button
              type="primary"
              onClick={handleUnban}
              loading={actionLoading}
              className="!rounded-xl !font-bold !bg-green-500 !border-green-500"
            >
              <CheckCircleOutlined /> Unban
            </Button>
          ) : (
            <Button
              danger
              onClick={handleBan}
              loading={actionLoading}
              className="!rounded-xl"
            >
              <StopOutlined /> Ban User
            </Button>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <Card className="!bg-[#151c2a] !border-white/10">
        <Tabs
          defaultActiveKey="info"
          items={[
            {
              key: 'info',
              label: 'Thông tin',
              children: (
                <Descriptions column={2} className="[&_.ant-descriptions-item-label]:!text-slate-400 [&_.ant-descriptions-item-content]:!text-white">
                  <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
                  <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                  <Descriptions.Item label="Name">{user.name || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
                  <Descriptions.Item label="Created">{dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                  <Descriptions.Item label="Last Active">{user.lastActiveAt ? dayjs(user.lastActiveAt).format('DD/MM/YYYY HH:mm') : '—'}</Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: 'stats',
              label: 'Thống kê',
              children: (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Flashcards', value: user._count.flashcards },
                    { label: 'Quizzes', value: user._count.quizzes },
                    { label: 'Videos Watched', value: user._count.watchProgress },
                    { label: 'Payments', value: user._count.payments },
                  ].map((item) => (
                    <Card key={item.label} className="!bg-white/5 !border-white/10">
                      <div className="text-2xl font-black text-primary">{item.value}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.label}</div>
                    </Card>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
