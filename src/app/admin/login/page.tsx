'use client';

import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { MailOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';
import imgKMATELOGO from '../../../../assets/img/branding/KMATELOGO.png';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Vui lòng nhập email và mật khẩu.'); return; }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      if (user.role !== 'ADMIN') {
        setError('Bạn không có quyền truy cập trang quản trị.');
        return;
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setTokens(accessToken, refreshToken);
      setUser(user);
      message.success('Đăng nhập admin thành công!');
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setError(e.response?.data?.error?.message || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/15 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src={imgKMATELOGO} alt="K-MATE" width={120} height={30} className="object-contain" />
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 tracking-widest">
              ADMIN PANEL
            </span>
          </div>
          <h2 className="text-white text-2xl font-black">Đăng nhập Quản trị</h2>
          <p className="text-slate-500 text-sm mt-1">K-MATE Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-[#151c2a] rounded-2xl p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Email
              </label>
              <Input
                size="large"
                prefix={<MailOutlined className="text-slate-500" />}
                placeholder="admin@kmate.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!bg-slate-900/50 !border !border-slate-700/50 !rounded-xl !py-3 !pl-11 !text-white placeholder:!text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-slate-500" />}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!bg-slate-900/50 !border !border-slate-700/50 !rounded-xl !py-3 !pl-11 !text-white placeholder:!text-slate-600"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="!font-bold !h-12 !rounded-xl !border-0 !text-white !transition-all"
              style={{ background: 'linear-gradient(135deg, #ef4444, #7C4DFF)' }}
              icon={<ArrowRightOutlined />}
              iconPosition="end"
            >
              Đăng nhập Admin
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link href="/login" className="text-slate-500 hover:text-slate-300 text-sm">
              ← Quay về đăng nhập thường
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
