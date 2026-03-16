export type DisputeStatus = "open" | "resolved" | "escalated";
export type RaisedBy = "student" | "teacher";

export interface Dispute {
  id: string;
  disputeId: string;
  raisedBy: RaisedBy;
  raisedByName: string;
  otherParty: string;
  amount: number;
  reason: string;
  status: DisputeStatus;
  ticketAge: string;
  ticketAgeHours: number;
  createdAt: string;
}

export interface DisputeProfile {
  studentClaim: string;
  teacherRebuttal: string;
  osmiumJoinTime: string;
  osmiumLeaveTime: string;
  connectionDrops: number;
  transcriptSummary: string;
  teachingOccurred: boolean;
  sessionDurationMin: number;
}
