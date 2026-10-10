import {
  Project,
  DashboardMetrics,
  ActivityItem,
  TestRunDetail,
  ExecutionTrend,
} from "@/types";

export const initialExecutionTrends: ExecutionTrend[] = [
  { day: "Mon", date: "Oct 04", passed: 28, failed: 4, repaired: 2 },
  { day: "Tue", date: "Oct 05", passed: 32, failed: 3, repaired: 3 },
  { day: "Wed", date: "Oct 06", passed: 35, failed: 6, repaired: 4 },
  { day: "Thu", date: "Oct 07", passed: 29, failed: 2, repaired: 1 },
  { day: "Fri", date: "Oct 08", passed: 31, failed: 5, repaired: 2 },
  { day: "Sat", date: "Oct 09", passed: 30, failed: 4, repaired: 1 },
  { day: "Sun", date: "Oct 10", passed: 34, failed: 5, repaired: 3 },
];

export const initialProjects: Project[] = [
  {
    id: "proj-001",
    name: "Commerce Portal",
    targetUrl: "https://shop.example-saas.com",
    lastTestRun: "10 mins ago",
    status: "Passed",
    suiteCount: 32,
    passRate: 100,
    lastRunDuration: "42s",
  },
  {
    id: "proj-002",
    name: "Admin Console",
    targetUrl: "https://admin.example-saas.com",
    lastTestRun: "25 mins ago",
    status: "Failed",
    suiteCount: 28,
    passRate: 85.7,
    lastRunDuration: "1m 12s",
  },
  {
    id: "proj-003",
    name: "Customer Support",
    targetUrl: "https://support.example-saas.com",
    lastTestRun: "1 hour ago",
    status: "Passed",
    suiteCount: 18,
    passRate: 94.4,
    lastRunDuration: "35s",
  },
  {
    id: "proj-004",
    name: "Analytics Workspace",
    targetUrl: "https://analytics.example-saas.com",
    lastTestRun: "Running now",
    status: "Running",
    suiteCount: 45,
    passRate: 91.1,
    lastRunDuration: "In progress",
  },
  {
    id: "proj-005",
    name: "Billing & Checkout",
    targetUrl: "https://checkout.example-saas.com",
    lastTestRun: "3 hours ago",
    status: "Passed",
    suiteCount: 24,
    passRate: 100,
    lastRunDuration: "50s",
  },
  {
    id: "proj-006",
    name: "Auth & Identity Service",
    targetUrl: "https://auth.example-saas.com",
    lastTestRun: "5 hours ago",
    status: "Passed",
    suiteCount: 16,
    passRate: 100,
    lastRunDuration: "28s",
  },
  {
    id: "proj-007",
    name: "Inventory Manager",
    targetUrl: "https://inventory.example-saas.com",
    lastTestRun: "6 hours ago",
    status: "Repaired",
    suiteCount: 22,
    passRate: 90.9,
    lastRunDuration: "1m 05s",
  },
  {
    id: "proj-008",
    name: "Notification Dispatcher",
    targetUrl: "https://notify.example-saas.com",
    lastTestRun: "12 hours ago",
    status: "Passed",
    suiteCount: 14,
    passRate: 100,
    lastRunDuration: "20s",
  },
  {
    id: "proj-009",
    name: "Partner API Gateway",
    targetUrl: "https://api-gateway.example-saas.com",
    lastTestRun: "1 day ago",
    status: "Passed",
    suiteCount: 19,
    passRate: 94.7,
    lastRunDuration: "48s",
  },
  {
    id: "proj-010",
    name: "Developer Documentation",
    targetUrl: "https://docs.example-saas.com",
    lastTestRun: "1 day ago",
    status: "Passed",
    suiteCount: 10,
    passRate: 100,
    lastRunDuration: "15s",
  },
  {
    id: "proj-011",
    name: "Mobile Web Companion",
    targetUrl: "https://m.example-saas.com",
    lastTestRun: "2 days ago",
    status: "Failed",
    suiteCount: 12,
    passRate: 66.6,
    lastRunDuration: "58s",
  },
  {
    id: "proj-012",
    name: "Feedback & Survey Portal",
    targetUrl: "https://feedback.example-saas.com",
    lastTestRun: "2 days ago",
    status: "Passed",
    suiteCount: 8,
    passRate: 100,
    lastRunDuration: "18s",
  },
  {
    id: "proj-013",
    name: "Reporting Service Engine",
    targetUrl: "https://reports-engine.example-saas.com",
    lastTestRun: "3 days ago",
    status: "Passed",
    suiteCount: 15,
    passRate: 100,
    lastRunDuration: "32s",
  },
  {
    id: "proj-014",
    name: "RPA Orchestrator Workspace",
    targetUrl: "https://rpa.example-saas.com",
    lastTestRun: "3 days ago",
    status: "Repaired",
    suiteCount: 20,
    passRate: 95.0,
    lastRunDuration: "45s",
  },
];

export const initialTestRuns: TestRunDetail[] = [
  {
    id: "run-101",
    suiteName: "Commerce Portal - Full E2E Checkout Flow",
    projectId: "proj-001",
    projectName: "Commerce Portal",
    targetUrl: "https://shop.example-saas.com",
    startTime: "2026-10-10 10:15:00 UTC",
    completionTime: "2026-10-10 10:15:42 UTC",
    duration: "42s",
    status: "Passed",
    passRate: 100,
    totalAssertions: 32,
    passedAssertions: 32,
    failedAssertions: 0,
    skippedAssertions: 0,
    developerSummary:
      "All 32 automated assertions executed flawlessly. Product catalog rendering, cart additions, and payment checkout flow validated.",
    executiveSummary:
      "Commerce Portal is 100% operational. Zero functional or visual regressions detected across desktop and mobile viewports.",
    recommendation: "No corrective actions needed. Continue scheduled 1-hour monitoring interval.",
    hasVisualDiff: false,
    defects: [],
    selfHealing: [],
    assertions: [
      { id: "ast-101", name: "Homepage banner render check", selector: "#hero-banner", type: "element_exist", status: "Passed" },
      { id: "ast-102", name: "Product catalog grid count >= 12", selector: ".product-card", type: "functional", status: "Passed" },
      { id: "ast-103", name: "Add to Cart button clickable", selector: 'button[data-testid="add-to-cart"]', type: "functional", status: "Passed" },
      { id: "ast-104", name: "Stripe Checkout modal visual match", selector: "#checkout-modal", type: "visual", status: "Passed" },
    ],
  },
  {
    id: "run-102",
    suiteName: "Admin Console - User Management & Settings",
    projectId: "proj-002",
    projectName: "Admin Console",
    targetUrl: "https://admin.example-saas.com",
    startTime: "2026-10-10 09:50:00 UTC",
    completionTime: "2026-10-10 09:51:12 UTC",
    duration: "1m 12s",
    status: "Failed",
    passRate: 85.7,
    totalAssertions: 28,
    passedAssertions: 24,
    failedAssertions: 4,
    skippedAssertions: 0,
    developerSummary:
      "4 assertions failed due to a 24px layout shift on the top navigation bar and an updated button selector `#save-admin-settings`.",
    executiveSummary:
      "Admin Console UI regression detected. 4 visual & selector mismatches require review.",
    recommendation: "Approve visual baseline update or trigger automated self-healing selector update.",
    hasVisualDiff: true,
    defects: [
      {
        id: "def-101",
        title: "Navigation bar layout shift (+24px offset)",
        category: "Visual Shift",
        severity: "High",
        component: "Header Navbar",
        description: "Header elements displaced downwards after recent Tailwind CSS update.",
      },
      {
        id: "def-102",
        title: "Save button selector missing",
        category: "Selector Change",
        severity: "Medium",
        component: "Settings Form",
        description: "DOM ID `#save-settings` changed to `button[data-action='save']`.",
      },
    ],
    selfHealing: [
      {
        id: "heal-101",
        brokenSelector: "#save-settings",
        replacementSelector: 'button[data-action="save"]',
        confidenceScore: 0.94,
        strategy: "Vision Vector Similarity",
        status: "Pending Review",
      },
    ],
    assertions: [
      { id: "ast-201", name: "Admin Dashboard login state", selector: "#admin-avatar", type: "element_exist", status: "Passed" },
      { id: "ast-202", name: "Top Header visual alignment", selector: "header.nav-header", type: "visual", status: "Failed", failureReason: "Visual diff percentage 4.2% exceeds tolerance (1.0%)" },
      { id: "ast-203", name: "Settings form submit button", selector: "#save-settings", type: "functional", status: "Failed", failureReason: "Element not found with selector #save-settings" },
    ],
  },
  {
    id: "run-103",
    suiteName: "Inventory Manager - Automated Self-Healing Suite",
    projectId: "proj-007",
    projectName: "Inventory Manager",
    targetUrl: "https://inventory.example-saas.com",
    startTime: "2026-10-10 04:00:00 UTC",
    completionTime: "2026-10-10 04:01:05 UTC",
    duration: "1m 05s",
    status: "Repaired",
    passRate: 90.9,
    totalAssertions: 22,
    passedAssertions: 20,
    failedAssertions: 2,
    skippedAssertions: 0,
    developerSummary:
      "OmniSight Vision AI successfully auto-repaired 2 broken selectors (`#btn-update-stock` -> `button:has-text('Update Stock')`) without interrupting test execution.",
    executiveSummary:
      "Self-healing successfully intervened. Test suite completed with 90.9% pass rate after autonomous selector repair.",
    recommendation: "Commit healed selector `button:has-text('Update Stock')` into automated repository codebase.",
    hasVisualDiff: true,
    defects: [
      {
        id: "def-103",
        title: "Stock update button class rename",
        category: "Selector Change",
        severity: "Medium",
        component: "Inventory Table",
        description: "CSS class `.btn-stock-update` removed during release v2.4.",
      },
    ],
    selfHealing: [
      {
        id: "heal-102",
        brokenSelector: "#btn-update-stock",
        replacementSelector: "button:has-text('Update Stock')",
        confidenceScore: 0.98,
        strategy: "SSIM Visual Match",
        status: "Validated",
      },
    ],
    assertions: [
      { id: "ast-301", name: "Inventory table rendering", selector: "#inventory-grid", type: "element_exist", status: "Passed" },
      { id: "ast-302", name: "Stock update submission", selector: "#btn-update-stock", type: "functional", status: "Repaired", healedSelector: "button:has-text('Update Stock')" },
    ],
  },
  {
    id: "run-104",
    suiteName: "Billing & Checkout - Payment Gateway Integration",
    projectId: "proj-005",
    projectName: "Billing & Checkout",
    targetUrl: "https://checkout.example-saas.com",
    startTime: "2026-10-10 07:00:00 UTC",
    completionTime: "2026-10-10 07:00:50 UTC",
    duration: "50s",
    status: "Passed",
    passRate: 100,
    totalAssertions: 24,
    passedAssertions: 24,
    failedAssertions: 0,
    skippedAssertions: 0,
    developerSummary:
      "Stripe API webhook simulation and credit card form validation passed 100%.",
    executiveSummary: "Checkout pipeline is fully operational with zero errors.",
    recommendation: "Routine scheduled run complete. No action required.",
    hasVisualDiff: false,
    defects: [],
    selfHealing: [],
    assertions: [
      { id: "ast-401", name: "Payment card field iframe load", selector: "#stripe-card-element", type: "element_exist", status: "Passed" },
      { id: "ast-402", name: "Pay Now button state", selector: "#btn-pay", type: "functional", status: "Passed" },
    ],
  },
];

export const initialActivities: ActivityItem[] = [
  {
    id: "act-001",
    timestamp: "10 mins ago",
    title: "Dashboard regression test completed",
    description: "Commerce Portal test suite executed with 32 passed assertions.",
    type: "test_completed",
    status: "Passed",
    projectName: "Commerce Portal",
  },
  {
    id: "act-002",
    timestamp: "25 mins ago",
    title: "Visual difference detected",
    description: "Layout shift detected on Admin Console settings page navigation bar.",
    type: "visual_diff",
    status: "Failed",
    projectName: "Admin Console",
  },
  {
    id: "act-003",
    timestamp: "1 hour ago",
    title: "OmniSight Vision AI Self-Healing Triggered",
    description: "Inventory Manager selector #btn-update-stock auto-repaired to button:has-text('Update Stock').",
    type: "self_healed",
    status: "Repaired",
    projectName: "Inventory Manager",
  },
  {
    id: "act-004",
    timestamp: "2 hours ago",
    title: "New test target registered",
    description: "RPA Orchestrator Workspace added to monitoring list.",
    type: "target_registered",
    status: "Info",
    projectName: "RPA Orchestrator Workspace",
  },
];

// Persistent LocalStorage Store Engine

const STORAGE_KEYS = {
  PROJECTS: "omnisight_projects_v2",
  TEST_RUNS: "omnisight_test_runs_v2",
  ACTIVITIES: "omnisight_activities_v2",
};

export function getStoredProjects(): Project[] {
  if (typeof window === "undefined") return initialProjects;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
      return initialProjects;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn("LocalStorage read error for projects:", e);
    return initialProjects;
  }
}

export function saveStoredProjects(projects: Project[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.warn("LocalStorage write error for projects:", e);
  }
}

export function getStoredTestRuns(): TestRunDetail[] {
  if (typeof window === "undefined") return initialTestRuns;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEST_RUNS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEST_RUNS, JSON.stringify(initialTestRuns));
      return initialTestRuns;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn("LocalStorage read error for test runs:", e);
    return initialTestRuns;
  }
}

export function saveStoredTestRuns(runs: TestRunDetail[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.TEST_RUNS, JSON.stringify(runs));
  } catch (e) {
    console.warn("LocalStorage write error for test runs:", e);
  }
}

export function getStoredActivities(): ActivityItem[] {
  if (typeof window === "undefined") return initialActivities;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(initialActivities));
      return initialActivities;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn("LocalStorage read error for activities:", e);
    return initialActivities;
  }
}

export function saveStoredActivities(activities: ActivityItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (e) {
    console.warn("LocalStorage write error for activities:", e);
  }
}

export function getTestRunById(runId: string): TestRunDetail | undefined {
  const runs = getStoredTestRuns();
  return runs.find((r) => r.id === runId);
}

export function getCalculatedMetrics(): DashboardMetrics {
  const projects = getStoredProjects();
  const runs = getStoredTestRuns();

  const totalProjects = projects.length;
  const testsExecuted = runs.length > 0 ? runs.length * 32 : 248;
  const passedTests = runs.filter((r) => r.status === "Passed").length;
  const failedTestsCount = runs.filter((r) => r.status === "Failed").length;
  const repairedTests = runs.filter((r) => r.status === "Repaired").length;

  const totalRuns = runs.length || 1;
  const overallPassRate = Number(
    (((passedTests + repairedTests) / totalRuns) * 100).toFixed(1)
  );

  const totalHealingAttempts = runs.reduce(
    (acc, r) => acc + (r.selfHealing ? r.selfHealing.length : 0),
    15
  );
  const validatedHealing = runs.reduce(
    (acc, r) =>
      acc + (r.selfHealing ? r.selfHealing.filter((h) => h.status === "Validated").length : 0),
    14
  );

  const selfHealingSuccessRate = Number(
    ((validatedHealing / (totalHealingAttempts || 1)) * 100).toFixed(1)
  );

  return {
    totalProjects,
    testsExecuted,
    passedTests: 219,
    failedTests: failedTestsCount > 0 ? failedTestsCount : 29,
    repairedTests,
    overallPassRate: overallPassRate > 0 ? overallPassRate : 88.3,
    selfHealingSuccessRate: selfHealingSuccessRate > 0 ? selfHealingSuccessRate : 93.3,
    totalHealingAttempts,
    lastUpdated: "Just now",
  };
}
