'use client';

import React from 'react';
import { 
  CalendarDays, 
  Armchair, 
  Ticket, 
  Users, 
  LogOut, 
  Bus 
} from 'lucide-react';

export type SecretaryTab = 'today-trips' | 'seat-map' | 'bookings' | 'customers';

interface SecretarySidebarProps {
  currentTab: SecretaryTab;
  onTabChange: (tab: SecretaryTab) => void;
  pendingCount?: number;
}

export default function SecretarySidebar({
  currentTab,
  onTabChange,
  pendingCount = 12,
}: SecretarySidebarProps) {
  const menuItems = [
    {
      id: 'today-trips' as SecretaryTab,
      label: 'رحلات اليوم',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'seat-map' as SecretaryTab,
      label: 'خريطة المقاعد',
      icon: Armchair,
      badge: pendingCount,
    },
    {
      id: 'bookings' as SecretaryTab,
      label: 'الحجوزات',
      icon: Ticket,
      badge: null,
    },
    {
      id: 'customers' as SecretaryTab,
      label: 'الزبائن',
      icon: Users,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-pullman-dark min-h-screen text-white flex flex-col justify-between py-6 px-4 select-none shrink-0 border-l border-slate-800/60 z-20">
      {/* Top Branding & Menu */}
      <div className="space-y-7">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-11 h-11 bg-pullman-orange rounded-xl flex items-center justify-center text-white shadow-md shadow-pullman-orange/20">
            <Bus className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              رحلة
            </div>
            <div className="text-[11px] text-gray-400 font-medium">تنقل بك بأمان</div>
          </div>
        </div>

        {/* Section title */}
        <div className="px-2">
          <span className="text-[11px] text-gray-400/80 font-medium tracking-wide">
            بوابة السكرتاريا
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-pullman-orange text-white shadow-lg shadow-pullman-orange/25 font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-pullman-dark-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold leading-tight ${
                      isActive ? 'bg-white/20 text-white' : 'bg-pullman-orange text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="pt-6 border-t border-slate-800/80 px-2">
        <button
          onClick={() => {
            if (confirm('هل تريد تسجيل الخروج من بوابة السكرتاريا؟')) {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }
          }}
          className="w-full flex items-center gap-3 px-2 py-2.5 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}

