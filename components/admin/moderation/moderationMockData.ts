import type { FlaggedItem, FlagProfile } from "./moderationTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

export const moderationKPIs: KPIItem[] = [
  { label: "Pending Manual Reviews", value: 38, change: "+7 today", changeType: "up", icon: null, isCritical: true, pulseColor: "#E08A3C" },
  { label: "LMlens Auto-Blocks (24h)", value: 142, change: "99.1% confidence avg", changeType: "neutral", icon: null },
  { label: "Avg Review Time", value: "1.4h", change: "Target: < 2h", changeType: "up", icon: null },
  { label: "Escalations", value: 5, change: "+2 vs yesterday", changeType: "up", icon: null },
];

export const moderationSparklines: number[][] = [
  [22, 28, 31, 35, 30, 34, 38],
  [98, 110, 125, 134, 128, 138, 142],
  [2.1, 1.8, 1.6, 1.5, 1.7, 1.3, 1.4],
  [2, 3, 1, 4, 3, 2, 5],
];

export const flaggedItems: FlaggedItem[] = [
  { id: "FL-001", flagId: "FLG-8821", assetType: "pdf", userName: "Rohan Gupta", userRole: "student", severity: "critical", reason: "PII Detected", lmlensConfidence: 97, flaggedAt: "12 min ago", status: "pending" },
  { id: "FL-002", flagId: "FLG-8822", assetType: "transcript", userName: "Kavya Nair", userRole: "teacher", severity: "medium", reason: "Inappropriate Language", lmlensConfidence: 84, flaggedAt: "28 min ago", status: "pending" },
  { id: "FL-003", flagId: "FLG-8823", assetType: "image", userName: "Vikram Singh", userRole: "student", severity: "critical", reason: "Explicit Content", lmlensConfidence: 99, flaggedAt: "45 min ago", status: "pending" },
  { id: "FL-004", flagId: "FLG-8824", assetType: "pdf", userName: "Priya Patel", userRole: "teacher", severity: "low", reason: "Copyright Material", lmlensConfidence: 72, flaggedAt: "1h ago", status: "pending" },
  { id: "FL-005", flagId: "FLG-8825", assetType: "transcript", userName: "Arjun Reddy", userRole: "teacher", severity: "medium", reason: "Off-Platform Contact", lmlensConfidence: 88, flaggedAt: "1.5h ago", status: "pending" },
  { id: "FL-006", flagId: "FLG-8826", assetType: "pdf", userName: "Meera Joshi", userRole: "student", severity: "low", reason: "Spam / Irrelevant", lmlensConfidence: 65, flaggedAt: "2h ago", status: "pending" },
  { id: "FL-007", flagId: "FLG-8827", assetType: "image", userName: "Siddharth Rao", userRole: "student", severity: "medium", reason: "PII Detected", lmlensConfidence: 91, flaggedAt: "2.5h ago", status: "pending" },
  { id: "FL-008", flagId: "FLG-8828", assetType: "transcript", userName: "Ishita Kapoor", userRole: "student", severity: "critical", reason: "Harassment", lmlensConfidence: 96, flaggedAt: "3h ago", status: "pending" },
];

export function getFlagProfile(_id: string): FlagProfile {
  return {
    assetPreview: "The uploaded PDF contains a scanned document with visible Aadhaar number and personal address in paragraph 3, lines 12-15.",
    highlightedText: "\"My Aadhaar number is XXXX-XXXX-4821 and I live at 42 MG Road, Sector 14, Gurgaon 122001\"",
    lmlensReason: "PII Detection — Government ID number and residential address found in user-uploaded document. Confidence: 97%. Bounding box coordinates: [x:120, y:340, w:480, h:60].",
    lmlensConfidence: 97,
    platformRule: "Section 4.2 — Prohibition of PII in Shared Materials",
    ruleSection: "Users must not share government-issued identification numbers, residential addresses, or financial account details in any uploaded materials, chat messages, or session recordings.",
    context: "This file was shared during a live session between Student Rohan Gupta and Teacher Priya Sharma on March 10, 2026 at 10:05 AM IST.",
  };
}
