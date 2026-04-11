import type { KPIItem } from "../LiveOpsKPIRibbon";

export type ChurnRisk = "critical" | "high" | "medium" | "low";

export interface AtRiskUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: "student" | "teacher";
  engagementScore: number;
  lastActive: string;
  riskLevel: ChurnRisk;
  riskFactors: string[];
  nudgeSent: boolean;
  nudgeChannel: string | null;
}

export interface SentimentFlag {
  id: string;
  userName: string;
  userType: "student" | "teacher";
  rating: number;
  reviewSnippet: string;
  sentiment: "negative" | "mixed";
  flaggedAt: string;
  resolved: boolean;
}

export const churnKPIs: KPIItem[] = [
  { label: "At-Risk Users", value: "142", change: "+18 this week", changeType: "up", icon: null, isCritical: true, pulseColor: "#E08A3C" },
  { label: "Avg. Engagement Score", value: "72%", change: "−3% vs last week", changeType: "down", icon: null },
  { label: "Nudges Sent (7d)", value: "89", change: "WhatsApp: 64, Email: 25", changeType: "neutral", icon: null },
  { label: "Recovered Users", value: "34", change: "24% recovery rate", changeType: "up", icon: null },
];
export const churnSparklines = [
  [110, 115, 120, 125, 130, 138, 142],
  [78, 77, 76, 75, 74, 73, 72],
  [45, 52, 60, 68, 75, 82, 89],
  [20, 22, 24, 26, 28, 31, 34],
];

export const atRiskUsers: AtRiskUser[] = [
  { id: "STU-8801", name: "Aarav Sharma", email: "aarav.s@gmail.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=aarav.s@gmail.com", type: "student", engagementScore: 32, lastActive: "5 days ago", riskLevel: "critical", riskFactors: ["No classes in 14 days", "Whiteboard usage dropped 90%", "Skipped 3 scheduled sessions"], nudgeSent: true, nudgeChannel: "WhatsApp" },
  { id: "STU-7702", name: "Meera Joshi", email: "meera.j@outlook.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=meera.j@outlook.com", type: "student", engagementScore: 45, lastActive: "3 days ago", riskLevel: "high", riskFactors: ["Chat frequency dropped 70%", "Negative review submitted"], nudgeSent: true, nudgeChannel: "WhatsApp" },
  { id: "TCH-3302", name: "Ravi Kumar", email: "ravi.k@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=ravi.k@homeguruworld.com", type: "teacher", engagementScore: 51, lastActive: "2 days ago", riskLevel: "high", riskFactors: ["Booking rate dropped 60%", "Response time increased 3x"], nudgeSent: false, nudgeChannel: null },
  { id: "STU-9903", name: "Priya Nair", email: "priya.n@gmail.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=priya.n@gmail.com", type: "student", engagementScore: 58, lastActive: "1 day ago", riskLevel: "medium", riskFactors: ["Session duration declining", "Feedback scores dropping"], nudgeSent: false, nudgeChannel: null },
  { id: "TCH-4401", name: "Sneha Reddy", email: "sneha.r@homeguruworld.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=sneha.r@homeguruworld.com", type: "teacher", engagementScore: 62, lastActive: "Today", riskLevel: "medium", riskFactors: ["Fewer slots opened this week"], nudgeSent: false, nudgeChannel: null },
  { id: "STU-6604", name: "Carlos Vega", email: "carlos.v@gmail.com", avatar: "https://api.dicebear.com/9.x/glass/svg?seed=carlos.v@gmail.com", type: "student", engagementScore: 68, lastActive: "Today", riskLevel: "low", riskFactors: ["Slight dip in quiz completion"], nudgeSent: false, nudgeChannel: null },
];

export const sentimentFlags: SentimentFlag[] = [
  { id: "SF-001", userName: "Meera Joshi", userType: "student", rating: 2, reviewSnippet: "Teacher was unprepared and kept checking phone during session. Very disappointing.", sentiment: "negative", flaggedAt: "2h ago", resolved: false },
  { id: "SF-002", userName: "Rohan Mehta", userType: "student", rating: 2, reviewSnippet: "Audio quality was terrible. Could barely hear the teacher. Waste of money.", sentiment: "negative", flaggedAt: "4h ago", resolved: false },
  { id: "SF-003", userName: "Anita Desai", userType: "student", rating: 3, reviewSnippet: "Content was okay but the session felt rushed. Expected more depth.", sentiment: "mixed", flaggedAt: "6h ago", resolved: true },
  { id: "SF-004", userName: "Ravi Kumar", userType: "teacher", rating: 2, reviewSnippet: "Student was disruptive and platform did nothing. Support is non-existent.", sentiment: "negative", flaggedAt: "8h ago", resolved: false },
  { id: "SF-005", userName: "Léa Rousseau", userType: "student", rating: 3, reviewSnippet: "Good teacher but scheduling system is confusing. Almost missed my class.", sentiment: "mixed", flaggedAt: "12h ago", resolved: true },
];
