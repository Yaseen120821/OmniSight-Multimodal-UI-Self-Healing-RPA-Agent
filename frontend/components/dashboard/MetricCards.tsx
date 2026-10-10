"use client";

import {
  FolderGit2,
  PlayCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Layers,
} from "lucide-react";
import { DashboardMetrics } from "@/types";

interface MetricCardsProps {
  metrics: DashboardMetrics;
}

export default function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      id: "total-projects",
      title: "Total Projects",
      value: metrics.totalProjects,
      subtitle: "Active monitored target applications",
      icon: FolderGit2,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50/70",
      borderColor: "border-blue-100",
      trend: "up",
      trendText: "+2 this month",
    },
    {
      id: "test-runs",
      title: "Test Executions",
      value: metrics.testsExecuted.toLocaleString(),
      subtitle: "Recorded automated test runs",
      icon: Layers,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50/70",
      borderColor: "border-indigo-100",
      trend: "up",
      trendText: "+18.2%",
    },
    {
      id: "passed-tests",
      title: "Passed Tests",
      value: metrics.passedTests.toLocaleString(),
      subtitle: "Passed assertion checks",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50/70",
      borderColor: "border-emerald-100",
      trend: "up",
      trendText: "+4.1%",
    },
    {
      id: "failed-tests",
      title: "Failed Tests",
      value: metrics.failedTests.toLocaleString(),
      subtitle: "Queued for self-healing repair",
      icon: XCircle,
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50/70",
      borderColor: "border-rose-100",
      trend: "down",
      trendText: "-2.5%",
    },
    {
      id: "overall-pass-rate",
      title: "Overall Pass Rate",
      value: `${metrics.overallPassRate}%`,
      subtitle: "Reliability across targets",
      icon: PlayCircle,
      iconColor: "text-sky-600",
      bgColor: "bg-sky-50/70",
      borderColor: "border-sky-100",
      trend: "up",
      trendText: "+1.2%",
    },
    {
      id: "self-healing-success",
      title: "Self-Healing Success",
      value: `${metrics.selfHealingSuccessRate}%`,
      subtitle: `${metrics.totalHealingAttempts} selector repairs attempted`,
      icon: Sparkles,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50/70",
      borderColor: "border-purple-100",
      trend: "up",
      trendText: "+5.4%",
    },
  ];

  return (
    <section aria-label="Dashboard Metrics Overview" data-testid="dashboard-metrics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {card.title}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
                    {card.value}
                  </h2>
                </div>
                <div className={`p-2 rounded-xl ${card.bgColor} ${card.borderColor} border shrink-0`}>
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium truncate">
                  {card.subtitle}
                </span>
                <div
                  className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    card.trend === "up"
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-rose-700 bg-rose-50"
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
