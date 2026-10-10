"use client";

import { ActivityItem } from "@/types";
import { CheckCircle2, AlertTriangle, Info, PlayCircle, Clock } from "lucide-react";

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: ActivityItem["type"], status: ActivityItem["status"]) => {
    if (status === "Failed") {
      return (
        <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
        </div>
      );
    }

    switch (type) {
      case "test_completed":
      case "test_run":
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        );
      case "target_registered":
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
            <PlayCircle className="w-4 h-4 text-indigo-600" />
          </div>
        );
    }
  };

  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
          Sample Activity Data
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="py-4 space-y-4 max-h-[320px] overflow-y-auto pr-1">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-3 group">
            {getIcon(item.type, item.status)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {item.title}
                </p>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                {item.description}
              </p>
              {item.projectName && (
                <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded">
                  {item.projectName}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 text-center">
        <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
          View all system execution logs &rarr;
        </span>
      </div>
    </div>
  );
}
