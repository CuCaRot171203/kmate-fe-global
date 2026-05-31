'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Tag, Input, Modal, message, Popconfirm, InputNumber, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { adminService, type CoinPackageAdmin, type PackageInput } from '@/lib/api-services';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<CoinPackageAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editing, setEditing] = useState<CoinPackageAdmin | null>(null);
  const [form, setForm] = useState<PackageInput>({
    name: '', description: '', coinAmount: 0, bonusCoinAmount: 0, price: 0, isActive: true, sortOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPackages();
      setPackages(res.data.data);
    } catch { message.error('Lỗi tải packages'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', coinAmount: 0, bonusCoinAmount: 0, price: 0, isActive: true, sortOrder: packages.length + 1 });
    setEditModal(true);
  };

  const openEdit = (pkg: CoinPackageAdmin) => {
    setEditing(pkg);
    setForm({ name: pkg.name, description: pkg.description ?? '', coinAmount: pkg.coinAmount, bonusCoinAmount: pkg.bonusCoinAmount ?? 0, price: pkg.price, isActive: pkg.isActive, sortOrder: pkg.sortOrder });
    setEditModal(true);
  };

  const handleSave = async () => {
    if (!form.name || form.coinAmount <= 0 || form.price <= 0) { message.error('Vui lòng nhập đầy đủ thông tin'); return; }
    setSaving(true);
    try {
      if (editing) {
        await adminService.updatePackage(editing.id, form);
        message.success('Đã cập nhật');
      } else {
        await adminService.createPackage(form);
        message.success('Đã tạo');
      }
      setEditModal(false);
      load();
    } catch { message.error('Lỗi lưu'); }
    finally { setSaving(false); }
  };

  const columns: ColumnsType<CoinPackageAdmin> = [
    { title: 'Tên', dataIndex: 'name', key: 'name', render: (n: string) => <span className="text-white font-medium">{n}</span> },
    { title: 'Coin', dataIndex: 'coinAmount', key: 'coinAmount', render: (c: number) => <span className="text-secondary font-bold text-lg">{c} Xu</span> },
    { title: 'Bonus', dataIndex: 'bonusCoinAmount', key: 'bonusCoinAmount', render: (b: number) => b > 0 ? <Tag color="cyan">+{b} Bonus</Tag> : <span className="text-slate-600">—</span> },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (p: number) => <span className="text-green-400 font-bold">{p.toLocaleString()}đ</span> },
    { title: 'Thứ tự', dataIndex: 'sortOrder', key: 'sortOrder', render: (s: number) => <span className="text-slate-400">{s}</span> },
    {
      title: 'Active',
      key: 'isActive',
      render: (_, record) => <Tag color={record.isActive ? 'green' : 'default'} className="!rounded-full">{record.isActive ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} className="!rounded-lg !text-xs" />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Coin Packages</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} className="!rounded-xl !font-bold" style={{ background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)' }}>
          Tạo Package
        </Button>
      </div>

      <Table columns={columns} dataSource={packages} rowKey="id" loading={loading} pagination={false} className="kmate-table" />

      <Modal
        title={<span className="text-white font-bold">{editing ? 'Sửa Package' : 'Tạo Package'}</span>}
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={null}
        className="kmate-modal"
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tên gói</label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Gói 100 Xu" className="!rounded-xl" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mô tả</label>
              <Input.TextArea value={form.description ?? ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} className="!rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Số coin</label>
              <InputNumber min={1} value={form.coinAmount} onChange={(v) => setForm((p) => ({ ...p, coinAmount: v ?? 0 }))} className="!w-full !rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bonus coin</label>
              <InputNumber min={0} value={form.bonusCoinAmount} onChange={(v) => setForm((p) => ({ ...p, bonusCoinAmount: v ?? 0 }))} className="!w-full !rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Giá (VND)</label>
              <InputNumber min={0} value={form.price} onChange={(v) => setForm((p) => ({ ...p, price: v ?? 0 }))} className="!w-full !rounded-xl" formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Thứ tự</label>
              <InputNumber min={0} value={form.sortOrder} onChange={(v) => setForm((p) => ({ ...p, sortOrder: v ?? 0 }))} className="!w-full !rounded-xl" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Active:</span>
            <Switch checked={form.isActive} onChange={(v) => setForm((p) => ({ ...p, isActive: v }))} />
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
