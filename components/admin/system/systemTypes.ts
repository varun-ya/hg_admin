// ── Audit Logs ──
export type AuditCategory = "auth" | "financial" | "liveops" | "system" | "ai";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  ipAddress: string;
  category: AuditCategory;
  target: string;
  description: string;
  severity: "info" | "warning" | "critical";
}

// ── Feature Flags ──
export type FlagEnvironment = "production" | "staging";
export type FlagStatus = "enabled" | "disabled" | "partial";

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  environment: FlagEnvironment;
  rolloutPercent: number;
  status: FlagStatus;
  targetSegment: string;
  lastModified: string;
  modifiedBy: string;
}

// ── Emergency Controls ──
export interface KillSwitch {
  id: string;
  name: string;
  description: string;
  impact: string;
  active: boolean;
  lastTriggered: string | null;
  triggeredBy: string | null;
}

// ── System Overrides ──
export type OverrideStatus = "idle" | "running" | "completed" | "failed";

export interface SystemOverride {
  id: string;
  name: string;
  description: string;
  command: string;
  dangerLevel: "low" | "medium" | "high" | "critical";
}

export interface OverrideLogEntry {
  id: string;
  overrideName: string;
  executedBy: string;
  executedAt: string;
  status: OverrideStatus;
  duration: string;
}

export const CATEGORY_LABELS: Record<AuditCategory, string> = {
  auth: "Auth",
  financial: "Financial",
  liveops: "LiveOps",
  system: "System",
  ai: "AI",
};
