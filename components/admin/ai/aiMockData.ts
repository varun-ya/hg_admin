import type {
  UsageMetric, LatencyMetric, TopConsumer, ApiKey, ApiKeyDetail,
  WorkflowRule, EthicsSafeguard, RegionalScope,
} from "./aiTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

// ═══════════════════════════════════════════
// Usage Metrics
// ═══════════════════════════════════════════
export const usageKPIs: KPIItem[] = [
  { label: "Osmium LLM Tokens (MTD)", value: "14.2M", change: "68% of 21M quota", changeType: "up", icon: null, pulseColor: "#293763" },
  { label: "LMlens API Calls", value: "8,742", change: "+312 today", changeType: "up", icon: null },
  { label: "VideoMeet Ingestion", value: "4,280 min", change: "+186 min today", changeType: "up", icon: null },
  { label: "Estimated AI Cost", value: "$3,847", usdValue: 3847, change: "Burn rate: $128/day", changeType: "up", icon: null, isCritical: true, pulseColor: "#D4956A" },
];
export const usageSparklines = [
  [9.1, 10.2, 11.0, 11.8, 12.6, 13.4, 14.2],
  [6200, 6800, 7100, 7600, 8000, 8400, 8742],
  [2800, 3100, 3400, 3600, 3800, 4100, 4280],
  [2400, 2700, 2900, 3200, 3400, 3600, 3847],
];

export const dailyTokenBurn: UsageMetric[] = [
  { date: "Mar 6", chatbot: 320000, summarization: 180000, quizGen: 95000 },
  { date: "Mar 7", chatbot: 410000, summarization: 220000, quizGen: 120000 },
  { date: "Mar 8", chatbot: 380000, summarization: 195000, quizGen: 110000 },
  { date: "Mar 9", chatbot: 450000, summarization: 240000, quizGen: 135000 },
  { date: "Mar 10", chatbot: 520000, summarization: 280000, quizGen: 160000 },
  { date: "Mar 11", chatbot: 490000, summarization: 260000, quizGen: 145000 },
  { date: "Mar 12", chatbot: 540000, summarization: 290000, quizGen: 170000 },
];

export const latencyMetrics: LatencyMetric[] = [
  { date: "Mar 6", p95: 420, errorRate: 0.8 },
  { date: "Mar 7", p95: 380, errorRate: 0.5 },
  { date: "Mar 8", p95: 510, errorRate: 1.2 },
  { date: "Mar 9", p95: 350, errorRate: 0.3 },
  { date: "Mar 10", p95: 440, errorRate: 0.9 },
  { date: "Mar 11", p95: 390, errorRate: 0.6 },
  { date: "Mar 12", p95: 360, errorRate: 0.4 },
];

export const topConsumers: TopConsumer[] = [
  { id: "TC-001", name: "Priya Nair", type: "teacher", tokensUsed: 1840000, lmlensJobs: 342, videoMinutes: 620, costEstimate: 482 },
  { id: "TC-002", name: "Delhi Public School", type: "institution", tokensUsed: 3200000, lmlensJobs: 890, videoMinutes: 1240, costEstimate: 1120 },
  { id: "TC-003", name: "Kavya Menon", type: "teacher", tokensUsed: 1420000, lmlensJobs: 280, videoMinutes: 480, costEstimate: 368 },
  { id: "TC-004", name: "Bangalore Academy", type: "institution", tokensUsed: 2100000, lmlensJobs: 560, videoMinutes: 890, costEstimate: 724 },
  { id: "TC-005", name: "Arjun Reddy", type: "teacher", tokensUsed: 980000, lmlensJobs: 190, videoMinutes: 340, costEstimate: 256 },
  { id: "TC-006", name: "Siddharth Rao", type: "teacher", tokensUsed: 860000, lmlensJobs: 165, videoMinutes: 290, costEstimate: 218 },
  { id: "TC-007", name: "Mumbai International", type: "institution", tokensUsed: 1680000, lmlensJobs: 420, videoMinutes: 710, costEstimate: 580 },
  { id: "TC-008", name: "Neha Deshmukh", type: "teacher", tokensUsed: 740000, lmlensJobs: 140, videoMinutes: 260, costEstimate: 192 },
];

// ═══════════════════════════════════════════
// Quotas & API Keys
// ═══════════════════════════════════════════
export const keysKPIs: KPIItem[] = [
  { label: "Active Keys", value: 24, change: "3 near quota", changeType: "neutral", icon: null },
  { label: "Total Quota Allocated", value: "42M tokens", change: "Across all tenants", changeType: "neutral", icon: null },
  { label: "Rate-Limited Keys", value: 2, change: "Throttled this hour", changeType: "up", icon: null, isCritical: true, pulseColor: "#D4956A" },
  { label: "Revoked (30d)", value: 5, change: "Security rotations", changeType: "neutral", icon: null },
];
export const keysSparklines = [
  [20, 21, 22, 22, 23, 24, 24],
  [36, 38, 39, 40, 41, 41, 42],
  [0, 1, 0, 1, 2, 1, 2],
  [2, 3, 3, 4, 4, 5, 5],
];

export const apiKeys: ApiKey[] = [
  { id: "K-001", keyName: "Production — Chatbot", tenant: "HomeGuru Core", keyHash: "sk-osm_••••7f3a", createdAt: "Jan 15, 2024", monthlyQuota: 5000000, currentUsage: 4200000, usagePercent: 84, status: "active", engine: "osmium_llm" },
  { id: "K-002", keyName: "LMlens — Document Parser", tenant: "HomeGuru Core", keyHash: "sk-lml_••••2b8c", createdAt: "Feb 2, 2024", monthlyQuota: 15000, currentUsage: 8742, usagePercent: 58, status: "active", engine: "lmlens" },
  { id: "K-003", keyName: "VideoMeet — Diarization", tenant: "HomeGuru Core", keyHash: "sk-vmm_••••9d1e", createdAt: "Dec 8, 2023", monthlyQuota: 10000, currentUsage: 4280, usagePercent: 43, status: "active", engine: "videomeet" },
  { id: "K-004", keyName: "DPS Integration", tenant: "Delhi Public School", keyHash: "sk-osm_••••4a2f", createdAt: "Mar 1, 2024", monthlyQuota: 3000000, currentUsage: 2880000, usagePercent: 96, status: "rate_limited", engine: "osmium_llm" },
  { id: "K-005", keyName: "Quiz Generation", tenant: "HomeGuru Core", keyHash: "sk-osm_••••8c5d", createdAt: "Feb 20, 2024", monthlyQuota: 2000000, currentUsage: 1240000, usagePercent: 62, status: "active", engine: "osmium_llm" },
  { id: "K-006", keyName: "Bangalore Academy API", tenant: "Bangalore Academy", keyHash: "sk-osm_••••1e7b", createdAt: "Jan 28, 2024", monthlyQuota: 2000000, currentUsage: 1920000, usagePercent: 96, status: "rate_limited", engine: "osmium_llm" },
  { id: "K-007", keyName: "Churn Prediction", tenant: "HomeGuru Core", keyHash: "sk-osm_••••6f9a", createdAt: "Feb 14, 2024", monthlyQuota: 1000000, currentUsage: 420000, usagePercent: 42, status: "active", engine: "osmium_llm" },
  { id: "K-008", keyName: "Legacy Chatbot v1", tenant: "HomeGuru Core", keyHash: "sk-osm_••••3d2c", createdAt: "Oct 5, 2023", monthlyQuota: 500000, currentUsage: 0, usagePercent: 0, status: "revoked", engine: "osmium_llm" },
  { id: "K-009", keyName: "Mumbai Intl — LMlens", tenant: "Mumbai International", keyHash: "sk-lml_••••5a8e", createdAt: "Mar 5, 2024", monthlyQuota: 5000, currentUsage: 2100, usagePercent: 42, status: "active", engine: "lmlens" },
  { id: "K-010", keyName: "Summarization Pipeline", tenant: "HomeGuru Core", keyHash: "sk-osm_••••7b4d", createdAt: "Feb 8, 2024", monthlyQuota: 3000000, currentUsage: 1860000, usagePercent: 62, status: "active", engine: "osmium_llm" },
];

export function getApiKeyDetail(_id: string): ApiKeyDetail {
  return {
    dailyUsage: [120000, 145000, 138000, 162000, 155000, 170000, 148000],
    topEndpoints: [
      { endpoint: "/v1/chat/completions", calls: 42800 },
      { endpoint: "/v1/summarize", calls: 18400 },
      { endpoint: "/v1/quiz/generate", calls: 12600 },
      { endpoint: "/v1/embeddings", calls: 8200 },
    ],
    lastRotated: "Feb 28, 2024",
    rateLimit: "1,200 req/min",
  };
}

// ═══════════════════════════════════════════
// Workflow Rules
// ═══════════════════════════════════════════
export const workflowKPIs: KPIItem[] = [
  { label: "Active Pipelines", value: 6, change: "2 paused", changeType: "neutral", icon: null },
  { label: "Executions (24h)", value: 1247, change: "+18% vs yesterday", changeType: "up", icon: null },
  { label: "Avg Pipeline Duration", value: "4.2s", change: "p95: 8.1s", changeType: "down", icon: null },
  { label: "Failed Runs (24h)", value: 3, change: "99.8% success rate", changeType: "neutral", icon: null },
];
export const workflowSparklines = [
  [5, 5, 6, 6, 6, 6, 6],
  [980, 1020, 1080, 1120, 1160, 1200, 1247],
  [5.1, 4.8, 4.6, 4.5, 4.3, 4.2, 4.2],
  [5, 2, 4, 1, 3, 2, 3],
];

export const workflows: WorkflowRule[] = [
  {
    id: "WF-001", name: "Post-Class Processing", description: "Processes recording, generates transcript, creates quiz, and notifies student after every class ends.",
    trigger: "class_ends",
    steps: [
      { engine: "osmium_videomeet", action: "Process Recording" },
      { engine: "osmium_llm", action: "Generate Transcript & Speaker Diarization" },
      { engine: "osmium_llm", action: "Create Follow-up Quiz" },
      { engine: "system", action: "Send WhatsApp Notification" },
    ],
    status: "active", lastRun: "2 min ago", executionCount: 4820, avgDuration: "3.8s",
  },
  {
    id: "WF-002", name: "Churn Prevention Nudges", description: "Detects churn signals and triggers personalized re-engagement via AI-generated messages.",
    trigger: "churn_signal",
    steps: [
      { engine: "osmium_llm", action: "Analyze Engagement Pattern" },
      { engine: "osmium_llm", action: "Generate Personalized Nudge" },
      { engine: "system", action: "Send Push Notification" },
      { engine: "system", action: "Schedule Follow-up Call" },
    ],
    status: "active", lastRun: "14 min ago", executionCount: 892, avgDuration: "2.1s",
  },
  {
    id: "WF-003", name: "Lead Qualification", description: "Scores inbound leads using AI and routes qualified ones to sales agents.",
    trigger: "lead_inbound",
    steps: [
      { engine: "osmium_llm", action: "Score Lead Intent" },
      { engine: "osmium_llm", action: "Generate Qualification Summary" },
      { engine: "system", action: "Route to Agent Queue" },
    ],
    status: "active", lastRun: "8 min ago", executionCount: 2340, avgDuration: "1.4s",
  },
  {
    id: "WF-004", name: "KYC Document Verification", description: "Extracts and validates identity documents submitted during teacher onboarding.",
    trigger: "kyc_submitted",
    steps: [
      { engine: "lmlens", action: "Extract Document Fields" },
      { engine: "osmium_llm", action: "Cross-Reference & Validate" },
      { engine: "system", action: "Update KYC Status" },
    ],
    status: "active", lastRun: "22 min ago", executionCount: 1560, avgDuration: "5.2s",
  },
  {
    id: "WF-005", name: "Smart Receipt Generation", description: "Generates itemized invoices with tax calculations after payment confirmation.",
    trigger: "payment_received",
    steps: [
      { engine: "osmium_llm", action: "Calculate Tax Components" },
      { engine: "lmlens", action: "Generate PDF Invoice" },
      { engine: "system", action: "Email Receipt to Student" },
    ],
    status: "paused", lastRun: "2 hours ago", executionCount: 6200, avgDuration: "3.1s",
  },
  {
    id: "WF-006", name: "Booking Confirmation Flow", description: "Sends AI-personalized booking confirmations with prep materials.",
    trigger: "booking_created",
    steps: [
      { engine: "osmium_llm", action: "Generate Prep Summary" },
      { engine: "system", action: "Send Confirmation Email" },
      { engine: "system", action: "Create Calendar Event" },
    ],
    status: "active", lastRun: "5 min ago", executionCount: 8400, avgDuration: "1.8s",
  },
  {
    id: "WF-007", name: "Content Quality Scan", description: "Scans uploaded teaching materials for quality and compliance.",
    trigger: "class_ends",
    steps: [
      { engine: "lmlens", action: "Extract Content Metadata" },
      { engine: "osmium_llm", action: "Quality & Compliance Check" },
      { engine: "system", action: "Flag if Below Threshold" },
    ],
    status: "draft", lastRun: "Never", executionCount: 0, avgDuration: "—",
  },
];

// ═══════════════════════════════════════════
// Ethics Controls
// ═══════════════════════════════════════════
export const ethicsKPIs: KPIItem[] = [
  { label: "Safeguards Active", value: "7 / 9", change: "2 locked by policy", changeType: "neutral", icon: null },
  { label: "Policy Violations (30d)", value: 0, change: "Clean record", changeType: "neutral", icon: null },
  { label: "Audit Logs Captured", value: "2.4M", change: "+84K today", changeType: "up", icon: null },
  { label: "Regional Restrictions", value: 4, change: "EU, US, IN, BR", changeType: "neutral", icon: null },
];
export const ethicsSparklines = [
  [7, 7, 7, 7, 7, 7, 7],
  [0, 0, 0, 0, 0, 0, 0],
  [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4],
  [4, 4, 4, 4, 4, 4, 4],
];

export const safeguards: EthicsSafeguard[] = [
  { id: "SG-001", label: "Allow AI to approve refunds < $50?", description: "Enables Osmium to auto-approve low-value refund requests without human review.", enabled: false, locked: true, lockReason: "No autonomous decision-making for payments — Board Policy §4.2", category: "financial" },
  { id: "SG-002", label: "Allow AI to auto-suspend users?", description: "Permits Osmium to suspend accounts based on behavioral analysis without admin confirmation.", enabled: false, locked: true, lockReason: "No autonomous account governance — Board Policy §4.3", category: "governance" },
  { id: "SG-003", label: "Allow AI to resolve basic disputes?", description: "Enables Osmium to auto-resolve disputes where system logs clearly indicate fault.", enabled: false, locked: true, lockReason: "No autonomous dispute resolution — Board Policy §4.4", category: "dispute" },
  { id: "SG-004", label: "AI-generated content watermarking", description: "Adds invisible watermarks to all AI-generated quizzes, summaries, and materials.", enabled: true, locked: false, category: "content" },
  { id: "SG-005", label: "Prompt injection detection", description: "Scans all user inputs for prompt injection attempts before forwarding to Osmium LLM.", enabled: true, locked: false, category: "content" },
  { id: "SG-006", label: "PII redaction in AI logs", description: "Automatically strips personally identifiable information from all stored AI interaction logs.", enabled: true, locked: false, category: "content" },
  { id: "SG-007", label: "Bias detection on AI outputs", description: "Runs a secondary model to flag potentially biased or discriminatory AI responses.", enabled: true, locked: false, category: "content" },
  { id: "SG-008", label: "Rate-limit student AI interactions", description: "Caps the number of AI chatbot interactions per student per day to prevent abuse.", enabled: true, locked: false, category: "governance" },
  { id: "SG-009", label: "Teacher AI usage transparency", description: "Shows students when AI-generated content is being used in their learning materials.", enabled: true, locked: false, category: "content" },
];

export const regionalScopes: RegionalScope[] = [
  { region: "European Union", code: "EU", facialAnalysis: false, voiceProfiling: false, autoModeration: true, sentimentTracking: false },
  { region: "United States", code: "US", facialAnalysis: true, voiceProfiling: true, autoModeration: true, sentimentTracking: true },
  { region: "India", code: "IN", facialAnalysis: true, voiceProfiling: true, autoModeration: true, sentimentTracking: true },
  { region: "Brazil", code: "BR", facialAnalysis: false, voiceProfiling: true, autoModeration: true, sentimentTracking: false },
  { region: "United Kingdom", code: "UK", facialAnalysis: false, voiceProfiling: false, autoModeration: true, sentimentTracking: true },
  { region: "Singapore", code: "SG", facialAnalysis: true, voiceProfiling: true, autoModeration: true, sentimentTracking: true },
];
