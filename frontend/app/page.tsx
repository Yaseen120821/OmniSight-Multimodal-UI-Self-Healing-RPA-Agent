"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import MetricCards from "@/components/dashboard/MetricCards";
import TrendChart from "@/components/dashboard/TrendChart";
import SelfHealingPerformance from "@/components/dashboard/SelfHealingPerformance";
import DefectCategoryChart from "@/components/dashboard/DefectCategoryChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import RecentTestRunsTable from "@/components/dashboard/RecentTestRunsTable";
import ProjectsTable from "@/components/projects/ProjectsTable";
import {
  getStoredProjects,
  getStoredTestRuns,
  subscribeToStoreUpdates,
  initialExecutionTrends,
} from "@/lib/store";
import { Project, TestRunDetail } from "@/types";
import { Play, RefreshCw, Calendar, Sparkles, Layers, FolderGit2 } from "lucide-react";

export default function DashboardPage() {
  const [period, setPeriod] = useState("7d");
  const [projectsList, setProjectsList] = useState<Project[]>(() => getStoredProjects());
  const [storedRuns, setStoredRuns] = useState<TestRunDetail[]>(() => getStoredTestRuns());
  const [activeTableTab, setActiveTableTab] = useState<"runs" | "targets">("runs");

  useEffect(() => {
    const unsubscribe = subscribeToStoreUpdates(() => {
      setProjectsList(getStoredProjects());
      setStoredRuns(getStoredTestRuns());
    });
    return unsubscribe;
  }, []);

  return (
    <AppShell>
      {({ metrics, activities, isTestRunning, runningProjectId, handleRunTest }) => (
        <div className="space-y-6">
          {/* Welcome Banner & Primary Actions (Matching Reference Screenshot) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-blue-500/30 text-blue-200 border border-blue-400/30 rounded">
                  Autonomous UI Agent
                </span>
                <span className="text-xs text-slate-300">&bull; OmniSight Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
                <span>Welcome back, Alex</span>
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                OmniSight is actively monitoring <strong>{metrics.totalProjects} target applications</strong> for UI regressions, DOM mutations, and visual drift.
              </p>
            </div>

            {/* Controls */}
            <div className="relative z-10 flex flex-wrap items-center gap-3">
              {/* Period Selector */}
              <div className="flex items-center bg-slate-800/80 border border-slate-700/80 p-1 rounded-lg text-xs font-semibold text-slate-300">
                <Calendar className="w-3.5 h-3.5 ml-2 mr-1 text-slate-400" />
                <button
                  onClick={() => setPeriod("7d")}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    period === "7d" ? "bg-blue-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setPeriod("30d")}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    period === "30d" ? "bg-blue-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setPeriod("all")}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    period === "all" ? "bg-blue-600 text-white font-bold" : "hover:text-white"
                  }`}
                >
                  All Time
                </button>
              </div>

              {/* Primary Run Test Button */}
              <button
                onClick={() => handleRunTest()}
                disabled={isTestRunning}
                data-testid="run-test-button"
                className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-xl shadow-lg shadow-blue-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Execute OmniSight Test Suite"
              >
                {isTestRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Suite...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Full Test Suite</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 1: Four KPI Metric Cards (Matching Reference Screenshot) */}
          <MetricCards metrics={metrics} />

          {/* Section 2: Two-Column Analytics Layout (Left & Right Column) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Test Execution Trend & Self-Healing Performance */}
            <div className="space-y-6 flex flex-col">
              <div className="flex-1">
                <TrendChart data={initialExecutionTrends} />
              </div>
              <div className="flex-1">
                <SelfHealingPerformance metrics={metrics} />
              </div>
            </div>

            {/* Right Column: Defect Category Distribution & Recent Activity */}
            <div className="space-y-6 flex flex-col">
              <div className="flex-1">
                <DefectCategoryChart />
              </div>
              <div className="flex-1">
                <RecentActivity activities={activities} />
              </div>
            </div>
          </div>

          {/* Section 3: Full-Width Table Switcher (Recent Test Runs & Target Applications) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTableTab("runs")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTableTab === "runs"
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Recent Test Runs ({storedRuns.length})</span>
              </button>

              <button
                onClick={() => setActiveTableTab("targets")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTableTab === "targets"
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Registered Test Targets ({projectsList.length})</span>
              </button>
            </div>

            {activeTableTab === "runs" ? (
              <RecentTestRunsTable testRuns={storedRuns} />
            ) : (
              <ProjectsTable
                projects={projectsList}
                onRunTest={(id) => handleRunTest(id)}
                runningProjectId={runningProjectId}
              />
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
