'use client';

import { useState, useEffect } from 'react';
import {
  SearchOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Table, Input, Button, Tag, Spin, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminService, type AdminPayment } from '@/lib/api-services';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'orange',
  SUCCESS: 'green',
  FAILED: 'red',
  EXPIRED: 'default',
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async (pg = 1, s = status) => {
    setLoading(true);
    try {
      const res = await adminService.getPayments({ page: pg, limit: 20, status: s || undefined });
      setPayments(res.data.data);
      setTotal(res.data.pagination.total);
      setPage(pg);
    } catch { message.error('Lỗi tải payments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(1, ''); }, []);

  const columns: ColumnsType<AdminPayment> = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div>
          <p className="text-white text-sm font-medium">{record.user.name || '—'}</p>
          <p className="text-slate-400 text-xs">{record.user.email}</p>
        </div>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (v: number) => (
        <span className="text-green-400 font-bold">{v.toLocaleString()}đ</span>
      ),
    },
    {
      title: 'Coin',
      dataIndex: 'coinAmount',
      key: 'coinAmount',
      render: (c: number) => <span className="text-secondary font-bold">{c} Xu</span>,
    },
    {
      title: 'Order Code',
      dataIndex: 'payosOrderCode',
      key: 'payosOrderCode',
      render: (c: string | null) => (
        <span className="text-slate-400 text-xs font-mono">{c || '—'}</span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        const icon = record.status === 'SUCCESS' ? <CheckCircleOutlined /> :
          record.status === 'PENDING' ? <ClockCircleOutlined /> :
          record.status === 'FAILED' ? <CloseCircleOutlined /> : null;
        return (
          <Tag color={STATUS_COLORS[record.status] || 'default'} icon={icon} className="!rounded-full">
            {record.status}
          </Tag>
        );
      },
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record) => (
        <div>
          <p className="text-slate-400 text-xs">Tạo: {dayjs(record.createdAt).format('DD/MM/YY HH:mm')}</p>
          {record.paidAt && <p className="text-slate-500 text-xs">Thanh toán: {dayjs(record.paidAt).format('DD/MM/YY HH:mm')}</p>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-white">Quản lý Thanh toán</h2>
        <div className="flex items-center gap-3">
          <Select
            placeholder="Tất cả trạng thái"
            allowClear
            className="!w-40"
            value={status || undefined}
            onChange={(v) => { setStatus(v || ''); load(1, v || ''); }}
            options={[
              { value: 'PENDING', label: 'Pending' },
              { value: 'SUCCESS', label: 'Success' },
              { value: 'FAILED', label: 'Failed' },
              { value: 'EXPIRED', label: 'Expired' },
            ]}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={payments}
        rowKey="id"
        loading={loading}
        pagination={{ current: page, pageSize: 20, total, onChange: (p) => load(p, status), showSizeChanger: false }}
        className="kmate-table"
      />
    </div>
  );
}
