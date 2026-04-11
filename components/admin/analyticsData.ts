// ─── 1. Executive KPI Ribbon ───
export const kpiMetrics = [
  { id: "gmv", label: "Gross Merchandise Value", value: "$3.24M", change: "+12.4%", changeType: "up" as const, period: "vs last month", usdValue: 3240000, sparkline: [2.1, 2.3, 2.5, 2.7, 2.8, 3.0, 3.24] },
  { id: "revenue", label: "Net Platform Revenue", value: "$487K", change: "+8.7%", changeType: "up" as const, period: "vs last month", usdValue: 487000, sparkline: [310, 340, 365, 398, 420, 442, 487] },
  { id: "hours", label: "Learning Hours Delivered", value: "142,800", change: "+22.1%", changeType: "up" as const, period: "vs last month", sparkline: [82, 94, 102, 112, 124, 134, 142.8] },
  { id: "conversion", label: "Trial → Paid Conversion", value: "34.2%", change: "+2.1pp", changeType: "up" as const, period: "vs last month", sparkline: [28, 29.5, 30.2, 31.4, 32.1, 33.0, 34.2] },
  { id: "nps", label: "Net Promoter Score", value: "72", change: "+4", changeType: "up" as const, period: "vs last month", sparkline: [58, 62, 64, 66, 68, 70, 72] },
  { id: "dau", label: "Daily Active Users", value: "18,420", change: "+14.8%", changeType: "up" as const, period: "vs last month", sparkline: [12.4, 13.2, 14.1, 15.2, 16.0, 17.1, 18.4] },
];

// ─── 2. Conversion Funnel ───
export const funnelData = [
  { stage: "Website Visitors", count: 284000, color: "#293763" },
  { stage: "Sign Ups", count: 42600, color: "#3D4D7A" },
  { stage: "Trial Booked", count: 18200, color: "#5A6A96" },
  { stage: "Trial Completed", count: 14800, color: "#E08A3C" },
  { stage: "Paid Enrollment", count: 6220, color: "#D4956A" },
  { stage: "Retained (30d)", count: 4840, color: "#B45309" },
];

// ─── 3. Marketplace Liquidity ───
export const subjectDemand = [
  { subject: "IELTS Speaking", searches: 4200, slots: 1800, gap: "high" as const },
  { subject: "JEE Physics", searches: 3800, slots: 3200, gap: "low" as const },
  { subject: "Calculus II", searches: 2900, slots: 1200, gap: "high" as const },
  { subject: "Python / DSA", searches: 2600, slots: 2400, gap: "low" as const },
  { subject: "NEET Biology", searches: 2200, slots: 900, gap: "critical" as const },
  { subject: "Spoken English", searches: 1900, slots: 1700, gap: "low" as const },
  { subject: "Guitar Basics", searches: 1400, slots: 1100, gap: "low" as const },
  { subject: "Data Science", searches: 1200, slots: 400, gap: "critical" as const },
  { subject: "Vedic Maths", searches: 1100, slots: 820, gap: "low" as const },
  { subject: "German Language", searches: 980, slots: 340, gap: "critical" as const },
  { subject: "Graphic Design", searches: 860, slots: 680, gap: "low" as const },
  { subject: "UPSC GS", searches: 780, slots: 280, gap: "high" as const },
  { subject: "Piano", searches: 720, slots: 540, gap: "low" as const },
  { subject: "French Language", searches: 640, slots: 180, gap: "critical" as const },
];

export const liquidityMetrics = {
  tutorUtilization: 62.4,
  searchToFill: 71.8,
  avgWaitTime: "4.2 min",
  avgMatchScore: 87.4,
  repeatBookingRate: 64.2,
};

export const geoDistribution = [
  { region: "India", students: 48200, teachers: 12400, revenue: 1840000, flag: "🇮🇳" },
  { region: "United States", students: 12800, teachers: 3200, revenue: 620000, flag: "🇺🇸" },
  { region: "United Kingdom", students: 8400, teachers: 2100, revenue: 380000, flag: "🇬🇧" },
  { region: "UAE", students: 6200, teachers: 800, revenue: 210000, flag: "🇦🇪" },
  { region: "Canada", students: 4100, teachers: 1400, revenue: 120000, flag: "🇨🇦" },
  { region: "Germany", students: 2800, teachers: 900, revenue: 70000, flag: "🇩🇪" },
  { region: "Australia", students: 2400, teachers: 680, revenue: 58000, flag: "🇦🇺" },
  { region: "Singapore", students: 1800, teachers: 420, revenue: 46000, flag: "🇸🇬" },
  { region: "Saudi Arabia", students: 1600, teachers: 310, revenue: 42000, flag: "🇸🇦" },
  { region: "Qatar", students: 1200, teachers: 240, revenue: 34000, flag: "🇶🇦" },
  { region: "Oman", students: 900, teachers: 180, revenue: 22000, flag: "🇴🇲" },
  { region: "Kuwait", students: 800, teachers: 160, revenue: 18000, flag: "🇰🇼" },
  { region: "Nepal", students: 1400, teachers: 520, revenue: 16000, flag: "🇳🇵" },
  { region: "Bangladesh", students: 1100, teachers: 380, revenue: 12000, flag: "🇧🇩" },
  { region: "South Africa", students: 600, teachers: 140, revenue: 8000, flag: "🇿🇦" },
  { region: "Nigeria", students: 480, teachers: 90, revenue: 5200, flag: "🇳🇬" },
];

// ─── 4. Hourly Traffic Pattern ───
export const hourlyTraffic = Array.from({ length: 24 }, (_, h) => {
  const base = h >= 16 && h <= 21 ? 2800 : h >= 9 && h <= 14 ? 1800 : h >= 6 && h <= 8 ? 900 : 300;
  return { hour: `${h.toString().padStart(2, "0")}:00`, sessions: Math.round(base * (0.85 + Math.random() * 0.3)), bookings: Math.round(base * 0.12 * (0.8 + Math.random() * 0.4)) };
});

// ─── 5. Session Duration Distribution ───
export const durationDistribution = [
  { range: "< 30m", count: 4200, pct: 12.3 },
  { range: "30–45m", count: 8400, pct: 24.6 },
  { range: "45–60m", count: 12800, pct: 37.5 },
  { range: "60–90m", count: 6200, pct: 18.2 },
  { range: "90m+", count: 2520, pct: 7.4 },
];

// ─── 6. Cohort Retention ───
export const cohortData = [
  { cohort: "Jan '26", size: 5200, m1: 72, m2: 58, m3: 44, m4: 38, m5: 32 },
  { cohort: "Feb '26", size: 6100, m1: 74, m2: 61, m3: 48, m4: 41 },
  { cohort: "Mar '26", size: 7400, m1: 78, m2: 64, m3: 51 },
  { cohort: "Apr '26", size: 5800, m1: 71, m2: 59 },
  { cohort: "May '26", size: 6900, m1: 76 },
];

export const retentionMetrics = {
  teacherChurnRate: 8.2,
  studentChurnRate: 18.4,
  avgSessionsPerStudent: 2.4,
  avgSessionsPerTeacher: 14.2,
  weeklyActiveStreaks: { "7+": 12400, "14+": 6800, "30+": 2100 },
};

// ─── 7. Weekly Active Users ───
export const wauTrend = [
  { week: "W1 Jan", students: 42100, teachers: 8200 },
  { week: "W2 Jan", students: 44200, teachers: 8400 },
  { week: "W3 Jan", students: 43800, teachers: 8500 },
  { week: "W4 Jan", students: 46200, teachers: 8800 },
  { week: "W1 Feb", students: 48400, teachers: 9100 },
  { week: "W2 Feb", students: 50200, teachers: 9400 },
  { week: "W3 Feb", students: 49800, teachers: 9300 },
  { week: "W4 Feb", students: 52400, teachers: 9600 },
  { week: "W1 Mar", students: 54200, teachers: 9900 },
  { week: "W2 Mar", students: 56800, teachers: 10200 },
  { week: "W3 Mar", students: 58400, teachers: 10400 },
  { week: "W4 Mar", students: 61200, teachers: 10800 },
];

// ─── 8. Financial & Unit Economics ───
export const unitEconomics = {
  cac: 42,
  ltv: 186,
  ltvCacRatio: 4.4,
  arpuStudent: 28.40,
  arpuTeacher: 412.00,
  promoDiscountTotal: 124800,
  promoLiftVolume: 18.2,
  paybackPeriodDays: 48,
  grossMargin: 34.2,
};

export const monthlyRevenue = [
  { month: "Jul", revenue: 218000, cac: 56, sessions: 18200 },
  { month: "Aug", revenue: 245000, cac: 53, sessions: 21400 },
  { month: "Sep", revenue: 282000, cac: 51, sessions: 24800 },
  { month: "Oct", revenue: 320000, cac: 48, sessions: 28200 },
  { month: "Nov", revenue: 380000, cac: 45, sessions: 32400 },
  { month: "Dec", revenue: 410000, cac: 44, sessions: 34800 },
  { month: "Jan", revenue: 398000, cac: 43, sessions: 33200 },
  { month: "Feb", revenue: 442000, cac: 41, sessions: 36400 },
  { month: "Mar", revenue: 487000, cac: 42, sessions: 38800 },
];

// ─── 9. Channel Attribution ───
export const channelAttribution = [
  { channel: "Organic Search", students: 18400, revenue: 142000, cac: 18, color: "#293763" },
  { channel: "Google Ads", students: 12200, revenue: 98000, cac: 62, color: "#3D4D7A" },
  { channel: "Meta Ads", students: 8400, revenue: 64000, cac: 54, color: "#E08A3C" },
  { channel: "Referral", students: 6800, revenue: 58000, cac: 12, color: "#059669" },
  { channel: "WhatsApp", students: 4200, revenue: 32000, cac: 28, color: "#25D366" },
  { channel: "Direct", students: 3800, revenue: 28000, cac: 0, color: "#D4956A" },
];

// ─── 10. Teacher Performance ───
export const topTeachers = [
  { name: "Priya Sharma", subject: "IELTS", sessions: 248, rating: 4.96, revenue: 18400, retention: 92 },
  { name: "Rahul Verma", subject: "JEE Physics", sessions: 212, rating: 4.91, revenue: 16200, retention: 88 },
  { name: "Anita Gupta", subject: "English", sessions: 198, rating: 4.89, revenue: 14800, retention: 86 },
  { name: "Vikram Singh", subject: "Maths", sessions: 186, rating: 4.87, revenue: 13600, retention: 84 },
  { name: "Sneha Patel", subject: "Biology", sessions: 174, rating: 4.85, revenue: 12400, retention: 82 },
];

// ─── 11. Quality & Infrastructure ───
export const qualityMetrics = {
  avgRating: 4.72,
  ratingTrend: [
    { month: "Jul", rating: 4.58, reviews: 2400 },
    { month: "Aug", rating: 4.61, reviews: 2800 },
    { month: "Sep", rating: 4.63, reviews: 3100 },
    { month: "Oct", rating: 4.65, reviews: 3400 },
    { month: "Nov", rating: 4.68, reviews: 3800 },
    { month: "Dec", rating: 4.71, reviews: 4200 },
    { month: "Jan", rating: 4.69, reviews: 3900 },
    { month: "Feb", rating: 4.74, reviews: 4400 },
    { month: "Mar", rating: 4.72, reviews: 4600 },
  ],
  techFailureRate: 1.8,
  disputeRefundRate: 2.4,
  aiAutoResolution: 78.6,
  avgResponseTime: "2.4s",
  p99Latency: "142ms",
  uptimePct: 99.97,
};

// ─── 12. NPS Breakdown ───
export const npsBreakdown = {
  promoters: 58,
  passives: 28,
  detractors: 14,
  score: 72,
  trend: [
    { month: "Oct", score: 58 },
    { month: "Nov", score: 62 },
    { month: "Dec", score: 64 },
    { month: "Jan", score: 66 },
    { month: "Feb", score: 70 },
    { month: "Mar", score: 72 },
  ],
};
