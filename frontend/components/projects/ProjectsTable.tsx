"use client";

import { useState } from "react";
import { Project, TestStatus } from "@/types";
import {
  Search,
  ExternalLink,
  Play,
  CheckCircle2,
  XCircle,
  RefreshCw,
  SlidersHorizontal,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectsTableProps {
  projects: Project[];
  onRunTest: (projectId: string) => void;
  runningProjectId?: string | null;
  onSelectProjectForDetails?: (project: Project) => void;
}

export default function ProjectsTable({
  projects,
  onRunTest,
  runningProjectId,
  onSelectProjectForDetails,
}: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TestStatus>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);

  // Filter projects across entire dataset
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination boundaries
  const totalRecords = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);

  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const getStatusBadge = (status: TestStatus, isRunning: boolean) => {
    if (isRunning || status === "Running") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
          <span>Running</span>
        </span>
      );
    }
    if (status === "Repaired") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Repaired</span>
        </span>
      );
    }
    if (status === "Passed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Passed</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>Failed</span>
      </span>
    );
  };

  const statusOptions: Array<"All" | TestStatus> = [
    "All",
    "Passed",
    "Failed",
    "Repaired",
    "Running",
  ];

  const renderPaginationControls = (positionLabel: "top" | "bottom") => (
    <div
      aria-label={`Pagination controls (${positionLabel})`}
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50/80 border-slate-200 text-xs text-slate-600",
        positionLabel === "top" ? "border-b" : "border-t"
      )}
    >
      <div className="font-medium text-slate-500">
        {totalRecords === 0 ? (
          <span>Showing 0 records</span>
        ) : (
          <span>
            Showing <strong className="text-slate-800">{startIndex + 1}–{endIndex}</strong> of{" "}
            <strong className="text-slate-800">{totalRecords}</strong> target applications
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={validPage <= 1}
          aria-label="Previous Page"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white rounded-lg border border-slate-200 shadow-2xs transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {/* Numbered Page Buttons */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            aria-label={`Go to page ${pageNum}`}
            aria-current={validPage === pageNum ? "page" : undefined}
            className={cn(
              "w-7 h-7 text-xs font-bold rounded-lg border transition-colors flex items-center justify-center",
              validPage === pageNum
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
            )}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={validPage >= totalPages}
          aria-label="Next Page"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white rounded-lg border border-slate-200 shadow-2xs transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div
      aria-label="Recent Projects and Test Targets Table"
      data-testid="projects-table"
      className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
    >
      {/* Controls Bar: Title, Search & Status Filter */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-base font-bold text-slate-900">Registered Test Targets</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active web application endpoints monitored by Playwright & Vision AI
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <label htmlFor="projects-search-input" className="sr-only">
              Search target projects
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="projects-search-input"
              type="text"
              data-testid="project-search"
              placeholder="Search projects or URLs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-60 pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          {/* Status Filter Buttons */}
          <div
            data-testid="project-status-filter"
            aria-label="Filter projects by test status"
            className="flex items-center bg-slate-200/60 p-1 rounded-lg gap-1 text-xs font-semibold overflow-x-auto"
          >
            {statusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setStatusFilter(opt);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all text-xs font-semibold whitespace-nowrap",
                  statusFilter === opt
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOP Pagination Bar (Phase 3 requirement) */}
      {renderPaginationControls("top")}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3 px-5">Project Name</th>
              <th scope="col" className="py-3 px-5">Target URL</th>
              <th scope="col" className="py-3 px-5">Last Test Run</th>
              <th scope="col" className="py-3 px-5">Status</th>
              <th scope="col" className="py-3 px-5">Pass Rate</th>
              <th scope="col" className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <SlidersHorizontal className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-slate-700">No matching projects found</p>
                    <p className="text-xs text-slate-400">
                      Try adjusting your search query or status filter criteria.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedProjects.map((project) => {
                const isRunning = runningProjectId === project.id;
                return (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Project Name */}
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {project.suiteCount} assertions &bull; ID: {project.id}
                      </div>
                    </td>

                    {/* Target URL */}
                    <td className="py-3.5 px-5">
                      <a
                        href={project.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600 hover:text-blue-600 hover:underline max-w-xs truncate"
                      >
                        <span>{project.targetUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                      </a>
                    </td>

                    {/* Last Test Run */}
                    <td className="py-3.5 px-5 text-slate-600 font-medium">
                      <div>{project.lastTestRun}</div>
                      <div className="text-[10px] text-slate-400">
                        Duration: {project.lastRunDuration}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5">
                      {getStatusBadge(project.status, isRunning)}
                    </td>

                    {/* Pass Rate */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              project.passRate >= 90
                                ? "bg-emerald-500"
                                : project.passRate >= 75
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            )}
                            style={{ width: `${project.passRate}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700">{project.passRate}%</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            if (onSelectProjectForDetails) {
                              onSelectProjectForDetails(project);
                            } else {
                              setSelectedProjectModal(project);
                            }
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
                          aria-label={`View details for ${project.name}`}
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onRunTest(project.id)}
                          disabled={isRunning}
                          data-testid="run-test-button"
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg shadow-2xs transition-colors"
                          aria-label={`Run test for ${project.name}`}
                        >
                          {isRunning ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Running</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>Run Test</span>
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

      {/* Mobile Card Grid View */}
      <div className="block md:hidden divide-y divide-slate-100">
        {paginatedProjects.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No matching projects found
          </div>
        ) : (
          paginatedProjects.map((project) => {
            const isRunning = runningProjectId === project.id;
            return (
              <div key={project.id} className="p-4 space-y-3 bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{project.name}</h3>
                    <a
                      href={project.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-blue-600 flex items-center gap-1 mt-0.5"
                    >
                      {project.targetUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>{getStatusBadge(project.status, isRunning)}</div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-2">
                  <span>Last run: <strong className="text-slate-700">{project.lastTestRun}</strong></span>
                  <span>Pass rate: <strong className="text-slate-700">{project.passRate}%</strong></span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (onSelectProjectForDetails) {
                        onSelectProjectForDetails(project);
                      } else {
                        setSelectedProjectModal(project);
                      }
                    }}
                    className="flex-1 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onRunTest(project.id)}
                    disabled={isRunning}
                    data-testid="run-test-button"
                    className="flex-1 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg flex items-center justify-center gap-1.5"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Test</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* BOTTOM Pagination Bar (Phase 3 requirement) */}
      {renderPaginationControls("bottom")}

      {/* Project Details Modal */}
      {selectedProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {selectedProjectModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProjectModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold px-2 py-0.5 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Project ID</span>
                <span className="font-mono font-bold text-slate-800">{selectedProjectModal.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Target URL</span>
                <span className="font-mono text-blue-600">{selectedProjectModal.targetUrl}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Test Suite Size</span>
                <span>{selectedProjectModal.suiteCount} assertions</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Historical Pass Rate</span>
                <span className="font-bold text-emerald-600">{selectedProjectModal.passRate}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Last Execution Duration</span>
                <span>{selectedProjectModal.lastRunDuration}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Current Status</span>
                <span>{getStatusBadge(selectedProjectModal.status, runningProjectId === selectedProjectModal.id)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedProjectModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onRunTest(selectedProjectModal.id);
                  setSelectedProjectModal(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Suite Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
