import type { KPIItem } from "../LiveOpsKPIRibbon";

export interface SubjectNode {
  id: string;
  name: string;
  level: number;
  parentId: string | null;
  tutorCount: number;
  bookings30d: number;
  trending: boolean;
}

export interface FeaturedTutor {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  rating: number;
  totalSessions: number;
  slot: "manual" | "auto";
  reason: string;
  featuredSince: string;
}

export const taxonomyKPIs: KPIItem[] = [
  { label: "Subject Categories", value: "148", change: "+6 this month", changeType: "up", icon: null },
  { label: "Featured Tutors", value: "12", change: "4 auto, 8 manual", changeType: "neutral", icon: null },
  { label: "Trending Subjects", value: "8", change: "Python, Physics top", changeType: "up", icon: null },
];
export const taxonomySparklines = [
  [130, 134, 138, 140, 142, 145, 148],
  [10, 10, 11, 11, 12, 12, 12],
  [5, 6, 6, 7, 7, 8, 8],
];

export const subjectTree: SubjectNode[] = [
  { id: "S-001", name: "Academics", level: 0, parentId: null, tutorCount: 4200, bookings30d: 28400, trending: false },
  { id: "S-002", name: "Mathematics", level: 1, parentId: "S-001", tutorCount: 1200, bookings30d: 8200, trending: false },
  { id: "S-003", name: "Calculus", level: 2, parentId: "S-002", tutorCount: 340, bookings30d: 2100, trending: true },
  { id: "S-004", name: "Algebra", level: 2, parentId: "S-002", tutorCount: 480, bookings30d: 3400, trending: false },
  { id: "S-005", name: "Statistics", level: 2, parentId: "S-002", tutorCount: 220, bookings30d: 1800, trending: false },
  { id: "S-006", name: "Science", level: 1, parentId: "S-001", tutorCount: 980, bookings30d: 6800, trending: false },
  { id: "S-007", name: "Physics", level: 2, parentId: "S-006", tutorCount: 420, bookings30d: 3200, trending: true },
  { id: "S-008", name: "Chemistry", level: 2, parentId: "S-006", tutorCount: 310, bookings30d: 2100, trending: false },
  { id: "S-009", name: "Technology", level: 0, parentId: null, tutorCount: 2800, bookings30d: 18200, trending: true },
  { id: "S-010", name: "Programming", level: 1, parentId: "S-009", tutorCount: 1400, bookings30d: 9800, trending: true },
  { id: "S-011", name: "Python", level: 2, parentId: "S-010", tutorCount: 680, bookings30d: 5200, trending: true },
  { id: "S-012", name: "JavaScript", level: 2, parentId: "S-010", tutorCount: 420, bookings30d: 3100, trending: false },
  { id: "S-013", name: "Languages", level: 0, parentId: null, tutorCount: 1600, bookings30d: 10400, trending: false },
  { id: "S-014", name: "English", level: 1, parentId: "S-013", tutorCount: 620, bookings30d: 4200, trending: false },
  { id: "S-015", name: "French", level: 1, parentId: "S-013", tutorCount: 280, bookings30d: 1800, trending: false },
  { id: "S-016", name: "Japanese", level: 1, parentId: "S-013", tutorCount: 140, bookings30d: 1200, trending: true },
];

export const featuredTutors: FeaturedTutor[] = [
  { id: "FT-001", name: "Priya Mehta", avatar: "https://i.pravatar.cc/150?img=47", subject: "Physics", rating: 4.9, totalSessions: 1240, slot: "auto", reason: "Top rated in Physics, 98% completion rate", featuredSince: "Mar 1" },
  { id: "FT-002", name: "Arjun Singh", avatar: "https://i.pravatar.cc/150?img=12", subject: "Python", rating: 4.8, totalSessions: 980, slot: "manual", reason: "Admin pick — excellent student feedback", featuredSince: "Feb 15" },
  { id: "FT-003", name: "Léa Rousseau", avatar: "https://i.pravatar.cc/150?img=32", subject: "French", rating: 4.9, totalSessions: 620, slot: "auto", reason: "Trending in Languages, 100% show rate", featuredSince: "Mar 5" },
  { id: "FT-004", name: "Sneha Reddy", avatar: "https://i.pravatar.cc/150?img=25", subject: "Calculus", rating: 4.7, totalSessions: 440, slot: "manual", reason: "Admin pick — STEM talent initiative", featuredSince: "Mar 8" },
];
