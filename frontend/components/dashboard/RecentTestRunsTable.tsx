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
} from "lucide-react";

interface RecentTestRunsTableProps {
  testRuns: TestRunDetail[];
}

export default function RecentTestRunsTable({ testRuns }: RecentTestRunsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
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

  const handleDownloadPdf = async (run: TestRunDetail) => {
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

      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3 px-5">Run ID</th>
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
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No matching test executions found.
                </td>
              </tr>
            ) : (
              paginatedRuns.map((run) => {
                const isGeneratingPdf = generatingPdfRunId === run.id;
                return (
                  <tr key={run.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Run ID */}
                    <td className="py-3.5 px-5">
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

                        {/* Download PDF */}
                        <button
                          onClick={() => handleDownloadPdf(run)}
                          disabled={isGeneratingPdf}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-2xs transition-colors"
                          title="Download Multi-Page PDF Report"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
        <div>
          Showing <strong className="text-slate-800">{startIndex + 1}</strong> to{" "}
          <strong className="text-slate-800">{endIndex}</strong> of{" "}
          <strong className="text-slate-800">{totalRecords}</strong> test runs
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validPage <= 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="px-2 font-semibold text-slate-700">
            Page {validPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validPage >= totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
