'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SecretaryHeaderProps {
  pageTitle?: string;
  userName?: string;
  userRole?: string;
}

export default function SecretaryHeader({
  pageTitle = 'رحلات اليوم',
  userName = 'سارة محمود',
  userRole = 'موظفة حجوزات',
}: SecretaryHeaderProps) {
  const currentDate = 'السبت، 24 أيار 2025';

  return (
    <header className="bg-white border-b border-pullman-gray-border px-8 py-5 flex items-center justify-between select-none">
      {/* Right side: Greeting & Date */}
      <div>
        <p className="text-xs text-pullman-gray-muted font-medium mb-1">
          {currentDate}
        </p>
        <h1 className="text-2xl font-bold text-pullman-gray-text tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Left side: Secretary Profile & Portal Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white pl-2 pr-3 py-1.5 rounded-full border border-pullman-gray-border shadow-sm">
          {/* Avatar with Initials "سم" */}
          <div className="w-9 h-9 rounded-full bg-pullman-dark text-white font-bold flex items-center justify-center text-xs shadow-inner">
            سم
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-pullman-gray-text leading-tight">
              {userName}
            </div>
            <div className="text-[11px] text-pullman-gray-muted font-medium">
              {userRole}
            </div>
          </div>

          {/* Separator */}
          <div className="h-6 w-[1px] bg-gray-200 mx-1" />

          {/* Return to Portals */}
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

