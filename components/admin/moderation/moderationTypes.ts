export type AssetType = "pdf" | "image" | "transcript";
export type FlagSeverity = "critical" | "medium" | "low";
export type FlagStatus = "pending" | "approved" | "deleted" | "escalated";

export interface FlaggedItem {
  id: string;
  flagId: string;
  assetType: AssetType;
  userName: string;
  userRole: "student" | "teacher";
  severity: FlagSeverity;
  reason: string;
  lmlensConfidence: number;
  flaggedAt: string;
  status: FlagStatus;
}

export interface FlagProfile {
  assetPreview: string; // description of the flagged content
  highlightedText: string;
  lmlensReason: string;
  lmlensConfidence: number;
  platformRule: string;
  ruleSection: string;
  context: string;
}
