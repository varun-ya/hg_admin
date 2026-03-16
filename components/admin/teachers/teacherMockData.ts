import type { Teacher, TeacherProfile, TeacherKPI } from "./teacherTypes";

export const teacherKPIs: TeacherKPI[] = [
  { label: "Active Verified Tutors (30d)", value: "3,842", change: "+86 vs last month", changeType: "up", icon: "ChalkboardTeacher" },
  { label: "Pending KYC & Verification", value: 89, change: "12 urgent", changeType: "neutral", icon: "IdentificationBadge", isCritical: true },
  { label: "Platform Avg. Rating", value: "4.82", change: "+0.03 vs Q3", changeType: "up", icon: "Star" },
  { label: "Pending Escrow Liabilities", value: "$2.4M", change: "+$124K today", changeType: "up", icon: "Vault" },
];

export const teachers: Teacher[] = [
  { id: "T-001", aegisId: "AEG-T8X2K", name: "Cersei Lannister", email: "cersei.l@email.com", avatar: "https://i.pravatar.cc/150?img=47", subject: "Advanced React", status: "verified", isVerified: true, avgRating: 4.94, totalHours: 1842, hourlyRate: 85, lifetimeEarnings: 156570, commissionTier: 12, region: "IN", ratingTrend: [4.9, 4.88, 4.91, 4.93, 4.92, 4.95, 4.94], dateJoined: "2023-06-15" },
  { id: "T-002", aegisId: "AEG-T3M1P", name: "Jon Snow", email: "jon.snow@email.com", avatar: "https://i.pravatar.cc/150?img=12", subject: "Calculus II", status: "verified", isVerified: true, avgRating: 4.87, totalHours: 1204, hourlyRate: 70, lifetimeEarnings: 84280, commissionTier: 15, region: "US", ratingTrend: [4.82, 4.85, 4.84, 4.86, 4.88, 4.87, 4.87], dateJoined: "2023-09-20" },
  { id: "T-003", aegisId: "AEG-T9R8L", name: "Arya Stark", email: "arya.s@email.com", avatar: "https://i.pravatar.cc/150?img=32", subject: "IELTS Speaking", status: "verified", isVerified: true, avgRating: 4.76, totalHours: 890, hourlyRate: 60, lifetimeEarnings: 53400, commissionTier: 15, region: "UK", ratingTrend: [4.8, 4.78, 4.75, 4.73, 4.74, 4.76, 4.76], dateJoined: "2024-01-10" },
  { id: "T-004", aegisId: "AEG-T5K7N", name: "Aarav Mehta", email: "aarav.m@email.com", avatar: "https://i.pravatar.cc/150?img=11", subject: "JEE Physics", status: "under_review", isVerified: false, avgRating: 4.91, totalHours: 2340, hourlyRate: 90, lifetimeEarnings: 210600, commissionTier: 10, region: "IN", ratingTrend: [4.88, 4.89, 4.9, 4.91, 4.9, 4.92, 4.91], dateJoined: "2023-03-05" },
  { id: "T-005", aegisId: "AEG-T1T3Q", name: "Priya Desai", email: "priya.d@email.com", avatar: "https://i.pravatar.cc/150?img=25", subject: "Data Science", status: "verified", isVerified: true, avgRating: 4.68, totalHours: 560, hourlyRate: 75, lifetimeEarnings: 42000, commissionTier: 15, region: "IN", ratingTrend: [4.72, 4.7, 4.69, 4.67, 4.66, 4.68, 4.68], dateJoined: "2024-05-18" },
  { id: "T-006", aegisId: "AEG-T8W5R", name: "Ravi Kumar", email: "ravi.k@email.com", avatar: "https://i.pravatar.cc/150?img=53", subject: "Machine Learning", status: "suspended", isVerified: false, avgRating: 3.42, totalHours: 180, hourlyRate: 65, lifetimeEarnings: 11700, commissionTier: 18, region: "IN", ratingTrend: [3.8, 3.7, 3.6, 3.5, 3.45, 3.4, 3.42], dateJoined: "2024-08-22" },
  { id: "T-007", aegisId: "AEG-T2D9S", name: "Sarah Chen", email: "sarah.c@email.com", avatar: "https://i.pravatar.cc/150?img=44", subject: "Mandarin HSK", status: "verified", isVerified: true, avgRating: 4.89, totalHours: 1560, hourlyRate: 80, lifetimeEarnings: 124800, commissionTier: 12, region: "SG", ratingTrend: [4.85, 4.86, 4.87, 4.88, 4.89, 4.88, 4.89], dateJoined: "2023-07-30" },
  { id: "T-008", aegisId: "AEG-T6F2T", name: "Dmitri Volkov", email: "dmitri.v@email.com", avatar: "https://i.pravatar.cc/150?img=15", subject: "Piano Theory", status: "unverified", isVerified: false, avgRating: 0, totalHours: 0, hourlyRate: 55, lifetimeEarnings: 0, commissionTier: 18, region: "DE", ratingTrend: [0, 0, 0, 0, 0, 0, 0], dateJoined: "2025-03-01" },
  { id: "T-009", aegisId: "AEG-T4H6U", name: "Neha Iyer", email: "neha.i@email.com", avatar: "https://i.pravatar.cc/150?img=43", subject: "NEET Biology", status: "verified", isVerified: true, avgRating: 4.83, totalHours: 1120, hourlyRate: 72, lifetimeEarnings: 80640, commissionTier: 15, region: "IN", ratingTrend: [4.79, 4.8, 4.81, 4.82, 4.83, 4.84, 4.83], dateJoined: "2023-11-12" },
  { id: "T-010", aegisId: "AEG-T0J8V", name: "Marcus Johnson", email: "marcus.j@email.com", avatar: "https://i.pravatar.cc/150?img=60", subject: "SAT Prep", status: "verified", isVerified: true, avgRating: 4.71, totalHours: 740, hourlyRate: 95, lifetimeEarnings: 70300, commissionTier: 12, region: "US", ratingTrend: [4.68, 4.69, 4.7, 4.72, 4.71, 4.7, 4.71], dateJoined: "2024-02-28" },
  { id: "T-011", aegisId: "AEG-T7L4W", name: "Anita Deshmukh", email: "anita.d@email.com", avatar: "https://i.pravatar.cc/150?img=26", subject: "Graphic Design", status: "under_review", isVerified: false, avgRating: 4.55, totalHours: 320, hourlyRate: 50, lifetimeEarnings: 16000, commissionTier: 18, region: "IN", ratingTrend: [4.5, 4.52, 4.53, 4.54, 4.55, 4.56, 4.55], dateJoined: "2024-10-05" },
  { id: "T-012", aegisId: "AEG-T3N1X", name: "Yuki Tanaka", email: "yuki.t@email.com", avatar: "https://i.pravatar.cc/150?img=45", subject: "Japanese N2", status: "verified", isVerified: true, avgRating: 4.96, totalHours: 2100, hourlyRate: 88, lifetimeEarnings: 184800, commissionTier: 10, region: "JP", ratingTrend: [4.93, 4.94, 4.95, 4.95, 4.96, 4.96, 4.96], dateJoined: "2023-04-18" },
];

export function getTeacherProfile(_id: string): TeacherProfile {
  return {
    bgCheckStatus: "passed",
    idDocType: "Aadhaar + PAN (LMlens verified)",
    introVideoUrl: "https://cdn.homeguru.com/intro/T-001.mp4",
    lastLoginIp: "103.21.xx.xx",
    deviceType: "Chrome / macOS",
    mfaEnabled: true,
    payoutMethod: "Razorpay Route",
    payoutAccount: "HDFC ••••4821",
    commissionPct: 12,
    pendingPayout: 4280,
    completedSettlements: 148200,
    activeChargebacks: 0,
    recentPayouts: [
      { id: "PAY-44210", amount: 8400, status: "settled", date: "2026-03-10" },
      { id: "PAY-44180", amount: 6200, status: "settled", date: "2026-03-03" },
      { id: "PAY-44150", amount: 4800, status: "pending", date: "2026-02-25" },
      { id: "PAY-44090", amount: 1200, status: "chargeback", date: "2026-02-18" },
    ],
    attendanceRate: 97.2,
    recentReviews: [
      { student: "Aarav S.", rating: 5, text: "Incredibly clear explanations. Best React teacher on the platform.", date: "2026-03-11" },
      { student: "Priya P.", rating: 5, text: "Very patient and thorough. Highly recommend.", date: "2026-03-08" },
      { student: "Rohan G.", rating: 4, text: "Good session but ran 5 minutes over time.", date: "2026-03-04" },
    ],
    osmiumAudit: { score: 94, flags: 1, summary: "High-quality instruction. 1 minor flag: session LS-412 exceeded scheduled duration by 8 minutes." },
    publishedCourses: 3,
    uploadedModules: 24,
    autoGradedQuizzes: 12,
  };
}
