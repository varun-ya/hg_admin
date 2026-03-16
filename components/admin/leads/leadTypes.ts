export type LeadScore = "hot" | "warm" | "cold";
export type LeadSource = "meta_ads" | "google" | "organic" | "whatsapp" | "csv_import" | "referral";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type PipelineStage = "new_inbound" | "ai_qualified" | "agent_contacted" | "demo_booked" | "converted";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  aiScore: LeadScore;
  assignedAgent: string;
  lastTouchpoint: string;
  lastTouchpointTime: string;
  status: LeadStatus;
  pipelineStage: PipelineStage;
  createdAt: string;
  utm: { source: string; medium: string; campaign: string };
}

export interface LeadProfile {
  chatHistory: { sender: "lead" | "agent" | "bot"; text: string; time: string; channel: "whatsapp" | "web" }[];
  aiSummary: string;
  budget: string;
  availability: string;
  subject: string;
}

export const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: "new_inbound", label: "New Inbound", color: "#3B6FC0" },
  { key: "ai_qualified", label: "AI Qualified", color: "#E08A3C" },
  { key: "agent_contacted", label: "Agent Contacted", color: "#1A1A1A" },
  { key: "demo_booked", label: "Demo Booked", color: "#293763" },
  { key: "converted", label: "Converted", color: "#1A7A1A" },
];
