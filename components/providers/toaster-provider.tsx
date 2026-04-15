"use client";

import { Toaster as Sonner } from "sonner";

export function ToasterProvider() {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-bg-elevated/80 group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-2xl group-[.toaster]:font-display font-medium",
          description: "group-[.toast]:text-white/60",
          actionButton: "group-[.toast]:bg-primary-500 group-[.toast]:text-white group-[.toast]:rounded-xl font-bold uppercase tracking-widest text-[10px]",
          cancelButton: "group-[.toast]:bg-white/5 group-[.toast]:text-white",
          success: "group-[.toast]:border-emerald-500/20 group-[.toast]:text-emerald-400",
          error: "group-[.toast]:border-rose-500/20 group-[.toast]:text-rose-400",
        },
      }}
    />
  );
}
