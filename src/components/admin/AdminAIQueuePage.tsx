'use client';

import { useState, useEffect } from 'react';
import { Table, Tag, Button, Spin, Select, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminService, type AIJob } from '@/lib/api-services';

const STATUS_COLORS: Record<string, string> = {
  QUEUED: 'blue',
  PROCESSING: 'orange',
  FAILED: 'red',
  COMPLETED: 'green',
};

const STAGE_ICONS: Record<string, React.ReactNode> = {
  PENDING: '⏳',
  DOWNLOADING: '📥',
  EXTRACTING_AUDIO: '🎵',
  TRANSCRIBING: '🎤',
  TRANSLATING: '🌐',
  SYNCING: '⏱️',
  UPLOADING: '☁️',
  DONE: '✅',
  CANCELLED: '🚫',
};

export default function AdminAIQueuePage() {
  const [jobs, setJobs] = useState<AIJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAIQueue({ status: status || undefined });
      setJobs(res.data.data);
    } catch { message.error('Lỗi tải queue'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [status]);

  const handleRetry = async (id: string) => {
    setActionId(id);
    try {
      await adminService.retryAIJob(id);
      message.success('Đã retry job');
      load();
    } catch { message.error('Lỗi retry'); }
    finally { setActionId(null); }
  };

  const handleCancel = async (id: string) => {
    setActionId(id);
    try {
      await adminService.cancelAIJob(id);
      message.success('Đã cancel job');
      load();
    } catch { message.error('Lỗi cancel'); }
    finally { setActionId(null); }
  };

  const columns: ColumnsType<AIJob> = [
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
      title: 'Video',
      key: 'video',
      render: (_, record) => (
        <div className="max-w-[200px]">
          <p className="text-slate-200 text-xs truncate">{record.video.title}</p>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (t: string) => <Tag className="!rounded-full">{t}</Tag>,
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (s: string) => (
        <span className="text-lg">{STAGE_ICONS[s] || '🔄'} <span className="text-xs text-slate-400">{s}</span></span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={STATUS_COLORS[s] || 'default'} className="!rounded-full">{s}</Tag>,
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (p: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p}%` }} />
          </div>
          <span className="text-slate-400 text-xs">{p}%</span>
        </div>
      ),
    },
    {
      title: 'Retries',
      dataIndex: 'retryCount',
      key: 'retryCount',
      render: (r: number) => <span className={r > 0 ? 'text-red-400' : 'text-slate-400'}>{r}x</span>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (t: string) => (
        <span className="text-slate-400 text-xs">{dayjs(t).format('DD/MM HH:mm')}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          {(record.status === 'FAILED') && (
            <Popconfirm title="Retry this job?" onConfirm={() => handleRetry(record.id)} okText="Retry">
              <Button size="small" type="primary" loading={actionId === record.id} icon={<ReloadOutlined />} className="!rounded-lg !text-xs !bg-green-500 !border-green-500">
                Retry
              </Button>
            </Popconfirm>
          )}
          {(record.status === 'QUEUED' || record.status === 'PROCESSING') && (
            <Popconfirm title="Cancel this job?" onConfirm={() => handleCancel(record.id)} okText="Cancel">
              <Button size="small" danger loading={actionId === record.id} icon={<StopOutlined />} className="!rounded-lg !text-xs">
                Cancel
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
        <h2 className="text-2xl font-black text-white">AI Queue</h2>
        <div className="flex items-center gap-3">
          <Select
            placeholder="Tất cả"
            allowClear
            className="!w-40"
            value={status || undefined}
            onChange={(v) => setStatus(v || '')}
            options={[
              { value: 'QUEUED', label: 'Queued' },
              { value: 'PROCESSING', label: 'Processing' },
              { value: 'FAILED', label: 'Failed' },
              { value: 'COMPLETED', label: 'Completed' },
            ]}
          />
          <Button onClick={load} className="!rounded-xl">Làm mới</Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={jobs}
        rowKey="id"
        loading={loading}
        pagination={false}
        className="kmate-table"
        scroll={{ x: 1000 }}
      />
    </div>
  );
}
