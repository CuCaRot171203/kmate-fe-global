'use client';

import { useState, useEffect } from 'react';
import {
  WalletOutlined,
  GiftOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Card, Table, Tag, Button, Tabs, Empty, message, Spin, Modal, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { coinService, type CoinBalance, type CoinTransaction, type CoinPackage } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';

dayjs.extend(relativeTime);

const COIN_TYPE_COLORS: Record<string, string> = {
  PURCHASE: 'green',
  DAILY_LOGIN: 'cyan',
  ACHIEVEMENT: 'gold',
  REFERRAL_BONUS: 'purple',
  PIONEER_REWARD: 'orange',
  PROMOTION: 'magenta',
  UNLOCK_VIDEO: 'red',
  SUBTITLE_GENERATION: 'volcano',
  REFUND: 'lime',
};

const COIN_TYPE_LABELS: Record<string, string> = {
  PURCHASE: 'Mua coin',
  DAILY_LOGIN: 'Đăng nhập',
  ACHIEVEMENT: 'Thành tựu',
  REFERRAL_BONUS: 'Giới thiệu',
  PIONEER_REWARD: 'Pioneer',
  PROMOTION: 'Khuyến mãi',
  UNLOCK_VIDEO: 'Mở video',
  SUBTITLE_GENERATION: 'Tạo phụ đề',
  REFUND: 'Hoàn tiền',
};

export default function UserWalletPage() {
  const { user, updateCoinBalance } = useAuthStore();
  const [balance, setBalance] = useState<CoinBalance | null>(null);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [txType, setTxType] = useState<string>('');
  const [buyModal, setBuyModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<CoinPackage | null>(null);

  const loadBalance = async () => {
    try {
      const res = await coinService.getBalance();
      setBalance(res.data.data);
    } catch {
      // silent
    }
  };

  const loadTransactions = async (pg = 1) => {
    setTxLoading(true);
    try {
      const res = await coinService.getHistory({ page: pg, limit: 10, type: txType || undefined });
      setTransactions(res.data.data);
      setPage(pg);
      setTotal(res.data.pagination.total);
    } catch {
      message.error('Không tải được lịch sử');
    } finally {
      setTxLoading(false);
    }
  };

  const loadPackages = async () => {
    try {
      const res = await coinService.getPackages();
      setPackages(res.data.data);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    Promise.all([loadBalance(), loadTransactions(), loadPackages()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadTransactions(1);
  }, [txType]);

  const handleDailyLogin = async () => {
    setDailyLoading(true);
    try {
      const res = await coinService.dailyLogin();
      const data = res.data.data;
      message.success(data.message);
      setDailyClaimed(true);
      await loadBalance();
      updateCoinBalance(data.newBalance);
      loadTransactions(1);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { code?: string; message?: string } } } };
      if (e.response?.data?.error?.code === 'ALREADY_CLAIMED') {
        message.info('Bạn đã nhận thưởng hôm nay rồi!');
        setDailyClaimed(true);
      } else {
        message.error('Không thể nhận thưởng. Thử lại sau.');
      }
    } finally {
      setDailyLoading(false);
    }
  };

  const txColumns: ColumnsType<CoinTransaction> = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={COIN_TYPE_COLORS[type] || 'default'}>{COIN_TYPE_LABELS[type] || type}</Tag>
      ),
    },
    {
      title: 'Số coin',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className={amount >= 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
          {amount >= 0 ? '+' : ''}{amount}
        </span>
      ),
    },
    {
      title: 'Số dư trước',
      dataIndex: 'balanceBefore',
      key: 'balanceBefore',
      render: (v: number) => <span className="text-slate-400">{v}</span>,
    },
    {
      title: 'Số dư sau',
      dataIndex: 'balanceAfter',
      key: 'balanceAfter',
      render: (v: number) => <span className="text-white font-medium">{v}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (d: string | null) => <span className="text-slate-300 text-xs">{d || '—'}</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (t: string) => (
        <span className="text-slate-400 text-xs">{dayjs(t).format('DD/MM/YYYY HH:mm')}</span>
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
    <div className="p-6 lg:p-10 space-y-8 bg-gradient-cyber min-h-full">
      {/* Balance Card */}
      <div className="user-glass-card p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full -mb-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center">
              <WalletOutlined className="text-4xl text-secondary" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Số dư ví của bạn</p>
              <h2 className="text-5xl font-black text-white flex items-baseline gap-2">
                {balance?.balance ?? user?.coinBalance ?? 0}
                <span className="text-2xl font-bold text-secondary">Xu</span>
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Tích luỹ: +{balance?.lifetimeEarnings ?? 0} | Đã tiêu: -{balance?.lifetimeSpent ?? 0}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="primary"
              size="large"
              icon={dailyLoading ? <LoadingOutlined /> : dailyClaimed ? <CheckCircleOutlined /> : <GiftOutlined />}
              onClick={handleDailyLogin}
              loading={dailyLoading}
              disabled={dailyClaimed}
              className="!font-bold !rounded-xl !h-12 !px-6 !border-0"
              style={{
                background: dailyClaimed ? '#22c55e' : 'linear-gradient(135deg, #7C4DFF, #00e5ff)',
                boxShadow: dailyClaimed ? '' : '0 0 15px rgba(124,77,255,0.3)',
              }}
            >
              {dailyClaimed ? 'Đã nhận thưởng hôm nay' : 'Nhận thưởng đăng nhập +5 Xu'}
            </Button>

            <Button
              size="large"
              className="!font-bold !rounded-xl !h-12 !px-6 !border !border-secondary/30 !text-secondary !bg-secondary/10"
              icon={<HistoryOutlined />}
              onClick={() => setBuyModal(true)}
            >
              Mua thêm Xu
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="user-glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HistoryOutlined className="text-primary" />
            Lịch sử giao dịch
          </h3>
          <Select
            placeholder="Tất cả loại"
            allowClear
            className="!w-40"
            value={txType || undefined}
            onChange={(v) => setTxType(v || '')}
            options={Object.entries(COIN_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }))}
          />
        </div>

        <Table
          columns={txColumns}
          dataSource={transactions}
          rowKey="id"
          loading={txLoading}
          pagination={{
            current: page,
            pageSize: 10,
            total,
            onChange: (p) => loadTransactions(p),
            showSizeChanger: false,
          }}
          locale={{ emptyText: <Empty description="Chưa có giao dịch nào" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
          className="kmate-table"
        />
      </div>

      {/* Buy Coins Modal */}
      <Modal
        title={
          <span className="text-white font-bold text-lg">Mua thêm Xu</span>
        }
        open={buyModal}
        onCancel={() => setBuyModal(false)}
        footer={null}
        width={640}
        className="kmate-modal"
      >
        <div className="py-4 space-y-4">
          {packages.length === 0 ? (
            <Empty description="Chưa có gói nào được cấu hình" />
          ) : (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg)}
                className={`user-glass-card p-5 rounded-xl cursor-pointer transition-all border-2 ${
                  selectedPkg?.id === pkg.id
                    ? 'border-primary bg-primary/10'
                    : 'border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-lg">{pkg.name}</p>
                    {pkg.description && <p className="text-slate-400 text-xs mt-0.5">{pkg.description}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-secondary">{pkg.coinAmount} Xu</p>
                    <p className="text-slate-400 text-sm">
                      {pkg.price.toLocaleString()}đ
                    </p>
                    {pkg.bonusCoinAmount && pkg.bonusCoinAmount > 0 && (
                      <Tag color="cyan" className="mt-1">+{pkg.bonusCoinAmount} Bonus</Tag>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {selectedPkg && (
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button onClick={() => setBuyModal(false)} className="!rounded-xl">Huỷ</Button>
              <Button
                type="primary"
                size="large"
                className="!font-bold !rounded-xl"
                style={{ background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)' }}
                onClick={() => {
                  setBuyModal(false);
                  message.info(`Tính năng thanh toán PayOS đang được phát triển. Đã chọn gói: ${selectedPkg.name}`);
                }}
              >
                Thanh toán {selectedPkg.price.toLocaleString()}đ
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
