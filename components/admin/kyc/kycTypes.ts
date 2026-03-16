export type KycStatus = "new" | "resubmitted" | "in_review" | "waiting_on_user";
export type LmlensFlag = "clear" | "mismatch" | "blurry_id";
export type AegisRisk = "safe" | "vpn_detected" | "ip_mismatch";

export interface KycApplicant {
  id: string;
  aegisId: string;
  name: string;
  email: string;
  avatar: string;
  subject: string;
  status: KycStatus;
  submittedAt: string;
  timeInQueue: string;
  hoursInQueue: number;
  lmlensFlag: LmlensFlag;
  lmlensConfidence: number;
  aegisRisk: AegisRisk;
  lockedBy: string | null;
}

export interface KycDocument {
  claimedName: string;
  extractedName: string;
  nameMatch: boolean;
  claimedDob: string;
  extractedDob: string;
  dobMatch: boolean;
  docType: string;
  docExpiry: string;
  docExpiryValid: boolean;
  docNumber: string;
  ipCountry: string;
  docCountry: string;
  ipMatch: boolean;
}

export interface KycProfile {
  introVideoUrl: string;
  bio: string;
  osmiumAnalysis: { languageMatch: boolean; flaggedPhrases: string[]; proficiencyLevel: string };
  document: KycDocument;
}

export interface KycKPI {
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: string;
  isCritical?: boolean;
}
