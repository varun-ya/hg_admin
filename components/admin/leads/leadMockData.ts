import type { Lead, LeadProfile } from "./leadTypes";
import type { KPIItem } from "../LiveOpsKPIRibbon";

export const leadKPIs: KPIItem[] = [
  { label: "Total Active Leads", value: 342, change: "+28 this week", changeType: "up", icon: null },
  { label: "AI Qualification Rate", value: "84.2%", change: "+4% vs last month", changeType: "up", icon: null },
  { label: "WhatsApp Delivery Rate", value: "98.5%", change: "Stable", changeType: "neutral", icon: null },
  { label: "Trial-to-Paid Conversion", value: "12.4%", change: "+1.8% vs Q3", changeType: "up", icon: null },
];

export const leadSparklines: number[][] = [
  [280, 295, 310, 318, 325, 334, 342],
  [72, 74, 76, 78, 80, 82, 84.2],
  [96, 97, 97.5, 98, 98.2, 98.4, 98.5],
  [8.2, 9.1, 9.8, 10.4, 11.2, 11.8, 12.4],
];

export const leads: Lead[] = [
  { id: "LD-001", name: "Rahul Khanna", phone: "+91 98XXX-XX421", email: "rahul.k@homeguruworld.com", source: "meta_ads", aiScore: "hot", assignedAgent: "Arya Desai", lastTouchpoint: "WhatsApp reply", lastTouchpointTime: "10 min ago", status: "qualified", pipelineStage: "demo_booked", createdAt: "Today", utm: { source: "meta_ads", medium: "cpc", campaign: "jee_physics_retargeting" } },
  { id: "LD-002", name: "Sneha Pillai", phone: "+91 87XXX-XX892", email: "sneha.p@homeguruworld.com", source: "organic", aiScore: "warm", assignedAgent: "Bran Nair", lastTouchpoint: "Web chatbot", lastTouchpointTime: "1h ago", status: "contacted", pipelineStage: "agent_contacted", createdAt: "Today", utm: { source: "organic", medium: "search", campaign: "—" } },
  { id: "LD-003", name: "Amit Tiwari", phone: "+91 99XXX-XX334", email: "amit.t@homeguruworld.com", source: "whatsapp", aiScore: "hot", assignedAgent: "Arya Desai", lastTouchpoint: "WhatsApp reply", lastTouchpointTime: "25 min ago", status: "qualified", pipelineStage: "demo_booked", createdAt: "Yesterday", utm: { source: "whatsapp", medium: "direct", campaign: "weekend_blast_mar" } },
  { id: "LD-004", name: "Pooja Saxena", phone: "+91 70XXX-XX156", email: "pooja.s@homeguruworld.com", source: "csv_import", aiScore: "cold", assignedAgent: "Unassigned", lastTouchpoint: "No contact yet", lastTouchpointTime: "—", status: "new", pipelineStage: "new_inbound", createdAt: "Yesterday", utm: { source: "csv_import", medium: "bulk", campaign: "school_partnership_q1" } },
  { id: "LD-005", name: "Karan Malhotra", phone: "+91 88XXX-XX778", email: "karan.m@homeguruworld.com", source: "meta_ads", aiScore: "warm", assignedAgent: "Brienne Joshi", lastTouchpoint: "Call scheduled", lastTouchpointTime: "3h ago", status: "contacted", pipelineStage: "agent_contacted", createdAt: "Mar 8", utm: { source: "meta_ads", medium: "cpc", campaign: "ielts_lookalike_v2" } },
  { id: "LD-006", name: "Divya Menon", phone: "+91 91XXX-XX445", email: "divya.m@homeguruworld.com", source: "referral", aiScore: "hot", assignedAgent: "Arya Desai", lastTouchpoint: "Trial booked", lastTouchpointTime: "2h ago", status: "qualified", pipelineStage: "converted", createdAt: "Mar 8", utm: { source: "referral", medium: "word_of_mouth", campaign: "—" } },
  { id: "LD-007", name: "Nikhil Jain", phone: "+91 76XXX-XX223", email: "nikhil.j@homeguruworld.com", source: "organic", aiScore: "cold", assignedAgent: "Bran Nair", lastTouchpoint: "Email sent", lastTouchpointTime: "1d ago", status: "contacted", pipelineStage: "agent_contacted", createdAt: "Mar 7", utm: { source: "organic", medium: "blog", campaign: "—" } },
  { id: "LD-008", name: "Anita Rao", phone: "+91 85XXX-XX667", email: "anita.r@homeguruworld.com", source: "whatsapp", aiScore: "warm", assignedAgent: "Unassigned", lastTouchpoint: "WhatsApp read", lastTouchpointTime: "4h ago", status: "new", pipelineStage: "ai_qualified", createdAt: "Mar 7", utm: { source: "whatsapp", medium: "direct", campaign: "trial_reminder" } },
  { id: "LD-009", name: "Varun Chopra", phone: "+91 93XXX-XX112", email: "varun.c@homeguruworld.com", source: "meta_ads", aiScore: "hot", assignedAgent: "Brienne Joshi", lastTouchpoint: "Trial completed", lastTouchpointTime: "6h ago", status: "qualified", pipelineStage: "converted", createdAt: "Mar 6", utm: { source: "meta_ads", medium: "cpc", campaign: "python_dsa_broad" } },
  { id: "LD-010", name: "Megha Srinivasan", phone: "+91 82XXX-XX889", email: "megha.s@homeguruworld.com", source: "referral", aiScore: "warm", assignedAgent: "Arya Desai", lastTouchpoint: "Follow-up call", lastTouchpointTime: "1d ago", status: "contacted", pipelineStage: "agent_contacted", createdAt: "Mar 6", utm: { source: "referral", medium: "teacher_referral", campaign: "—" } },
  { id: "LD-011", name: "Prateek Gupta", phone: "+91 90XXX-XX551", email: "prateek.g@homeguruworld.com", source: "google", aiScore: "warm", assignedAgent: "Unassigned", lastTouchpoint: "Form submitted", lastTouchpointTime: "30 min ago", status: "new", pipelineStage: "new_inbound", createdAt: "Today", utm: { source: "google", medium: "cpc", campaign: "neet_biology_search" } },
  { id: "LD-012", name: "Riya Sharma", phone: "+91 81XXX-XX334", email: "riya.s@homeguruworld.com", source: "meta_ads", aiScore: "hot", assignedAgent: "Arya Desai", lastTouchpoint: "WhatsApp reply", lastTouchpointTime: "15 min ago", status: "qualified", pipelineStage: "ai_qualified", createdAt: "Today", utm: { source: "meta_ads", medium: "cpc", campaign: "jee_physics_retargeting" } },
  { id: "LD-013", name: "Saurabh Patel", phone: "+91 77XXX-XX890", email: "saurabh.p@homeguruworld.com", source: "whatsapp", aiScore: "cold", assignedAgent: "Unassigned", lastTouchpoint: "Bot message sent", lastTouchpointTime: "2h ago", status: "new", pipelineStage: "new_inbound", createdAt: "Today", utm: { source: "whatsapp", medium: "direct", campaign: "—" } },
  { id: "LD-014", name: "Tanvi Reddy", phone: "+91 86XXX-XX112", email: "tanvi.r@homeguruworld.com", source: "google", aiScore: "warm", assignedAgent: "Bran Nair", lastTouchpoint: "Demo scheduled", lastTouchpointTime: "5h ago", status: "contacted", pipelineStage: "demo_booked", createdAt: "Yesterday", utm: { source: "google", medium: "cpc", campaign: "guitar_lessons_blr" } },
];

export function getLeadProfile(_id: string): LeadProfile {
  return {
    chatHistory: [
      { sender: "bot", text: "Hi! Welcome to HomeGuru 👋 What subject are you looking for?", time: "10:00 AM", channel: "whatsapp" },
      { sender: "lead", text: "I need JEE Physics coaching for my son. He's in 11th.", time: "10:02 AM", channel: "whatsapp" },
      { sender: "bot", text: "Great! We have excellent JEE Physics tutors. What's your budget per hour?", time: "10:02 AM", channel: "whatsapp" },
      { sender: "lead", text: "Around 800-1000 per hour. Weekends preferred.", time: "10:04 AM", channel: "whatsapp" },
      { sender: "bot", text: "Perfect. Let me connect you with a specialist. One moment!", time: "10:04 AM", channel: "whatsapp" },
      { sender: "agent", text: "Hi Rahul! I'm Arya from HomeGuru. I've found 3 top-rated JEE Physics tutors in your budget. Would you like to book a free trial?", time: "10:15 AM", channel: "whatsapp" },
      { sender: "lead", text: "Yes please! Saturday morning works best.", time: "10:18 AM", channel: "whatsapp" },
      { sender: "agent", text: "Done! I've booked a 30-min trial with Priya Sharma (4.9★) this Saturday at 10 AM. You'll get a link on WhatsApp.", time: "10:20 AM", channel: "whatsapp" },
    ],
    aiSummary: "Parent seeking JEE Physics preparation for 11th-grade student. Budget ₹800–1,000/hr. Prefers weekend sessions (Saturday mornings). High intent — responded quickly, agreed to trial. Recommended: Match with top-rated JEE Physics tutor with weekend availability.",
    budget: "₹800–1,000/hr",
    availability: "Weekends (Saturday mornings)",
    subject: "JEE Physics",
  };
}
