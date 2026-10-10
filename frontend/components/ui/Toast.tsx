"use client";

import { CheckCircle2, AlertTriangle, X, Info } from "lucide-react";

interface ToastProps {
  message: string | null;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-200 max-w-md"
    >
      {type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
      {type === "error" && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
      {type === "info" && <Info className="w-5 h-5 text-blue-400 shrink-0" />}

      <div className="flex-1 text-xs font-medium leading-relaxed">{message}</div>

      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        aria-label="Close notification toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
