"use client";

import { useState, ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Toast from "@/components/ui/Toast";
import {
  getCalculatedMetrics,
  getStoredActivities,
  saveStoredActivities,
  getStoredTestRuns,
  saveStoredTestRuns,
  getStoredProjects,
} from "@/lib/store";
import { DashboardMetrics, ActivityItem, TestRunDetail } from "@/types";

interface AppShellProps {
  children: (props: {
    searchQuery: string;
    metrics: DashboardMetrics;
    activities: ActivityItem[];
    isTestRunning: boolean;
    runningProjectId: string | null;
    handleRunTest: (projectId?: string) => void;
  }) => ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [metrics, setMetrics] = useState<DashboardMetrics>(() => getCalculatedMetrics());
  const [activities, setActivities] = useState<ActivityItem[]>(() => getStoredActivities());
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [runningProjectId, setRunningProjectId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRunTest = (projectId?: string) => {
    if (isTestRunning) return;

    setIsTestRunning(true);
    if (projectId) {
      setRunningProjectId(projectId);
    }

    // Simulate local test suite execution with persistent record creation
    setTimeout(() => {
      setIsTestRunning(false);
      setRunningProjectId(null);

      const projects = getStoredProjects();
      const targetProj = projectId
        ? projects.find((p) => p.id === projectId)
        : projects[0];

      const projName = targetProj ? targetProj.name : "Commerce Portal";
      const targetUrl = targetProj ? targetProj.targetUrl : "https://shop.example-saas.com";
      const newRunId = `run-${Date.now().toString().slice(-4)}`;

      // Create new persistent TestRunDetail record
      const newTestRun: TestRunDetail = {
        id: newRunId,
        suiteName: `${projName} - Self-Healing Regression Run`,
        projectId: projectId || targetProj?.id || "proj-001",
        projectName: projName,
        targetUrl: targetUrl,
        startTime: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
        completionTime: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
        duration: "38s",
        status: "Passed",
        passRate: 100,
        totalAssertions: 16,
        passedAssertions: 16,
        failedAssertions: 0,
        skippedAssertions: 0,
        developerSummary: `Automated Playwright suite executed 16 assertions on ${projName}. All UI components and visual baselines verified cleanly.`,
        executiveSummary: `${projName} is 100% operational following automated test execution.`,
        recommendation: "Routine test suite completed with zero defects.",
        hasVisualDiff: false,
        defects: [],
        selfHealing: [],
        assertions: [
          { id: `ast-${Date.now()}-1`, name: "DOM Root render check", selector: "body", type: "element_exist", status: "Passed" },
          { id: `ast-${Date.now()}-2`, name: "Main navigation header visibility", selector: "header", type: "visual", status: "Passed" },
          { id: `ast-${Date.now()}-3`, name: "Interactive primary buttons response", selector: "button", type: "functional", status: "Passed" },
        ],
      };

      const existingRuns = getStoredTestRuns();
      const updatedRuns = [newTestRun, ...existingRuns];
      saveStoredTestRuns(updatedRuns);

      // Append persistent activity record
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        timestamp: "Just now",
        title: projectId
          ? `Local test suite completed for ${projName}`
          : "Global regression test run completed",
        description: `Executed 16 assertions for ${projName}; 0 defects found. (Report #${newRunId})`,
        type: "test_completed",
        status: "Passed",
        projectName: projName,
      };

      const existingActivities = getStoredActivities();
      const updatedActivities = [newAct, ...existingActivities];
      saveStoredActivities(updatedActivities);
      setActivities(updatedActivities);

      // Update metrics dynamically
      const updatedMetrics = getCalculatedMetrics();
      setMetrics(updatedMetrics);

      setToastMessage(
        `Simulated test run complete for ${projName} (Report #${newRunId}): 16 assertions passed. (Frontend Mock)`
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="md:pl-64 flex-1 flex flex-col min-w-0">
        <Header
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRunGlobalTest={() => handleRunTest()}
          isTestRunning={isTestRunning}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children({
            searchQuery,
            metrics,
            activities,
            isTestRunning,
            runningProjectId,
            handleRunTest,
          })}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              OmniSight &copy; 2026 Multimodal UI Self-Healing & RPA Agent
            </span>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Synchronized Data Engine</span>
              <span>&bull;</span>
              <span>PDF & CSV Reporting Ready</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
