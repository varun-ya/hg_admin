import type { KPIItem } from "../LiveOpsKPIRibbon";

export type BroadcastChannel = "email" | "sms" | "push" | "whatsapp";
export type BroadcastStatus = "sent" | "scheduled" | "draft" | "failed";

export interface BroadcastTemplate {
  id: string;
  name: string;
  category: "emergency" | "marketing" | "transactional" | "system";
  channels: BroadcastChannel[];
  mergeFields: string[];
  lastUsed: string | null;
  createdBy: string;
}

export interface BroadcastLog {
  id: string;
  templateName: string;
  channel: BroadcastChannel;
  audience: string;
  recipientCount: number;
  deliveredCount: number;
  status: BroadcastStatus;
  sentBy: string;
  sentAt: string;
}

export const broadcastKPIs: KPIItem[] = [
  { label: "Broadcasts Sent (7d)", value: "14", change: "98.2% delivery rate", changeType: "up", icon: null },
  { label: "Active Templates", value: "22", change: "4 emergency, 18 standard", changeType: "neutral", icon: null },
  { label: "Total Recipients (7d)", value: "48.2K", change: "+12K vs last week", changeType: "up", icon: null },
];
export const broadcastSparklines = [
  [8, 9, 10, 11, 12, 13, 14],
  [18, 19, 20, 20, 21, 22, 22],
  [28, 32, 35, 38, 42, 45, 48.2],
];

export const broadcastTemplates: BroadcastTemplate[] = [
  { id: "BT-001", name: "Technical Outage Alert", category: "emergency", channels: ["email", "sms", "push", "whatsapp"], mergeFields: ["{{Service_Name}}", "{{ETA}}", "{{Status_Page_URL}}"], lastUsed: "47 days ago", createdBy: "admin@homeguru.in" },
  { id: "BT-002", name: "Safety Warning", category: "emergency", channels: ["email", "push", "whatsapp"], mergeFields: ["{{Student_Name}}", "{{Incident_Type}}", "{{Support_Link}}"], lastUsed: null, createdBy: "admin@homeguru.in" },
  { id: "BT-003", name: "Scheduled Maintenance", category: "system", channels: ["email", "push"], mergeFields: ["{{Start_Time}}", "{{End_Time}}", "{{Affected_Services}}"], lastUsed: "3 days ago", createdBy: "karan@homeguru.in" },
  { id: "BT-004", name: "Class Reminder", category: "transactional", channels: ["whatsapp", "push"], mergeFields: ["{{Student_Name}}", "{{Teacher_Name}}", "{{Session_Time}}", "{{Join_Link}}"], lastUsed: "Today", createdBy: "system" },
  { id: "BT-005", name: "Payout Confirmation", category: "transactional", channels: ["email", "whatsapp"], mergeFields: ["{{Teacher_Name}}", "{{Amount}}", "{{Bank_Last4}}"], lastUsed: "Today", createdBy: "system" },
  { id: "BT-006", name: "Re-engagement Nudge", category: "marketing", channels: ["whatsapp", "email"], mergeFields: ["{{Student_Name}}", "{{Last_Subject}}", "{{Promo_Code}}"], lastUsed: "2 days ago", createdBy: "riya@homeguru.in" },
  { id: "BT-007", name: "New Feature Announcement", category: "marketing", channels: ["email", "push"], mergeFields: ["{{User_Name}}", "{{Feature_Name}}", "{{CTA_Link}}"], lastUsed: "5 days ago", createdBy: "admin@homeguru.in" },
];

export const broadcastLogs: BroadcastLog[] = [
  { id: "BL-001", templateName: "Class Reminder", channel: "whatsapp", audience: "Students with classes today", recipientCount: 4200, deliveredCount: 4180, status: "sent", sentBy: "system", sentAt: "Today, 07:00 AM" },
  { id: "BL-002", templateName: "Payout Confirmation", channel: "email", audience: "Teachers with pending payouts", recipientCount: 340, deliveredCount: 338, status: "sent", sentBy: "system", sentAt: "Today, 06:00 AM" },
  { id: "BL-003", templateName: "Re-engagement Nudge", channel: "whatsapp", audience: "Inactive students (7d+)", recipientCount: 890, deliveredCount: 864, status: "sent", sentBy: "riya@homeguru.in", sentAt: "Yesterday, 10:00 AM" },
  { id: "BL-004", templateName: "Scheduled Maintenance", channel: "email", audience: "All users", recipientCount: 42000, deliveredCount: 41800, status: "sent", sentBy: "karan@homeguru.in", sentAt: "Mar 10, 08:00 PM" },
  { id: "BL-005", templateName: "New Feature Announcement", channel: "push", audience: "All active users", recipientCount: 28000, deliveredCount: 26400, status: "sent", sentBy: "admin@homeguru.in", sentAt: "Mar 8, 12:00 PM" },
];
