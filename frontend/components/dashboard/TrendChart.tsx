"use client";

import { useState } from "react";
import { ExecutionTrend } from "@/types";
import { BarChart2, Info } from "lucide-react";

interface TrendChartProps {
  data: ExecutionTrend[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const [activeBar, setActiveBar] = useState<ExecutionTrend | null>(null);

  // Maximum value for scale baseline
  const maxTotal = Math.max(...data.map((d) => d.passed + d.failed), 40);

  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between h-full">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Test Execution Trend</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily breakdown of passed vs failed automated test runs over 7 days
          </p>
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
        <caption>Weekly Test Execution Results</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Passed</th>
            <th scope="col">Failed</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.day}>
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
        <div className="flex items-end justify-between gap-2 sm:gap-4 px-2">
          {data.map((item) => {
            // Compute percentage relative to chart height scale
            const passedHeight = Math.round((item.passed / maxTotal) * 100);
            const failedHeight = Math.round((item.failed / maxTotal) * 100);
            const isHovered = activeBar?.day === item.day;

            return (
              <div
                key={item.day}
                onMouseEnter={() => setActiveBar(item)}
                onMouseLeave={() => setActiveBar(null)}
                className="flex-1 flex flex-col items-center group relative cursor-pointer"
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3 shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
                    <p className="font-bold text-[11px] text-slate-300">
                      {item.day}, {item.date}
                    </p>
                    <div className="flex items-center gap-3 text-xs mt-0.5">
                      <span className="text-emerald-400 font-semibold">
                        {item.passed} Passed
                      </span>
                      <span className="text-rose-400 font-semibold">
                        {item.failed} Failed
                      </span>
                    </div>
                  </div>
                )}

                {/* Fixed Height Container for Percent Height Bars */}
                <div className="w-full max-w-[36px] h-36 sm:h-44 flex flex-col justify-end gap-1 rounded-t-md overflow-hidden bg-slate-50 border border-slate-200/80 p-1 group-hover:border-blue-400 transition-colors">
                  {/* Failed Bar */}
                  {failedHeight > 0 && (
                    <div
                      style={{ height: `${failedHeight}%` }}
                      className="w-full bg-rose-500 rounded-xs transition-all duration-300 group-hover:bg-rose-600 min-h-[4px]"
                      title={`${item.failed} Failed`}
                    />
                  )}
                  {/* Passed Bar */}
                  {passedHeight > 0 && (
                    <div
                      style={{ height: `${passedHeight}%` }}
                      className="w-full bg-emerald-500 rounded-xs transition-all duration-300 group-hover:bg-emerald-600 min-h-[4px]"
                      title={`${item.passed} Passed`}
                    />
                  )}
                </div>

                {/* X Axis Label */}
                <div className="mt-2 text-center">
                  <span className="block text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {item.day}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium">
                    {item.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Summary note */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Average daily executions: 35 tests</span>
        </span>
        <span className="font-semibold text-slate-700">7-Day Total: 248 runs</span>
      </div>
    </div>
  );
}
