import type { LiveSession, SessionProfile } from "./classTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

export const classKPIs: KPIItem[] = [
  { label: "Active Classes", value: 847, change: "Peak today: 1,204", changeType: "neutral", icon: null, isCritical: false, pulseColor: "#22C55E" },
  { label: "Media Plane Health", value: "Stable", change: "99.97% uptime (30d)", changeType: "up", icon: null },
  { label: "Network Warnings", value: 12, change: "+3 vs last hour", changeType: "up", icon: null, isCritical: true, pulseColor: "#E08A3C" },
  { label: "Auto-Terminated", value: 4, change: "Today total", changeType: "neutral", icon: null },
];

export const classSparklines: number[][] = [
  [620, 780, 910, 1204, 980, 870, 847],
  [99.9, 99.95, 99.97, 99.92, 99.98, 99.95, 99.97],
  [5, 8, 6, 10, 9, 14, 12],
  [1, 0, 2, 1, 3, 2, 4],
];

export const liveSessions: LiveSession[] = [
  { id: "LS-001", sessionId: "SES-8842A", teacher: "Priya Sharma", student: "Aarav Gupta", subject: "JEE Physics", region: "Mumbai", startedAt: "10:02 AM", durationMin: 42, health: "green", healthHistory: [95, 97, 96, 98, 97, 99, 98], latencyMs: 45, packetLoss: 0.1 },
  { id: "LS-002", sessionId: "SES-8843B", teacher: "Rohan Mehta", student: "Ananya Patel", subject: "IELTS Speaking", region: "Delhi", startedAt: "10:15 AM", durationMin: 29, health: "green", healthHistory: [92, 94, 93, 95, 96, 94, 95], latencyMs: 62, packetLoss: 0.3 },
  { id: "LS-003", sessionId: "SES-8844C", teacher: "Kavya Nair", student: "Vikram Singh", subject: "Piano Grade 5", region: "Bangalore", startedAt: "09:45 AM", durationMin: 59, health: "yellow", healthHistory: [88, 82, 75, 70, 68, 72, 65], latencyMs: 380, packetLoss: 2.1 },
  { id: "LS-004", sessionId: "SES-8845D", teacher: "Arjun Reddy", student: "Meera Joshi", subject: "NEET Biology", region: "Hyderabad", startedAt: "10:30 AM", durationMin: 14, health: "green", healthHistory: [96, 97, 98, 97, 99, 98, 97], latencyMs: 38, packetLoss: 0.0 },
  { id: "LS-005", sessionId: "SES-8846E", teacher: "Siddharth Rao", student: "Ishita Kapoor", subject: "Spoken English", region: "Chennai", startedAt: "09:30 AM", durationMin: 74, health: "red", healthHistory: [90, 72, 55, 40, 35, 28, 22], latencyMs: 820, packetLoss: 8.4 },
  { id: "LS-006", sessionId: "SES-8847F", teacher: "Neha Deshmukh", student: "Aditya Verma", subject: "CAT Quant", region: "Pune", startedAt: "10:45 AM", durationMin: 8, health: "green", healthHistory: [97, 98, 96, 97, 98, 99, 98], latencyMs: 42, packetLoss: 0.1 },
  { id: "LS-007", sessionId: "SES-8848G", teacher: "Brienne Joshi", student: "Robb Sharma", subject: "Guitar Basics", region: "Kolkata", startedAt: "10:00 AM", durationMin: 44, health: "yellow", healthHistory: [85, 80, 78, 74, 70, 68, 66], latencyMs: 510, packetLoss: 3.2 },
  { id: "LS-008", sessionId: "SES-8849H", teacher: "Tyrion Bhat", student: "Catelyn Verma", subject: "Python DSA", region: "Mumbai", startedAt: "11:00 AM", durationMin: 3, health: "green", healthHistory: [99, 98, 99, 98, 99, 99, 98], latencyMs: 28, packetLoss: 0.0 },
  { id: "LS-009", sessionId: "SES-8850I", teacher: "Daenerys Rao", student: "Jaime Reddy", subject: "Vedic Math", region: "Delhi", startedAt: "09:15 AM", durationMin: 89, health: "yellow", healthHistory: [94, 88, 82, 76, 72, 68, 64], latencyMs: 440, packetLoss: 2.8 },
  { id: "LS-010", sessionId: "SES-8851J", teacher: "Cersei Mehta", student: "Bran Nair", subject: "Hindustani Vocal", region: "Jaipur", startedAt: "10:20 AM", durationMin: 24, health: "green", healthHistory: [96, 97, 95, 96, 98, 97, 96], latencyMs: 55, packetLoss: 0.2 },
];

export function getSessionProfile(_id: string): SessionProfile {
  return {
    teacherBitrate: [2400, 2350, 2300, 2280, 2320, 2350, 2380, 2400, 2360, 2340],
    studentBitrate: [1800, 1750, 1720, 1680, 1700, 1740, 1760, 1780, 1750, 1730],
    teacherPacketLoss: [0.1, 0.2, 0.1, 0.3, 0.2, 0.1, 0.2, 0.1, 0.3, 0.2],
    studentPacketLoss: [0.3, 0.5, 0.8, 1.2, 0.9, 0.6, 0.4, 0.5, 0.7, 0.6],
    chatMessages: [
      { sender: "teacher", text: "Let's start with Newton's Third Law today.", time: "10:03 AM" },
      { sender: "student", text: "Sure! I had a doubt from last class about friction.", time: "10:04 AM" },
      { sender: "teacher", text: "Great, let me share a diagram.", time: "10:05 AM" },
      { sender: "system", text: "File shared: friction_diagram.pdf", time: "10:05 AM" },
      { sender: "student", text: "Got it, thanks!", time: "10:06 AM" },
    ],
    filesShared: [
      { name: "friction_diagram.pdf", type: "PDF", size: "1.2 MB" },
      { name: "newton_laws_notes.pdf", type: "PDF", size: "840 KB" },
    ],
  };
}
