import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة المدير - رحلة | تنقل بك بأمان',
  description: 'نظام إدارة وحجز رحلات الباصات - لوحة تحكم المدير',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-pullman-gray-bg font-sans min-h-screen text-pullman-gray-text antialiased">
        {children}
      </body>
    </html>
  );
}

