import type { ImpersonationSession, ImpersonationLog } from "./impersonationTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

export const impersonationKPIs: KPIItem[] = [
  { label: "Active Sessions", value: "1", change: "admin@homeguru.in", changeType: "neutral", icon: null },
  { label: "Sessions Today", value: "7", change: "+2 vs yesterday", changeType: "up", icon: null },
  { label: "Blocked Actions", value: "3", change: "2FA / Bank edits", changeType: "neutral", icon: null },
];
export const impersonationSparklines = [
  [0, 1, 0, 1, 1, 0, 1],
  [4, 5, 3, 6, 5, 5, 7],
  [1, 0, 2, 1, 3, 2, 3],
];

export const impersonationSessions: ImpersonationSession[] = [
  { id: "IMP-001", adminId: "ADM-01", adminEmail: "admin@homeguru.in", targetUserId: "STU-8842", targetUserName: "Rohan Mehta", targetUserEmail: "rohan@gmail.com", targetType: "student", reason: "Student unable to see booked classes", ticketId: "TKT-4421", startedAt: "Today, 10:42 AM", endedAt: null, actionsPerformed: 4, blockedActions: [] },
  { id: "IMP-002", adminId: "ADM-02", adminEmail: "riya@homeguru.in", targetUserId: "TCH-2201", targetUserName: "Priya Desai", targetUserEmail: "priya.d@homeguru.in", targetType: "teacher", reason: "Payout not reflecting in dashboard", ticketId: "TKT-4418", startedAt: "Today, 09:15 AM", endedAt: "Today, 09:28 AM", actionsPerformed: 6, blockedActions: ["Modify Bank Details"] },
  { id: "IMP-003", adminId: "ADM-01", adminEmail: "admin@homeguru.in", targetUserId: "STU-7701", targetUserName: "Sneha Patel", targetUserEmail: "sneha.p@outlook.com", targetType: "student", reason: "Refund status investigation", ticketId: "TKT-4415", startedAt: "Today, 08:30 AM", endedAt: "Today, 08:41 AM", actionsPerformed: 3, blockedActions: [] },
  { id: "IMP-004", adminId: "ADM-03", adminEmail: "karan@homeguru.in", targetUserId: "TCH-3301", targetUserName: "Arjun Singh", targetUserEmail: "arjun.s@homeguru.in", targetType: "teacher", reason: "KYC badge not showing after approval", ticketId: "TKT-4410", startedAt: "Yesterday, 04:12 PM", endedAt: "Yesterday, 04:25 PM", actionsPerformed: 2, blockedActions: ["Modify 2FA Settings"] },
  { id: "IMP-005", adminId: "ADM-02", adminEmail: "riya@homeguru.in", targetUserId: "STU-9901", targetUserName: "Carlos Vega", targetUserEmail: "carlos.v@gmail.com", targetType: "student", reason: "Wallet balance discrepancy", ticketId: "TKT-4405", startedAt: "Yesterday, 02:00 PM", endedAt: "Yesterday, 02:18 PM", actionsPerformed: 8, blockedActions: ["Delete Account"] },
];

export const impersonationLogs: ImpersonationLog[] = [
  { id: "IL-001", sessionId: "IMP-001", action: "Viewed booked classes list", timestamp: "10:43 AM", blocked: false },
  { id: "IL-002", sessionId: "IMP-001", action: "Opened class detail CLS-4401", timestamp: "10:44 AM", blocked: false },
  { id: "IL-003", sessionId: "IMP-001", action: "Attempted to modify 2FA settings", timestamp: "10:45 AM", blocked: true, reason: "Destructive action blocked during impersonation" },
  { id: "IL-004", sessionId: "IMP-001", action: "Viewed wallet balance", timestamp: "10:46 AM", blocked: false },
  { id: "IL-005", sessionId: "IMP-001", action: "Viewed transaction history", timestamp: "10:47 AM", blocked: false },
];
