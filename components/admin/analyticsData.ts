// ─── 1. Executive KPI Ribbon ───
export const kpiMetrics = [
  { id: "gmv", label: "Gross Merchandise Value", value: "$3.24M", change: "+12.4%", changeType: "up" as const, period: "vs last month" },
  { id: "revenue", label: "Net Platform Revenue", value: "$487K", change: "+8.7%", changeType: "up" as const, period: "vs last month" },
  { id: "hours", label: "Learning Hours Delivered", value: "142,800", change: "+22.1%", changeType: "up" as const, period: "vs last month" },
  { id: "conversion", label: "Trial-to-Paid Conversion", value: "34.2%", change: "+2.1pp", changeType: "up" as const, period: "vs last month" },
];

// ─── 2. Marketplace Liquidity ───
export const subjectDemand = [
  { subject: "IELTS Speaking", searches: 4200, slots: 1800, gap: "high" as const },
  { subject: "JEE Physics", searches: 3800, slots: 3200, gap: "low" as const },
  { subject: "Calculus II", searches: 2900, slots: 1200, gap: "high" as const },
  { subject: "Python / DSA", searches: 2600, slots: 2400, gap: "low" as const },
  { subject: "NEET Biology", searches: 2200, slots: 900, gap: "critical" as const },
  { subject: "Spoken English", searches: 1900, slots: 1700, gap: "low" as const },
  { subject: "Guitar Basics", searches: 1400, slots: 1100, gap: "low" as const },
  { subject: "Data Science", searches: 1200, slots: 400, gap: "critical" as const },
];

export const liquidityMetrics = {
  tutorUtilization: 62.4,
  searchToFill: 71.8,
  avgWaitTime: "4.2 min",
};

export const geoDistribution = [
  { region: "India", students: 48200, teachers: 12400, flag: "🇮🇳" },
  { region: "United States", students: 12800, teachers: 3200, flag: "🇺🇸" },
  { region: "United Kingdom", students: 8400, teachers: 2100, flag: "🇬🇧" },
  { region: "UAE", students: 6200, teachers: 800, flag: "🇦🇪" },
  { region: "Canada", students: 4100, teachers: 1400, flag: "🇨🇦" },
  { region: "Germany", students: 2800, teachers: 900, flag: "🇩🇪" },
];

// ─── 3. Cohort Retention ───
export const cohortData = [
  { cohort: "Jan '26", size: 5200, m1: 72, m2: 58, m3: 44, m4: 38, m5: 32 },
  { cohort: "Feb '26", size: 6100, m1: 74, m2: 61, m3: 48, m4: 41 },
  { cohort: "Mar '26", size: 7400, m1: 78, m2: 64, m3: 51 },
  { cohort: "Apr '26", size: 5800, m1: 71, m2: 59 },
  { cohort: "May '26", size: 6900, m1: 76 },
];

export const retentionMetrics = {
  teacherChurnRate: 8.2,
  avgSessionsPerStudent: 2.4,
  weeklyActiveStreaks: { "7+": 12400, "14+": 6800, "30+": 2100 },
};

// ─── 4. Financial & Unit Economics ───
export const unitEconomics = {
  cac: 42,
  ltv: 186,
  ltvCacRatio: 4.4,
  arpuStudent: 28.40,
  arpuTeacher: 412.00,
  promoDiscountTotal: 124800,
  promoLiftVolume: 18.2,
};

export const monthlyRevenue = [
  { month: "Jul", revenue: 218000, cac: 56 },
  { month: "Aug", revenue: 245000, cac: 53 },
  { month: "Sep", revenue: 282000, cac: 51 },
  { month: "Oct", revenue: 320000, cac: 48 },
  { month: "Nov", revenue: 380000, cac: 45 },
  { month: "Dec", revenue: 410000, cac: 44 },
  { month: "Jan", revenue: 398000, cac: 43 },
  { month: "Feb", revenue: 442000, cac: 41 },
  { month: "Mar", revenue: 487000, cac: 42 },
];

// ─── 5. Quality & Infrastructure ───
export const qualityMetrics = {
  avgRating: 4.72,
  ratingTrend: [
    { month: "Jul", rating: 4.58 },
    { month: "Aug", rating: 4.61 },
    { month: "Sep", rating: 4.63 },
    { month: "Oct", rating: 4.65 },
    { month: "Nov", rating: 4.68 },
    { month: "Dec", rating: 4.71 },
    { month: "Jan", rating: 4.69 },
    { month: "Feb", rating: 4.74 },
    { month: "Mar", rating: 4.72 },
  ],
  techFailureRate: 1.8,
  disputeRefundRate: 2.4,
  aiAutoResolution: 78.6,
};
