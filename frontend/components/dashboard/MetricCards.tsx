"use client";

import {
  FolderGit2,
  PlayCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DashboardMetrics } from "@/types";

interface MetricCardsProps {
  metrics: DashboardMetrics;
}

export default function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      id: "registered-targets",
      title: "TOTAL PROJECTS",
      secondaryTitle: "Registered Targets",
      value: metrics.totalProjects,
      subtitle: "+2 registered this month",
      icon: FolderGit2,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      trend: "up",
      trendText: "+16.6%",
    },
    {
      id: "test-runs",
      title: "TESTS EXECUTED",
      secondaryTitle: "Test Runs",
      value: metrics.testsExecuted.toLocaleString(),
      subtitle: "Total automated test runs",
      icon: PlayCircle,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
      trend: "up",
      trendText: "+18.2%",
    },
    {
      id: "passed-tests",
      title: "PASSED TESTS",
      secondaryTitle: "Pass Rate",
      value: metrics.passedTests.toLocaleString(),
      subtitle: `${metrics.overallPassRate}% pass rate accuracy`,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      trend: "up",
      trendText: "+4.1%",
    },
    {
      id: "failed-tests",
      title: "FAILED TESTS",
      secondaryTitle: "Open Defects",
      value: metrics.failedTests.toLocaleString(),
      subtitle: "Queued for self-healing repair",
      icon: XCircle,
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
      trend: "down",
      trendText: "-2.5%",
    },
  ];

  return (
    <section aria-label="Dashboard Metrics Overview" data-testid="dashboard-metrics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {card.title}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                    {card.value}
                  </h2>
                </div>
                <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.borderColor} border shrink-0`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium truncate">
                  {card.subtitle}
                </span>
                <div
                  className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    card.trend === "up"
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                      : "text-rose-700 bg-rose-50 border border-rose-200"
                  }`}
                >
                  {card.trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{card.trendText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
