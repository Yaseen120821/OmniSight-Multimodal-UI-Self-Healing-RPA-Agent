"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { getStoredTestRuns, initialTestRuns, subscribeToStoreUpdates } from "@/lib/store";
import { generateTestRunPdf } from "@/lib/pdf-generator";
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
  Layers,
  RefreshCw,
  FileSpreadsheet,
  CheckSquare,
} from "lucide-react";

export default function ReportsPage() {
  const [testRuns, setTestRuns] = useState<TestRunDetail[]>(initialTestRuns);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedRunIds, setSelectedRunIds] = useState<string[]>([]);
  const [generatingPdfRunId, setGeneratingPdfRunId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setTestRuns(getStoredTestRuns());
    };
    const timer = setTimeout(sync, 0);
    const unsubscribe = subscribeToStoreUpdates(sync);
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const filteredRuns = testRuns.filter((run) => {
    const matchesSearch =
      run.suiteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isAllSelected =
    filteredRuns.length > 0 &&
    filteredRuns.every((r) => selectedRunIds.includes(r.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRunIds([]);
    } else {
      setSelectedRunIds(filteredRuns.map((r) => r.id));
    }
  };

  const handleToggleSelectRow = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedRunIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDownloadPdf = async (run: TestRunDetail, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (generatingPdfRunId) return;

    setGeneratingPdfRunId(run.id);
    try {
      const filename = await generateTestRunPdf(run);
      setToastMessage(`Report downloaded: ${filename}`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPdfRunId(null);
    }
  };

  const handleExportSelectedCsv = () => {
    const targetRuns =
      selectedRunIds.length > 0
        ? testRuns.filter((r) => selectedRunIds.includes(r.id))
        : testRuns;

    const headers = ["Run ID", "Suite Name", "Project", "Status", "Pass Rate", "Duration", "Start Time"];
    const rows = targetRuns.map((r) => [
      r.id,
      `"${r.suiteName}"`,
      `"${r.projectName}"`,
      r.status,
      `${r.passRate}%`,
      r.duration,
      `"${r.startTime}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download =
      selectedRunIds.length > 0
        ? `OmniSight_Selected_${selectedRunIds.length}_Reports.csv`
        : "OmniSight_Test_Reports_Summary.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold rounded-xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="font-bold text-sm px-2">
                ✕
              </button>
            </div>
          )}

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
                onClick={handleExportSelectedCsv}
                className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>
                  {selectedRunIds.length > 0
                    ? `Export (${selectedRunIds.length}) CSV`
                    : "Export All CSV"}
                </span>
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
              <h3 suppressHydrationWarning className="text-2xl font-bold text-slate-900 mt-2">{metrics.overallPassRate}%</h3>
              <p className="text-xs text-slate-500 mt-1">Calculated across all stored test suites</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Self-Healing Rate</span>
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 suppressHydrationWarning className="text-2xl font-bold text-slate-900 mt-2">{metrics.selfHealingSuccessRate}%</h3>
              <p className="text-xs text-slate-500 mt-1">{metrics.totalHealingAttempts} total selector repair attempts</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Test Runs</span>
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <h3 suppressHydrationWarning className="text-2xl font-bold text-slate-900 mt-2">{testRuns.length}</h3>
              <p className="text-xs text-slate-500 mt-1">Recorded in local store persistence</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Visual Shift Alerts</span>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 suppressHydrationWarning className="text-2xl font-bold text-slate-900 mt-2">
                {testRuns.filter((r) => r.hasVisualDiff).length} Flagged
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {testRuns.filter((r) => r.hasVisualDiff).length > 0
                  ? "Suites flagged with visual drift requiring review"
                  : "Zero visual shifts detected across all suites"}
              </p>
            </div>
          </div>

          {/* Bulk Action Toolbar */}
          {selectedRunIds.length > 0 && (
            <div className="px-5 py-2.5 bg-blue-50/90 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 font-semibold">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>
                  <strong>{selectedRunIds.length}</strong> test run{selectedRunIds.length > 1 ? "s" : ""} selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportSelectedCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-blue-700 font-bold border border-blue-200 rounded-md shadow-2xs transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export Selected CSV</span>
                </button>
                <button
                  onClick={() => setSelectedRunIds([])}
                  className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}

          {/* Test Runs Reports Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  aria-label="Select all reports"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <h3 className="font-bold text-slate-900 text-sm">Execution History Reports</h3>
              </div>

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
                filteredRuns.map((run) => {
                  const isSelected = selectedRunIds.includes(run.id);
                  const isGeneratingPdf = generatingPdfRunId === run.id;
                  return (
                    <div
                      key={run.id}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors group ${
                        isSelected ? "bg-blue-50/40" : "hover:bg-slate-50/80"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            aria-label={`Select run ${run.id}`}
                            checked={isSelected}
                            onChange={(e) => handleToggleSelectRow(run.id, e as unknown as React.MouseEvent)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>

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

                      <div className="flex items-center gap-4 shrink-0 justify-end">
                        <div className="text-right hidden sm:block">
                          <div className="font-bold text-slate-900">{run.passRate}% Pass Rate</div>
                          <div className="text-[10px] text-slate-400">
                            {run.passedAssertions}/{run.totalAssertions} Assertions
                          </div>
                        </div>

                        <div>{getStatusBadge(run.status)}</div>

                        <div className="flex items-center gap-2">
                          {/* View Report button */}
                          <Link
                            href={`/reports/${run.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>

                          {/* Download PDF button (Affects ONLY this run) */}
                          <button
                            onClick={(e) => handleDownloadPdf(run, e)}
                            disabled={isGeneratingPdf}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-2xs transition-colors"
                            title={`Download PDF Report for ${run.id}`}
                          >
                            {isGeneratingPdf ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline">PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
