import type { KycApplicant, KycProfile, KycKPI } from "./kycTypes";

export const kycKPIs: KycKPI[] = [
  { label: "Pending Reviews", value: 89, change: "+14 today", changeType: "up", icon: "Queue" },
  { label: "SLA Breaches (> 48h)", value: 7, change: "3 critical", changeType: "neutral", icon: "Clock", isCritical: true },
  { label: "LMlens Confidence", value: "92.4%", change: "+1.2% vs yesterday", changeType: "up", icon: "Eye" },
  { label: "Approval Rate (7d)", value: "78%", change: "-2% vs last week", changeType: "down", icon: "CheckCircle" },
];

export const kycApplicants: KycApplicant[] = [
  { id: "KYC-001", aegisId: "AEG-K8X2A", name: "Rahul Verma", email: "rahul.v@email.com", avatar: "https://i.pravatar.cc/150?img=52", subject: "JEE Mathematics", status: "new", submittedAt: "2026-03-12 06:30", timeInQueue: "3 hours", hoursInQueue: 3, lmlensFlag: "clear", lmlensConfidence: 97, aegisRisk: "safe", lockedBy: null },
  { id: "KYC-002", aegisId: "AEG-K3M1B", name: "Sneha Kulkarni", email: "sneha.k@email.com", avatar: "https://i.pravatar.cc/150?img=44", subject: "IELTS Writing", status: "new", submittedAt: "2026-03-12 04:15", timeInQueue: "5 hours", hoursInQueue: 5, lmlensFlag: "clear", lmlensConfidence: 94, aegisRisk: "safe", lockedBy: null },
  { id: "KYC-003", aegisId: "AEG-K9R8C", name: "Dmitri Volkov", email: "dmitri.v@email.com", avatar: "https://i.pravatar.cc/150?img=15", subject: "Piano Theory", status: "new", submittedAt: "2026-03-11 18:00", timeInQueue: "15 hours", hoursInQueue: 15, lmlensFlag: "mismatch", lmlensConfidence: 62, aegisRisk: "vpn_detected", lockedBy: null },
  { id: "KYC-004", aegisId: "AEG-K5K7D", name: "Anita Deshmukh", email: "anita.d@email.com", avatar: "https://i.pravatar.cc/150?img=26", subject: "Graphic Design", status: "resubmitted", submittedAt: "2026-03-11 14:00", timeInQueue: "19 hours", hoursInQueue: 19, lmlensFlag: "clear", lmlensConfidence: 91, aegisRisk: "safe", lockedBy: null },
  { id: "KYC-005", aegisId: "AEG-K1T3E", name: "James Okafor", email: "james.o@email.com", avatar: "https://i.pravatar.cc/150?img=60", subject: "SAT English", status: "new", submittedAt: "2026-03-11 02:00", timeInQueue: "1 day", hoursInQueue: 31, lmlensFlag: "blurry_id", lmlensConfidence: 38, aegisRisk: "safe", lockedBy: null },
  { id: "KYC-006", aegisId: "AEG-K8W5F", name: "Priya Nair", email: "priya.n@email.com", avatar: "https://i.pravatar.cc/150?img=43", subject: "NEET Biology", status: "new", submittedAt: "2026-03-10 08:00", timeInQueue: "2 days", hoursInQueue: 49, lmlensFlag: "clear", lmlensConfidence: 96, aegisRisk: "safe", lockedBy: null },
  { id: "KYC-007", aegisId: "AEG-K2D9G", name: "Carlos Mendez", email: "carlos.m@email.com", avatar: "https://i.pravatar.cc/150?img=11", subject: "Spanish B2", status: "resubmitted", submittedAt: "2026-03-10 02:00", timeInQueue: "2 days", hoursInQueue: 55, lmlensFlag: "mismatch", lmlensConfidence: 58, aegisRisk: "ip_mismatch", lockedBy: null },
  { id: "KYC-008", aegisId: "AEG-K6F2H", name: "Yuki Tanaka", email: "yuki.t@email.com", avatar: "https://i.pravatar.cc/150?img=45", subject: "Japanese N2", status: "new", submittedAt: "2026-03-12 07:00", timeInQueue: "2 hours", hoursInQueue: 2, lmlensFlag: "clear", lmlensConfidence: 99, aegisRisk: "safe", lockedBy: null },
  { id: "KYC-009", aegisId: "AEG-K4H6I", name: "Fatima Al-Rashid", email: "fatima.r@email.com", avatar: "https://i.pravatar.cc/150?img=32", subject: "Arabic Literature", status: "new", submittedAt: "2026-03-09 20:00", timeInQueue: "3 days", hoursInQueue: 61, lmlensFlag: "clear", lmlensConfidence: 88, aegisRisk: "safe", lockedBy: null },
];

export function getKycProfile(_id: string): KycProfile {
  return {
    introVideoUrl: "https://cdn.homeguru.com/kyc/intro-preview.mp4",
    bio: "Experienced mathematics educator with 8+ years of teaching JEE Advanced and Mains. Former faculty at Allen Career Institute, Kota. Specialized in Calculus, Coordinate Geometry, and Algebra. Published 3 problem sets adopted by coaching centers across Rajasthan.",
    osmiumAnalysis: {
      languageMatch: true,
      flaggedPhrases: [],
      proficiencyLevel: "Native / C2",
    },
    document: {
      claimedName: "Rahul Verma",
      extractedName: "Rahul Kumar Verma",
      nameMatch: true,
      claimedDob: "15/08/1992",
      extractedDob: "15/08/1992",
      dobMatch: true,
      docType: "Aadhaar Card",
      docExpiry: "N/A (Lifetime)",
      docExpiryValid: true,
      docNumber: "XXXX-XXXX-4821",
      ipCountry: "India",
      docCountry: "India",
      ipMatch: true,
    },
  };
}
