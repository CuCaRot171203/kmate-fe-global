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

  if (loading) return <div className="flex items-center justify-center py-20"><Spin size="large" /></div>;
  if (!user) return <div className="text-white">Không tìm thấy user</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} className="!rounded-xl">Quay lại</Button>
        <h2 className="text-2xl font-black text-white">Chi tiết User</h2>
        <Tag color={user.isBanned ? 'red' : 'green'} className="!rounded-full ml-auto">
          {user.isBanned ? 'Banned' : 'Active'}
        </Tag>
      </div>

      {/* Profile Card */}
      <div className="bg-[#151c2a] rounded-2xl border border-white/10 p-6">
        <div className="flex items-start gap-6">
          <Avatar size={80} src={user.avatar} icon={<UserOutlined />} className="!bg-primary/20 !text-primary !text-2xl" />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-black text-white">{user.name || '—'}</h3>
              <Tag color={user.role === 'ADMIN' ? 'red' : 'default'} className="!rounded-full">{user.role}</Tag>
            </div>
            <p className="text-slate-400 text-sm mt-1">{user.email}</p>
            <div className="flex gap-6 mt-4 flex-wrap">
              <div><span className="text-slate-500 text-xs">Coins</span><p className="text-secondary font-bold text-lg">{user.coinBalance}</p></div>
              <div><span className="text-slate-500 text-xs">Streak</span><p className="text-white font-bold">{user.streak} ngày</p></div>
              <div><span className="text-slate-500 text-xs">Flashcards</span><p className="text-white font-bold">{user._count.flashcards}</p></div>
              <div><span className="text-slate-500 text-xs">Quizzes</span><p className="text-white font-bold">{user._count.quizzes}</p></div>
              <div><span className="text-slate-500 text-xs">Tham gia</span><p className="text-white font-bold">{dayjs(user.createdAt).format('DD/MM/YYYY')}</p></div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {user.isBanned ? (
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleUnban} loading={actionLoading} className="!rounded-xl !font-bold !bg-green-500 !border-green-500">
                Unban
              </Button>
            ) : (
              <Button danger icon={<StopOutlined />} onClick={handleBan} loading={actionLoading} className="!rounded-xl">
                Ban User
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        className="kmate-tabs"
        items={[
          {
            key: 'info',
            label: 'Thông tin',
            children: (
              <div className="bg-[#151c2a] rounded-2xl border border-white/10 p-6">
                <Descriptions column={2} size="small" labelStyle={{ color: '#64748b' }} contentStyle={{ color: '#fff' }}>
                  <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
                  <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                  <Descriptions.Item label="Name">{user.name || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
                  <Descriptions.Item label="Created">{dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                  <Descriptions.Item label="Last Active">{user.lastActiveAt ? dayjs(user.lastActiveAt).format('DD/MM/YYYY HH:mm') : '—'}</Descriptions.Item>
                </Descriptions>
              </div>
            ),
          },
          {
            key: 'stats',
            label: 'Thống kê',
            children: (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Flashcards', value: user._count.flashcards },
                  { label: 'Quizzes', value: user._count.quizzes },
                  { label: 'Videos Watched', value: user._count.watchProgress },
                  { label: 'Payments', value: user._count.payments },
                ].map((item) => (
                  <div key={item.label} className="bg-[#151c2a] rounded-xl border border-white/10 p-5 text-center">
                    <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                    <p className="text-white text-2xl font-black">{item.value}</p>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
