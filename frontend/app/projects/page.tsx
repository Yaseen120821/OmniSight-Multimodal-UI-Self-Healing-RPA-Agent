"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import ProjectsTable from "@/components/projects/ProjectsTable";
import { getStoredProjects, saveStoredProjects, getStoredActivities, saveStoredActivities } from "@/lib/store";
import { Project, ActivityItem } from "@/types";
import { FolderPlus, FolderGit2, Plus } from "lucide-react";

export default function ProjectsPage() {
  const [projectsList, setProjectsList] = useState<Project[]>(() => getStoredProjects());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newTargetUrl, setNewTargetUrl] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !newTargetUrl) return;

    const formattedUrl = newTargetUrl.startsWith("http") ? newTargetUrl : `https://${newTargetUrl}`;

    const newProj: Project = {
      id: `proj-${String(projectsList.length + 1).padStart(3, "0")}`,
      name: newProjectName,
      targetUrl: formattedUrl,
      lastTestRun: "Never",
      status: "Passed",
      suiteCount: 16,
      passRate: 100,
      lastRunDuration: "N/A",
    };

    const updatedProjects = [newProj, ...projectsList];
    setProjectsList(updatedProjects);
    saveStoredProjects(updatedProjects);

    // Save activity record
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: "Just now",
      title: "New test target registered",
      description: `${newProjectName} (${formattedUrl}) added to active monitoring schedule.`,
      type: "target_registered",
      status: "Info",
      projectName: newProjectName,
    };
    const currentActivities = getStoredActivities();
    saveStoredActivities([newActivity, ...currentActivities]);

    setNewProjectName("");
    setNewTargetUrl("");
    setIsAddModalOpen(false);
  };

  return (
    <AppShell>
      {({ handleRunTest, runningProjectId }) => (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                <FolderGit2 className="w-4 h-4" />
                <span>Test Target Inventory</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Target Applications ({projectsList.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Register web applications and endpoints for automated self-healing inspection.
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Target</span>
            </button>
          </div>

          {/* Projects Table Component with Pagination */}
          <ProjectsTable
            projects={projectsList}
            onRunTest={(id) => handleRunTest(id)}
            runningProjectId={runningProjectId}
          />

          {/* Add Project Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
              <form
                onSubmit={handleCreateProject}
                className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FolderPlus className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-base">
                      Register Web Application Target
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold px-2 py-0.5 rounded"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="project-name-input"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Project Name *
                    </label>
                    <input
                      id="project-name-input"
                      type="text"
                      required
                      placeholder="e.g., RPA Partner Portal"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="target-url-input"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Target URL Endpoint *
                    </label>
                    <input
                      id="target-url-input"
                      type="url"
                      required
                      placeholder="https://app.example.com"
                      value={newTargetUrl}
                      onChange={(e) => setNewTargetUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Register Target
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
