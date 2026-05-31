'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import imgKMATELOGO from '../../../assets/img/branding/KMATELOGO.png';
import { authService } from '@/lib/api-services';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Định dạng email không hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      message.success('Đã gửi email đặt lại mật khẩu!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Không tìm thấy tài khoản với email này.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-sans relative overflow-hidden">
      {/* ===== BACKGROUND LAYERS ===== */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C4DFF]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00e5ff]/20 rounded-full blur-[150px]" />

        {/* Cyber grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-xl px-6 py-3 flex items-center justify-between border-white/5">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src={imgKMATELOGO}
                alt="K-MATE Logo"
                width={120}
                height={30}
                className="h-[30px] w-auto object-contain"
              />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button type="text" className="!text-white/70 !font-semibold !text-sm !px-3 hover:!text-white">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="!font-bold !text-sm !h-9 !px-5 !rounded-xl !border-0 !text-background-dark"
                  style={{ background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)' }}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-24 pb-12">

        {/* ===== LEFT: Floating lock icon ===== */}
        <div className="absolute left-[8%] top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-48 h-48"
          >
            <div className="absolute inset-0 bg-[#7C4DFF]/30 rounded-full blur-2xl" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full glass border-[rgba(124,77,255,0.3)] rounded-3xl flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-12 h-12 text-[#7C4DFF]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
                <span className="text-[10px] font-black tracking-widest uppercase text-slate-300">Reset Password</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ===== RIGHT: Mascot ===== */}
        <div className="absolute right-[8%] bottom-20 hidden xl:block pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-96 h-96"
          >
            <div className="absolute inset-0 bg-[#00e5ff]/20 rounded-full blur-3xl animate-pulse" />
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR4HenTVN200iJvXOCOqaO8sZDvexTovOYG7rM8dlbBe9WNjnwLPLgUjeIP9zpNqI_Na71r_ReRAl3kWN-hxFq_ThaU256N9BeDZUwtgFGW9gj-WGLKE6adj6epA-GynO-DCKWrvG01_3sRwiauDSx8m_JOB7Uibh4y03fpeaMpDAmxZyLAOpRDG_6EC2SeF9d1vkRciTPdkLlYOFAPfXYw25CIeKvnchUelSMaUfOCbaMguY_ycnL_zTa2lhSHOK5QgArA7dxhLbp"
              alt="K-MATE AI Robot Mascot"
              width={384}
              height={384}
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(0,229,255,0.4)]"
              priority={false}
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 glass px-4 py-3 rounded-xl border-[rgba(0,229,255,0.3)]"
            >
              <span className="text-2xl font-bold text-[#00e5ff]">도와줄게!</span>
            </motion.div>
          </motion.div>
        </div>

        {/* ===== CENTER: Form card ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-xl p-8 border-white/10 relative overflow-hidden group">
            {/* Card top glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00e5ff]/10 rounded-full blur-3xl transition-all group-hover:bg-[#00e5ff]/20 pointer-events-none" />

            {!submitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                  <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                    Forgot{' '}
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #7C4DFF 0%, #00e5ff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Password
                    </span>
                    ?
                  </h2>
                  <p className="text-slate-400 text-sm">
                    No worries, we&apos;ll send you reset instructions.
                  </p>
                </div>

                {/* Form */}
                <form className="space-y-5 relative z-10" onSubmit={handleSubmit} noValidate>
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Email Address
                    </label>
                    <Input
                      size="large"
                      prefix={<MailOutlined className="text-slate-500" />}
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="!bg-slate-900/50 !border !border-slate-700/50 !rounded-xl !py-3 !pl-11 !pr-4 !text-white placeholder:!text-slate-600 hover:!border-[#00e5ff]/50 focus-within:!border-[#00e5ff] !transition-all"
                      style={{ boxShadow: 'none' }}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    className="!font-bold !h-12 !rounded-xl !border-0 !text-background-dark !transition-all !duration-200 hover:!scale-[1.02] active:!scale-[0.98]"
                    style={{
                      background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)',
                      boxShadow: '0 0 15px rgba(124,77,255,0.3), 0 4px 12px rgba(0,0,0,0.3)',
                    }}
                  >
                    Send Reset Instructions
                  </Button>
                </form>

                {/* Back to login */}
                <p className="text-center mt-6 text-slate-400 text-sm relative z-10">
                  Remember your password?{' '}
                  <Link href="/login" className="text-[#00e5ff] font-bold hover:underline ml-1">
                    Back to Login
                  </Link>
                </p>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="text-center relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)' }}
                  >
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </motion.div>

                  <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                    Email{' '}
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #7C4DFF 0%, #00e5ff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Sent!
                    </span>
                  </h2>
                  <p className="text-slate-400 text-sm mb-2">
                    We&apos;ve sent password reset instructions to
                  </p>
                  <p className="text-[#00e5ff] font-bold text-base mb-8">{email}</p>
                  <p className="text-slate-500 text-xs mb-8">
                    Didn&apos;t receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-[#00e5ff] hover:underline cursor-pointer bg-transparent border-0"
                    >
                      try again
                    </button>
                    .
                  </p>

                  <Link href="/login">
                    <Button
                      size="large"
                      block
                      className="!h-12 !rounded-xl !font-bold !border-0 !text-background-dark !transition-all !duration-200 hover:!scale-[1.02]"
                      style={{
                        background: 'linear-gradient(135deg, #7C4DFF, #00e5ff)',
                        boxShadow: '0 0 15px rgba(124,77,255,0.3)',
                      }}
                    >
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>

      {/* ===== FLOATING PARTICLES ===== */}
      <div className="absolute left-1/4 bottom-1/4 w-4 h-4 bg-[#00e5ff] rounded-full blur-sm opacity-50 animate-ping pointer-events-none" />
      <div className="absolute right-1/4 top-1/4 w-3 h-3 bg-[#7C4DFF] rounded-full blur-sm opacity-50 animate-pulse pointer-events-none" />

      {/* ===== FOOTER ===== */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 text-center z-0 opacity-40">
        <p className="text-xs text-slate-500 tracking-widest uppercase font-bold">
          Powered by NeuralCore 4.0 &copy; 2026 K-MATE Labs
        </p>
      </footer>
    </div>
  );
}
