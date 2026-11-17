'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-pullman-dark flex items-center justify-center text-white">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-pullman-orange border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-400 font-bold">جاري الانتقال إلى صفحة تسجيل الدخول...</p>
      </div>
    </div>
  );
}
