"use client";

import { useState } from "react";
import { ExecutionTrend } from "@/types";
import { BarChart2 } from "lucide-react";

interface TrendChartProps {
  data: ExecutionTrend[];
  period?: "7d" | "30d" | "all";
}

export default function TrendChart({ data, period = "7d" }: TrendChartProps) {
  const [activeBar, setActiveBar] = useState<ExecutionTrend | null>(null);

  // Maximum value for scale baseline
  const maxTotal = Math.max(...data.map((d) => d.passed + d.failed), 40);

  const getSubtitle = () => {
    switch (period) {
      case "30d":
        return "Weekly breakdown of passed vs failed automated test runs over 30 days";
      case "all":
        return "Comprehensive historical test execution trends across all monitored periods";
      default:
        return "Daily breakdown of passed vs failed automated test runs over 7 days";
    }
  };

  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between h-full">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Test Execution Trend</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{getSubtitle()}</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
            <span className="text-slate-600">Passed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
            <span className="text-slate-600">Failed</span>
          </div>
        </div>
      </div>

      {/* Accessible Table for Screen Readers */}
      <table className="sr-only">
        <caption>Test Execution Results ({period.toUpperCase()})</caption>
        <thead>
          <tr>
            <th scope="col">Interval</th>
            <th scope="col">Passed</th>
            <th scope="col">Failed</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={`${item.day}-${item.date}`}>
              <th scope="row">
                {item.day} ({item.date})
              </th>
              <td>{item.passed}</td>
              <td>{item.failed}</td>
              <td>{item.passed + item.failed}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Interactive Stacked Bar Chart */}
      <div className="pt-6 pb-2">
        <div className="flex items-end justify-between gap-2 sm:gap-4 px-2 min-h-[140px]">
          {data.map((item) => {
            // Compute percentage relative to chart height scale
            const total = item.passed + item.failed;
            const passedHeight = Math.max(4, Math.round((item.passed / maxTotal) * 100));
            const failedHeight = item.failed > 0 ? Math.max(3, Math.round((item.failed / maxTotal) * 100)) : 0;
            const isHovered = activeBar?.date === item.date;

            return (
              <div
                key={`${item.day}-${item.date}`}
                onMouseEnter={() => setActiveBar(item)}
                onMouseLeave={() => setActiveBar(null)}
                className="flex-1 flex flex-col items-center group relative cursor-pointer"
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3 shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                    <p className="font-bold text-[11px] text-slate-300">
                      {item.day} • {item.date}
                    </p>
                    <div className="flex items-center gap-3 text-xs mt-0.5">
                      <span className="text-emerald-400 font-semibold">
                        {item.passed} Passed
                      </span>
                      <span className="text-rose-400 font-semibold">
                        {item.failed} Failed
                      </span>
                      <span className="text-slate-300 font-medium">
                        ({total} Total)
                      </span>
                    </div>
                  </div>
                )}

                {/* Stacked Vertical Bar */}
                <div className="w-full max-w-[28px] sm:max-w-[34px] flex flex-col justify-end gap-0.5 h-32">
                  {/* Failed segment (top) */}
                  {failedHeight > 0 && (
                    <div
                      style={{ height: `${failedHeight}%` }}
                      className={`w-full bg-rose-500 rounded-t-sm transition-all duration-300 ${
                        isHovered ? "brightness-110" : ""
                      }`}
                    />
                  )}
                  {/* Passed segment (bottom) */}
                  <div
                    style={{ height: `${passedHeight}%` }}
                    className={`w-full bg-emerald-500 transition-all duration-300 ${
                      failedHeight > 0 ? "rounded-b-sm" : "rounded-sm"
                    } ${isHovered ? "brightness-110" : ""}`}
                  />
                </div>

                {/* Axis Labels */}
                <span className="mt-2 text-[11px] font-bold text-slate-700 tracking-tight">
                  {item.day}
                </span>
                <span className="text-[9px] text-slate-400 font-medium truncate max-w-[50px]">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
