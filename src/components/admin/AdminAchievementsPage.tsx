'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Tag, Spin, Input, Modal, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { adminService, type Achievement, type AchievementInput } from '@/lib/api-services';

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState<AchievementInput>({
    type: '', name: '', description: '', icon: '', coinReward: 0, xpReward: 0, requirement: 1, isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAchievements();
      setAchievements(res.data.data);
    } catch { message.error('Lỗi tải achievements'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ type: '', name: '', description: '', icon: '🏆', coinReward: 0, xpReward: 0, requirement: 1, isActive: true }); setEditModal(true); };
  const openEdit = (a: Achievement) => {
    setEditing(a);
    setForm({ type: a.type, name: a.name, description: a.description, icon: a.icon, coinReward: a.coinReward, xpReward: a.xpReward, requirement: a.requirement, isActive: a.isActive });
    setEditModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.type) { message.error('Vui lòng nhập tên và type'); return; }
    setSaving(true);
    try {
      if (editing) {
        await adminService.updateAchievement(editing.id, form);
        message.success('Đã cập nhật');
      } else {
        await adminService.createAchievement(form);
        message.success('Đã tạo');
      }
      setEditModal(false);
      load();
    } catch { message.error('Lỗi lưu'); }
    finally { setSaving(false); }
  };

  const handleToggleActive = async (a: Achievement) => {
    try {
      await adminService.updateAchievement(a.id, { ...a, isActive: !a.isActive });
      load();
    } catch { message.error('Lỗi cập nhật'); }
  };

  const columns: ColumnsType<Achievement> = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (i: string) => <span className="text-2xl">{i}</span>,
    },
    { title: 'Name', dataIndex: 'name', key: 'name', render: (n: string) => <span className="text-white font-medium">{n}</span> },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => <Tag className="!rounded-full">{t}</Tag> },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', render: (d: string) => <span className="text-slate-400 text-xs max-w-[200px] truncate block">{d}</span> },
    { title: 'Coin', dataIndex: 'coinReward', key: 'coinReward', render: (c: number) => <span className="text-yellow-400 font-bold">{c}</span> },
    { title: 'Yêu cầu', dataIndex: 'requirement', key: 'requirement', render: (r: number) => <span className="text-slate-400">{r}</span> },
    {
      title: 'Active',
      key: 'isActive',
      render: (_, record) => (
        <Tag color={record.isActive ? 'green' : 'default'} className="!rounded-full cursor-pointer" onClick={() => handleToggleActive(record)}>
          {record.isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} className="!rounded-lg !text-xs" />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Achievements</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} className="!rounded-xl !font-bold" style={{ background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)' }}>
          Tạo Achievement
        </Button>
      </div>

      <Table columns={columns} dataSource={achievements} rowKey="id" loading={loading} pagination={false} className="kmate-table" />

      <Modal
        title={<span className="text-white font-bold">{editing ? 'Sửa Achievement' : 'Tạo Achievement'}</span>}
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
        className="kmate-modal"
      >
        <div className="py-4 space-y-4">
          {[
            { label: 'Type (unique)', key: 'type', placeholder: 'e.g. FIRST_VIDEO' },
            { label: 'Name', key: 'name', placeholder: 'Tên achievement' },
            { label: 'Icon (emoji)', key: 'icon', placeholder: '🏆' },
            { label: 'Mô tả', key: 'description', placeholder: 'Mô tả achievement' },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{field.label}</label>
              <Input
                value={(form as Record<string, unknown>)[field.key] as string}
                onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="!rounded-xl"
              />
            </div>
          ))}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Coin Reward', key: 'coinReward' },
              { label: 'XP Reward', key: 'xpReward' },
              { label: 'Yêu cầu', key: 'requirement' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{field.label}</label>
                <Input
                  type="number"
                  value={(form as Record<string, unknown>)[field.key] as number}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: parseInt(e.target.value) || 0 }))}
                  className="!rounded-xl"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <Button block onClick={() => setEditModal(false)} className="!rounded-xl">Huỷ</Button>
            <Button type="primary" block loading={saving} onClick={handleSave} className="!rounded-xl !font-bold" style={{ background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)' }}>
              Lưu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
