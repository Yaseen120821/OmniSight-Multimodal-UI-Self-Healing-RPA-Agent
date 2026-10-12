"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { getStoredTestRuns, subscribeToStoreUpdates } from "@/lib/store";
import { TestRunDetail } from "@/types";
import {
  BarChart3,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  FileText,
  Search,
  ChevronRight,
  Layers,
} from "lucide-react";

export default function ReportsPage() {
  const [testRuns, setTestRuns] = useState<TestRunDetail[]>(() => getStoredTestRuns());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    const unsubscribe = subscribeToStoreUpdates(() => {
      setTestRuns(getStoredTestRuns());
    });
    return unsubscribe;
  }, []);

  const filteredRuns = testRuns.filter((run) => {
    const matchesSearch =
      run.suiteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TestRunDetail["status"]) => {
    switch (status) {
      case "Passed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Passed</span>
          </span>
        );
      case "Repaired":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Repaired</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Failed</span>
          </span>
        );
    }
  };

  return (
    <AppShell>
      {({ metrics }) => (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                <BarChart3 className="w-4 h-4" />
                <span>Executive Reports & Audit Logs</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Test Execution Reports ({testRuns.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive evaluation of pass rates, visual diff logs, and self-healing statistics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reports or suites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 w-48 sm:w-60"
                />
              </div>

              <button
                onClick={() => {
                  const headers = ["Run ID", "Suite Name", "Project", "Status", "Pass Rate", "Duration", "Start Time"];
                  const rows = testRuns.map((r) => [r.id, `"${r.suiteName}"`, `"${r.projectName}"`, r.status, `${r.passRate}%`, r.duration, `"${r.startTime}"`]);
                  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "OmniSight_Test_Reports_Summary.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV Summary</span>
              </button>
            </div>
          </div>

          {/* Stats Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Overall Reliability</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">{metrics.overallPassRate}%</h3>
              <p className="text-xs text-slate-500 mt-1">Calculated across all stored test suites</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Self-Healing Rate</span>
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">{metrics.selfHealingSuccessRate}%</h3>
              <p className="text-xs text-slate-500 mt-1">{metrics.totalHealingAttempts} total selector repair attempts</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Test Runs</span>
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">{testRuns.length}</h3>
              <p className="text-xs text-slate-500 mt-1">Recorded in local store persistence</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Visual Shift Alerts</span>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                {testRuns.filter((r) => r.hasVisualDiff).length} Flagged
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {testRuns.filter((r) => r.hasVisualDiff).length > 0
                  ? "Suites flagged with visual drift requiring review"
                  : "Zero visual shifts detected across all suites"}
              </p>
            </div>
          </div>

          {/* Test Runs Reports Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-slate-900 text-sm">Execution History Reports</h3>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg text-xs font-semibold">
                {["All", "Passed", "Failed", "Repaired"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      statusFilter === st ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {filteredRuns.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No execution reports match your search query.
                </div>
              ) : (
                filteredRuns.map((run) => (
                  <Link
                    key={run.id}
                    href={`/reports/${run.id}`}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group block"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {run.suiteName}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {run.id}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 flex flex-wrap items-center gap-3">
                          <span>Target: <strong className="text-slate-700">{run.projectName}</strong></span>
                          <span>&bull;</span>
                          <span>Duration: {run.duration}</span>
                          <span>&bull;</span>
                          <span>Executed: {run.startTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{run.passRate}% Pass Rate</div>
                        <div className="text-[10px] text-slate-400">
                          {run.passedAssertions}/{run.totalAssertions} Assertions
                        </div>
                      </div>

                      <div>{getStatusBadge(run.status)}</div>

                      <div className="p-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
