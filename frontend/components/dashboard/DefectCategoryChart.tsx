"use client";

import { AlertTriangle, PieChart } from "lucide-react";

export default function DefectCategoryChart() {
  const defectCategories = [
    { category: "Visual Shift", count: 14, color: "bg-amber-500", percentage: 41 },
    { category: "Selector Change", count: 11, color: "bg-indigo-500", percentage: 32 },
    { category: "Timeout Error", count: 6, color: "bg-rose-500", percentage: 18 },
    { category: "Assertion Failure", count: 3, color: "bg-blue-500", percentage: 9 },
  ];

  return (
    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Defect Category Distribution</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Classification of detected visual shifts & DOM mutations
          </p>
        </div>
        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
          34 Defects Total
        </span>
      </div>

      {/* Progress Bars Stack */}
      <div className="py-4 space-y-3.5">
        <div className="h-3 bg-slate-100 rounded-full flex overflow-hidden p-0.5 border border-slate-200/60">
          {defectCategories.map((item) => (
            <div
              key={item.category}
              style={{ width: `${item.percentage}%` }}
              className={`h-full ${item.color} first:rounded-l-full last:rounded-r-full transition-all duration-300`}
              title={`${item.category}: ${item.count} (${item.percentage}%)`}
            />
          ))}
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {defectCategories.map((item) => (
            <div key={item.category} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-xs font-semibold text-slate-700">{item.category}</span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {item.count} <span className="text-[10px] text-slate-400 font-normal">({item.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>73% automatically repaired via Vision AI</span>
        </span>
      </div>
    </div>
  );
}
