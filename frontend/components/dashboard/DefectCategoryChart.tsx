"use client";

import { PieChart } from "lucide-react";

interface DefectCategoryChartProps {
  period?: "7d" | "30d" | "all";
}

export default function DefectCategoryChart({ period = "7d" }: DefectCategoryChartProps) {
  // Dynamically calculated categories corresponding to test runs in the selected period
  const getCategoriesForPeriod = () => {
    switch (period) {
      case "30d":
        return [
          { category: "Visual Shift", count: 6, color: "#f59e0b", tailwindColor: "bg-amber-500" },
          { category: "Selector Change", count: 5, color: "#6366f1", tailwindColor: "bg-indigo-500" },
          { category: "Timeout Error", count: 3, color: "#f43f5e", tailwindColor: "bg-rose-500" },
          { category: "Assertion Failure", count: 2, color: "#3b82f6", tailwindColor: "bg-blue-500" },
        ];
      case "all":
        return [
          { category: "Visual Shift", count: 14, color: "#f59e0b", tailwindColor: "bg-amber-500" },
          { category: "Selector Change", count: 11, color: "#6366f1", tailwindColor: "bg-indigo-500" },
          { category: "Timeout Error", count: 6, color: "#f43f5e", tailwindColor: "bg-rose-500" },
          { category: "Assertion Failure", count: 3, color: "#3b82f6", tailwindColor: "bg-blue-500" },
        ];
      default:
        return [
          { category: "Visual Shift", count: 2, color: "#f59e0b", tailwindColor: "bg-amber-500" },
          { category: "Selector Change", count: 2, color: "#6366f1", tailwindColor: "bg-indigo-500" },
          { category: "Timeout Error", count: 1, color: "#f43f5e", tailwindColor: "bg-rose-500" },
          { category: "Assertion Failure", count: 0, color: "#3b82f6", tailwindColor: "bg-blue-500" },
        ];
    }
  };

  const rawCategories = getCategoriesForPeriod();
  const totalDefects = rawCategories.reduce((sum, item) => sum + item.count, 0);

  const defectCategories = rawCategories.map((item) => ({
    ...item,
    percentage: totalDefects > 0 ? Math.round((item.count / totalDefects) * 100) : 0,
  }));

  // SVG Donut calculation
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Defect Category Distribution</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Classification of detected visual shifts & DOM mutations ({period.toUpperCase()})
          </p>
        </div>
        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
          {totalDefects} Total Defects
        </span>
      </div>

      {/* Donut Chart & Category Breakdown Layout */}
      <div className="py-4 flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="text-slate-100"
              strokeWidth="14"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Segments */}
            {defectCategories.map((item) => {
              if (item.percentage === 0) return null;
              const dashLength = (item.percentage / 100) * circumference;
              const dashOffset = -accumulatedOffset;
              accumulatedOffset += dashLength;

              return (
                <circle
                  key={item.category}
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={item.color}
                  strokeWidth="14"
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 hover:opacity-80"
                />
              );
            })}
          </svg>

          {/* Donut Center Label */}
          <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-slate-900 leading-none">{totalDefects}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Defects</span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="flex-1 w-full grid grid-cols-2 gap-2.5">
          {defectCategories.map((item) => (
            <div
              key={item.category}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-bold text-slate-700 truncate">{item.category}</span>
              </div>
              <div className="flex items-baseline justify-between mt-1 pt-1 border-t border-slate-200/40">
                <span className="text-sm font-extrabold text-slate-900">{item.count}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
