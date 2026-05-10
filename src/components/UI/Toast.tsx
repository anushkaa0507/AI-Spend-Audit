"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type = "info",
  duration = 3500,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // mount → slide in
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, duration);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [duration, onClose]);

  const colors = {
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    error:   "border-red-500/40    bg-red-500/10    text-red-300",
    info:    "border-violet-500/40 bg-violet-500/10 text-violet-300",
  };

  const icons = { success: "✓", error: "✕", info: "ℹ" };

  return (
    <>
      <style>{`
        .toast-enter { opacity: 0; transform: translateY(16px) scale(0.95); }
        .toast-show   { opacity: 1; transform: translateY(0)     scale(1);    transition: all 0.35s cubic-bezier(.22,1,.36,1); }
        .toast-hide   { opacity: 0; transform: translateY(-8px)  scale(0.95); transition: all 0.35s ease-in; }
      `}</style>
      <div
        className={`
          fixed bottom-6 right-6 z-[9999] flex items-center gap-3
          border rounded-2xl px-5 py-4 shadow-2xl backdrop-blur-xl
          ${colors[type]}
          ${visible ? "toast-show" : "toast-enter"}
        `}
      >
        <span className="text-lg font-bold">{icons[type]}</span>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => { setVisible(false); setTimeout(onClose, 400); }}
          className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
        >
          ×
        </button>
      </div>
    </>
  );
}