'use client';

import { useState, useEffect } from 'react';
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Button, Empty, Spin, List, Badge } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { notificationService, type Notification } from '@/lib/api-services';

dayjs.extend(relativeTime);

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  PAYMENT_SUCCESS: <span className="text-lg">💰</span>,
  SUBTITLE_COMPLETE: <span className="text-lg">✅</span>,
  ACHIEVEMENT_UNLOCKED: <span className="text-lg">🏆</span>,
  DAILY_REMINDER: <span className="text-lg">🔔</span>,
  STREAK: <span className="text-lg">🔥</span>,
};

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const load = async (pg = 1) => {
    setLoading(true);
    try {
      const res = await notificationService.list({ page: pg, limit: 20 });
      if (pg === 1) {
        setNotifications(res.data.data);
      } else {
        setNotifications((prev) => [...prev, ...res.data.data]);
      }
      setTotal(res.data.pagination.total);
      setPage(pg);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  const handleMarkRead = async (id: string) => {
    setMarkingId(id);
    try {
      await notificationService.markOneAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() as unknown as string } : n))
      );
    } catch {
      // silent
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() as unknown as string })));
    } catch {
      // silent
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setTotal((t) => t - 1);
    } catch {
      // silent
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-6 lg:p-10 space-y-6 bg-gradient-cyber min-h-full max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BellOutlined className="text-2xl text-primary" />
          <div>
            <h2 className="text-2xl font-black text-white">Thông báo</h2>
            {unreadCount > 0 && (
              <p className="text-slate-400 text-sm">{unreadCount} thông báo chưa đọc</p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            icon={<CheckOutlined />}
            onClick={handleMarkAllRead}
            className="!rounded-xl !font-bold"
          >
            Đánh dấu đã đọc tất cả
          </Button>
        )}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.length === 0 && !loading ? (
          <div className="user-glass-card p-16 rounded-2xl">
            <Empty
              image={<BellOutlined style={{ fontSize: 48, color: '#64748b' }} />}
              description={
                <span className="text-slate-500">Chưa có thông báo nào</span>
              }
            />
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`user-glass-card p-4 rounded-xl border transition-all ${
                n.isRead
                  ? 'border-white/5 opacity-70'
                  : 'border-primary/20 bg-primary/5'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  {NOTIFICATION_ICONS[n.type] || <BellOutlined className="text-slate-400" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold ${n.isRead ? 'text-slate-400' : 'text-white'}`}>
                      {n.title}
                    </p>
                    <span className="text-slate-600 text-xs shrink-0">
                      {dayjs(n.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    {n.message}
                  </p>

                  {/* Actions */}
                  {!n.isRead && (
                    <Button
                      size="small"
                      icon={<CheckCircleOutlined />}
                      loading={markingId === n.id}
                      onClick={() => handleMarkRead(n.id)}
                      className="!mt-2 !rounded-lg !text-xs"
                    >
                      Đánh dấu đã đọc
                    </Button>
                  )}
                </div>

                {/* Delete */}
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(n.id)}
                  className="!text-slate-600 hover:!text-red-400 !shrink-0"
                />
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        )}

        {total > notifications.length && !loading && (
          <div className="flex justify-center">
            <Button
              onClick={() => load(page + 1)}
              className="!rounded-xl"
              loading={loading}
            >
              Xem thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
