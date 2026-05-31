'use client';

import { useState, useEffect } from 'react';
import {
  UserOutlined,
  VideoCameraOutlined,
  DollarOutlined,
  RobotOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { Spin, Card, Statistic } from 'antd';
import { adminService, type AdminDashboard } from '@/lib/api-services';

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Spin size="large" /></div>;

  const stats = [
    { title: 'Tổng Users', value: data?.totalUsers ?? 0, icon: <UserOutlined />, color: '#7C4DFF', bg: 'rgba(124,77,255,0.1)' },
    { title: 'Users Active (24h)', value: data?.activeUsers ?? 0, icon: <UserOutlined />, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { title: 'Tổng Videos', value: data?.totalVideos ?? 0, icon: <VideoCameraOutlined />, color: '#00e5ff', bg: 'rgba(0,229,255,0.1)' },
    { title: 'Total Revenue', value: `${(data?.totalRevenue ?? 0).toLocaleString()}đ`, icon: <DollarOutlined />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { title: 'Pending AI Jobs', value: data?.pendingAIJobs ?? 0, icon: <RobotOutlined />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { title: 'Total Payments', value: data?.totalPayments ?? 0, icon: <DollarOutlined />, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-black text-white">Tổng quan</h2>
        <span className="text-slate-500 text-sm">Platform statistics</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border p-6 relative overflow-hidden"
            style={{ backgroundColor: stat.bg, borderColor: `${stat.color}40` }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10 blur-3xl rounded-full" style={{ backgroundColor: stat.color }} />
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium mb-1">{stat.title}</p>
                <p className="text-white text-2xl font-black">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#151c2a] rounded-2xl border border-white/10 p-6">
        <h3 className="text-white font-bold text-lg mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Quản lý Users', href: '/admin/users', color: '#7C4DFF' },
            { label: 'Xem Payments', href: '/admin/payments', color: '#22c55e' },
            { label: 'AI Queue', href: '/admin/ai-queue', color: '#ef4444' },
            { label: 'Audit Logs', href: '/admin/logs', color: '#00e5ff' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:border-white/20 transition-all text-sm font-medium text-white"
              style={{ borderColor: `${item.color}30` }}
            >
              <ArrowUpOutlined style={{ color: item.color }} />
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
