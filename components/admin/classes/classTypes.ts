export type ConnectionHealth = "green" | "yellow" | "red";
export type ClassType = "live" | "demo";

export interface LiveSession {
  id: string;
  sessionId: string;
  teacher: string;
  student: string;
  subject: string;
  region: string;
  startedAt: string;
  durationMin: number;
  health: ConnectionHealth;
  healthHistory: number[]; // 0-100 quality over last 7 samples
  latencyMs: number;
  packetLoss: number;
  classType: ClassType;
}

export type PastClassOutcome = "completed" | "no_show_student" | "no_show_teacher" | "terminated" | "cancelled";

export interface PastClass {
  id: string;
  sessionId: string;
  teacher: string;
  student: string;
  subject: string;
  region: string;
  date: string;
  startedAt: string;
  endedAt: string;
  durationMin: number;
  outcome: PastClassOutcome;
  rating: number | null;
  classType: ClassType;
  recordingAvailable: boolean;
}

export interface SessionProfile {
  teacherBitrate: number[];
  studentBitrate: number[];
  teacherPacketLoss: number[];
  studentPacketLoss: number[];
  chatMessages: { sender: "teacher" | "student" | "system"; text: string; time: string }[];
  filesShared: { name: string; type: string; size: string }[];
}
