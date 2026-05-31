'use client';

import { useState, useEffect } from 'react';
import {
  SearchOutlined,
  UserOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Table, Input, Button, Tag, Avatar, Spin, Modal, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { adminService, type AdminUser } from '@/lib/api-services';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async (pg = 1, q = search) => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ page: pg, limit: 20, search: q || undefined });
      setUsers(res.data.data);
      setTotal(res.data.pagination.total);
      setPage(pg);
    } catch { message.error('Lỗi tải users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(1, ''); }, []);

  const handleBan = async (id: string) => {
    setActionId(id);
    try {
      await adminService.banUser(id);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isBanned: true } : u));
      message.success('Đã ban user');
    } catch { message.error('Lỗi ban user'); }
    finally { setActionId(null); }
  };

  const handleUnban = async (id: string) => {
    setActionId(id);
    try {
      await adminService.unbanUser(id);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isBanned: false } : u));
      message.success('Đã unban user');
    } catch { message.error('Lỗi unban user'); }
    finally { setActionId(null); }
  };

  const columns: ColumnsType<AdminUser> = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} icon={<UserOutlined />} className="!bg-primary/20 !text-primary" />
          <div>
            <p className="text-white font-medium text-sm">{record.name || '—'}</p>
            <p className="text-slate-400 text-xs">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (r: string) => <Tag color={r === 'ADMIN' ? 'red' : 'default'} className="!rounded-full">{r}</Tag>,
    },
    {
      title: 'Coins',
      dataIndex: 'coinBalance',
      key: 'coinBalance',
      render: (c: number) => <span className="text-secondary font-bold">{c}</span>,
    },
    {
      title: 'Streak',
      dataIndex: 'streak',
      key: 'streak',
      render: (s: number) => <span className="text-slate-300">{s} ngày</span>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) =>
        record.isBanned
          ? <Tag color="red" className="!rounded-full">Banned</Tag>
          : <Tag color="green" className="!rounded-full">Active</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            size="small"
            onClick={() => router.push(`/admin/users/${record.id}`)}
            className="!rounded-lg !text-xs"
          >
            Chi tiết
          </Button>
          {record.isBanned ? (
            <Popconfirm title="Unban user này?" onConfirm={() => handleUnban(record.id)} okText="Unban" cancelText="Huỷ">
              <Button size="small" type="primary" loading={actionId === record.id} className="!rounded-lg !text-xs !bg-green-500 !border-green-500">
                <CheckCircleOutlined /> Unban
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm title="Ban user này?" onConfirm={() => handleBan(record.id)} okText="Ban" cancelText="Huỷ">
              <Button size="small" danger loading={actionId === record.id} className="!rounded-lg !text-xs">
                <StopOutlined /> Ban
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-white">Quản lý Người dùng</h2>
        <div className="flex items-center gap-3">
          <Input
            prefix={<SearchOutlined className="text-slate-500" />}
            placeholder="Tìm theo email hoặc tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={() => load(1, search)}
            className="!w-64 !rounded-xl !bg-[#151c2a] !border-white/10 !text-sm"
          />
          <Button onClick={() => load(1, search)} className="!rounded-xl">Tìm</Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: 20,
          total,
          onChange: (p) => load(p, search),
          showSizeChanger: false,
        }}
        className="kmate-table"
      />
    </div>
  );
}
