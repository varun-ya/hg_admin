export type ImpersonationTarget = "student" | "teacher";

export interface ImpersonationSession {
  id: string;
  adminId: string;
  adminEmail: string;
  targetUserId: string;
  targetUserName: string;
  targetUserEmail: string;
  targetType: ImpersonationTarget;
  reason: string;
  ticketId: string;
  startedAt: string;
  endedAt: string | null;
  actionsPerformed: number;
  blockedActions: string[];
}

export interface ImpersonationLog {
  id: string;
  sessionId: string;
  action: string;
  timestamp: string;
  blocked: boolean;
  reason?: string;
}
