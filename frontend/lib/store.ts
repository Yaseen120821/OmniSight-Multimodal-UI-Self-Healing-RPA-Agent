import {
  Project,
  DashboardMetrics,
  ActivityItem,
  TestRunDetail,
  ExecutionTrend,
} from "@/types";

export const initialExecutionTrends7d: ExecutionTrend[] = [
  { day: "Mon", date: "Oct 06", passed: 28, failed: 4, repaired: 2 },
  { day: "Tue", date: "Oct 07", passed: 32, failed: 3, repaired: 3 },
  { day: "Wed", date: "Oct 08", passed: 35, failed: 6, repaired: 4 },
  { day: "Thu", date: "Oct 09", passed: 29, failed: 2, repaired: 1 },
  { day: "Fri", date: "Oct 10", passed: 31, failed: 5, repaired: 2 },
  { day: "Sat", date: "Oct 11", passed: 30, failed: 4, repaired: 1 },
  { day: "Sun", date: "Oct 12", passed: 34, failed: 5, repaired: 3 },
];

export const initialExecutionTrends = initialExecutionTrends7d;

export const initialExecutionTrends30d: ExecutionTrend[] = [
  { day: "Wk 1", date: "Sep 13-19", passed: 142, failed: 12, repaired: 8 },
  { day: "Wk 2", date: "Sep 20-26", passed: 156, failed: 15, repaired: 11 },
  { day: "Wk 3", date: "Sep 27-03", passed: 168, failed: 10, repaired: 9 },
  { day: "Wk 4", date: "Oct 04-10", passed: 182, failed: 14, repaired: 12 },
  { day: "Curr", date: "Oct 11-12", passed: 64, failed: 5, repaired: 4 },
];

export const initialExecutionTrendsAll: ExecutionTrend[] = [
  { day: "Jul", date: "July 2026", passed: 512, failed: 48, repaired: 32 },
  { day: "Aug", date: "August 2026", passed: 640, failed: 55, repaired: 41 },
  { day: "Sep", date: "September 2026", passed: 720, failed: 52, repaired: 46 },
  { day: "Oct", date: "October 2026", passed: 416, failed: 28, repaired: 24 },
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
    name: "Mobile API Gateway",
    targetUrl: "https://api-mobile.example-saas.com",
    lastTestRun: "1 day ago",
    status: "Passed",
    suiteCount: 30,
    passRate: 96.7,
    lastRunDuration: "1m 15s",
  },
  {
    id: "proj-010",
    name: "Payment Gateway Webhook",
    targetUrl: "https://webhooks.example-saas.com",
    lastTestRun: "1 day ago",
    status: "Passed",
    suiteCount: 12,
    passRate: 100,
    lastRunDuration: "18s",
  },
  {
    id: "proj-011",
    name: "Search & Discovery Engine",
    targetUrl: "https://search.example-saas.com",
    lastTestRun: "2 days ago",
    status: "Failed",
    suiteCount: 26,
    passRate: 88.5,
    lastRunDuration: "55s",
  },
  {
    id: "proj-012",
    name: "Partner Integration Hub",
    targetUrl: "https://partners.example-saas.com",
    lastTestRun: "2 days ago",
    status: "Passed",
    suiteCount: 20,
    passRate: 100,
    lastRunDuration: "39s",
  },
  {
    id: "proj-013",
    name: "Reporting Export Service",
    targetUrl: "https://export.example-saas.com",
    lastTestRun: "3 days ago",
    status: "Passed",
    suiteCount: 15,
    passRate: 100,
    lastRunDuration: "30s",
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
    startTime: "2026-10-12 09:15:00 UTC",
    completionTime: "2026-10-12 09:15:42 UTC",
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
    startTime: "2026-10-11 18:50:00 UTC",
    completionTime: "2026-10-11 18:51:12 UTC",
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
    startTime: "2026-10-10 14:00:00 UTC",
    completionTime: "2026-10-10 14:01:05 UTC",
    duration: "1m 05s",
    status: "Repaired",
    passRate: 90.9,
    totalAssertions: 22,
    passedAssertions: 20,
    failedAssertions: 2,
    skippedAssertions: 0,
    developerSummary:
      "OmniSight Vision AI successfully auto-repaired broken selector `#btn-update-stock` -> `button:has-text('Update Stock')` without interrupting test execution.",
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
    startTime: "2026-10-09 11:30:00 UTC",
    completionTime: "2026-10-09 11:30:50 UTC",
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
  {
    id: "run-3115",
    suiteName: "Analytics Workspace - Autonomous UI Verification Suite",
    projectId: "proj-004",
    projectName: "Analytics Workspace",
    targetUrl: "https://analytics.example-saas.com",
    startTime: "2026-10-08 15:45:00 UTC",
    completionTime: "2026-10-08 15:46:18 UTC",
    duration: "1m 18s",
    status: "Passed",
    passRate: 100,
    totalAssertions: 42,
    passedAssertions: 42,
    failedAssertions: 0,
    skippedAssertions: 0,
    developerSummary:
      "All 42 assertions passed. Real-time metric streaming, SVG charting components, date filter dropdowns, and CSV export triggers validated without regression.",
    executiveSummary:
      "Analytics Workspace is 100% operational. Zero visual regressions or selector drift found across all chart views.",
    recommendation: "System fully healthy. Continue automated hourly execution interval.",
    hasVisualDiff: false,
    defects: [],
    selfHealing: [],
    assertions: [
      { id: "ast-3115-1", name: "Dashboard SVG charts render", selector: "#analytics-chart-canvas", type: "visual", status: "Passed" },
      { id: "ast-3115-2", name: "Date range filter dropdown exists", selector: "#date-picker-button", type: "functional", status: "Passed" },
      { id: "ast-3115-3", name: "Export data table button clickable", selector: 'button[data-testid="export-csv"]', type: "functional", status: "Passed" },
      { id: "ast-3115-4", name: "Live metrics websocket stream active", selector: "#metrics-socket-status", type: "element_exist", status: "Passed" },
    ],
  },
  // 30-Day Historical Runs (outside 7d, inside 30d)
  {
    id: "run-201",
    suiteName: "Inventory Manager - Stock Sync & Barcode Scanner",
    projectId: "proj-007",
    projectName: "Inventory Manager",
    targetUrl: "https://inventory.example-saas.com",
    startTime: "2026-10-02 08:20:00 UTC",
    completionTime: "2026-10-02 08:21:15 UTC",
    duration: "1m 15s",
    status: "Repaired",
    passRate: 92.0,
    totalAssertions: 25,
    passedAssertions: 23,
    failedAssertions: 2,
    skippedAssertions: 0,
    developerSummary: "Healed barcode input field selector using OpenCV visual pattern match.",
    executiveSummary: "Stock sync operational with autonomous selector recovery.",
    recommendation: "Keep barcode match template active.",
    hasVisualDiff: true,
    defects: [
      {
        id: "def-201",
        title: "Barcode input field selector rename",
        category: "Selector Change",
        severity: "Medium",
        component: "Scanner Dialog",
        description: "DOM selector `#scan-input` updated to `input[name='barcode']`.",
      },
    ],
    selfHealing: [
      {
        id: "heal-201",
        brokenSelector: "#scan-input",
        replacementSelector: "input[name='barcode']",
        confidenceScore: 0.96,
        strategy: "Vision Vector Similarity",
        status: "Validated",
      },
    ],
    assertions: [
      { id: "ast-201-1", name: "Scanner modal render", selector: "#scanner-modal", type: "element_exist", status: "Passed" },
      { id: "ast-201-2", name: "Barcode input focus", selector: "#scan-input", type: "functional", status: "Repaired", healedSelector: "input[name='barcode']" },
    ],
  },
  {
    id: "run-202",
    suiteName: "Admin Console - Role Permission Matrix",
    projectId: "proj-002",
    projectName: "Admin Console",
    targetUrl: "https://admin.example-saas.com",
    startTime: "2026-09-24 16:10:00 UTC",
    completionTime: "2026-09-24 16:11:05 UTC",
    duration: "1m 05s",
    status: "Failed",
    passRate: 80.0,
    totalAssertions: 20,
    passedAssertions: 16,
    failedAssertions: 4,
    skippedAssertions: 0,
    developerSummary: "Permission checkbox grid timed out waiting for GraphQL mutation.",
    executiveSummary: "Admin role matrix regression flagged for backend review.",
    recommendation: "Increase mutation timeout threshold to 8000ms.",
    hasVisualDiff: false,
    defects: [
      {
        id: "def-202",
        title: "Role permission mutation latency",
        category: "Timeout",
        severity: "High",
        component: "Role Permissions Table",
        description: "Network response exceeded 5000ms SLA during permission save.",
      },
    ],
    selfHealing: [],
    assertions: [
      { id: "ast-202-1", name: "Role table render", selector: "#roles-grid", type: "element_exist", status: "Passed" },
      { id: "ast-202-2", name: "Save permissions CTA", selector: "#save-roles", type: "functional", status: "Failed", failureReason: "Network request timed out after 5000ms" },
    ],
  },
  {
    id: "run-203",
    suiteName: "Customer Support - Chatbot Live Feed",
    projectId: "proj-003",
    projectName: "Customer Support",
    targetUrl: "https://support.example-saas.com",
    startTime: "2026-09-18 10:00:00 UTC",
    completionTime: "2026-09-18 10:00:36 UTC",
    duration: "36s",
    status: "Passed",
    passRate: 100,
    totalAssertions: 18,
    passedAssertions: 18,
    failedAssertions: 0,
    skippedAssertions: 0,
    developerSummary: "Chat widget trigger and simulated response verified cleanly.",
    executiveSummary: "Customer Support chat automation is 100% operational.",
    recommendation: "Routine check successful.",
    hasVisualDiff: false,
    defects: [],
    selfHealing: [],
    assertions: [
      { id: "ast-203-1", name: "Chat launcher button", selector: "#chat-bubble", type: "element_exist", status: "Passed" },
    ],
  },
  // All-Time Historical Runs (outside 30d)
  {
    id: "run-301",
    suiteName: "Notification Dispatcher - Email Queue E2E",
    projectId: "proj-008",
    projectName: "Notification Dispatcher",
    targetUrl: "https://notify.example-saas.com",
    startTime: "2026-08-25 12:00:00 UTC",
    completionTime: "2026-08-25 12:00:22 UTC",
    duration: "22s",
    status: "Passed",
    passRate: 100,
    totalAssertions: 14,
    passedAssertions: 14,
    failedAssertions: 0,
    skippedAssertions: 0,
    developerSummary: "SMTP delivery confirmation validated.",
    executiveSummary: "Notification queue healthy.",
    recommendation: "No action required.",
    hasVisualDiff: false,
    defects: [],
    selfHealing: [],
    assertions: [
      { id: "ast-301-1", name: "Dispatcher health endpoint", selector: "body", type: "element_exist", status: "Passed" },
    ],
  },
  {
    id: "run-302",
    suiteName: "Auth & Identity Service - OAuth2 Multi-Tenant",
    projectId: "proj-006",
    projectName: "Auth & Identity Service",
    targetUrl: "https://auth.example-saas.com",
    startTime: "2026-07-28 09:30:00 UTC",
    completionTime: "2026-07-28 09:30:45 UTC",
    duration: "45s",
    status: "Passed",
    passRate: 100,
    totalAssertions: 16,
    passedAssertions: 16,
    failedAssertions: 0,
    skippedAssertions: 0,
    developerSummary: "SAML and OpenID flows verified.",
    executiveSummary: "Auth cluster fully functional.",
    recommendation: "No action required.",
    hasVisualDiff: false,
    defects: [],
    selfHealing: [],
    assertions: [
      { id: "ast-302-1", name: "Sign In button", selector: "#login-submit", type: "element_exist", status: "Passed" },
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
  {
    id: "act-005",
    timestamp: "4 days ago",
    title: "Analytics Workspace autonomous suite executed",
    description: "Run run-3115 executed 42 assertions successfully with 100% pass rate.",
    type: "test_completed",
    status: "Passed",
    projectName: "Analytics Workspace",
  },
  {
    id: "act-006",
    timestamp: "10 days ago",
    title: "Barcode input field selector repaired",
    description: "Inventory Manager scan input auto-healed via SSIM Visual Match.",
    type: "self_healed",
    status: "Repaired",
    projectName: "Inventory Manager",
  },
  {
    id: "act-007",
    timestamp: "18 days ago",
    title: "Timeout defect detected in role matrix",
    description: "Admin Console role permission save operation timed out.",
    type: "visual_diff",
    status: "Failed",
    projectName: "Admin Console",
  },
  {
    id: "act-008",
    timestamp: "48 days ago",
    title: "Historical test run completed",
    description: "Notification Dispatcher verified 14 assertions in legacy audit.",
    type: "test_completed",
    status: "Passed",
    projectName: "Notification Dispatcher",
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
    const parsed: Project[] = JSON.parse(raw);
    // Ensure all default projects exist
    const existingIds = new Set(parsed.map((p) => p.id));
    let hasMissing = false;
    for (const seed of initialProjects) {
      if (!existingIds.has(seed.id)) {
        parsed.push(seed);
        hasMissing = true;
      }
    }
    if (hasMissing) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.warn("LocalStorage read error for projects:", e);
    return initialProjects;
  }
}

export function dispatchStoreUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("omnisight_store_update"));
  }
}

export function subscribeToStoreUpdates(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("omnisight_store_update", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("omnisight_store_update", handler);
    window.removeEventListener("storage", handler);
  };
}

export function saveStoredProjects(projects: Project[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    dispatchStoreUpdate();
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
    const parsed: TestRunDetail[] = JSON.parse(raw);
    // Ensure all default/seed runs exist in stored runs so new seeds (like run-3115) are canonical
    let hasMissing = false;
    for (const seed of initialTestRuns) {
      const idx = parsed.findIndex((r) => r.id === seed.id);
      if (idx === -1) {
        parsed.push(seed);
        hasMissing = true;
      } else if (seed.id === "run-3115" && parsed[idx].projectName !== seed.projectName) {
        parsed[idx] = seed;
        hasMissing = true;
      }
    }
    if (hasMissing) {
      localStorage.setItem(STORAGE_KEYS.TEST_RUNS, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.warn("LocalStorage read error for test runs:", e);
    return initialTestRuns;
  }
}

export function saveStoredTestRuns(runs: TestRunDetail[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.TEST_RUNS, JSON.stringify(runs));
    dispatchStoreUpdate();
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
    dispatchStoreUpdate();
  } catch (e) {
    console.warn("LocalStorage write error for activities:", e);
  }
}

export function getTestRunById(runId: string): TestRunDetail | undefined {
  const runs = getStoredTestRuns();
  return (
    runs.find((r) => r.id.toLowerCase() === runId.toLowerCase()) ||
    initialTestRuns.find((r) => r.id.toLowerCase() === runId.toLowerCase())
  );
}

// Date-Range Filtering Utilities

// Deterministic anchor time for SSR prerendering to avoid Next.js 16 dynamic date prerender warnings
const PRERENDER_ANCHOR_TIME = 1791806400000; // 2026-10-12T12:00:00.000Z

export function getNowTime(): number {
  if (typeof window === "undefined") {
    return PRERENDER_ANCHOR_TIME;
  }
  return Date.now();
}

export function parseRunDate(dateStr: string): Date {
  const normalized = dateStr.replace(" UTC", "Z").replace(" ", "T");
  const d = new Date(normalized);
  if (!isNaN(d.getTime())) return d;
  return new Date(PRERENDER_ANCHOR_TIME);
}

export function filterRunsByPeriod(
  runs: TestRunDetail[],
  period: "7d" | "30d" | "all"
): TestRunDetail[] {
  if (period === "all") return runs;
  const days = period === "7d" ? 7 : 30;
  const cutoffTime = getNowTime() - days * 24 * 60 * 60 * 1000;
  return runs.filter((r) => {
    const runTime = parseRunDate(r.startTime).getTime();
    return runTime >= cutoffTime;
  });
}

export function filterActivitiesByPeriod(
  activities: ActivityItem[],
  period: "7d" | "30d" | "all"
): ActivityItem[] {
  if (period === "all") return activities;
  const days = period === "7d" ? 7 : 30;
  return activities.filter((act) => {
    const ts = act.timestamp.toLowerCase();
    if (ts.includes("min") || ts.includes("hour")) return true;
    if (ts.includes("day")) {
      const match = ts.match(/\d+/);
      const d = match ? parseInt(match[0], 10) : 1;
      return d <= days;
    }
    if (ts.includes("week")) {
      const match = ts.match(/\d+/);
      const w = match ? parseInt(match[0], 10) : 1;
      return w * 7 <= days;
    }
    if (ts.includes("month")) {
      return false;
    }
    return true;
  });
}

export function getTrendData(period: "7d" | "30d" | "all"): ExecutionTrend[] {
  if (period === "all") return initialExecutionTrendsAll;
  if (period === "30d") return initialExecutionTrends30d;
  return initialExecutionTrends7d;
}

export function getCalculatedMetrics(period: "7d" | "30d" | "all" = "7d"): DashboardMetrics {
  const projects = getStoredProjects();
  const allRuns = getStoredTestRuns();
  const runs = filterRunsByPeriod(allRuns, period);

  const totalProjects = projects.length;
  
  // Aggregate actual assertions and runs across recorded test runs in the selected period
  let totalAssertions = 0;
  let passedAssertions = 0;
  let failedAssertions = 0;
  let repairedCount = 0;
  let totalHealingAttempts = 0;
  let validatedHealing = 0;

  runs.forEach((r) => {
    const totalAst = r.totalAssertions || (r.assertions ? r.assertions.length : 0);
    const passAst = r.passedAssertions || (r.assertions ? r.assertions.filter(a => a.status === "Passed" || a.status === "Repaired").length : 0);
    const failAst = r.failedAssertions || (r.assertions ? r.assertions.filter(a => a.status === "Failed").length : 0);

    totalAssertions += totalAst;
    passedAssertions += passAst;
    failedAssertions += failAst;

    if (r.status === "Repaired") {
      repairedCount += 1;
    }

    if (r.selfHealing && r.selfHealing.length > 0) {
      totalHealingAttempts += r.selfHealing.length;
      validatedHealing += r.selfHealing.filter((h) => h.status === "Validated").length;
    }
  });

  // Calculate distinct tests executed in period
  const testsExecuted = totalAssertions > 0 ? totalAssertions : (runs.length * 24);
  const passedTests = passedAssertions;
  const failedTests = failedAssertions;
  const repairedTests = repairedCount;

  const overallPassRate = testsExecuted > 0
    ? Number(((passedTests / testsExecuted) * 100).toFixed(1))
    : 100;

  const selfHealingSuccessRate = totalHealingAttempts > 0
    ? Number(((validatedHealing / totalHealingAttempts) * 100).toFixed(1))
    : 100;

  return {
    totalProjects,
    testsExecuted,
    passedTests,
    failedTests,
    repairedTests,
    overallPassRate,
    selfHealingSuccessRate,
    totalHealingAttempts,
    lastUpdated: "Just now",
  };
}
