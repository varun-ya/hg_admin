import type {
  AuditLogEntry, FeatureFlag, KillSwitch, SystemOverride, OverrideLogEntry,
} from "./systemTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

// ═══════════════════════════════════════════
// Audit Logs
// ═══════════════════════════════════════════
export const auditKPIs: KPIItem[] = [
  { label: "Events Logged (24h)", value: "48,291", change: "+2.4K vs yesterday", changeType: "up", icon: null },
  { label: "Failed Auth Attempts", value: "127", change: "14 unique IPs", changeType: "up", icon: null, isCritical: true, pulseColor: "#C2571A" },
  { label: "High-Privilege Actions", value: "34", change: "3 Super Admins active", changeType: "neutral", icon: null },
];
export const auditSparklines = [
  [38000, 40200, 42100, 44300, 45800, 47100, 48291],
  [82, 95, 88, 104, 112, 118, 127],
  [28, 30, 32, 29, 31, 33, 34],
];

export const auditLogs: AuditLogEntry[] = [
  { id: "AL-001", timestamp: "2024-03-12 10:42:18.304", actor: "admin@homeguruworld.com", ipAddress: "103.21.58.14", category: "financial", target: "RFD-7705", description: "High-value refund approved (1/2) — $5,800 to Rohan Mehta", severity: "critical" },
  { id: "AL-002", timestamp: "2024-03-12 10:38:02.112", actor: "system@osmium.ai", ipAddress: "10.0.1.42", category: "ai", target: "sk-osm_••••4a2f", description: "API key rate-limited — DPS Integration exceeded 1,200 req/min", severity: "warning" },
  { id: "AL-003", timestamp: "2024-03-12 10:35:44.891", actor: "karan@homeguruworld.com", ipAddress: "49.36.112.88", category: "auth", target: "AEG-1099", description: "Aegis MFA challenge passed — Super Admin login", severity: "info" },
  { id: "AL-004", timestamp: "2024-03-12 10:31:15.667", actor: "riya@homeguruworld.com", ipAddress: "103.21.58.14", category: "financial", target: "P-006", description: "Payout hold initiated — $2,100 to Ravi Kumar frozen for T&S review", severity: "warning" },
  { id: "AL-005", timestamp: "2024-03-12 10:28:33.445", actor: "system@lmlens.ai", ipAddress: "10.0.2.18", category: "ai", target: "KYC-4421", description: "LMlens OCR extraction failed — damaged Aadhaar card image", severity: "warning" },
  { id: "AL-006", timestamp: "2024-03-12 10:24:09.223", actor: "admin@homeguruworld.com", ipAddress: "103.21.58.14", category: "system", target: "FLAG-osmium_auto_summaries", description: "Feature flag updated — osmium_auto_summaries rollout increased to 75%", severity: "info" },
  { id: "AL-007", timestamp: "2024-03-12 10:19:51.001", actor: "unknown", ipAddress: "185.220.101.34", category: "auth", target: "admin@homeguruworld.com", description: "Failed login attempt — invalid TOTP code (attempt 3/5)", severity: "critical" },
  { id: "AL-008", timestamp: "2024-03-12 10:15:28.778", actor: "system@aegis.auth", ipAddress: "10.0.1.10", category: "auth", target: "SESSION-88421", description: "Aegis token revocation — expired session for teacher AEG-1034", severity: "info" },
  { id: "AL-009", timestamp: "2024-03-12 10:12:04.556", actor: "admin@homeguruworld.com", ipAddress: "103.21.58.14", category: "ai", target: "sk-osm_••••3d2c", description: "API key revoked — Legacy Chatbot v1 permanently disabled", severity: "critical" },
  { id: "AL-010", timestamp: "2024-03-12 10:08:42.334", actor: "system@osmium.ai", ipAddress: "10.0.1.42", category: "ai", target: "WF-001", description: "Post-Class Processing pipeline executed — 3.8s, transcript + quiz generated", severity: "info" },
  { id: "AL-011", timestamp: "2024-03-12 10:04:19.112", actor: "riya@homeguruworld.com", ipAddress: "103.21.58.14", category: "liveops", target: "CLS-4401", description: "Class session terminated — admin override, student complaint", severity: "warning" },
  { id: "AL-012", timestamp: "2024-03-12 09:58:55.890", actor: "system@razorpay", ipAddress: "52.66.48.12", category: "financial", target: "TXN-88406", description: "Payment gateway callback — PayPal transaction failed, retry queued", severity: "warning" },
  { id: "AL-013", timestamp: "2024-03-12 09:54:31.668", actor: "karan@homeguruworld.com", ipAddress: "49.36.112.88", category: "financial", target: "RFD-7703", description: "High-value refund approved (1/2) — $3,600 to Meera Joshi", severity: "critical" },
  { id: "AL-014", timestamp: "2024-03-12 09:50:08.446", actor: "system@aegis.auth", ipAddress: "10.0.1.10", category: "auth", target: "USR-28841", description: "Account locked — 5 consecutive failed login attempts from student", severity: "warning" },
  { id: "AL-015", timestamp: "2024-03-12 09:45:44.224", actor: "admin@homeguruworld.com", ipAddress: "103.21.58.14", category: "system", target: "CACHE-teacher-rankings", description: "Redis cache invalidated — teacher search rankings refreshed", severity: "info" },
  { id: "AL-016", timestamp: "2024-03-12 09:41:20.002", actor: "system@osmium.ai", ipAddress: "10.0.1.42", category: "ai", target: "THROTTLE-global", description: "Osmium LLM throttle engaged — token burn rate exceeded 80% of daily budget", severity: "warning" },
];

// ═══════════════════════════════════════════
// Feature Flags
// ═══════════════════════════════════════════
export const flagKPIs: KPIItem[] = [
  { label: "Active Flags", value: "12", change: "3 in A/B test", changeType: "neutral", icon: null },
  { label: "Staging Only", value: "5", change: "Pending promotion", changeType: "neutral", icon: null },
  { label: "Last Deployment", value: "14m ago", change: "By admin@homeguruworld.com", changeType: "neutral", icon: null },
];
export const flagSparklines = [
  [10, 10, 11, 11, 12, 12, 12],
  [3, 4, 4, 5, 5, 5, 5],
  [1, 1, 1, 1, 1, 1, 1],
];

export const featureFlags: FeatureFlag[] = [
  { id: "FF-001", name: "osmium_auto_summaries", description: "AI-generated class summaries sent to students post-session", environment: "production", rolloutPercent: 75, status: "partial", targetSegment: "All Users", lastModified: "Today, 10:24 AM", modifiedBy: "admin@homeguruworld.com" },
  { id: "FF-002", name: "razorpay_global_routing", description: "Route international payments through Razorpay Global instead of Stripe", environment: "production", rolloutPercent: 100, status: "enabled", targetSegment: "All Users", lastModified: "Mar 10, 4:00 PM", modifiedBy: "karan@homeguruworld.com" },
  { id: "FF-003", name: "lmlens_strict_ocr", description: "Enforce strict OCR validation on KYC documents with 95% confidence threshold", environment: "production", rolloutPercent: 100, status: "enabled", targetSegment: "All Teachers", lastModified: "Mar 8, 2:15 PM", modifiedBy: "admin@homeguruworld.com" },
  { id: "FF-004", name: "videomeet_noise_cancel", description: "AI-powered background noise cancellation in Osmium VideoMeet", environment: "production", rolloutPercent: 50, status: "partial", targetSegment: "Teachers in India", lastModified: "Mar 9, 11:00 AM", modifiedBy: "riya@homeguruworld.com" },
  { id: "FF-005", name: "churn_prediction_v2", description: "Next-gen churn prediction model with 30-day lookahead", environment: "staging", rolloutPercent: 100, status: "enabled", targetSegment: "Internal QA", lastModified: "Mar 11, 3:30 PM", modifiedBy: "admin@homeguruworld.com" },
  { id: "FF-006", name: "smart_scheduling", description: "AI-optimized class scheduling based on student availability patterns", environment: "staging", rolloutPercent: 25, status: "partial", targetSegment: "Beta Teachers", lastModified: "Mar 7, 9:45 AM", modifiedBy: "karan@homeguruworld.com" },
  { id: "FF-007", name: "parent_dashboard", description: "Dedicated parent view with child progress tracking", environment: "staging", rolloutPercent: 0, status: "disabled", targetSegment: "None", lastModified: "Mar 6, 5:00 PM", modifiedBy: "riya@homeguruworld.com" },
  { id: "FF-008", name: "instant_payouts", description: "Real-time teacher payouts via UPI instead of batch settlement", environment: "production", rolloutPercent: 10, status: "partial", targetSegment: "Top 50 Teachers", lastModified: "Mar 11, 1:00 PM", modifiedBy: "admin@homeguruworld.com" },
  { id: "FF-009", name: "ai_quiz_difficulty", description: "Adaptive quiz difficulty based on student performance history", environment: "production", rolloutPercent: 100, status: "enabled", targetSegment: "All Students", lastModified: "Mar 5, 10:30 AM", modifiedBy: "admin@homeguruworld.com" },
  { id: "FF-010", name: "whatsapp_bot_v3", description: "Third-generation WhatsApp chatbot with Osmium LLM integration", environment: "staging", rolloutPercent: 100, status: "enabled", targetSegment: "Internal QA", lastModified: "Mar 10, 8:00 AM", modifiedBy: "karan@homeguruworld.com" },
];

// ═══════════════════════════════════════════
// Emergency Controls
// ═══════════════════════════════════════════
export const emergencyKPIs: KPIItem[] = [
  { label: "Active Kill Switches", value: "0 / 4", change: "All systems nominal", changeType: "neutral", icon: null },
  { label: "Last Emergency", value: "47d ago", change: "Payout halt — fraud detection", changeType: "neutral", icon: null },
  { label: "Incident Response SLA", value: "< 2 min", change: "Current avg: 48s", changeType: "down", icon: null },
];
export const emergencySparklines = [
  [0, 0, 0, 0, 0, 0, 0],
  [47, 47, 47, 47, 47, 47, 47],
  [52, 50, 49, 48, 48, 48, 48],
];

export const killSwitches: KillSwitch[] = [
  { id: "KS-001", name: "Pause All New Bookings", description: "Stops the entire checkout flow. No new class bookings can be created. Existing scheduled classes continue.", impact: "All students, all regions. Revenue generation halted.", active: false, lastTriggered: null, triggeredBy: null },
  { id: "KS-002", name: "Halt Outbound Payouts", description: "Freezes the Escrow-to-Bank settlement pipeline. No teacher payouts will be dispatched until re-enabled.", impact: "All teachers. Funds remain in escrow. Trust impact: HIGH.", active: false, lastTriggered: "Jan 24, 2024 — 03:42 AM", triggeredBy: "admin@homeguruworld.com" },
  { id: "KS-003", name: "Disable Media Ingestion", description: "Shuts down Osmium VideoMeet recording and processing. Live classes continue but are not recorded.", impact: "All classes. No recordings, transcripts, or AI summaries generated.", active: false, lastTriggered: null, triggeredBy: null },
  { id: "KS-004", name: "Platform Maintenance Mode", description: "Forces all non-admin users to a maintenance screen. Admin panel remains accessible.", impact: "TOTAL PLATFORM SHUTDOWN for end users. Nuclear option.", active: false, lastTriggered: "Dec 15, 2023 — 02:00 AM", triggeredBy: "karan@homeguruworld.com" },
];

// ═══════════════════════════════════════════
// System Overrides
// ═══════════════════════════════════════════
export const overrideKPIs: KPIItem[] = [
  { label: "Overrides (24h)", value: "3", change: "All successful", changeType: "neutral", icon: null },
  { label: "Pending Manual Actions", value: "1", change: "KYC bypass queued", changeType: "neutral", icon: null },
  { label: "System Health", value: "99.97%", change: "Uptime (30d)", changeType: "up", icon: null },
];
export const overrideSparklines = [
  [2, 1, 3, 2, 4, 2, 3],
  [0, 1, 0, 2, 1, 0, 1],
  [99.95, 99.96, 99.97, 99.96, 99.97, 99.97, 99.97],
];

export const systemOverrides: SystemOverride[] = [
  { id: "SO-001", name: "Force DB Sync", description: "Manually trigger a ClickHouse event ingestion sync from the primary Postgres database.", command: "FORCE-DB-SYNC", dangerLevel: "low" },
  { id: "SO-002", name: "Invalidate Global Cache", description: "Clear the entire Redis cache including teacher search rankings, session tokens, and rate-limit counters.", command: "INVALIDATE-CACHE", dangerLevel: "medium" },
  { id: "SO-003", name: "Manual KYC Bypass", description: "Force-approve a teacher whose KYC is failing the LMlens OCR check due to a damaged or low-quality ID document.", command: "KYC-BYPASS", dangerLevel: "high" },
  { id: "SO-004", name: "Wipe Aegis Sessions", description: "Force logout EVERY user on the platform immediately. All active sessions are invalidated.", command: "WIPE-ALL-SESSIONS", dangerLevel: "critical" },
];

export const overrideLogs: OverrideLogEntry[] = [
  { id: "OL-001", overrideName: "Force DB Sync", executedBy: "admin@homeguruworld.com", executedAt: "Today, 09:45 AM", status: "completed", duration: "2.4s" },
  { id: "OL-002", overrideName: "Invalidate Global Cache", executedBy: "karan@homeguruworld.com", executedAt: "Today, 08:12 AM", status: "completed", duration: "0.8s" },
  { id: "OL-003", overrideName: "Manual KYC Bypass", executedBy: "riya@homeguruworld.com", executedAt: "Yesterday, 06:30 PM", status: "completed", duration: "1.1s" },
  { id: "OL-004", overrideName: "Force DB Sync", executedBy: "admin@homeguruworld.com", executedAt: "Yesterday, 02:15 PM", status: "completed", duration: "3.2s" },
  { id: "OL-005", overrideName: "Wipe Aegis Sessions", executedBy: "admin@homeguruworld.com", executedAt: "Mar 10, 11:00 PM", status: "completed", duration: "0.3s" },
];
