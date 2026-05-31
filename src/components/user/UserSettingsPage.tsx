'use client';

import { useState, useEffect } from 'react';
import {
  LockOutlined,
  MobileOutlined,
  BellOutlined,
  LogoutOutlined,
  DesktopOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import {
  Card,
  Table,
  Button,
  Tag,
  Modal,
  Input,
  message,
  Spin,
  Popconfirm,
  Tabs,
  Switch,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authService, type AuthSession } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

dayjs.extend(relativeTime);

export default function UserSettingsPage() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [changePwOpen, setChangePwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    // TODO: re-enable auth guard before production
    // if (!isAuthenticated) {
    //   router.replace('/login');
    //   return;
    // }
    authService.getSessions()
      .then((r) => setSessions(r.data.data.sessions))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  const handleRevokeSession = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      await authService.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      message.success('Đã xoá session');
    } catch {
      message.error('Lỗi khi xoá session');
    } finally {
      setRevoking(null);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) {
      message.error('Vui lòng nhập đầy đủ');
      return;
    }
    if (newPw.length < 8) {
      message.error('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    setPwLoading(true);
    try {
      await authService.changePassword({ currentPassword: currentPw, newPassword: newPw });
      message.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
      setChangePwOpen(false);
      setCurrentPw('');
      setNewPw('');
      setTimeout(() => { logout(); router.push('/login'); }, 1500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      message.error(e.response?.data?.message || 'Lỗi khi đổi mật khẩu');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await authService.logout();
      logout();
      router.push('/login');
    } catch {
      message.error('Lỗi đăng xuất');
    }
  };

  const sessionColumns: ColumnsType<AuthSession> = [
    {
      title: 'Thiết bị',
      dataIndex: 'deviceInfo',
      key: 'deviceInfo',
      render: (d: string | null) => (
        <div className="flex items-center gap-2">
          <DesktopOutlined className="text-slate-400" />
          <span className="text-sm text-slate-200">{d || 'Unknown Device'}</span>
        </div>
      ),
    },
    {
      title: 'IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (ip: string | null) => <span className="text-slate-400 text-xs">{ip || '—'}</span>,
    },
    {
      title: 'Đăng nhập lúc',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (t: string) => (
        <span className="text-slate-400 text-xs">{dayjs(t).format('DD/MM/YYYY HH:mm')}</span>
      ),
    },
    {
      title: 'Hết hạn lúc',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (t: string) => (
        <span className="text-slate-400 text-xs">{dayjs(t).format('DD/MM/YYYY HH:mm')}</span>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_: unknown, record: AuthSession) =>
        record.isCurrent ? (
          <Tag color="cyan" className="!rounded-full">Hiện tại</Tag>
        ) : (
          <Popconfirm
            title="Xoá session này?"
            onConfirm={() => handleRevokeSession(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button
              size="small"
              danger
              loading={revoking === record.id}
              className="!rounded-lg"
            >
              Xoá
            </Button>
          </Popconfirm>
        ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-6 bg-gradient-cyber min-h-full max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Cài đặt tài khoản</h2>
      </div>

      <Tabs
        className="kmate-tabs"
        items={[
          {
            key: 'security',
            label: <span className="text-sm"><LockOutlined /> Bảo mật</span>,
            children: (
              <div className="space-y-6">
                {/* Change Password */}
                <div className="user-glass-card p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <KeyOutlined className="text-primary text-lg" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Đổi mật khẩu</p>
                      <p className="text-slate-500 text-xs">Cập nhật mật khẩu mới cho tài khoản</p>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    className="!rounded-xl !font-bold"
                    style={{ background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)' }}
                    onClick={() => setChangePwOpen(true)}
                  >
                    Đổi mật khẩu
                  </Button>
                </div>

                {/* Active Sessions */}
                <div className="user-glass-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <MobileOutlined className="text-secondary text-lg" />
                      </div>
                      <div>
                        <p className="text-white font-bold">Phiên đăng nhập</p>
                        <p className="text-slate-500 text-xs">Quản lý các thiết bị đang đăng nhập</p>
                      </div>
                    </div>
                    <Popconfirm
                      title="Đăng xuất tất cả thiết bị?"
                      onConfirm={handleLogoutAll}
                      okText="Đăng xuất all"
                      cancelText="Huỷ"
                    >
                      <Button danger className="!rounded-xl">
                        <LogoutOutlined /> Đăng xuất all
                      </Button>
                    </Popconfirm>
                  </div>

                  <Table
                    columns={sessionColumns}
                    dataSource={sessions}
                    rowKey="id"
                    pagination={false}
                    className="kmate-table"
                  />
                </div>
              </div>
            ),
          },
          {
            key: 'notifications',
            label: <span className="text-sm"><BellOutlined /> Thông báo</span>,
            children: (
              <div className="user-glass-card p-6 rounded-2xl">
                <p className="text-white font-bold mb-4">Tùy chọn thông báo</p>
                {[
                  { label: 'Thông báo video hoàn thành', desc: 'Khi phụ đề video sẵn sàng', defaultChecked: true },
                  { label: 'Nhắc nhở ôn tập', desc: 'Nhắc nhở khi có flashcards cần ôn', defaultChecked: true },
                  { label: 'Email marketing', desc: 'Cập nhật tính năng mới', defaultChecked: false },
                  { label: 'Achievement mới', desc: 'Thông báo khi mở khoá thành tựu', defaultChecked: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm text-white">{item.label}</p>
                      <p className="text-slate-500 text-xs">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.defaultChecked} />
                  </div>
                ))}
                <Button
                  type="primary"
                  className="!rounded-xl !font-bold !mt-4"
                  style={{ background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)' }}
                  onClick={() => message.success('Đã lưu tùy chọn thông báo')}
                >
                  Lưu thay đổi
                </Button>
              </div>
            ),
          },
        ]}
      />

      {/* Change Password Modal */}
      <Modal
        title={<span className="text-white font-bold">Đổi mật khẩu</span>}
        open={changePwOpen}
        onCancel={() => { setChangePwOpen(false); setCurrentPw(''); setNewPw(''); }}
        footer={null}
        className="kmate-modal"
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Mật khẩu hiện tại</label>
            <Input.Password
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
              className="!rounded-xl"
              size="large"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Mật khẩu mới</label>
            <Input.Password
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Ít nhất 8 ký tự, có hoa thường và số"
              className="!rounded-xl"
              size="large"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button block onClick={() => setChangePwOpen(false)} className="!rounded-xl">Huỷ</Button>
            <Button
              type="primary"
              block
              loading={pwLoading}
              onClick={handleChangePassword}
              className="!rounded-xl !font-bold"
              style={{ background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)' }}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
