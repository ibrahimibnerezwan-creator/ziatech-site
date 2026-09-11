import React from 'react';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0a0f18] text-slate-100">{children}</div>;
}
