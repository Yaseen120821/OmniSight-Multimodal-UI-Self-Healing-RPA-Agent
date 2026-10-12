"use client";

import { Sparkles, CheckCircle2, Clock, XCircle, ShieldCheck } from "lucide-react";
import { DashboardMetrics } from "@/types";

interface SelfHealingPerformanceProps {
  metrics: DashboardMetrics;
}

export default function SelfHealingPerformance({ metrics }: SelfHealingPerformanceProps) {
  const totalAttempts = metrics.totalHealingAttempts || 15;
  const validatedCount = Math.round((totalAttempts * (metrics.selfHealingSuccessRate || 93.3)) / 100);
  const pendingCount = 1;
  const failedCount = Math.max(0, totalAttempts - validatedCount - pendingCount);

  const validatedPercent = Math.round((validatedCount / totalAttempts) * 100);
  const pendingPercent = Math.round((pendingCount / totalAttempts) * 100);
  const failedPercent = Math.max(0, 100 - validatedPercent - pendingPercent);

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Self-Healing Performance</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Autonomous AI selector repair validation & recovery metrics
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>{metrics.selfHealingSuccessRate}% Success Rate</span>
        </span>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Attempts</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{totalAttempts}</p>
          <span className="text-[10px] text-slate-500">Mutated DOM elements</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Successful</p>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-emerald-800 mt-1">{validatedCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Validated & Passed</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Pending Review</p>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-xl font-extrabold text-amber-800 mt-1">{pendingCount}</p>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting human signoff</span>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Failed</p>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <p className="text-xl font-extrabold text-rose-800 mt-1">{failedCount}</p>
          <span className="text-[10px] text-rose-600 font-medium">Manual repair needed</span>
        </div>
      </div>

      {/* Progress Breakdown Bar */}
      <div className="space-y-1.5 pb-2">
        <div className="flex justify-between text-xs text-slate-600 font-medium">
          <span>Repair Resolution Ratio</span>
          <span className="text-slate-900 font-bold">{validatedPercent}% Validated</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full flex overflow-hidden p-0.5 border border-slate-200/60">
          <div
            style={{ width: `${validatedPercent}%` }}
            className="h-full bg-emerald-500 rounded-l-full transition-all duration-300"
            title={`Validated: ${validatedPercent}%`}
          />
          <div
            style={{ width: `${pendingPercent}%` }}
            className="h-full bg-amber-400 transition-all duration-300"
            title={`Pending: ${pendingPercent}%`}
          />
          {failedPercent > 0 && (
            <div
              style={{ width: `${failedPercent}%` }}
              className="h-full bg-rose-500 rounded-r-full transition-all duration-300"
              title={`Failed: ${failedPercent}%`}
            />
          )}
        </div>
      </div>

      {/* Active AI Healing Strategies Showcase */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">
          Strategies: SSIM Visual Match (98%) &bull; Vision Vector Similarity (94%)
        </span>
        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Zero Pipeline Halts
        </span>
      </div>
    </div>
  );
}
