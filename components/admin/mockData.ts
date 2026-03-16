import type {
  PlatformHealthStatus,
  OpsMetric,
  AIMediaHealth,
  FinancialSummary,
  LiveSession,
  GovernanceItem,
  AuditEvent,
  AdminNotification,
} from "./types";

export const platformHealth: PlatformHealthStatus = {
  apiAvailability: 99.97,
  mediaPlane: 99.95,
  rto: "< 4 min",
  rpo: "< 1 min",
  status: "healthy",
};

export const opsMetrics: OpsMetric[] = [
  { id: "live-classes", label: "Active Live Classes", value: 342, change: "+18 vs last hour", changeType: "up", icon: "VideoCamera" },
  { id: "escrow", label: "Escrow Balance Held", value: "$2.4M", change: "+$124K today", changeType: "up", icon: "Vault" },
  { id: "kyc", label: "Pending KYC Approvals", value: 89, change: "12 urgent", changeType: "neutral", icon: "IdentificationBadge" },
  { id: "disputes", label: "Unresolved Disputes", value: 23, change: "-4 vs yesterday", changeType: "down", icon: "Scales" },
];

export const aiMediaHealth: AIMediaHealth = {
  osmiumLLM: { label: "Osmium LLM Tokens", current: 14_200_000, limit: 20_000_000, unit: "tokens" },
  lmlensAPI: { label: "LMlens Extraction API", current: 8_740, limit: 15_000, unit: "calls" },
  videoMeetStatus: "healthy",
  videoMeetActiveSessions: 342,
};

export const financialSummary: FinancialSummary = {
  totalRevenue: "$847,230",
  pendingEscrow: "$2,412,800",
  dailyData: [
    { date: "Mar 1", revenue: 28400, pendingEscrow: 82000 },
    { date: "Mar 3", revenue: 31200, pendingEscrow: 78500 },
    { date: "Mar 5", revenue: 27800, pendingEscrow: 91200 },
    { date: "Mar 7", revenue: 35600, pendingEscrow: 85400 },
    { date: "Mar 9", revenue: 42100, pendingEscrow: 79800 },
    { date: "Mar 11", revenue: 38900, pendingEscrow: 94600 },
    { date: "Mar 13", revenue: 44200, pendingEscrow: 88300 },
  ],
};

export const liveSessions: LiveSession[] = [
  { id: "LS-001", host: "Cersei Lannister", hostAvatar: "https://i.pravatar.cc/150?img=47", subject: "Advanced React", participants: 1, duration: "47m", status: "live", region: "IN" },
  { id: "LS-002", host: "Jon Snow", hostAvatar: "https://i.pravatar.cc/150?img=12", subject: "Calculus II", participants: 1, duration: "1h 12m", status: "live", region: "US" },
  { id: "LS-003", host: "Arya Stark", hostAvatar: "https://i.pravatar.cc/150?img=32", subject: "IELTS Speaking", participants: 1, duration: "23m", status: "live", region: "UK" },
  { id: "LS-004", host: "Aarav Mehta", hostAvatar: "https://i.pravatar.cc/150?img=11", subject: "JEE Physics", participants: 1, duration: "5m", status: "starting", region: "IN" },
  { id: "LS-005", host: "Priya Desai", hostAvatar: "https://i.pravatar.cc/150?img=25", subject: "Data Science", participants: 1, duration: "1h 58m", status: "ending", region: "IN" },
];

export const governanceQueue: GovernanceItem[] = [
  { id: "GV-001", type: "flagged_content", title: "Inappropriate file upload", description: "LMlens flagged a document in session LS-412", severity: "critical", timestamp: "2 min ago", requiresApproval: false },
  { id: "GV-002", type: "pending_refund", title: "High-value refund: $1,240", description: "Student #8842 — requires 2nd approval", severity: "high", timestamp: "18 min ago", requiresApproval: true },
  { id: "GV-003", type: "failed_payment", title: "Razorpay webhook failure", description: "3 transactions stuck in pending state", severity: "high", timestamp: "34 min ago", requiresApproval: false },
  { id: "GV-004", type: "flagged_content", title: "Transcript policy violation", description: "Session LS-389 transcript flagged by AI", severity: "medium", timestamp: "1h ago", requiresApproval: false },
  { id: "GV-005", type: "pending_refund", title: "Refund request: $680", description: "Teacher no-show — auto-escalated", severity: "high", timestamp: "2h ago", requiresApproval: true },
];

export const auditTrail: AuditEvent[] = [
  { id: "AE-001", timestamp: "2026-03-12 09:42:18", actor: "admin@homeguru.com", action: "Approved KYC", target: "Teacher #4421", category: "kyc", ip: "103.21.xx.xx", immutable: true },
  { id: "AE-002", timestamp: "2026-03-12 09:38:05", actor: "superadmin@homeguru.com", action: "Rotated API Key", target: "Osmium Prod Key", category: "system", ip: "52.66.xx.xx", immutable: true },
  { id: "AE-003", timestamp: "2026-03-12 09:31:44", actor: "finance@homeguru.com", action: "Initiated Batch Payout", target: "$48,200 — 34 teachers", category: "financial", ip: "103.21.xx.xx", immutable: true },
  { id: "AE-004", timestamp: "2026-03-12 09:22:10", actor: "superadmin@homeguru.com", action: "Force Terminated Session", target: "LS-388", category: "override", ip: "52.66.xx.xx", immutable: true },
  { id: "AE-005", timestamp: "2026-03-12 09:15:33", actor: "admin@homeguru.com", action: "Suspended Account", target: "Teacher #2201", category: "auth", ip: "103.21.xx.xx", immutable: true },
  { id: "AE-006", timestamp: "2026-03-12 09:02:01", actor: "system", action: "Auto-escalated Dispute", target: "Dispute #D-1192", category: "system", ip: "internal", immutable: true },
  { id: "AE-007", timestamp: "2026-03-12 08:55:19", actor: "superadmin@homeguru.com", action: "Approved Refund ($1,240)", target: "Student #8842", category: "financial", ip: "52.66.xx.xx", immutable: true },
  { id: "AE-008", timestamp: "2026-03-12 08:41:07", actor: "admin@homeguru.com", action: "Toggled Feature Flag", target: "ai_quiz_generation: ON", category: "system", ip: "103.21.xx.xx", immutable: true },
  { id: "AE-009", timestamp: "2026-03-12 08:30:00", actor: "system", action: "Scheduled Backup Complete", target: "PostgreSQL — Full Snapshot", category: "system", ip: "internal", immutable: true },
  { id: "AE-010", timestamp: "2026-03-12 08:12:44", actor: "superadmin@homeguru.com", action: "Login (MFA Verified)", target: "Aegis Auth Gateway", category: "auth", ip: "52.66.xx.xx", immutable: true },
];

export const adminNotifications: AdminNotification[] = [
  { id: "N-001", type: "security", title: "Unusual login pattern", message: "Admin login from new IP 185.xx.xx.xx", time: "5 min ago", isRead: false },
  { id: "N-002", type: "financial", title: "Batch payout completed", message: "34 teachers settled — $48,200 total", time: "22 min ago", isRead: false },
  { id: "N-003", type: "alert", title: "LMlens flagged content", message: "2 files quarantined in last hour", time: "1h ago", isRead: true },
  { id: "N-004", type: "system", title: "Scheduled maintenance", message: "ClickHouse cluster upgrade at 2 AM UTC", time: "3h ago", isRead: true },
];
