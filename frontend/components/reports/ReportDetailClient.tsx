"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { getTestRunById, subscribeToStoreUpdates } from "@/lib/store";
import { generateTestRunPdf } from "@/lib/pdf-generator";
import { TestRunDetail } from "@/types";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Clock,
  ExternalLink,
  ShieldCheck,
  Eye,
  RefreshCw,
  FileText,
} from "lucide-react";

export default function ReportDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  const [storeRun, setStoreRun] = useState<TestRunDetail | null>(() =>
    getTestRunById(id) || null
  );
  const testRun = getTestRunById(id) || storeRun;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToStoreUpdates(() => {
      const current = getTestRunById(id);
      if (current) setStoreRun(current);
    });
    return unsubscribe;
  }, [id]);

  const handleExportCsv = () => {
    if (!testRun) return;

    const headers = ["Assertion ID", "Name", "Selector", "Type", "Status", "Failure Reason / Healed Selector"];
    const rows = testRun.assertions.map((a) => [
      a.id,
      `"${a.name}"`,
      `"${a.selector}"`,
      a.type,
      a.status,
      `"${a.failureReason || a.healedSelector || "N/A"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OmniSight_Assertions_${testRun.projectName.replace(/\s+/g, "_")}_${testRun.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPdf = async () => {
    if (!testRun || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    setPdfSuccessMessage(null);
    try {
      const filename = await generateTestRunPdf(testRun);
      setPdfSuccessMessage(`Report PDF downloaded: ${filename}`);
      setTimeout(() => setPdfSuccessMessage(null), 5000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      const detail = err instanceof Error ? err.message : "Internal rendering error";
      alert(`Failed to generate PDF: ${detail}. Please check test run records.`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!testRun) {
    return (
      <AppShell>
        {() => (
          <div className="p-12 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Test Report Not Found</h2>
            <p className="text-xs text-slate-500">
              No test run record matching ID &quot;{id}&quot; was found in local storage.
            </p>
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Reports List</span>
            </Link>
          </div>
        )}
      </AppShell>
    );
  }

  const getStatusBadge = (status: TestRunDetail["status"]) => {
    switch (status) {
      case "Passed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Passed</span>
          </span>
        );
      case "Repaired":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Self-Healed (Passed)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Failed</span>
          </span>
        );
    }
  };

  return (
    <AppShell>
      {() => (
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/reports")}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Back to Reports"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                  <span>Report Details</span>
                  <span>&bull;</span>
                  <span className="font-mono text-slate-500">{testRun.id}</span>
                </div>
                <h1 suppressHydrationWarning className="text-lg sm:text-xl font-bold text-slate-900">
                  {testRun.suiteName}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-2xs transition-colors"
              >
                {isGeneratingPdf ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PDF Download Success Banner */}
          {pdfSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pdfSuccessMessage}</span>
              </div>
              <button
                onClick={() => setPdfSuccessMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold px-2 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* PDF Capture Container */}
          <div ref={reportRef} className="space-y-6 bg-slate-50 p-1 rounded-xl">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-semibold uppercase text-slate-500">Target Application</p>
                <p className="font-bold text-slate-900 text-sm mt-1">{testRun.projectName}</p>
                <a
                  href={testRun.targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 hover:underline mt-1"
                >
                  {testRun.targetUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-semibold uppercase text-slate-500">Execution Duration</p>
                <p className="font-bold text-slate-900 text-sm mt-1">{testRun.duration}</p>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {testRun.startTime}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-semibold uppercase text-slate-500">Pass Rate</p>
                <p className="font-bold text-slate-900 text-sm mt-1">{testRun.passRate}%</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {testRun.passedAssertions} of {testRun.totalAssertions} assertions passed
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <p className="text-xs font-semibold uppercase text-slate-500">Overall Status</p>
                <div className="mt-1">{getStatusBadge(testRun.status)}</div>
              </div>
            </div>

            {/* Executive & Developer Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Executive Stakeholder Summary</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {testRun.executiveSummary}
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Developer Technical Diagnostics</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {testRun.developerSummary}
                </p>
                <div className="pt-2 text-xs text-slate-600 font-medium">
                  <strong>Recommendation:</strong> {testRun.recommendation}
                </div>
              </div>
            </div>

            {/* Self-Healing Log Section */}
            {testRun.selfHealing && testRun.selfHealing.length > 0 && (
              <div className="p-5 bg-white rounded-xl border border-indigo-200 bg-indigo-50/20 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>OmniSight Autonomous Self-Healing Intervention</span>
                </div>

                <div className="divide-y divide-indigo-100 text-xs">
                  {testRun.selfHealing.map((heal) => (
                    <div key={heal.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="font-mono text-[11px] text-rose-700 line-through">
                          Broken: {heal.brokenSelector}
                        </div>
                        <div className="font-mono text-[11px] text-emerald-700 font-bold">
                          Healed: {heal.replacementSelector}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                          Strategy: {heal.strategy}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          Confidence: {Math.round(heal.confidenceScore * 100)}%
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                          {heal.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assertions Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Assertion-by-Assertion Results</h3>
                <span className="text-xs font-semibold text-slate-500">
                  {testRun.assertions.length} total assertions
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-5">Assertion Name</th>
                      <th className="py-3 px-5">Target Selector</th>
                      <th className="py-3 px-5">Type</th>
                      <th className="py-3 px-5">Result</th>
                      <th className="py-3 px-5">Details / Healed Selector</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {testRun.assertions.map((ast) => (
                      <tr key={ast.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-5 font-semibold text-slate-900">{ast.name}</td>
                        <td className="py-3 px-5 font-mono text-[11px] text-slate-600">{ast.selector}</td>
                        <td className="py-3 px-5 uppercase text-[10px] font-bold text-slate-500">{ast.type}</td>
                        <td className="py-3 px-5">
                          {ast.status === "Passed" && (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                              <CheckCircle2 className="w-3 h-3" /> Passed
                            </span>
                          )}
                          {ast.status === "Failed" && (
                            <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                              <XCircle className="w-3 h-3" /> Failed
                            </span>
                          )}
                          {ast.status === "Repaired" && (
                            <span className="inline-flex items-center gap-1 text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[11px]">
                              <Sparkles className="w-3 h-3" /> Self-Healed
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-5 text-slate-600">
                          {ast.failureReason && (
                            <span className="text-rose-600 font-medium">{ast.failureReason}</span>
                          )}
                          {ast.healedSelector && (
                            <span className="text-indigo-600 font-mono text-[11px] font-semibold">
                              Auto-healed to {ast.healedSelector}
                            </span>
                          )}
                          {!ast.failureReason && !ast.healedSelector && (
                            <span className="text-slate-400">Assertion satisfied cleanly</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Screenshot Comparison Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Visual Regression Comparison</h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {testRun.hasVisualDiff ? "Visual Shift Flagged" : "Zero Visual Shift"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Baseline */}
                <div className="space-y-1.5 text-center">
                  <p className="text-xs font-bold text-slate-700 uppercase">1. Baseline Screenshot</p>
                  <div className="h-32 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center p-4">
                    <div className="w-full h-full bg-white rounded border border-slate-300 p-2 text-left space-y-1">
                      <div className="w-full h-2 bg-slate-200 rounded" />
                      <div className="w-3/4 h-2 bg-blue-500 rounded" />
                      <div className="w-1/2 h-2 bg-slate-200 rounded" />
                    </div>
                  </div>
                </div>

                {/* Actual */}
                <div className="space-y-1.5 text-center">
                  <p className="text-xs font-bold text-slate-700 uppercase">2. Actual Execution</p>
                  <div className="h-32 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center p-4">
                    <div className="w-full h-full bg-white rounded border border-slate-300 p-2 text-left space-y-1">
                      <div className="w-full h-2 bg-slate-200 rounded" />
                      <div className="w-3/4 h-2 bg-blue-500 rounded mt-2" />
                      <div className="w-1/2 h-2 bg-slate-200 rounded" />
                    </div>
                  </div>
                </div>

                {/* Diff */}
                <div className="space-y-1.5 text-center">
                  <p className="text-xs font-bold text-slate-700 uppercase">3. Visual Diff Overlay</p>
                  <div className="h-32 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center p-4">
                    <div className="w-full h-full bg-slate-950 rounded border border-slate-800 p-2 text-left space-y-1 relative">
                      <div className="w-full h-2 bg-slate-800 rounded opacity-40" />
                      <div className="w-3/4 h-2 bg-rose-500 rounded animate-pulse" />
                      <div className="w-1/2 h-2 bg-slate-800 rounded opacity-40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
