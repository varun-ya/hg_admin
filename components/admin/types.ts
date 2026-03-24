// ─── Platform Health ───
export interface PlatformHealthStatus {
  apiAvailability: number;
  mediaPlane: number;
  rto: string;
  rpo: string;
  status: "healthy" | "degraded" | "critical";
}

// ─── Global Ops Pulse ───
export interface OpsMetric {
  id: string;
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: string;
  sparkline?: number[];
}

// ─── AI & Media Health ───
export interface UsageQuota {
  label: string;
  current: number;
  limit: number;
  unit: string;
  dailyTrend?: number[];
}

export interface AIMediaHealth {
  osmiumLLM: UsageQuota;
  lmlensAPI: UsageQuota;
  videoMeetStatus: "healthy" | "degraded" | "down";
  videoMeetActiveSessions: number;
}

// ─── Financial ───
export interface DailyFinancial {
  date: string;
  revenue: number;
  pendingEscrow: number;
}

export interface FinancialSummary {
  totalRevenue: string;
  pendingEscrow: string;
  dailyData: DailyFinancial[];
}

// ─── Live Classroom ───
export interface LiveSession {
  id: string;
  host: string;
  hostAvatar: string;
  subject: string;
  participants: number;
  duration: string;
  status: "live" | "starting" | "ending";
  region: string;
}

// ─── Governance Queue ───
export interface GovernanceItem {
  id: string;
  type: "flagged_content" | "failed_payment" | "pending_refund";
  title: string;
  description: string;
  severity: "critical" | "high" | "medium";
  timestamp: string;
  requiresApproval: boolean;
}

// ─── Audit Trail ───
export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  category: "auth" | "financial" | "system" | "override" | "kyc";
  ip: string;
  immutable: boolean;
}

// ─── Sidebar Navigation ───
export interface NavItem {
  name: string;
  href: string;
  iconName: string;
  badge?: string;
  badgeColor?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// ─── Notification ───
export interface AdminNotification {
  id: string;
  type: "alert" | "system" | "financial" | "security";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

// ─── Confirmation Modal ───
export interface ConfirmationAction {
  title: string;
  description: string;
  confirmString: string;
  onConfirm: () => void;
  variant: "danger" | "warning";
}
