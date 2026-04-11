import type { Tenant, BulkInvite, CreditAllocation } from "./tenantTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

export const tenantKPIs: KPIItem[] = [
  { label: "Active Tenants", value: "24", change: "+3 this month", changeType: "up", icon: null },
  { label: "Total B2B Students", value: "4,218", change: "68% active", changeType: "up", icon: null },
  { label: "Credits Distributed", value: "$128K", change: "$42K remaining", changeType: "neutral", icon: null },
  { label: "Pending Onboarding", value: "2", change: "CSV uploads queued", changeType: "neutral", icon: null },
];
export const tenantSparklines = [
  [18, 19, 20, 21, 22, 23, 24],
  [3200, 3400, 3600, 3800, 3900, 4100, 4218],
  [80, 90, 95, 105, 110, 120, 128],
  [0, 1, 3, 1, 2, 0, 2],
];

export const tenants: Tenant[] = [
  { id: "TN-001", name: "Delhi Public School (Vasant Kunj)", type: "school", status: "active", subAdmins: 3, totalStudents: 840, activeStudents: 612, creditsAllocated: 25000, creditsUsed: 18200, onboardedVia: "scim", createdAt: "Jan 15, 2024" },
  { id: "TN-002", name: "Infosys Learning Academy", type: "corporation", status: "active", subAdmins: 5, totalStudents: 1200, activeStudents: 890, creditsAllocated: 50000, creditsUsed: 32400, onboardedVia: "csv", createdAt: "Feb 1, 2024" },
  { id: "TN-003", name: "IIT Bombay — Continuing Ed", type: "university", status: "active", subAdmins: 2, totalStudents: 420, activeStudents: 380, creditsAllocated: 15000, creditsUsed: 11800, onboardedVia: "scim", createdAt: "Dec 10, 2023" },
  { id: "TN-004", name: "Ryan International Group", type: "school", status: "trial", subAdmins: 1, totalStudents: 150, activeStudents: 88, creditsAllocated: 5000, creditsUsed: 1200, onboardedVia: "manual", createdAt: "Mar 5, 2024" },
  { id: "TN-005", name: "Wipro Talent Next", type: "corporation", status: "active", subAdmins: 4, totalStudents: 680, activeStudents: 520, creditsAllocated: 30000, creditsUsed: 22100, onboardedVia: "csv", createdAt: "Nov 20, 2023" },
  { id: "TN-006", name: "Amity University Online", type: "university", status: "suspended", subAdmins: 2, totalStudents: 320, activeStudents: 0, creditsAllocated: 10000, creditsUsed: 8400, onboardedVia: "scim", createdAt: "Oct 1, 2023" },
];

export const bulkInvites: BulkInvite[] = [
  { id: "BI-001", tenantId: "TN-002", tenantName: "Infosys Learning Academy", method: "csv", totalUsers: 200, successCount: 198, failedCount: 2, status: "completed", initiatedBy: "admin@homeguruworld.com", initiatedAt: "Today, 09:30 AM" },
  { id: "BI-002", tenantId: "TN-004", tenantName: "Ryan International Group", method: "csv", totalUsers: 150, successCount: 142, failedCount: 8, status: "completed", initiatedBy: "riya@homeguruworld.com", initiatedAt: "Yesterday, 03:15 PM" },
  { id: "BI-003", tenantId: "TN-001", tenantName: "Delhi Public School", method: "scim", totalUsers: 50, successCount: 50, failedCount: 0, status: "completed", initiatedBy: "system@scim", initiatedAt: "Yesterday, 12:00 AM" },
];

export const creditAllocations: CreditAllocation[] = [
  { id: "CA-001", tenantId: "TN-002", tenantName: "Infosys Learning Academy", department: "Engineering", totalCredits: 20000, usedCredits: 14200, allocatedBy: "admin@homeguruworld.com", allocatedAt: "Mar 1, 2024" },
  { id: "CA-002", tenantId: "TN-002", tenantName: "Infosys Learning Academy", department: "Design", totalCredits: 10000, usedCredits: 6800, allocatedBy: "admin@homeguruworld.com", allocatedAt: "Mar 1, 2024" },
  { id: "CA-003", tenantId: "TN-001", tenantName: "Delhi Public School", department: "Grade 10", totalCredits: 12000, usedCredits: 9400, allocatedBy: "riya@homeguruworld.com", allocatedAt: "Jan 20, 2024" },
  { id: "CA-004", tenantId: "TN-001", tenantName: "Delhi Public School", department: "Grade 12", totalCredits: 13000, usedCredits: 8800, allocatedBy: "riya@homeguruworld.com", allocatedAt: "Jan 20, 2024" },
  { id: "CA-005", tenantId: "TN-005", tenantName: "Wipro Talent Next", department: "Cloud Division", totalCredits: 15000, usedCredits: 11200, allocatedBy: "karan@homeguruworld.com", allocatedAt: "Feb 15, 2024" },
];
