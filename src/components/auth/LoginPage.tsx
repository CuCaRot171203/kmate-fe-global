'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button, Input, Checkbox, message } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import imgKMATELOGO from '../../../assets/img/branding/KMATELOGO.png';
import { authService } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth.store';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      const { setTokens, setUser } = useAuthStore.getState();
      setTokens(accessToken, refreshToken);
      message.success('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => { window.location.href = '/user/dashboard'; }, 500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || 'Email hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId) {
      const redirectUri = `${window.location.origin}/api/auth/google/callback`;
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`;
    } else {
      message.warning('Google OAuth chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_GOOGLE_CLIENT_ID vào .env.local');
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-sans relative overflow-hidden">
      {/* ===== BACKGROUND LAYERS ===== */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Ambient glows */}
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

        {/* ===== LEFT: Floating mascot ===== */}
        <div className="absolute left-[8%] top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-96 h-96"
          >
            {/* Glow behind mascot */}
            <div className="absolute inset-0 bg-[#00e5ff]/20 rounded-full blur-3xl animate-pulse" />

            {/* Mascot image */}
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR4HenTVN200iJvXOCOqaO8sZDvexTovOYG7rM8dlbBe9WNjnwLPLgUjeIP9zpNqI_Na71r_ReRAl3kWN-hxFq_ThaU256N9BeDZUwtgFGW9gj-WGLKE6adj6epA-GynO-DCKWrvG01_3sRwiauDSx8m_JOB7Uibh4y03fpeaMpDAmxZyLAOpRDG_6EC2SeF9d1vkRciTPdkLlYOFAPfXYw25CIeKvnchUelSMaUfOCbaMguY_ycnL_zTa2lhSHOK5QgArA7dxhLbp"
              alt="K-MATE AI Robot Mascot"
              width={384}
              height={384}
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(0,229,255,0.4)]"
              priority={false}
            />

            {/* Floating "안녕하세요" bubble */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 glass px-4 py-3 rounded-xl border-[rgba(0,229,255,0.3)]"
            >
              <span className="text-2xl font-bold text-[#00e5ff]">안녕하세요!</span>
            </motion.div>
          </motion.div>
        </div>

        {/* ===== RIGHT: Floating level badge ===== */}
        <div className="absolute right-[8%] bottom-20 hidden xl:block pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-48 h-48"
          >
            <div className="absolute inset-0 bg-[#7C4DFF]/30 rounded-full blur-2xl" />
            <motion.div
              animate={{ rotate: [12, 0, 12] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full glass border-[rgba(124,77,255,0.3)] rounded-3xl flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-10 h-10 text-[#7C4DFF]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span className="text-[10px] font-black tracking-widest uppercase text-slate-300">Level: Expert</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ===== CENTER: Login form card ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-xl p-8 border-white/10 relative overflow-hidden group">
            {/* Card top glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00e5ff]/10 rounded-full blur-3xl transition-all group-hover:bg-[#00e5ff]/20 pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                Welcome Back to{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #7C4DFF 0%, #00e5ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  K-MATE
                </span>
              </h2>
              <p className="text-slate-400 text-sm">Continue your Korean learning journey.</p>
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
                  style={{
                    boxShadow: 'none',
                  }}
                />
              </div>

              {/* Password */}
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
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone className="text-slate-500" /> : <EyeInvisibleOutlined className="text-slate-500" />
                  }
                  className="!bg-slate-900/50 !border !border-slate-700/50 !rounded-xl !py-3 !pl-11 !pr-4 !text-white placeholder:!text-slate-600 hover:!border-[#00e5ff]/50 focus-within:!border-[#00e5ff] !transition-all"
                  style={{
                    boxShadow: 'none',
                  }}
                />
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm -mt-1">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="[&_.ant-checkbox-inner]:!bg-slate-900/50 [&_.ant-checkbox-inner]:!border-slate-700/50 [&_.ant-checkbox-checked_.ant-checkbox-inner]:!bg-[#00e5ff] [&_.ant-checkbox-checked_.ant-checkbox-inner]:!border-[#00e5ff] [&_.ant-checkbox-wrapper:hover_.ant-checkbox-inner]:!border-[#00e5ff]/50"
                >
                  <span className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer select-none">
                    Remember me
                  </span>
                </Checkbox>
                <Link
                  href="/forgot-password"
                  className="text-[#00e5ff] hover:text-[#00e5ff]/80 font-semibold transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

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
                Login to Your Account
              </Button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="w-full border-t border-slate-800" />
                <span className="absolute px-3 bg-background-dark text-slate-500 text-xs font-bold uppercase">
                  or login with
                </span>
              </div>

              {/* Google */}
              <Button
                size="large"
                block
                onClick={handleGoogleLogin}
                className="!h-12 !rounded-xl !font-medium !bg-white/5 !border !border-slate-700/50 !text-white hover:!bg-white/10 hover:!border-slate-600/50 !transition-all !duration-200 flex !items-center !justify-center gap-3"
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M12 5.04c1.94 0 3.51.68 4.7 1.81l3.48-3.48C18.1 1.44 15.3 0 12 0 7.31 0 3.32 2.67 1.32 6.56l3.99 3.1c.95-2.85 3.6-4.62 6.69-4.62z" fill="#EA4335" />
                    <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.3h6.44c-.28 1.44-1.1 2.66-2.33 3.48l3.61 2.81c2.11-1.94 3.33-4.8 3.33-8.32z" fill="#4285F4" />
                    <path d="M5.31 14.44c-.24-.72-.37-1.5-.37-2.31s.13-1.59.37-2.31L1.32 6.56C.48 8.17 0 9.99 0 12s.48 3.83 1.32 5.44l3.99-3.12z" fill="#FBBC05" />
                    <path d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.61-2.81c-1.1.74-2.5 1.18-4.33 1.18-3.09 0-5.74-2.07-6.68-4.85l-3.99 3.12C3.32 21.33 7.31 24 12 24z" fill="#34A853" />
                  </svg>
                }
              >
                Continue with Google
              </Button>
            </form>

            {/* Footer link */}
            <p className="text-center mt-8 text-slate-400 text-sm relative z-10">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#00e5ff] font-bold hover:underline ml-1">
                Create Free Account
              </Link>
            </p>
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
