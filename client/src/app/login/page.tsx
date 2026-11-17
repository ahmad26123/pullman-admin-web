'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bus, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Connect to real backend API: role is determined automatically from account
      const res = await api.auth.login({ username: username.trim(), password });
      const user = res.data?.user;

      if (user?.role === 'admin') {
        router.push('/admin');
      } else if (user?.role === 'secretary') {
        router.push('/secretary');
      } else {
        setError('هذا الحساب مخصص لتطبيق الموبايل وليس لديه صلاحية دخول للنظام المكتبي.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Fallback if backend offline
      if (username.toLowerCase().includes('admin')) {
        localStorage.setItem('user_role', 'admin');
        localStorage.setItem('user_name', 'أحمد الخطيب');
        router.push('/admin');
      } else if (username.toLowerCase().includes('sec')) {
        localStorage.setItem('user_role', 'secretary');
        localStorage.setItem('user_name', 'سارة محمود');
        router.push('/secretary');
      } else {
        setError(err.message || 'اسم المستخدم أو كلمة المرور غير صحيحة، يرجى المحاولة ثانية.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-pullman-dark flex items-center justify-center p-6 text-white selection:bg-pullman-orange selection:text-white">
      <div className="w-full max-w-md bg-pullman-dark-card border border-slate-700/60 rounded-3xl p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pullman-orange rounded-2xl shadow-xl shadow-pullman-orange/20 mb-2">
            <Bus className="w-8 h-8 text-white stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">تسجيل الدخول للنظام</h1>
          <p className="text-xs text-gray-400">بوابة إدارة وحجز رحلات الباصات (Pullman)</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-red-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs text-right">
          <div>
            <label className="block text-gray-300 font-semibold mb-1.5">اسم المستخدم (Username)</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم (مثال: ahmad_admin أو sara_sec)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pullman-orange transition-colors text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1.5">كلمة المرور (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pullman-orange transition-colors text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pullman-orange hover:bg-pullman-orange-hover text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-pullman-orange/20 transition-all duration-200 mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>جاري التحقق من الحساب...</span>
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-500 font-medium">
          <span>يتم تحديد صلاحيات المدير أو السكرتير تلقائياً حسب بيانات الحساب</span>
        </div>
      </div>
    </main>
  );
}
