"use client";
import { TrendUp, TrendDown } from "@phosphor-icons/react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Cell, ReferenceLine,
} from "recharts";
import {
  kpiMetrics,
  subjectDemand,
  liquidityMetrics,
  geoDistribution,
  cohortData,
  retentionMetrics,
  unitEconomics,
  monthlyRevenue,
  qualityMetrics,
} from "@/components/admin/analyticsData";

/* ─── Shared Tooltip ─── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)] px-4 py-3 font-matter">
      <p className="text-[11px] font-medium text-[#1A1A1A] mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-[11px] mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || p.stroke }} />
          <span className="text-[#777]">{p.name}:</span>
          <span className="text-[#1A1A1A] font-medium tabular-nums">{
            typeof p.value === "number" && p.value > 1000
              ? p.value >= 1_000_000 ? `$${(p.value / 1_000_000).toFixed(1)}M` : `$${(p.value / 1_000).toFixed(0)}K`
              : p.value
          }</span>
        </div>
      ))}
    </div>
  );
}

function RatingTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)] px-4 py-3 font-matter">
      <p className="text-[11px] font-medium text-[#1A1A1A] mb-1">{label}</p>
      <p className="text-[12px] text-[#555]">Rating: <span className="font-medium text-[#1A1A1A]">{payload[0].value}</span></p>
    </div>
  );
}

/* ─── 1. KPI Ribbon ─── */
function KPIRibbon() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpiMetrics.map((m) => (
        <div key={m.id} className="bg-white rounded-2xl p-6 border border-[#F0F0F0]">
          <p className="text-[13px] text-[#ACACAC] font-normal mb-4">{m.label}</p>
          <p className="text-[26px] font-normal text-[#1A1A1A] tracking-tight leading-none mb-2.5">{m.value}</p>
          <span className="flex items-center gap-1 text-[11px] font-normal text-[#ACACAC]">
            {m.changeType === "up" ? <TrendUp size={11} weight="bold" /> : <TrendDown size={11} weight="bold" />}
            {m.change} <span className="text-[#DCDCDC] ml-0.5">{m.period}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── 2a. Subject Demand — Horizontal Bar Chart ─── */
function SubjectDemandChart() {
  const data = subjectDemand.map((s) => ({
    subject: s.subject,
    searches: s.searches,
    slots: s.slots,
    fillRate: Math.round((s.slots / s.searches) * 100),
  }));

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Subject Demand vs Supply</h3>
        <div className="flex items-center gap-4 text-[11px] text-[#ACACAC]">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1A1A1A]" />Searches</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D4D4D4]" />Available Slots</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }} barGap={2} barSize={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
          <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: "#555" }} axisLine={false} tickLine={false} width={100} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="searches" name="Searches" fill="#1A1A1A" radius={[0, 4, 4, 0]} animationDuration={600} />
          <Bar dataKey="slots" name="Slots" fill="#D4D4D4" radius={[0, 4, 4, 0]} animationDuration={600} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── 2b. Liquidity + Geo ─── */
function LiquidityPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 flex flex-col">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season mb-7">Marketplace Health</h3>
        <div className="flex flex-col gap-6 flex-1">
          {[
            { label: "Tutor Utilization Rate", value: `${liquidityMetrics.tutorUtilization}%`, bar: liquidityMetrics.tutorUtilization },
            { label: "Search-to-Fill Ratio", value: `${liquidityMetrics.searchToFill}%`, bar: liquidityMetrics.searchToFill },
          ].map((m) => (
            <div key={m.label} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-normal text-[#555]">{m.label}</span>
                <span className="text-[13px] font-normal text-[#1A1A1A]">{m.value}</span>
              </div>
              <div className="w-full h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#1A1A1A] transition-all duration-500" style={{ width: `${m.bar}%` }} />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-auto pt-5 border-t border-[#F5F5F5]">
            <span className="text-[13px] font-normal text-[#888]">Avg Wait to Match</span>
            <span className="text-[13px] font-normal text-[#1A1A1A]">{liquidityMetrics.avgWaitTime}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season mb-5">Geographic Distribution</h3>
        <div className="flex flex-col">
          <div className="flex items-center pb-3 border-b border-[#F5F5F5]">
            <span className="text-[10px] text-[#CACACA] uppercase tracking-wider flex-1">Region</span>
            <span className="text-[10px] text-[#CACACA] uppercase tracking-wider w-[80px] text-right">Students</span>
            <span className="text-[10px] text-[#CACACA] uppercase tracking-wider w-[80px] text-right">Teachers</span>
            <span className="text-[10px] text-[#CACACA] uppercase tracking-wider w-[50px] text-right">Ratio</span>
          </div>
          {geoDistribution.map((g) => {
            const ratio = g.students / g.teachers;
            return (
              <div key={g.region} className="flex items-center py-3 border-b border-[#F8F8F8] last:border-none">
                <span className="text-[12px] text-[#1A1A1A] flex-1 flex items-center gap-2">
                  <span className="text-[14px]">{g.flag}</span> {g.region}
                </span>
                <span className="text-[12px] text-[#888] w-[80px] text-right">{g.students.toLocaleString()}</span>
                <span className="text-[12px] text-[#888] w-[80px] text-right">{g.teachers.toLocaleString()}</span>
                <span className={`text-[11px] font-normal w-[50px] text-right ${ratio > 5 ? "text-[#E08A3C]" : "text-[#ACACAC]"}`}>
                  {ratio.toFixed(1)}:1
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── 3. Cohort Retention ─── */
function CohortRetention() {
  const months = ["M1", "M2", "M3", "M4", "M5"];
  const cellStyle = (v?: number): string => {
    if (v === undefined) return "bg-[#F8F8F8] text-[#DCDCDC]";
    if (v >= 70) return "bg-[#293763] text-white";
    if (v >= 50) return "bg-[#3D4D7A] text-white";
    if (v >= 35) return "bg-[#8B96B5] text-white";
    return "bg-[#C8CEE0] text-[#293763]";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F0] p-7">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season mb-5">Student Cohort Retention</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-2.5 pr-4 text-[10px] text-[#CACACA] uppercase tracking-wider font-medium">Cohort</th>
                <th className="py-2.5 pr-4 text-[10px] text-[#CACACA] uppercase tracking-wider font-medium text-right">Size</th>
                {months.map((m) => (
                  <th key={m} className="py-2.5 px-1.5 text-[10px] text-[#CACACA] uppercase tracking-wider font-medium text-center">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortData.map((c) => {
                const vals = [c.m1, c.m2, c.m3, c.m4, c.m5];
                return (
                  <tr key={c.cohort}>
                    <td className="py-2 pr-4 text-[12px] text-[#1A1A1A]">{c.cohort}</td>
                    <td className="py-2 pr-4 text-[12px] text-[#ACACAC] text-right">{c.size.toLocaleString()}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="py-2 px-1.5 text-center">
                        <span className={`inline-block w-[48px] py-1 rounded text-[11px] font-normal ${cellStyle(v)}`}>
                          {v !== undefined ? `${v}%` : "—"}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 flex flex-col">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season mb-6">Engagement Metrics</h3>
        <div className="flex flex-col gap-5 flex-1">
          <div>
            <p className="text-[11px] text-[#ACACAC] uppercase tracking-wider mb-1.5">Teacher Churn (30d)</p>
            <p className="text-[26px] font-normal text-[#1A1A1A] tracking-tight leading-none">{retentionMetrics.teacherChurnRate}%</p>
          </div>
          <div>
            <p className="text-[11px] text-[#ACACAC] uppercase tracking-wider mb-1.5">Avg Sessions / Student / Week</p>
            <p className="text-[26px] font-normal text-[#1A1A1A] tracking-tight leading-none">{retentionMetrics.avgSessionsPerStudent}</p>
          </div>
          <div className="mt-auto pt-5 border-t border-[#F5F5F5]">
            <p className="text-[11px] text-[#ACACAC] uppercase tracking-wider mb-3">Active Learning Streaks</p>
            <div className="flex flex-col gap-2.5">
              {Object.entries(retentionMetrics.weeklyActiveStreaks).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-[12px] text-[#888]">{k} days</span>
                  <span className="text-[12px] font-normal text-[#1A1A1A]">{v.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 4. Unit Economics + Revenue Trend (Recharts) ─── */
function UnitEconomics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 flex flex-col">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season mb-7">Unit Economics</h3>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#888]">CAC</span>
            <span className="text-[15px] font-normal text-[#1A1A1A]">${unitEconomics.cac}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#888]">LTV</span>
            <span className="text-[15px] font-normal text-[#1A1A1A]">${unitEconomics.ltv}</span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F5]">
            <span className="text-[13px] text-[#888]">LTV:CAC Ratio</span>
            <span className="text-[15px] font-normal text-[#1A1A1A]">{unitEconomics.ltvCacRatio}:1</span>
          </div>
        </div>
        <div className="mt-auto pt-5 border-t border-[#F5F5F5] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#888]">ARPU (Student)</span>
            <span className="text-[13px] text-[#1A1A1A]">${unitEconomics.arpuStudent.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#888]">ARPU (Teacher)</span>
            <span className="text-[13px] text-[#1A1A1A]">${unitEconomics.arpuTeacher.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[#F5F5F5]">
            <span className="text-[12px] text-[#ACACAC]">Promo Discount</span>
            <span className="text-[12px] text-[#ACACAC]">-${(unitEconomics.promoDiscountTotal / 1000).toFixed(0)}K → +{unitEconomics.promoLiftVolume}% vol</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F0] p-7 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Revenue Trend</h3>
          <span className="text-[11px] text-[#CACACA]">{monthlyRevenue[0].month} — {monthlyRevenue[monthlyRevenue.length - 1].month}</span>
        </div>
        <div className="flex-1" style={{ minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aRevGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A1A1A" stopOpacity={0.06} />
                  <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Net Revenue"
                stroke="#1A1A1A"
                fill="url(#aRevGrad2)"
                strokeWidth={2}
                dot={{ r: 3, fill: "#1A1A1A", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#1A1A1A", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ─── 5. Quality & Infra (Recharts) ─── */
function QualityOps() {
  const { ratingTrend } = qualityMetrics;

  const metrics = [
    { label: "Tech Failure Rate", value: `${qualityMetrics.techFailureRate}%`, target: "< 2%", ok: qualityMetrics.techFailureRate < 2 },
    { label: "Dispute / Refund Rate", value: `${qualityMetrics.disputeRefundRate}%`, target: "< 3%", ok: qualityMetrics.disputeRefundRate < 3 },
    { label: "AI Auto-Resolution", value: `${qualityMetrics.aiAutoResolution}%`, target: "> 75%", ok: qualityMetrics.aiAutoResolution > 75 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Session Rating</h3>
          <span className="text-[11px] font-normal text-[#ACACAC] bg-[#F7F7F7] px-2.5 py-1 rounded-full">Target: 4.7</span>
        </div>
        <p className="text-[32px] font-normal text-[#1A1A1A] tracking-tight leading-none mb-5">
          {qualityMetrics.avgRating}
          <span className="text-[14px] text-[#DCDCDC] ml-1 font-normal">/ 5.0</span>
        </p>
        <div style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} />
              <YAxis domain={[4.5, 4.85]} tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} />
              <ReferenceLine y={4.7} stroke="#E08A3C" strokeDasharray="4 3" strokeWidth={1} />
              <Tooltip content={<RatingTooltip />} />
              <Line
                type="monotone"
                dataKey="rating"
                name="Rating"
                stroke="#1A1A1A"
                strokeWidth={2}
                dot={{ r: 3, fill: "#1A1A1A", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#1A1A1A", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 flex flex-col">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season mb-6">Infrastructure & Quality</h3>
        <div className="flex flex-col gap-1 flex-1">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between py-4 border-b border-[#F8F8F8] last:border-none">
              <div>
                <p className="text-[13px] text-[#555]">{m.label}</p>
                <p className="text-[10px] text-[#DCDCDC] mt-0.5">Target: {m.target}</p>
              </div>
              <span className={`text-[20px] font-normal tracking-tight ${m.ok ? "text-[#1A1A1A]" : "text-[#E08A3C]"}`}>
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <KPIRibbon />
      <div className="flex flex-col gap-6">
        <SubjectDemandChart />
        <LiquidityPanel />
      </div>
      <CohortRetention />
      <UnitEconomics />
      <QualityOps />
    </div>
  );
}
