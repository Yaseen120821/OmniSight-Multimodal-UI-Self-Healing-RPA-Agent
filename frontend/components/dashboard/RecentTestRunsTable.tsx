"use client";

import { useState } from "react";
import Link from "next/link";
import { TestRunDetail } from "@/types";
import { generateTestRunPdf } from "@/lib/pdf-generator";
import {
  Search,
  ExternalLink,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  Layers,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  CheckSquare,
} from "lucide-react";

interface RecentTestRunsTableProps {
  testRuns: TestRunDetail[];
}

export default function RecentTestRunsTable({ testRuns }: RecentTestRunsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedRunIds, setSelectedRunIds] = useState<string[]>([]);
  const [generatingPdfRunId, setGeneratingPdfRunId] = useState<string | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const filteredRuns = testRuns.filter((run) => {
    const matchesSearch =
      run.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.suiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.targetUrl.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRecords = filteredRuns.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);
  const paginatedRuns = filteredRuns.slice(startIndex, endIndex);

  // Row selection handlers
  const isAllPageSelected =
    paginatedRuns.length > 0 &&
    paginatedRuns.every((r) => selectedRunIds.includes(r.id));

  const handleToggleSelectAll = () => {
    if (isAllPageSelected) {
      const pageIds = new Set(paginatedRuns.map((r) => r.id));
      setSelectedRunIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const combined = new Set([...selectedRunIds, ...paginatedRuns.map((r) => r.id)]);
      setSelectedRunIds(Array.from(combined));
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
      setDownloadSuccessToast(`Report downloaded: ${filename}`);
      setTimeout(() => setDownloadSuccessToast(null), 4000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPdfRunId(null);
    }
  };

  const handleExportSelectedCsv = () => {
    if (selectedRunIds.length === 0) return;
    const selectedRuns = testRuns.filter((r) => selectedRunIds.includes(r.id));
    const headers = ["Run ID", "Suite Name", "Target", "Status", "Pass Rate", "Duration", "Executed At"];
    const rows = selectedRuns.map((r) => [
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
    link.download = `OmniSight_Selected_${selectedRunIds.length}_Runs.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: TestRunDetail["status"]) => {
    switch (status) {
      case "Passed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Passed</span>
          </span>
        );
      case "Repaired":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Repaired</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Failed</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{downloadSuccessToast}</span>
          </div>
          <button onClick={() => setDownloadSuccessToast(null)} className="font-bold text-sm px-2">
            ✕
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Recent Test Runs</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated Playwright and Vision AI execution logs with downloadable audit reports
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search run ID, target, or suite..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-200/60 p-1 rounded-lg gap-1 text-xs font-semibold">
            {["All", "Passed", "Failed", "Repaired"].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md transition-all text-xs font-semibold ${
                  statusFilter === st
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Action Toolbar (When 1 or more runs are selected) */}
      {selectedRunIds.length > 0 && (
        <div className="px-5 py-2.5 bg-blue-50/90 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 animate-in fade-in duration-150">
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

      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  aria-label="Select all test runs on this page"
                  checked={isAllPageSelected}
                  onChange={handleToggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th scope="col" className="py-3 px-4">Run ID</th>
              <th scope="col" className="py-3 px-5">Target Application</th>
              <th scope="col" className="py-3 px-5">Executed At</th>
              <th scope="col" className="py-3 px-5">Duration</th>
              <th scope="col" className="py-3 px-5">Pass Rate</th>
              <th scope="col" className="py-3 px-5">Status</th>
              <th scope="col" className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRuns.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  No matching test executions found.
                </td>
              </tr>
            ) : (
              paginatedRuns.map((run) => {
                const isSelected = selectedRunIds.includes(run.id);
                const isGeneratingPdf = generatingPdfRunId === run.id;
                return (
                  <tr
                    key={run.id}
                    className={`transition-colors group ${
                      isSelected ? "bg-blue-50/50" : "hover:bg-slate-50/80"
                    }`}
                  >
                    {/* Checkbox column */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        aria-label={`Select run ${run.id}`}
                        checked={isSelected}
                        onChange={(e) => handleToggleSelectRow(run.id, e as unknown as React.MouseEvent)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    {/* Run ID */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {run.id}
                      </span>
                    </td>

                    {/* Target Application */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        <span>{run.projectName}</span>
                        <a
                          href={run.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-blue-600"
                          title={run.targetUrl}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {run.suiteName}
                      </div>
                    </td>

                    {/* Executed At */}
                    <td className="py-3.5 px-5 text-slate-600">
                      <div>{run.startTime}</div>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-5 font-mono text-slate-700">
                      {run.duration}
                    </td>

                    {/* Pass Rate */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              run.passRate >= 95
                                ? "bg-emerald-500"
                                : run.passRate >= 75
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${run.passRate}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{run.passRate}%</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5">
                      {getStatusBadge(run.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Report */}
                        <Link
                          href={`/reports/${run.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Report</span>
                        </Link>

                        {/* Download PDF (Affects ONLY this run) */}
                        <button
                          onClick={(e) => handleDownloadPdf(run, e)}
                          disabled={isGeneratingPdf}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-2xs transition-colors"
                          title={`Download PDF Report for ${run.id}`}
                        >
                          {isGeneratingPdf ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>PDF</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
        <div>
          Showing <span className="font-bold text-slate-800">{totalRecords > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="font-bold text-slate-800">{endIndex}</span> of{" "}
          <span className="font-bold text-slate-800">{totalRecords}</span> test runs
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold px-2">
            Page {validPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
