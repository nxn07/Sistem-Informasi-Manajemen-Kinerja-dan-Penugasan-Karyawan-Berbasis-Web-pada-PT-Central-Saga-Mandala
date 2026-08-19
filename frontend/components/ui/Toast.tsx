"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

interface ToastProps {
  type: "success" | "error";
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 fade-in duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium max-w-md ${
          isSuccess
            ? "bg-emerald-50 border-emerald-300 text-emerald-800"
            : "bg-rose-50 border-rose-300 text-rose-800"
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
        )}
        <span className="flex-1 leading-relaxed">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
