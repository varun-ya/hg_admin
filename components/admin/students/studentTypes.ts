export type StudentStatus = "active" | "inactive" | "suspended" | "pending_deletion";
export type RiskLevel = "low" | "medium" | "high";

export interface Student {
  id: string;
  aegisId: string;
  name: string;
  email: string;
  avatar: string;
  status: StudentStatus;
  totalClasses: number;
  totalHours: number;
  lifetimeSpend: number;
  riskScore: RiskLevel;
  dateJoined: string;
}

export interface StudentProfile {
  // Identity & Security
  lastLoginIp: string;
  deviceType: string;
  connectedAccounts: string[];
  mfaEnabled: boolean;
  // Wallet & Transactions
  escrowBalance: number;
  totalRefunded: number;
  recentTransactions: { id: string; amount: number; status: "success" | "failed" | "pending"; date: string }[];
  // Learning
  activePackages: { name: string; hoursLeft: number }[];
  missedClasses: number;
  avgFeedbackGiven: number;
  // Governance
  contentFlags: number;
  chatFlags: number;
}

export interface StudentKPI {
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: string;
  isCritical?: boolean;
}
