import type { Dispute, DisputeProfile } from "./disputeTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

export const disputeKPIs: KPIItem[] = [
  { label: "Open Disputes", value: 23, change: "+4 today", changeType: "up", icon: null, isCritical: true, pulseColor: "#E08A3C" },
  { label: "Total $ at Risk", value: "$18,420", change: "Escrow frozen", changeType: "neutral", icon: null },
  { label: "Chargebacks", value: 3, change: "Stripe: 2, Razorpay: 1", changeType: "up", icon: null },
  { label: "Avg Resolution Time", value: "18h", change: "Target: < 24h", changeType: "up", icon: null },
];

export const disputeSparklines: number[][] = [
  [15, 18, 20, 17, 22, 19, 23],
  [12400, 14200, 15800, 16900, 17200, 18100, 18420],
  [1, 0, 2, 1, 2, 1, 3],
  [28, 24, 22, 20, 19, 17, 18],
];

export const disputes: Dispute[] = [
  { id: "D-001", disputeId: "DSP-4401", raisedBy: "student", raisedByName: "Aarav Sharma", otherParty: "Priya Sharma (T)", amount: 1200, reason: "Tutor No-Show", status: "open", ticketAge: "6h", ticketAgeHours: 6, createdAt: "Today, 04:30 AM" },
  { id: "D-002", disputeId: "DSP-4402", raisedBy: "student", raisedByName: "Vikram Singh", otherParty: "Kavya Nair (T)", amount: 800, reason: "Tech Failure", status: "open", ticketAge: "14h", ticketAgeHours: 14, createdAt: "Yesterday, 08:15 PM" },
  { id: "D-003", disputeId: "DSP-4403", raisedBy: "teacher", raisedByName: "Rohan Mehta", otherParty: "Ananya Patel (S)", amount: 2400, reason: "Student No-Show", status: "open", ticketAge: "52h", ticketAgeHours: 52, createdAt: "Mar 8, 06:00 PM" },
  { id: "D-004", disputeId: "DSP-4404", raisedBy: "student", raisedByName: "Meera Joshi", otherParty: "Arjun Reddy (T)", amount: 600, reason: "Quality Complaint", status: "open", ticketAge: "3h", ticketAgeHours: 3, createdAt: "Today, 07:45 AM" },
  { id: "D-005", disputeId: "DSP-4405", raisedBy: "student", raisedByName: "Ishita Kapoor", otherParty: "Siddharth Rao (T)", amount: 3200, reason: "Tutor No-Show", status: "escalated", ticketAge: "72h", ticketAgeHours: 72, createdAt: "Mar 7, 10:30 AM" },
  { id: "D-006", disputeId: "DSP-4406", raisedBy: "teacher", raisedByName: "Neha Deshmukh", otherParty: "Aditya Verma (S)", amount: 1500, reason: "Cancellation Dispute", status: "open", ticketAge: "28h", ticketAgeHours: 28, createdAt: "Yesterday, 06:30 AM" },
  { id: "D-007", disputeId: "DSP-4407", raisedBy: "student", raisedByName: "Robb Sharma", otherParty: "Brienne Joshi (T)", amount: 450, reason: "Tech Failure", status: "open", ticketAge: "8h", ticketAgeHours: 8, createdAt: "Today, 02:00 AM" },
  { id: "D-008", disputeId: "DSP-4408", raisedBy: "student", raisedByName: "Catelyn Verma", otherParty: "Tyrion Bhat (T)", amount: 5800, reason: "Unauthorized Charge", status: "escalated", ticketAge: "96h", ticketAgeHours: 96, createdAt: "Mar 6, 02:15 PM" },
];

export function getDisputeProfile(_id: string): DisputeProfile {
  return {
    studentClaim: "The teacher did not join the session at the scheduled time. I waited for 15 minutes and then left. I want a full refund as this is the second time this has happened.",
    teacherRebuttal: "I experienced a power outage in my area and was unable to join. I informed the student via WhatsApp within 5 minutes of the scheduled time and offered to reschedule.",
    osmiumJoinTime: "Teacher: Never joined | Student: 10:00:12 AM",
    osmiumLeaveTime: "Student: 10:15:34 AM (auto-disconnect after 15m timeout)",
    connectionDrops: 0,
    transcriptSummary: "No teaching session occurred. The student joined at the scheduled time and waited in the room for 15 minutes. The Osmium system auto-terminated the session due to single-participant timeout.",
    teachingOccurred: false,
    sessionDurationMin: 0,
  };
}
