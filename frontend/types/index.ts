export type TestStatus = "Passed" | "Failed" | "Running" | "Repaired";

export interface Project {
  id: string;
  name: string;
  targetUrl: string;
  lastTestRun: string;
  status: TestStatus;
  suiteCount: number;
  passRate: number;
  lastRunDuration: string;
  createdAt?: string;
}

export interface DashboardMetrics {
  totalProjects: number;
  testsExecuted: number;
  passedTests: number;
  failedTests: number;
  repairedTests: number;
  overallPassRate: number;
  selfHealingSuccessRate: number;
  totalHealingAttempts: number;
  lastUpdated: string;
}

export type ActivityType =
  | "test_completed"
  | "target_registered"
  | "visual_diff"
  | "test_run"
  | "self_healed";

export interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: ActivityType;
  status: "Passed" | "Failed" | "Info" | "Repaired";
  projectName?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

export interface ExecutionTrend {
  day: string;
  date: string;
  passed: number;
  failed: number;
  repaired?: number;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  avatar: string;
  lastActive: string;
}

// Phase 5 & 6 Extended Report Types

export interface AssertionResult {
  id: string;
  name: string;
  selector: string;
  type: "visual" | "functional" | "element_exist" | "text_match";
  status: "Passed" | "Failed" | "Repaired" | "Skipped";
  failureReason?: string;
  healedSelector?: string;
}

export interface DefectDetail {
  id: string;
  title: string;
  category: "Visual Shift" | "Selector Change" | "Timeout" | "Assertion Failure" | "Layout Mutation";
  severity: "High" | "Medium" | "Low";
  component: string;
  description: string;
}

export interface SelfHealingAttempt {
  id: string;
  brokenSelector: string;
  replacementSelector: string;
  confidenceScore: number; // e.g. 0.94 (94%)
  strategy: "Vision Vector Similarity" | "SSIM Visual Match" | "DOM Hierarchy Tree";
  status: "Validated" | "Failed" | "Pending Review";
}

export interface TestRunDetail {
  id: string;
  suiteName: string;
  projectId: string;
  projectName: string;
  targetUrl: string;
  startTime: string;
  completionTime: string;
  duration: string;
  status: "Passed" | "Failed" | "Repaired";
  passRate: number;
  totalAssertions: number;
  passedAssertions: number;
  failedAssertions: number;
  skippedAssertions: number;
  assertions: AssertionResult[];
  defects: DefectDetail[];
  selfHealing: SelfHealingAttempt[];
  developerSummary: string;
  executiveSummary: string;
  recommendation: string;
  hasVisualDiff?: boolean;
}
