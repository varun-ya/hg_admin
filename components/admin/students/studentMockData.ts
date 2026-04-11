import type { Student, StudentProfile, StudentKPI } from "./studentTypes";

export const studentKPIs: StudentKPI[] = [
  { label: "Active Learners (30d)", value: "12,847", change: "+342 vs last month", changeType: "up", icon: "Student" },
  { label: "Churn Risk (AI Flagged)", value: 284, change: "18 critical", changeType: "neutral", icon: "Warning" },
  { label: "Open Support Tickets", value: 47, change: "+6 today", changeType: "up", icon: "Ticket", isCritical: true },
  { label: "Platform Avg. LTV", value: "$2,840", change: "+$120 vs Q3", changeType: "up", icon: "CurrencyDollar" },
];

export const students: Student[] = [
  { id: "S-001", aegisId: "AEG-7X92K", name: "Aarav Sharma", email: "aarav.sharma@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=aarav.sharma@homeguruworld.com", status: "active", totalClasses: 142, totalHours: 284, lifetimeSpend: 4820, riskScore: "low", dateJoined: "2024-08-12" },
  { id: "S-002", aegisId: "AEG-3M41P", name: "Priya Patel", email: "priya.p@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=priya.p@homeguruworld.com", status: "active", totalClasses: 89, totalHours: 178, lifetimeSpend: 3240, riskScore: "medium", dateJoined: "2024-11-03" },
  { id: "S-003", aegisId: "AEG-9R28L", name: "Rohan Gupta", email: "rohan.g@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=rohan.g@homeguruworld.com", status: "suspended", totalClasses: 34, totalHours: 68, lifetimeSpend: 1120, riskScore: "high", dateJoined: "2025-01-18" },
  { id: "S-004", aegisId: "AEG-5K67N", name: "Ananya Reddy", email: "ananya.r@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=ananya.r@homeguruworld.com", status: "active", totalClasses: 210, totalHours: 420, lifetimeSpend: 7650, riskScore: "low", dateJoined: "2024-03-22" },
  { id: "S-005", aegisId: "AEG-1T83Q", name: "Vikram Singh", email: "vikram.s@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=vikram.s@homeguruworld.com", status: "inactive", totalClasses: 12, totalHours: 24, lifetimeSpend: 480, riskScore: "high", dateJoined: "2025-02-01" },
  { id: "S-006", aegisId: "AEG-8W15R", name: "Meera Joshi", email: "meera.j@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=meera.j@homeguruworld.com", status: "active", totalClasses: 67, totalHours: 134, lifetimeSpend: 2890, riskScore: "low", dateJoined: "2024-09-14" },
  { id: "S-007", aegisId: "AEG-2D49S", name: "Arjun Nair", email: "arjun.n@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=arjun.n@homeguruworld.com", status: "pending_deletion", totalClasses: 5, totalHours: 10, lifetimeSpend: 200, riskScore: "medium", dateJoined: "2025-03-01" },
  { id: "S-008", aegisId: "AEG-6F72T", name: "Kavya Menon", email: "kavya.m@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=kavya.m@homeguruworld.com", status: "active", totalClasses: 156, totalHours: 312, lifetimeSpend: 5430, riskScore: "low", dateJoined: "2024-06-08" },
  { id: "S-009", aegisId: "AEG-4H36U", name: "Siddharth Rao", email: "sid.rao@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=sid.rao@homeguruworld.com", status: "active", totalClasses: 98, totalHours: 196, lifetimeSpend: 3670, riskScore: "medium", dateJoined: "2024-10-20" },
  { id: "S-010", aegisId: "AEG-0J58V", name: "Ishita Kapoor", email: "ishita.k@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=ishita.k@homeguruworld.com", status: "inactive", totalClasses: 28, totalHours: 56, lifetimeSpend: 920, riskScore: "high", dateJoined: "2025-01-05" },
  { id: "S-011", aegisId: "AEG-7L94W", name: "Aditya Verma", email: "aditya.v@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=aditya.v@homeguruworld.com", status: "active", totalClasses: 183, totalHours: 366, lifetimeSpend: 6210, riskScore: "low", dateJoined: "2024-04-15" },
  { id: "S-012", aegisId: "AEG-3N21X", name: "Neha Deshmukh", email: "neha.d@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=neha.d@homeguruworld.com", status: "active", totalClasses: 74, totalHours: 148, lifetimeSpend: 2540, riskScore: "low", dateJoined: "2024-12-01" },
];

export function getStudentProfile(_id: string): StudentProfile {
  return {
    lastLoginIp: "103.21.xx.xx",
    deviceType: "Chrome / macOS",
    connectedAccounts: ["Google", "Apple"],
    mfaEnabled: true,
    escrowBalance: 340,
    totalRefunded: 120,
    recentTransactions: [
      { id: "TXN-88421", amount: 1200, status: "success", date: "2026-03-10" },
      { id: "TXN-88390", amount: 800, status: "success", date: "2026-03-05" },
      { id: "TXN-88312", amount: 400, status: "pending", date: "2026-03-01" },
      { id: "TXN-88201", amount: 200, status: "failed", date: "2026-02-22" },
    ],
    activePackages: [
      { name: "10 Hours — Advanced React", hoursLeft: 4.5 },
      { name: "5 Hours — IELTS Speaking", hoursLeft: 2 },
    ],
    missedClasses: 3,
    avgFeedbackGiven: 4.2,
    contentFlags: 0,
    chatFlags: 1,
  };
}
