export type ConnectionHealth = "green" | "yellow" | "red";

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
}

export interface SessionProfile {
  teacherBitrate: number[];
  studentBitrate: number[];
  teacherPacketLoss: number[];
  studentPacketLoss: number[];
  chatMessages: { sender: "teacher" | "student" | "system"; text: string; time: string }[];
  filesShared: { name: string; type: string; size: string }[];
}
