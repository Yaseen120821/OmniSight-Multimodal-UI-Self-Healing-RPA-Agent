import {
  initialProjects,
  initialExecutionTrends,
  initialActivities,
  initialTestRuns,
  getStoredProjects,
  saveStoredProjects,
  getStoredTestRuns,
  saveStoredTestRuns,
  getStoredActivities,
  saveStoredActivities,
  getTestRunById,
  getCalculatedMetrics,
  dispatchStoreUpdate,
  subscribeToStoreUpdates,
} from "./store";

import { NotificationItem, UserItem } from "@/types";

export const sampleProjects = initialProjects;
export const sampleExecutionTrends = initialExecutionTrends;
export const sampleActivities = initialActivities;
export const initialMetrics = getCalculatedMetrics();

export const sampleNotifications: NotificationItem[] = [
  {
    id: "notif-001",
    title: "Visual regression alert",
    description: "Admin Console detected 3 visual mismatches during scheduled run.",
    time: "15 mins ago",
    read: false,
    type: "warning",
  },
  {
    id: "notif-002",
    title: "Test suite passed",
    description: "Commerce Portal passed all 32 automated functional checks.",
    time: "45 mins ago",
    read: false,
    type: "success",
  },
  {
    id: "notif-003",
    title: "New project added",
    description: "Partner API Gateway was registered by Sarah Chen.",
    time: "2 hours ago",
    read: true,
    type: "info",
  },
];

export const sampleUsers: UserItem[] = [
  {
    id: "usr-001",
    name: "Alex Rivera",
    email: "alex.rivera@omnisight.dev",
    role: "Lead QA Automation Engineer",
    status: "Active",
    avatar: "AR",
    lastActive: "Just now",
  },
  {
    id: "usr-002",
    name: "Sarah Chen",
    email: "sarah.chen@omnisight.dev",
    role: "Principal Product Manager",
    status: "Active",
    avatar: "SC",
    lastActive: "12 mins ago",
  },
  {
    id: "usr-003",
    name: "David Kim",
    email: "david.kim@omnisight.dev",
    role: "Senior Frontend Engineer",
    status: "Active",
    avatar: "DK",
    lastActive: "1 hour ago",
  },
];

export {
  initialProjects,
  initialExecutionTrends,
  initialActivities,
  initialTestRuns,
  getStoredProjects,
  saveStoredProjects,
  getStoredTestRuns,
  saveStoredTestRuns,
  getStoredActivities,
  saveStoredActivities,
  getTestRunById,
  getCalculatedMetrics,
  dispatchStoreUpdate,
  subscribeToStoreUpdates,
};
