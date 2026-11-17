'use client';

import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  adminName?: string;
  adminRole?: string;
}

export default function Header({ 
  adminName = 'أحمد الخطيب', 
  adminRole = 'مدير النظام' 
}: HeaderProps) {
  // Current date formatted nicely in Arabic like in the Figma design
  const currentDate = 'السبت، 24 أيار 2025';

  return (
    <header className="bg-white border-b border-pullman-gray-border px-8 py-5 flex items-center justify-between select-none">
      {/* Right side: Greeting & Date */}
      <div>
        <p className="text-xs text-pullman-gray-muted font-medium mb-1">
          {currentDate}
        </p>
        <h1 className="text-2xl font-bold text-pullman-gray-text tracking-tight">
          صباح الخير، أحمد
        </h1>
      </div>

      {/* Left side: Admin Profile & Portal Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white pl-2 pr-3 py-1.5 rounded-full border border-pullman-gray-border shadow-sm">
          {/* Avatar with Initials */}
          <div className="w-9 h-9 rounded-full bg-pullman-dark text-white font-bold flex items-center justify-center text-xs shadow-inner">
            أخ
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-pullman-gray-text leading-tight">
              {adminName}
            </div>
            <div className="text-[11px] text-pullman-gray-muted font-medium">
              {adminRole}
            </div>
          </div>

          {/* Return to Portals / Portal Switcher */}
          <div className="h-6 w-[1px] bg-gray-200 mx-1" />
          
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-pullman-gray-text hover:text-pullman-orange transition-colors px-2 py-1 rounded-md"
            title="العودة إلى البوابة الرئيسية"
          >
            <span>العودة إلى البوابات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

