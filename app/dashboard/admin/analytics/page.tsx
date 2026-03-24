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

/* ─── 2a. Subject Demand ─── */
const SUPPLY_STATUS: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  low:      { color: "#16A34A", bg: "#F0FDF4", dot: "#22C55E", label: "Healthy" },
  high:     { color: "#B45309", bg: "#FFFBEB", dot: "#F59E0B", label: "Gap" },
  critical: { color: "#DC2626", bg: "#FEF2F2", dot: "#EF4444", label: "Critical" },
};

function SubjectDemandChart() {
  const maxVal = Math.max(...subjectDemand.map((s) => s.searches));
  const data = subjectDemand.map((s) => ({
    ...s,
    fillRate: Math.round((s.slots / s.searches) * 100),
    unmet: s.searches - s.slots,
  }));

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-[#F5F5F5]">
        <div>
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Subject Demand vs Supply</h3>
          <p className="text-[12px] text-[#ACACAC] mt-0.5">Monthly search volume vs available tutor slots</p>
        </div>
        <div className="flex items-center gap-5 text-[11px] text-[#888] pt-0.5">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#1A1A1A] shrink-0" />Searches
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#E2E8F0] shrink-0" />Slots
          </span>
        </div>
      </div>

      {/* Table header */}
      <div className="grid px-7 py-2.5 bg-[#FAFAFA] border-b border-[#F0F0F0]" style={{ gridTemplateColumns: "1fr 80px 80px 90px 80px" }}>
        <span className="text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider">Subject</span>
        <span className="text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Searches</span>
        <span className="text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Slots</span>
        <span className="text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Unmet</span>
        <span className="text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Status</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#F8F8F8]">
        {data.map((s) => {
          const st = SUPPLY_STATUS[s.gap];
          const searchPct = (s.searches / maxVal) * 100;
          const slotPct   = (s.slots   / maxVal) * 100;
          return (
            <div key={s.subject} className="group px-7 py-3.5 hover:bg-[#FAFAFA] transition-colors">
              <div className="grid items-center gap-4" style={{ gridTemplateColumns: "1fr 80px 80px 90px 80px" }}>
                {/* Subject + bars */}
                <div className="flex flex-col gap-2 pr-4">
                  <span className="text-[13px] font-medium text-[#1A1A1A]">{s.subject}</span>
                  <div className="flex flex-col gap-1">
                    <div className="relative w-full h-[5px] bg-[#F0F0F0] rounded-full overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-[#1A1A1A] rounded-full transition-all duration-700" style={{ width: `${searchPct}%` }} />
                    </div>
                    <div className="relative w-full h-[5px] bg-[#F0F0F0] rounded-full overflow-hidden">
                      <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${slotPct}%`, backgroundColor: st.dot }} />
                    </div>
                  </div>
                </div>
                {/* Searches */}
                <span className="text-[13px] text-[#1A1A1A] font-medium tabular-nums text-right">{s.searches.toLocaleString()}</span>
                {/* Slots */}
                <span className="text-[13px] text-[#888] tabular-nums text-right">{s.slots.toLocaleString()}</span>
                {/* Unmet */}
                <span className="text-[13px] tabular-nums text-right font-medium" style={{ color: st.color }}>+{s.unmet.toLocaleString()}</span>
                {/* Status badge */}
                <div className="flex justify-end">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ color: st.color, backgroundColor: st.bg }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: st.dot }} />
                    {st.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="flex items-center justify-between px-7 py-4 bg-[#FAFAFA] border-t border-[#F0F0F0]">
        <div className="flex items-center gap-6">
          {Object.entries(SUPPLY_STATUS).map(([key, st]) => (
            <span key={key} className="flex items-center gap-1.5 text-[11px]" style={{ color: st.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.dot }} />
              {st.label}
            </span>
          ))}
        </div>
        <span className="text-[11px] text-[#ACACAC]">
          {data.filter(s => s.gap === "critical").length} critical · {data.filter(s => s.gap === "high").length} gaps
        </span>
      </div>
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
  const months = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5"];

  // 7-step continuous color scale dark→light
  const cellStyle = (v?: number): { bg: string; text: string; label: string } => {
    if (v === undefined) return { bg: "#F8F8F8", text: "#D0D0D0", label: "—" };
    if (v >= 75) return { bg: "#1E2D5A", text: "#fff", label: `${v}%` };
    if (v >= 65) return { bg: "#293763", text: "#fff", label: `${v}%` };
    if (v >= 55) return { bg: "#3D4D7A", text: "#fff", label: `${v}%` };
    if (v >= 45) return { bg: "#5A6A96", text: "#fff", label: `${v}%` };
    if (v >= 35) return { bg: "#8B96B5", text: "#fff", label: `${v}%` };
    if (v >= 25) return { bg: "#B8C0D4", text: "#293763", label: `${v}%` };
    return { bg: "#DDE1EC", text: "#293763", label: `${v}%` };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F0] p-7">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Student Cohort Retention</h3>
            <p className="text-[12px] text-[#ACACAC] mt-0.5">% of students still active each month after joining</p>
          </div>
          {/* Gradient legend */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-0.5">
              {["#1E2D5A","#293763","#3D4D7A","#5A6A96","#8B96B5","#B8C0D4","#DDE1EC"].map((c) => (
                <div key={c} className="w-5 h-3 rounded-sm" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] text-[#ACACAC]">75%+</span>
              <span className="text-[9px] text-[#ACACAC]">Low</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="pb-3 pr-5 text-[10px] text-[#CACACA] uppercase tracking-wider font-medium whitespace-nowrap">Cohort</th>
                <th className="pb-3 pr-5 text-[10px] text-[#CACACA] uppercase tracking-wider font-medium text-right whitespace-nowrap">Size</th>
                {months.map((m) => (
                  <th key={m} className="pb-3 px-2 text-[10px] text-[#CACACA] uppercase tracking-wider font-medium text-center whitespace-nowrap">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortData.map((c) => {
                const vals = [c.m1, c.m2, c.m3, c.m4, c.m5];
                return (
                  <tr key={c.cohort} className="group">
                    <td className="py-2 pr-5 text-[13px] font-medium text-[#1A1A1A] whitespace-nowrap">{c.cohort}</td>
                    <td className="py-2 pr-5 text-[12px] text-[#ACACAC] text-right tabular-nums whitespace-nowrap">{c.size.toLocaleString()}</td>
                    {vals.map((v, i) => {
                      const s = cellStyle(v);
                      return (
                        <td key={i} className="py-2 px-2 text-center">
                          <span
                            className="inline-flex items-center justify-center w-[58px] h-[30px] rounded-lg text-[12px] font-medium transition-transform duration-150 hover:scale-105"
                            style={{ backgroundColor: s.bg, color: s.text }}
                          >
                            {s.label}
                          </span>
                        </td>
                      );
                    })}
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

/* ─── 4. Unit Economics + Revenue Trend ─── */
function UnitEconomics() {
  const peakRev = Math.max(...monthlyRevenue.map((m) => m.revenue));
  const peakMonth = monthlyRevenue.find((m) => m.revenue === peakRev)?.month ?? "";
  const totalRev = monthlyRevenue.reduce((a, m) => a + m.revenue, 0);
  const avgCac = Math.round(monthlyRevenue.reduce((a, m) => a + m.cac, 0) / monthlyRevenue.length);
  const lastRev = monthlyRevenue[monthlyRevenue.length - 1].revenue;
  const prevRev = monthlyRevenue[monthlyRevenue.length - 2].revenue;
  const momPct = (((lastRev - prevRev) / prevRev) * 100).toFixed(1);

  const ecoRows = [
    { label: "CAC", value: `$${unitEconomics.cac}`, sub: "cost to acquire" },
    { label: "LTV", value: `$${unitEconomics.ltv}`, sub: "lifetime value" },
    { label: "LTV : CAC", value: `${unitEconomics.ltvCacRatio}×`, sub: "efficiency ratio" },
    { label: "ARPU — Student", value: `$${unitEconomics.arpuStudent.toFixed(2)}`, sub: "per month" },
    { label: "ARPU — Teacher", value: `$${unitEconomics.arpuTeacher.toFixed(2)}`, sub: "per month" },
    { label: "Promo Lift", value: `+${unitEconomics.promoLiftVolume}%`, sub: `-$${(unitEconomics.promoDiscountTotal / 1000).toFixed(0)}K discount` },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Unit Economics — table card */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden flex flex-col">
        <div className="px-7 pt-7 pb-5 border-b border-[#F5F5F5]">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Unit Economics</h3>
          <p className="text-[12px] text-[#ACACAC] mt-0.5">Per-student acquisition &amp; value</p>
        </div>
        {/* col headers */}
        <div className="grid grid-cols-2 px-7 py-2.5 bg-[#FAFAFA] border-b border-[#F0F0F0]">
          <span className="text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider">Metric</span>
          <span className="text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Value</span>
        </div>
        <div className="divide-y divide-[#F8F8F8] flex-1">
          {ecoRows.map((r) => (
            <div key={r.label} className="grid grid-cols-2 items-center px-7 py-3.5 hover:bg-[#FAFAFA] transition-colors">
              <div>
                <p className="text-[13px] font-medium text-[#1A1A1A]">{r.label}</p>
                <p className="text-[11px] text-[#CACACA] mt-0.5">{r.sub}</p>
              </div>
              <p className="text-[15px] font-medium text-[#1A1A1A] text-right tabular-nums">{r.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Trend — chart card */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-[#F5F5F5]">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Revenue Trend</h3>
            <p className="text-[12px] text-[#ACACAC] mt-0.5">{monthlyRevenue[0].month} – {monthlyRevenue[monthlyRevenue.length - 1].month} 2025</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[22px] font-medium text-[#1A1A1A] tracking-tight leading-none">${(lastRev / 1000).toFixed(0)}K</span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-[#16A34A]">
              <TrendUp size={11} weight="bold" />+{momPct}% vs last month
            </span>
          </div>
        </div>
        {/* Chart */}
        <div className="flex-1 px-2 pt-5 pb-2" style={{ minHeight: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="aRevGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#293763" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#293763" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#ACACAC" }} axisLine={false} tickLine={false} dy={6} />
              <YAxis tick={{ fontSize: 11, fill: "#ACACAC" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} width={48} domain={[150000, "auto"]} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Net Revenue" stroke="#293763" fill="url(#aRevGrad2)" strokeWidth={2.5}
                dot={{ r: 4, fill: "#293763", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#293763", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Footer KPI strip */}
        <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] border-t border-[#F0F0F0]">
          {[
            { label: "Peak Month", value: `$${(peakRev / 1000).toFixed(0)}K`, sub: peakMonth },
            { label: "9-Month Total", value: `$${(totalRev / 1_000_000).toFixed(2)}M`, sub: "Jul – Mar" },
            { label: "Avg CAC", value: `$${avgCac}`, sub: "per student" },
          ].map((k) => (
            <div key={k.label} className="px-6 py-4 hover:bg-[#FAFAFA] transition-colors">
              <p className="text-[10px] text-[#ACACAC] uppercase tracking-wider mb-1">{k.label}</p>
              <p className="text-[18px] font-medium text-[#1A1A1A] leading-none tabular-nums">{k.value}</p>
              <p className="text-[11px] text-[#CACACA] mt-0.5">{k.sub}</p>
            </div>
          ))}
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
