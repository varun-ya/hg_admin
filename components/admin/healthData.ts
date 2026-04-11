// ─── Platform Health Banner ───
export const platformStatus = {
  overall: "operational" as const,
  uptime: 99.97,
  lastIncident: "14 days ago",
  services: [
    { name: "API Gateway", status: "operational" as const, latency: 42, unit: "ms" },
    { name: "1on1 Meet", status: "operational" as const, latency: 18, unit: "ms" },
    { name: "PostgreSQL", status: "operational" as const, latency: 3.2, unit: "ms" },
    { name: "Redis Cache", status: "operational" as const, latency: 0.8, unit: "ms" },
    { name: "S3 / CDN", status: "operational" as const, latency: 12, unit: "ms" },
    { name: "Osmium LLM", status: "degraded" as const, latency: 820, unit: "ms" },
    { name: "LMLens", status: "operational" as const, latency: 145, unit: "ms" },
    { name: "LeadControl", status: "operational" as const, latency: 38, unit: "ms" },
    { name: "Aegis Auth", status: "operational" as const, latency: 56, unit: "ms" },
  ],
};

// ─── User Growth (12 months) ───
export const userGrowth = [
  { month: "Apr", students: 28400, teachers: 6200 },
  { month: "May", students: 31200, teachers: 6800 },
  { month: "Jun", students: 34800, teachers: 7400 },
  { month: "Jul", students: 38200, teachers: 8100 },
  { month: "Aug", students: 42600, teachers: 8900 },
  { month: "Sep", students: 48100, teachers: 9600 },
  { month: "Oct", students: 54200, teachers: 10400 },
  { month: "Nov", students: 61800, teachers: 11200 },
  { month: "Dec", students: 68400, teachers: 11800 },
  { month: "Jan", students: 72100, teachers: 12100 },
  { month: "Feb", students: 78600, teachers: 12800 },
  { month: "Mar", students: 84200, teachers: 13400 },
];

// ─── Revenue Heatmap (7 days × 24 hours) ───
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function genHeatmap() {
  const data: { day: string; hour: number; value: number }[] = [];
  for (const day of DAYS) {
    for (let h = 0; h < 24; h++) {
      const base = day === "Sat" || day === "Sun" ? 800 : 1400;
      const peak = h >= 16 && h <= 21 ? 2.2 : h >= 9 && h <= 14 ? 1.5 : 0.4;
      data.push({ day, hour: h, value: Math.round(base * peak * (0.7 + Math.random() * 0.6)) });
    }
  }
  return data;
}
export const revenueHeatmap = genHeatmap();

// ─── Session Distribution (by subject) ───
export const sessionDistribution = [
  { subject: "Mathematics", count: 86, color: "#293763" },
  { subject: "Science", count: 64, color: "#3D4D7A" },
  { subject: "English", count: 52, color: "#E08A3C" },
  { subject: "Coding", count: 48, color: "#D4956A" },
  { subject: "IELTS/TOEFL", count: 38, color: "#5A6A96" },
  { subject: "Music", count: 28, color: "#8B96B5" },
  { subject: "Other", count: 26, color: "#CACACA" },
];

// ─── System Health Grid ───
export const systemHealth = [
  { label: "API Latency (p99)", value: "142ms", target: "< 200ms", pct: 71, ok: true, trend: [120, 135, 128, 142, 138, 145, 142] },
  { label: "DB Connections", value: "284 / 500", target: "< 400", pct: 56.8, ok: true, trend: [240, 255, 268, 272, 280, 278, 284] },
  { label: "CDN Hit Rate", value: "94.2%", target: "> 90%", pct: 94.2, ok: true, trend: [91, 92.5, 93.1, 93.8, 94.0, 93.6, 94.2] },
  { label: "Error Rate (5xx)", value: "0.03%", target: "< 0.1%", pct: 30, ok: true, trend: [0.08, 0.06, 0.05, 0.04, 0.03, 0.04, 0.03] },
  { label: "Queue Depth", value: "12", target: "< 50", pct: 24, ok: true, trend: [28, 22, 18, 15, 14, 13, 12] },
  { label: "Memory Usage", value: "68%", target: "< 80%", pct: 68, ok: true, trend: [62, 64, 65, 66, 67, 67, 68] },
];

// ─── Real-time Activity Feed ───
export const activityFeed = [
  { id: "AF-01", time: "Just now", event: "New student enrolled", detail: "Aarav M. — JEE Physics", type: "enrollment" as const },
  { id: "AF-02", time: "1m ago", event: "Session started", detail: "Cersei L. → Advanced React", type: "session" as const },
  { id: "AF-03", time: "2m ago", event: "Payment received", detail: "₹4,200 — Student #8841", type: "payment" as const },
  { id: "AF-04", time: "3m ago", event: "KYC approved", detail: "Teacher #4422 — Auto-verified", type: "kyc" as const },
  { id: "AF-05", time: "5m ago", event: "AI flagged content", detail: "Session LS-412 transcript", type: "flag" as const },
  { id: "AF-06", time: "7m ago", event: "Refund processed", detail: "$680 — Teacher no-show", type: "refund" as const },
  { id: "AF-07", time: "8m ago", event: "Session ended", detail: "Jon S. — Calculus II (1h 12m)", type: "session" as const },
  { id: "AF-08", time: "12m ago", event: "New teacher onboarded", detail: "Priya D. — Data Science", type: "enrollment" as const },
  { id: "AF-09", time: "15m ago", event: "Batch payout initiated", detail: "$12,400 — 8 teachers", type: "payment" as const },
  { id: "AF-10", time: "18m ago", event: "Feature flag toggled", detail: "ai_quiz_generation: ON", type: "system" as const },
];

// ─── Enhanced Financial (weekly granularity) ───
export const weeklyFinancial = [
  { week: "W1 Jan", revenue: 32000, escrow: 98000, payouts: 28000 },
  { week: "W2 Jan", revenue: 36000, escrow: 102000, payouts: 31000 },
  { week: "W3 Jan", revenue: 38000, escrow: 108000, payouts: 34000 },
  { week: "W4 Jan", revenue: 42000, escrow: 113000, payouts: 36000 },
  { week: "W1 Feb", revenue: 44000, escrow: 118000, payouts: 38000 },
  { week: "W2 Feb", revenue: 48000, escrow: 124000, payouts: 42000 },
  { week: "W3 Feb", revenue: 46000, escrow: 128000, payouts: 40000 },
  { week: "W4 Feb", revenue: 52000, escrow: 134000, payouts: 44000 },
  { week: "W1 Mar", revenue: 54000, escrow: 140000, payouts: 48000 },
  { week: "W2 Mar", revenue: 58000, escrow: 148000, payouts: 52000 },
  { week: "W3 Mar", revenue: 56000, escrow: 152000, payouts: 50000 },
  { week: "W4 Mar", revenue: 62000, escrow: 158000, payouts: 54000 },
];
