'use client';

import { useState, useEffect } from 'react';
import {
  UserOutlined,
  MailOutlined,
  TrophyOutlined,
  BookOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Card, Avatar, Button, Input, Tag, Spin, message, Switch, Divider } from 'antd';
import { userService, authService, type UserProfile, type UserStatistics, type UserAchievement } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';
import dayjs from 'dayjs';

export default function UserProfilePage() {
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    Promise.all([
      userService.getProfile().then((r) => { setProfile(r.data.data); setEditName(r.data.data.name || ''); }),
      userService.getStatistics().then((r) => setStats(r.data.data)),
      userService.getAchievements().then((r) => setAchievements(r.data.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSaveName = async () => {
    setSaving(true);
    try {
      await userService.updateProfile({ name: editName });
      const updated = { ...(profile ?? { name: '' }), name: editName };
      setProfile(updated as UserProfile);
      if (user) setUser({ ...user, name: editName || null });
      message.success('Cập nhật tên thành công');
      setEditing(false);
    } catch {
      message.error('Lỗi khi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-gradient-cyber min-h-full">
      {/* Profile Card */}
      <div className="user-glass-card p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="shrink-0">
            <Avatar
              size={120}
              src={profile?.avatar}
              icon={<UserOutlined />}
              className="!bg-primary/20 !text-primary text-4xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            {editing ? (
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  className="!bg-white/5 !border !border-white/20 !text-white !rounded-xl !max-w-xs"
                />
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={saving}
                  onClick={handleSaveName}
                  className="!font-bold !rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)' }}
                >
                  Lưu
                </Button>
                <Button onClick={() => { setEditing(false); setEditName(profile?.name || ''); }} className="!rounded-xl">
                  Huỷ
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                <h2 className="text-3xl font-black text-white">
                  {profile?.name || 'Người dùng K-MATE'}
                </h2>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => setEditing(true)}
                  className="!text-slate-400 hover:!text-white"
                />
              </div>
            )}

            <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
              <MailOutlined className="text-slate-400" />
              <span className="text-slate-400 text-sm">{profile?.email}</span>
              {profile?.preferences && typeof profile.preferences === 'object' && (
                <Tag color="purple" className="ml-2">Đã xác minh</Tag>
              )}
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start mt-3 flex-wrap">
              <Tag color="primary" className="!rounded-full !px-3">
                Cấp 1 — Người học
              </Tag>
              <span className="text-slate-500 text-xs">
                Tham gia {profile?.createdAt ? dayjs(profile.createdAt).format('DD/MM/YYYY') : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <ThunderboltOutlined />, label: 'Video đã xem', value: stats?.totalVideosWatched ?? 0, color: '#00e5ff', bg: 'rgba(0,229,255,0.1)' },
          { icon: <BookOutlined />, label: 'Từ đã học', value: stats?.totalFlashcards ?? 0, color: '#7c4dff', bg: 'rgba(124,77,255,0.1)' },
          { icon: <CheckCircleOutlined />, label: 'Quiz đã làm', value: stats?.totalQuizzesTaken ?? 0, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
          { icon: <TrophyOutlined />, label: 'Thành tựu', value: `${unlockedCount}/${achievements.length}`, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map((item) => (
          <div key={item.label} className="user-glass-card p-5 rounded-xl relative overflow-hidden" style={{ borderColor: `${item.color}40` }}>
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10 blur-2xl rounded-full" style={{ backgroundColor: item.color }} />
            <div className="flex items-center gap-3 mb-3">
              <span style={{ color: item.color, fontSize: 20 }}>{item.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: item.color }}>{item.label}</span>
            </div>
            <p className="text-2xl font-black text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="user-glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrophyOutlined className="text-[#f59e0b]" />
          Thành tựu ({unlockedCount}/{achievements.length})
        </h3>

        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <TrophyOutlined className="text-4xl text-slate-600 mb-2" />
            <p className="text-slate-500">Chưa có thành tựu nào được mở khoá</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border transition-all ${
                  ach.isUnlocked
                    ? 'border-[#f59e0b]/30 bg-[#f59e0b]/5'
                    : 'border-white/5 bg-white/5 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{ach.icon || '🏆'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${ach.isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                      {ach.name}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">{ach.description}</p>
                    {!ach.isUnlocked && (
                      <div className="mt-2">
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#f59e0b] rounded-full transition-all"
                            style={{ width: `${Math.min(100, (ach.progress / ach.requirement) * 100)}%` }}
                          />
                        </div>
                        <p className="text-slate-600 text-[10px] mt-1">{ach.progress}/{ach.requirement}</p>
                      </div>
                    )}
                    {ach.isUnlocked && (
                      <p className="text-[#f59e0b] text-[10px] mt-1">
                        Mở khoá {ach.unlockedAt ? dayjs(ach.unlockedAt).fromNow() : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
