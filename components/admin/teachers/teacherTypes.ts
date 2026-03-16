export type TeacherStatus = "verified" | "unverified" | "suspended" | "under_review";

export interface Teacher {
  id: string;
  aegisId: string;
  name: string;
  email: string;
  avatar: string;
  subject: string;
  status: TeacherStatus;
  isVerified: boolean;
  avgRating: number;
  totalHours: number;
  hourlyRate: number;
  lifetimeEarnings: number;
  commissionTier: number;
  region: string;
  ratingTrend: number[];
  dateJoined: string;
}

export interface TeacherProfile {
  // KYC & Identity
  bgCheckStatus: "passed" | "pending" | "failed";
  idDocType: string;
  introVideoUrl: string;
  lastLoginIp: string;
  deviceType: string;
  mfaEnabled: boolean;
  // Financials
  payoutMethod: string;
  payoutAccount: string;
  commissionPct: number;
  pendingPayout: number;
  completedSettlements: number;
  activeChargebacks: number;
  recentPayouts: { id: string; amount: number; status: "settled" | "pending" | "chargeback"; date: string }[];
  // Classroom Quality
  attendanceRate: number;
  recentReviews: { student: string; rating: number; text: string; date: string }[];
  osmiumAudit: { score: number; flags: number; summary: string };
  // Content
  publishedCourses: number;
  uploadedModules: number;
  autoGradedQuizzes: number;
}

export interface TeacherKPI {
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: string;
  isCritical?: boolean;
}
