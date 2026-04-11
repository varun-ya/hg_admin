import type { LiveSession, SessionProfile, PastClass } from "./classTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

export const classKPIs: KPIItem[] = [
  { label: "Active Classes", value: 847, change: "Peak today: 1,204", changeType: "neutral", icon: null, isCritical: false, pulseColor: "#E08A3C" },
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
  // ── Live Classes ──
  { id: "LS-001", sessionId: "SES-8842A", teacher: "Priya Sharma", student: "Aarav Gupta", subject: "JEE Physics", region: "Mumbai", startedAt: "10:02 AM", durationMin: 42, health: "green", healthHistory: [95, 97, 96, 98, 97, 99, 98], latencyMs: 45, packetLoss: 0.1, classType: "live" },
  { id: "LS-002", sessionId: "SES-8843B", teacher: "Rohan Mehta", student: "Ananya Patel", subject: "IELTS Speaking", region: "Delhi", startedAt: "10:15 AM", durationMin: 29, health: "green", healthHistory: [92, 94, 93, 95, 96, 94, 95], latencyMs: 62, packetLoss: 0.3, classType: "live" },
  { id: "LS-003", sessionId: "SES-8844C", teacher: "Kavya Nair", student: "Vikram Singh", subject: "Piano Grade 5", region: "Bangalore", startedAt: "09:45 AM", durationMin: 59, health: "yellow", healthHistory: [88, 82, 75, 70, 68, 72, 65], latencyMs: 380, packetLoss: 2.1, classType: "live" },
  { id: "LS-004", sessionId: "SES-8845D", teacher: "Arjun Reddy", student: "Meera Joshi", subject: "NEET Biology", region: "Hyderabad", startedAt: "10:30 AM", durationMin: 14, health: "green", healthHistory: [96, 97, 98, 97, 99, 98, 97], latencyMs: 38, packetLoss: 0.0, classType: "live" },
  { id: "LS-005", sessionId: "SES-8846E", teacher: "Siddharth Rao", student: "Ishita Kapoor", subject: "Spoken English", region: "Chennai", startedAt: "09:30 AM", durationMin: 74, health: "red", healthHistory: [90, 72, 55, 40, 35, 28, 22], latencyMs: 820, packetLoss: 8.4, classType: "live" },
  { id: "LS-006", sessionId: "SES-8847F", teacher: "Neha Deshmukh", student: "Aditya Verma", subject: "CAT Quant", region: "Pune", startedAt: "10:45 AM", durationMin: 8, health: "green", healthHistory: [97, 98, 96, 97, 98, 99, 98], latencyMs: 42, packetLoss: 0.1, classType: "live" },
  { id: "LS-007", sessionId: "SES-8848G", teacher: "Brienne Joshi", student: "Robb Sharma", subject: "Guitar Basics", region: "Kolkata", startedAt: "10:00 AM", durationMin: 44, health: "yellow", healthHistory: [85, 80, 78, 74, 70, 68, 66], latencyMs: 510, packetLoss: 3.2, classType: "live" },
  { id: "LS-008", sessionId: "SES-8849H", teacher: "Tyrion Bhat", student: "Catelyn Verma", subject: "Python DSA", region: "Mumbai", startedAt: "11:00 AM", durationMin: 3, health: "green", healthHistory: [99, 98, 99, 98, 99, 99, 98], latencyMs: 28, packetLoss: 0.0, classType: "live" },
  { id: "LS-009", sessionId: "SES-8850I", teacher: "Daenerys Rao", student: "Jaime Reddy", subject: "Vedic Math", region: "Delhi", startedAt: "09:15 AM", durationMin: 89, health: "yellow", healthHistory: [94, 88, 82, 76, 72, 68, 64], latencyMs: 440, packetLoss: 2.8, classType: "live" },
  { id: "LS-010", sessionId: "SES-8851J", teacher: "Cersei Mehta", student: "Bran Nair", subject: "Hindustani Vocal", region: "Jaipur", startedAt: "10:20 AM", durationMin: 24, health: "green", healthHistory: [96, 97, 95, 96, 98, 97, 96], latencyMs: 55, packetLoss: 0.2, classType: "live" },
  // ── Demo Classes ──
  { id: "DM-001", sessionId: "DEMO-4401", teacher: "Priya Sharma", student: "Rahul Kapoor", subject: "JEE Physics", region: "Mumbai", startedAt: "11:00 AM", durationMin: 18, health: "green", healthHistory: [98, 97, 99, 98, 99, 98, 99], latencyMs: 32, packetLoss: 0.0, classType: "demo" },
  { id: "DM-002", sessionId: "DEMO-4402", teacher: "Kavya Nair", student: "Sneha Iyer", subject: "Piano Grade 3", region: "Bangalore", startedAt: "10:30 AM", durationMin: 12, health: "green", healthHistory: [96, 97, 96, 98, 97, 98, 97], latencyMs: 48, packetLoss: 0.1, classType: "demo" },
  { id: "DM-003", sessionId: "DEMO-4403", teacher: "Rohan Mehta", student: "Fatima Khan", subject: "IELTS Speaking", region: "Delhi", startedAt: "10:45 AM", durationMin: 8, health: "yellow", healthHistory: [90, 85, 82, 78, 80, 76, 74], latencyMs: 290, packetLoss: 1.4, classType: "demo" },
  { id: "DM-004", sessionId: "DEMO-4404", teacher: "Neha Deshmukh", student: "Aryan Tiwari", subject: "CAT Quant", region: "Pune", startedAt: "11:15 AM", durationMin: 5, health: "green", healthHistory: [99, 98, 99, 99, 98, 99, 99], latencyMs: 22, packetLoss: 0.0, classType: "demo" },
  { id: "DM-005", sessionId: "DEMO-4405", teacher: "Siddharth Rao", student: "Pooja Menon", subject: "Spoken English", region: "Chennai", startedAt: "09:50 AM", durationMin: 22, health: "green", healthHistory: [94, 95, 96, 95, 97, 96, 97], latencyMs: 58, packetLoss: 0.2, classType: "demo" },
  { id: "DM-006", sessionId: "DEMO-4406", teacher: "Tyrion Bhat", student: "Kiran Desai", subject: "Python DSA", region: "Mumbai", startedAt: "11:30 AM", durationMin: 2, health: "green", healthHistory: [99, 99, 98, 99, 99, 99, 98], latencyMs: 18, packetLoss: 0.0, classType: "demo" },
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

export const pastClasses: PastClass[] = [
  // ── Past Live Classes ──
  { id: "PC-001", sessionId: "SES-8801", teacher: "Priya Sharma", student: "Aarav Gupta", subject: "JEE Physics", region: "Mumbai", date: "Mar 12", startedAt: "08:00 AM", endedAt: "09:02 AM", durationMin: 62, outcome: "completed", rating: 4.9, classType: "live", recordingAvailable: true },
  { id: "PC-002", sessionId: "SES-8802", teacher: "Rohan Mehta", student: "Ananya Patel", subject: "IELTS Speaking", region: "Delhi", date: "Mar 12", startedAt: "07:30 AM", endedAt: "08:28 AM", durationMin: 58, outcome: "completed", rating: 4.7, classType: "live", recordingAvailable: true },
  { id: "PC-003", sessionId: "SES-8803", teacher: "Kavya Nair", student: "Vikram Singh", subject: "Piano Grade 5", region: "Bangalore", date: "Mar 11", startedAt: "06:00 PM", endedAt: "07:05 PM", durationMin: 65, outcome: "completed", rating: 4.8, classType: "live", recordingAvailable: true },
  { id: "PC-004", sessionId: "SES-8804", teacher: "Arjun Reddy", student: "Meera Joshi", subject: "NEET Biology", region: "Hyderabad", date: "Mar 11", startedAt: "04:00 PM", endedAt: "04:00 PM", durationMin: 0, outcome: "no_show_student", rating: null, classType: "live", recordingAvailable: false },
  { id: "PC-005", sessionId: "SES-8805", teacher: "Siddharth Rao", student: "Ishita Kapoor", subject: "Spoken English", region: "Chennai", date: "Mar 11", startedAt: "03:00 PM", endedAt: "03:42 PM", durationMin: 42, outcome: "terminated", rating: 2.1, classType: "live", recordingAvailable: true },
  { id: "PC-006", sessionId: "SES-8806", teacher: "Neha Deshmukh", student: "Aditya Verma", subject: "CAT Quant", region: "Pune", date: "Mar 11", startedAt: "11:00 AM", endedAt: "12:04 PM", durationMin: 64, outcome: "completed", rating: 5.0, classType: "live", recordingAvailable: true },
  { id: "PC-007", sessionId: "SES-8807", teacher: "Brienne Joshi", student: "Robb Sharma", subject: "Guitar Basics", region: "Kolkata", date: "Mar 10", startedAt: "05:00 PM", endedAt: "05:00 PM", durationMin: 0, outcome: "no_show_teacher", rating: null, classType: "live", recordingAvailable: false },
  { id: "PC-008", sessionId: "SES-8808", teacher: "Tyrion Bhat", student: "Catelyn Verma", subject: "Python DSA", region: "Mumbai", date: "Mar 10", startedAt: "10:00 AM", endedAt: "11:01 AM", durationMin: 61, outcome: "completed", rating: 4.6, classType: "live", recordingAvailable: true },
  { id: "PC-009", sessionId: "SES-8809", teacher: "Daenerys Rao", student: "Jaime Reddy", subject: "Vedic Math", region: "Delhi", date: "Mar 10", startedAt: "09:00 AM", endedAt: "09:58 AM", durationMin: 58, outcome: "completed", rating: 4.4, classType: "live", recordingAvailable: true },
  { id: "PC-010", sessionId: "SES-8810", teacher: "Cersei Mehta", student: "Bran Nair", subject: "Hindustani Vocal", region: "Jaipur", date: "Mar 10", startedAt: "08:00 AM", endedAt: "08:00 AM", durationMin: 0, outcome: "cancelled", rating: null, classType: "live", recordingAvailable: false },
  // ── Past Demo Classes ──
  { id: "PD-001", sessionId: "DEMO-4381", teacher: "Priya Sharma", student: "Rahul Kapoor", subject: "JEE Physics", region: "Mumbai", date: "Mar 12", startedAt: "09:00 AM", endedAt: "09:22 AM", durationMin: 22, outcome: "completed", rating: 4.8, classType: "demo", recordingAvailable: true },
  { id: "PD-002", sessionId: "DEMO-4382", teacher: "Kavya Nair", student: "Sneha Iyer", subject: "Piano Grade 3", region: "Bangalore", date: "Mar 12", startedAt: "08:30 AM", endedAt: "08:48 AM", durationMin: 18, outcome: "completed", rating: 5.0, classType: "demo", recordingAvailable: true },
  { id: "PD-003", sessionId: "DEMO-4383", teacher: "Rohan Mehta", student: "Fatima Khan", subject: "IELTS Speaking", region: "Delhi", date: "Mar 11", startedAt: "02:00 PM", endedAt: "02:00 PM", durationMin: 0, outcome: "no_show_student", rating: null, classType: "demo", recordingAvailable: false },
  { id: "PD-004", sessionId: "DEMO-4384", teacher: "Neha Deshmukh", student: "Aryan Tiwari", subject: "CAT Quant", region: "Pune", date: "Mar 11", startedAt: "01:00 PM", endedAt: "01:20 PM", durationMin: 20, outcome: "completed", rating: 4.5, classType: "demo", recordingAvailable: true },
  { id: "PD-005", sessionId: "DEMO-4385", teacher: "Siddharth Rao", student: "Pooja Menon", subject: "Spoken English", region: "Chennai", date: "Mar 10", startedAt: "11:00 AM", endedAt: "11:25 AM", durationMin: 25, outcome: "completed", rating: 4.9, classType: "demo", recordingAvailable: true },
  { id: "PD-006", sessionId: "DEMO-4386", teacher: "Tyrion Bhat", student: "Kiran Desai", subject: "Python DSA", region: "Mumbai", date: "Mar 10", startedAt: "10:00 AM", endedAt: "10:18 AM", durationMin: 18, outcome: "completed", rating: 4.7, classType: "demo", recordingAvailable: true },
  { id: "PD-007", sessionId: "DEMO-4387", teacher: "Arjun Reddy", student: "Nisha Agarwal", subject: "NEET Biology", region: "Hyderabad", date: "Mar 9", startedAt: "04:00 PM", endedAt: "04:15 PM", durationMin: 15, outcome: "completed", rating: 4.3, classType: "demo", recordingAvailable: true },
  { id: "PD-008", sessionId: "DEMO-4388", teacher: "Brienne Joshi", student: "Amit Saxena", subject: "Guitar Basics", region: "Kolkata", date: "Mar 9", startedAt: "03:00 PM", endedAt: "03:00 PM", durationMin: 0, outcome: "cancelled", rating: null, classType: "demo", recordingAvailable: false },
];
