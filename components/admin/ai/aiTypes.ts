// ── Usage Metrics ──
export interface UsageMetric {
  date: string;
  chatbot: number;
  summarization: number;
  quizGen: number;
}

export interface LatencyMetric {
  date: string;
  p95: number;
  errorRate: number;
}

export interface TopConsumer {
  id: string;
  name: string;
  type: "teacher" | "institution";
  tokensUsed: number;
  lmlensJobs: number;
  videoMinutes: number;
  costEstimate: number;
}

// ── API Keys ──
export type KeyStatus = "active" | "revoked" | "rate_limited";

export interface ApiKey {
  id: string;
  keyName: string;
  tenant: string;
  keyHash: string;
  createdAt: string;
  monthlyQuota: number;
  currentUsage: number;
  usagePercent: number;
  status: KeyStatus;
  engine: "osmium_llm" | "lmlens" | "videomeet";
}

export interface ApiKeyDetail {
  dailyUsage: number[];
  topEndpoints: { endpoint: string; calls: number }[];
  lastRotated: string;
  rateLimit: string;
}

// ── Workflow Rules ──
export type WorkflowStatus = "active" | "paused" | "draft";
export type TriggerEvent = "class_ends" | "booking_created" | "churn_signal" | "lead_inbound" | "kyc_submitted" | "payment_received";

export interface WorkflowStep {
  engine: "osmium_videomeet" | "osmium_llm" | "lmlens" | "system";
  action: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: TriggerEvent;
  steps: WorkflowStep[];
  status: WorkflowStatus;
  lastRun: string;
  executionCount: number;
  avgDuration: string;
}

// ── Ethics Controls ──
export interface EthicsSafeguard {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  locked: boolean;
  lockReason?: string;
  category: "financial" | "governance" | "dispute" | "content";
}

export interface RegionalScope {
  region: string;
  code: string;
  facialAnalysis: boolean;
  voiceProfiling: boolean;
  autoModeration: boolean;
  sentimentTracking: boolean;
}

export const TRIGGER_LABELS: Record<TriggerEvent, string> = {
  class_ends: "Class Ends",
  booking_created: "Booking Created",
  churn_signal: "Churn Signal Detected",
  lead_inbound: "New Lead Inbound",
  kyc_submitted: "KYC Submitted",
  payment_received: "Payment Received",
};

export const ENGINE_LABELS: Record<WorkflowStep["engine"], string> = {
  osmium_videomeet: "Osmium VideoMeet",
  osmium_llm: "Osmium LLM",
  lmlens: "LMlens",
  system: "System",
};

export const ENGINE_COLORS: Record<WorkflowStep["engine"], string> = {
  osmium_videomeet: "#06B6D4",
  osmium_llm: "#8B5CF6",
  lmlens: "#06B6D4",
  system: "#1A1A1A",
};
