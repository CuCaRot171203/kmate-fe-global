'use client';

import { useState, useEffect } from 'react';
import { Table, Tag, Spin, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminService, type AdminLog } from '@/lib/api-services';

const ACTION_COLORS: Record<string, string> = {
  USER_BAN: 'red',
  USER_UNBAN: 'green',
  ACHIEVEMENT_CREATE: 'purple',
  ACHIEVEMENT_UPDATE: 'cyan',
  PACKAGE_CREATE: 'gold',
  PACKAGE_UPDATE: 'orange',
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async (pg = 1, a = action) => {
    setLoading(true);
    try {
      const res = await adminService.getLogs({ page: pg, limit: 50, action: a || undefined });
      setLogs(res.data.data);
      setTotal(res.data.pagination.total);
      setPage(pg);
    } catch { message.error('Lỗi tải logs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(1, ''); }, []);

  const columns: ColumnsType<AdminLog> = [
    {
      title: 'Admin',
      key: 'admin',
      render: (_, record) => (
        <div>
          <p className="text-white text-sm font-medium">{record.admin.name || '—'}</p>
          <p className="text-slate-400 text-xs">{record.admin.email}</p>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Tag color={ACTION_COLORS[record.action] || 'default'} className="!rounded-full">
          {record.action}
        </Tag>
      ),
    },
    { title: 'Target Type', dataIndex: 'targetType', key: 'targetType', render: (t: string) => <Tag className="!rounded-full">{t}</Tag> },
    { title: 'Target ID', dataIndex: 'targetId', key: 'targetId', render: (id: string) => <span className="text-slate-400 text-xs font-mono">{id.slice(0, 8)}...</span> },
    { title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt', render: (t: string) => <span className="text-slate-400 text-xs">{dayjs(t).format('DD/MM/YYYY HH:mm:ss')}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Audit Logs</h2>
        <Select
          placeholder="Tất cả actions"
          allowClear
          className="!w-48"
          value={action || undefined}
          onChange={(v) => { setAction(v || ''); load(1, v || ''); }}
          options={[
            { value: 'USER_BAN', label: 'USER_BAN' },
            { value: 'USER_UNBAN', label: 'USER_UNBAN' },
            { value: 'ACHIEVEMENT_CREATE', label: 'ACHIEVEMENT_CREATE' },
            { value: 'ACHIEVEMENT_UPDATE', label: 'ACHIEVEMENT_UPDATE' },
            { value: 'PACKAGE_CREATE', label: 'PACKAGE_CREATE' },
            { value: 'PACKAGE_UPDATE', label: 'PACKAGE_UPDATE' },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
        pagination={{ current: page, pageSize: 50, total, onChange: (p) => load(p, action), showSizeChanger: false }}
        className="kmate-table"
        scroll={{ x: 800 }}
      />
    </div>
  );
}
