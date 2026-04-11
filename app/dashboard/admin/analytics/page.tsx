"use client";
import { memo, useId } from "react";
import { TrendUp, TrendDown } from "@phosphor-icons/react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, PieChart, Pie,
} from "recharts";
import {
  kpiMetrics, funnelData, subjectDemand, liquidityMetrics, geoDistribution,
  hourlyTraffic, durationDistribution, cohortData, retentionMetrics,
  wauTrend, unitEconomics, monthlyRevenue, channelAttribution,
  topTeachers, qualityMetrics, npsBreakdown,
} from "@/components/admin/analyticsData";
import { useCurrency } from "@/components/admin/context/CurrencyContext";

/* ─── Shared Tooltip ─── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)] px-4 py-3 font-matter min-w-[140px]">
      <p className="text-[11px] font-medium text-[#1A1A1A] mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 text-[11px] mb-0.5">
          <span className="flex items-center gap-1.5 text-[#777]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || p.stroke }} />
            {p.name}
          </span>
          <span className="text-[#1A1A1A] font-medium tabular-nums">{
            typeof p.value === "number" && p.value > 1000
              ? p.value >= 1_000_000 ? `${(p.value / 1_000_000).toFixed(1)}M` : `${(p.value / 1_000).toFixed(1)}K`
              : p.value
          }</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Mini Sparkline (SVG) ─── */
function Spark({ data, color = "#1A1A1A", w = 64, h = 24 }: { data: number[]; color?: string; w?: number; h?: number }) {
  const uid = useId().replace(/:/g, "");
  const pad = 2;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpx = (pts[i].x + pts[i + 1].x) / 2;
    d += ` C ${cpx} ${pts[i].y}, ${cpx} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  const area = `${d} L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <defs>
        <linearGradient id={`sp-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sp-${uid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2" fill={color} />
    </svg>
  );
}

/* ─── 1. KPI Ribbon (horizontally scrollable strip like Platform Health Banner) ─── */
function KPIRibbon() {
  const { formatCurrency } = useCurrency();
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-7 py-3.5 sm:py-5 border-b border-[#F5F5F5]">
        <h3 className="text-[14px] sm:text-[15px] font-medium text-[#1A1A1A] font-season">Executive KPIs</h3>
        <span className="text-[10px] sm:text-[11px] text-[#CACACA]">Last 30 days</span>
      </div>
      {/* Scrollable strip */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="flex divide-x divide-[#F5F5F5] min-w-max">
          {kpiMetrics.map((m) => {
            const displayValue = m.usdValue ? formatCurrency(m.usdValue, { compact: true }) : m.value;
            const sparkColor = m.changeType === "up" ? "#E08A3C" : "#293763";
            return (
              <div key={m.id} className="px-4 sm:px-6 py-4 sm:py-5 hover:bg-[#FAFAFA] transition-colors min-w-[160px] sm:min-w-[180px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] sm:text-[12px] text-[#ACACAC] font-normal">{m.label}</span>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[20px] sm:text-[24px] font-normal text-[#1A1A1A] tracking-tight leading-none mb-1.5">{displayValue}</p>
                    <span className="flex items-center gap-1 text-[10px] font-normal text-[#ACACAC]">
                      {m.changeType === "up" ? <TrendUp size={10} weight="bold" className="text-[#E08A3C]" /> : <TrendDown size={10} weight="bold" className="text-[#293763]" />}
                      {m.change}
                    </span>
                  </div>
                  {m.sparkline && <Spark data={m.sparkline} color={sparkColor} w={64} h={28} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── 2. Conversion Funnel ─── */
function ConversionFunnel() {
  const maxCount = funnelData[0].count;
  const endToEnd = ((funnelData[funnelData.length - 1].count / funnelData[0].count) * 100).toFixed(1);
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-4 sm:p-7 relative">
      {/* Sticky chip */}
      <div className="absolute top-4 right-4 sm:top-7 sm:right-7 z-10">
        <span className="text-[10px] sm:text-[11px] text-[#E08A3C] font-medium bg-[#FFF7ED] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
          {endToEnd}% end-to-end
        </span>
      </div>
      {/* Header */}
      <div className="mb-5 sm:mb-6 pr-[100px] sm:pr-[120px]">
        <h3 className="text-[14px] sm:text-[15px] font-medium text-[#1A1A1A] font-season">Conversion Funnel</h3>
        <p className="text-[11px] sm:text-[12px] text-[#ACACAC] mt-0.5">Visitor → Retained student</p>
      </div>
      {/* Funnel steps */}
      <div className="flex flex-col gap-2.5 sm:gap-3">
        {funnelData.map((step, i) => {
          const pct = (step.count / maxCount) * 100;
          const dropoff = i > 0 ? ((1 - step.count / funnelData[i - 1].count) * 100).toFixed(0) : null;
          return (
            <div key={step.stage}>
              <div className="flex items-center justify-between mb-1 sm:mb-1.5 gap-2">
                <span className="text-[11px] sm:text-[12px] font-medium text-[#1A1A1A] truncate">{step.stage}</span>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {dropoff && (
                    <span className="text-[9px] sm:text-[10px] text-[#CACACA] hidden xs:inline">-{dropoff}%</span>
                  )}
                  <span className="text-[11px] sm:text-[12px] font-medium text-[#1A1A1A] tabular-nums w-[50px] sm:w-[60px] text-right">{step.count.toLocaleString()}</span>
                </div>
              </div>
              <div className="relative w-full h-[6px] sm:h-[8px] bg-[#F0F0F0] rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: step.color }} />
              </div>
              {/* Mobile dropoff shown below bar */}
              {dropoff && (
                <span className="text-[9px] text-[#CACACA] mt-0.5 block xs:hidden">↓ {dropoff}% drop</span>
              )}
            </div>
          );
        })}
      </div>
      {/* Summary row */}
      <div className="flex items-center justify-between mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-[#F5F5F5]">
        <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-[#ACACAC] overflow-x-auto">
          <span className="shrink-0">{funnelData[0].count.toLocaleString()} visitors</span>
          <span className="text-[#DCDCDC] shrink-0">→</span>
          <span className="shrink-0 font-medium text-[#1A1A1A]">{funnelData[funnelData.length - 1].count.toLocaleString()} retained</span>
        </div>
        <span className="text-[10px] text-[#CACACA] shrink-0 hidden sm:inline">30-day window</span>
      </div>
    </div>
  );
}

/* ─── 3. WAU Trend ─── */
function WAUTrend() {
  const latest = wauTrend[wauTrend.length - 1];
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 flex flex-col">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Weekly Active Users</h3>
          <p className="text-[12px] text-[#ACACAC] mt-0.5">12-week trend</p>
        </div>
        <div className="text-right">
          <p className="text-[18px] font-medium text-[#1A1A1A] tracking-tight leading-none">{(latest.students / 1000).toFixed(1)}K</p>
          <p className="text-[10px] text-[#ACACAC] mt-0.5">students this week</p>
        </div>
      </div>
      <div className="flex items-center gap-5 mb-3">
        <span className="flex items-center gap-1.5 text-[11px] text-[#999]"><span className="w-3 h-[2px] bg-[#293763] rounded-full" /> Students</span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#999]"><span className="w-3 h-[2px] bg-[#E08A3C] rounded-full" /> Teachers</span>
      </div>
      <div className="flex-1 min-h-0" style={{ minHeight: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={wauTrend} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="wauStu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#293763" stopOpacity={0.1} /><stop offset="100%" stopColor="#293763" stopOpacity={0} /></linearGradient>
              <linearGradient id="wauTch" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E08A3C" stopOpacity={0.08} /><stop offset="100%" stopColor="#E08A3C" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 9, fill: "#CACACA" }} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={36} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="students" name="Students" stroke="#293763" fill="url(#wauStu)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#293763", stroke: "#fff", strokeWidth: 2 }} />
            <Area type="monotone" dataKey="teachers" name="Teachers" stroke="#E08A3C" fill="url(#wauTch)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#E08A3C", stroke: "#fff", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── 4. Hourly Traffic ─── */
function HourlyTraffic() {
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Hourly Traffic Pattern</h3>
          <p className="text-[12px] text-[#ACACAC] mt-0.5">Sessions &amp; bookings by hour (today)</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] text-[#999]"><span className="w-3 h-3 rounded-sm bg-[#293763]" /> Sessions</span>
          <span className="flex items-center gap-1.5 text-[11px] text-[#999]"><span className="w-3 h-[2px] bg-[#E08A3C] rounded-full" /> Bookings</span>
        </div>
      </div>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={hourlyTraffic} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="htBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#293763" /><stop offset="100%" stopColor="#3D4D7A" stopOpacity={0.8} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#CACACA" }} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} width={36} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="sessions" name="Sessions" fill="url(#htBar)" radius={[3, 3, 0, 0]} barSize={12} />
            <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#E08A3C" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#E08A3C", stroke: "#fff", strokeWidth: 2 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── 5. Session Duration Distribution ─── */
function DurationChart() {
  const maxPct = Math.max(...durationDistribution.map((d) => d.pct));
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7">
      <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season mb-2">Session Duration</h3>
      <p className="text-[12px] text-[#ACACAC] mb-6">Distribution of class lengths</p>
      <div className="flex flex-col gap-4">
        {durationDistribution.map((d) => {
          const isMax = d.pct === maxPct;
          return (
            <div key={d.range} className="flex items-center gap-4">
              <span className="text-[12px] text-[#888] w-[60px] shrink-0 text-right tabular-nums">{d.range}</span>
              <div className="flex-1 h-[10px] bg-[#F0F0F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d.pct / maxPct) * 100}%`, backgroundColor: isMax ? "#E08A3C" : "#293763" }} />
              </div>
              <span className="text-[11px] font-medium text-[#1A1A1A] w-[40px] tabular-nums">{d.pct}%</span>
              <span className="text-[10px] text-[#CACACA] w-[50px] tabular-nums text-right">{d.count.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 6. Subject Demand ─── */
const SUPPLY_STATUS: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  low: { color: "#293763", bg: "#F0F3FA", dot: "#293763", label: "Healthy" },
  high: { color: "#B45309", bg: "#FFF7ED", dot: "#E08A3C", label: "Gap" },
  critical: { color: "#9A3412", bg: "#FFF1E6", dot: "#C2571A", label: "Critical" },
};

function SubjectDemandChart() {
  const maxVal = Math.max(...subjectDemand.map((s) => s.searches));
  const data = subjectDemand.map((s) => ({ ...s, unmet: s.searches - s.slots }));
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden max-h-[480px] flex flex-col">
      <div className="flex items-start justify-between px-5 sm:px-7 pt-6 pb-4 border-b border-[#F5F5F5] shrink-0">
        <div>
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Subject Demand vs Supply</h3>
          <p className="text-[12px] text-[#ACACAC] mt-0.5">Search volume vs available tutor slots</p>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(SUPPLY_STATUS).map(([k, st]) => (
            <span key={k} className="flex items-center gap-1 text-[10px]" style={{ color: st.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.dot }} />{st.label}
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#F0F0F0]">
              <th className="py-2.5 pl-5 sm:pl-7 pr-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider">Subject</th>
              <th className="py-2.5 px-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Searches</th>
              <th className="py-2.5 px-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Slots</th>
              <th className="py-2.5 px-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider">Fill</th>
              <th className="py-2.5 pr-5 sm:pr-7 pl-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s, i) => {
              const st = SUPPLY_STATUS[s.gap];
              const fillPct = (s.slots / s.searches) * 100;
              return (
                <tr key={s.subject} className={`hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-3.5 pl-5 sm:pl-7 pr-3 text-[13px] font-medium text-[#1A1A1A]">{s.subject}</td>
                  <td className="py-3.5 px-3 text-[12px] text-[#1A1A1A] tabular-nums text-right">{s.searches.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-[12px] text-[#888] tabular-nums text-right">{s.slots.toLocaleString()}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-[80px] h-[5px] bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${fillPct}%`, backgroundColor: st.dot }} />
                      </div>
                      <span className="text-[10px] text-[#ACACAC] tabular-nums">{fillPct.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-5 sm:pr-7 pl-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: st.color, backgroundColor: st.bg }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.dot }} />{st.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── 7. Marketplace Health + Geo ─── */
function MarketplaceGeo() {
  const { formatCurrency } = useCurrency();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Marketplace Health */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F0] p-7 flex flex-col">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season mb-6">Marketplace Health</h3>
        <div className="flex flex-col gap-5 flex-1">
          {[
            { label: "Tutor Utilization", value: `${liquidityMetrics.tutorUtilization}%`, bar: liquidityMetrics.tutorUtilization },
            { label: "Search-to-Fill", value: `${liquidityMetrics.searchToFill}%`, bar: liquidityMetrics.searchToFill },
            { label: "Avg Match Score", value: `${liquidityMetrics.avgMatchScore}%`, bar: liquidityMetrics.avgMatchScore },
            { label: "Repeat Booking Rate", value: `${liquidityMetrics.repeatBookingRate}%`, bar: liquidityMetrics.repeatBookingRate },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-[#555]">{m.label}</span>
                <span className="text-[12px] font-medium text-[#1A1A1A] tabular-nums">{m.value}</span>
              </div>
              <div className="w-full h-[5px] bg-[#F0F0F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#293763] transition-all duration-500" style={{ width: `${m.bar}%` }} />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F5F5F5]">
            <span className="text-[12px] text-[#888]">Avg Wait to Match</span>
            <span className="text-[12px] font-medium text-[#1A1A1A]">{liquidityMetrics.avgWaitTime}</span>
          </div>
        </div>
      </div>
      {/* Geo Distribution */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-[#F0F0F0] p-7 flex flex-col max-h-[480px]">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season mb-5 shrink-0">Geographic Distribution</h3>
        <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[420px]">
            <thead>
              <tr className="border-b border-[#F5F5F5]">
                <th className="pb-3 text-[10px] text-[#CACACA] uppercase tracking-wider">Region</th>
                <th className="pb-3 text-[10px] text-[#CACACA] uppercase tracking-wider text-right">Students</th>
                <th className="pb-3 text-[10px] text-[#CACACA] uppercase tracking-wider text-right">Teachers</th>
                <th className="pb-3 text-[10px] text-[#CACACA] uppercase tracking-wider text-right">Revenue</th>
                <th className="pb-3 text-[10px] text-[#CACACA] uppercase tracking-wider text-right">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {geoDistribution.map((g) => {
                const ratio = g.students / g.teachers;
                return (
                  <tr key={g.region} className="border-b border-[#F8F8F8] last:border-none hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-3 text-[12px] text-[#1A1A1A] flex items-center gap-2"><span className="text-[14px]">{g.flag}</span> {g.region}</td>
                    <td className="py-3 text-[12px] text-[#888] text-right tabular-nums">{g.students.toLocaleString()}</td>
                    <td className="py-3 text-[12px] text-[#888] text-right tabular-nums">{g.teachers.toLocaleString()}</td>
                    <td className="py-3 text-[12px] text-[#1A1A1A] font-medium text-right tabular-nums">{formatCurrency(g.revenue, { compact: true })}</td>
                    <td className={`py-3 text-[11px] text-right tabular-nums ${ratio > 5 ? "text-[#E08A3C] font-medium" : "text-[#ACACAC]"}`}>{ratio.toFixed(1)}:1</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── 8. Cohort Retention ─── */
function CohortRetention() {
  const months = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5"];
  const shortMonths = ["M1", "M2", "M3", "M4", "M5"];
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

  const engagementMetrics = [
    { label: "Student Churn (30d)", value: `${retentionMetrics.studentChurnRate}%`, warn: retentionMetrics.studentChurnRate > 15 },
    { label: "Teacher Churn (30d)", value: `${retentionMetrics.teacherChurnRate}%`, warn: retentionMetrics.teacherChurnRate > 10 },
    { label: "Avg Sessions / Student / Wk", value: `${retentionMetrics.avgSessionsPerStudent}` },
    { label: "Avg Sessions / Teacher / Wk", value: `${retentionMetrics.avgSessionsPerTeacher}` },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Cohort heatmap */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F0] p-4 sm:p-7 self-start">
        <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 mb-4 sm:mb-6">
          <div>
            <h3 className="text-[14px] sm:text-[15px] font-medium text-[#1A1A1A] font-season">Student Cohort Retention</h3>
            <p className="text-[11px] sm:text-[12px] text-[#ACACAC] mt-0.5">% still active each month after joining</p>
          </div>
          {/* Legend — hidden on xs, shown on sm+ */}
          <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-0.5">
              {["#1E2D5A","#293763","#3D4D7A","#5A6A96","#8B96B5","#B8C0D4","#DDE1EC"].map((c) => (
                <div key={c} className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] text-[#ACACAC]">75%+</span>
              <span className="text-[9px] text-[#ACACAC]">Low</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[420px]">
            <thead><tr>
              <th className="pb-2 sm:pb-3 pr-2 sm:pr-4 text-[9px] sm:text-[10px] text-[#CACACA] uppercase tracking-wider font-medium">Cohort</th>
              <th className="pb-2 sm:pb-3 pr-2 sm:pr-4 text-[9px] sm:text-[10px] text-[#CACACA] uppercase tracking-wider font-medium text-right">Size</th>
              {months.map((m, mi) => (
                <th key={m} className="pb-2 sm:pb-3 px-1 sm:px-1.5 text-[9px] sm:text-[10px] text-[#CACACA] uppercase tracking-wider font-medium text-center">
                  <span className="hidden sm:inline">{m}</span>
                  <span className="sm:hidden">{shortMonths[mi]}</span>
                </th>
              ))}
            </tr></thead>
            <tbody>
              {cohortData.map((c) => {
                const vals = [c.m1, c.m2, c.m3, c.m4, c.m5];
                return (
                  <tr key={c.cohort}>
                    <td className="py-1.5 sm:py-2 pr-2 sm:pr-4 text-[11px] sm:text-[13px] font-medium text-[#1A1A1A] whitespace-nowrap">{c.cohort}</td>
                    <td className="py-1.5 sm:py-2 pr-2 sm:pr-4 text-[10px] sm:text-[12px] text-[#ACACAC] text-right tabular-nums">{c.size.toLocaleString()}</td>
                    {vals.map((v, i) => { const s = cellStyle(v); return (
                      <td key={i} className="py-1.5 sm:py-2 px-0.5 sm:px-1.5 text-center">
                        <span className="inline-flex items-center justify-center w-[40px] h-[24px] sm:w-[52px] sm:h-[28px] rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-medium hover:scale-105 transition-transform" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                      </td>
                    ); })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement sidebar */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-4 sm:p-7 flex flex-col max-h-[480px]">
        <h3 className="text-[14px] sm:text-[15px] font-medium text-[#1A1A1A] font-season mb-4 sm:mb-6 shrink-0">Engagement</h3>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
        {/* On mobile: 2x2 grid. On desktop: stacked list */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-5 flex-1">
          {engagementMetrics.map((m) => (
            <div key={m.label}>
              <p className="text-[10px] sm:text-[11px] text-[#ACACAC] uppercase tracking-wider mb-1">{m.label}</p>
              <p className={`text-[20px] sm:text-[24px] font-normal tracking-tight leading-none ${m.warn ? "text-[#E08A3C]" : "text-[#1A1A1A]"}`}>{m.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 sm:mt-auto pt-3 sm:pt-4 border-t border-[#F5F5F5]">
          <p className="text-[10px] sm:text-[11px] text-[#ACACAC] uppercase tracking-wider mb-2 sm:mb-3">Active Streaks</p>
          {Object.entries(retentionMetrics.weeklyActiveStreaks).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-1 sm:py-1.5">
              <span className="text-[11px] sm:text-[12px] text-[#888]">{k} days</span>
              <span className="text-[11px] sm:text-[12px] font-medium text-[#1A1A1A] tabular-nums">{v.toLocaleString()}</span>
            </div>
          ))}
        </div>
        </div>{/* end scroll wrapper */}
      </div>
    </div>
  );
}

/* ─── 9. Revenue Trend + Unit Economics ─── */
function RevenueEconomics() {
  const { formatCurrency, convert, currency } = useCurrency();
  const lastRev = monthlyRevenue[monthlyRevenue.length - 1].revenue;
  const prevRev = monthlyRevenue[monthlyRevenue.length - 2].revenue;
  const momPct = (((lastRev - prevRev) / prevRev) * 100).toFixed(1);
  const totalRev = monthlyRevenue.reduce((a, m) => a + m.revenue, 0);
  const peakRev = Math.max(...monthlyRevenue.map((m) => m.revenue));
  const peakMonth = monthlyRevenue.find((m) => m.revenue === peakRev)?.month ?? "";
  const avgCac = Math.round(monthlyRevenue.reduce((a, m) => a + m.cac, 0) / monthlyRevenue.length);

  function fmt(v: number) {
    if (Math.abs(v) >= 1_000_000) return `${currency.symbol}${(v / 1_000_000).toFixed(1)}M`;
    if (Math.abs(v) >= 1_000) return `${currency.symbol}${(v / 1_000).toFixed(0)}K`;
    return `${currency.symbol}${v.toFixed(0)}`;
  }

  const chartData = monthlyRevenue.map((d) => ({ ...d, revenue: convert(d.revenue) }));

  const ecoRows = [
    { label: "CAC", value: formatCurrency(unitEconomics.cac), sub: "cost to acquire" },
    { label: "LTV", value: formatCurrency(unitEconomics.ltv), sub: "lifetime value" },
    { label: "LTV : CAC", value: `${unitEconomics.ltvCacRatio}×`, sub: "efficiency ratio" },
    { label: "Gross Margin", value: `${unitEconomics.grossMargin}%`, sub: "after payouts" },
    { label: "Payback Period", value: `${unitEconomics.paybackPeriodDays}d`, sub: "CAC recovery" },
    { label: "Promo Lift", value: `+${unitEconomics.promoLiftVolume}%`, sub: `${formatCurrency(unitEconomics.promoDiscountTotal, { compact: true })} spent` },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Unit Economics */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden flex flex-col">
        <div className="px-7 pt-6 pb-4 border-b border-[#F5F5F5]">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Unit Economics</h3>
          <p className="text-[12px] text-[#ACACAC] mt-0.5">Acquisition &amp; value metrics</p>
        </div>
        <div className="divide-y divide-[#F8F8F8] flex-1">
          {ecoRows.map((r) => (
            <div key={r.label} className="flex items-center justify-between px-7 py-3.5 hover:bg-[#FAFAFA] transition-colors">
              <div><p className="text-[13px] font-medium text-[#1A1A1A]">{r.label}</p><p className="text-[10px] text-[#CACACA] mt-0.5">{r.sub}</p></div>
              <p className="text-[14px] font-medium text-[#1A1A1A] tabular-nums">{r.value}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue Trend */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-[#F5F5F5]">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Revenue Trend</h3>
            <p className="text-[12px] text-[#ACACAC] mt-0.5">{monthlyRevenue[0].month} – {monthlyRevenue[monthlyRevenue.length - 1].month} · {currency.code}</p>
          </div>
          <div className="text-right">
            <span className="text-[20px] font-medium text-[#1A1A1A] tracking-tight leading-none">{formatCurrency(lastRev, { compact: true })}</span>
            <span className="flex items-center gap-1 text-[11px] text-[#E08A3C] mt-1 justify-end"><TrendUp size={10} weight="bold" />+{momPct}%</span>
          </div>
        </div>
        <div className="flex-1 px-2 pt-4 pb-2" style={{ minHeight: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
              <defs><linearGradient id="aRevG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#293763" stopOpacity={0.12} /><stop offset="100%" stopColor="#293763" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} tickFormatter={fmt} width={48} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#293763" fill="url(#aRevG)" strokeWidth={2.5} dot={{ r: 3, fill: "#293763", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#293763", stroke: "#fff", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 divide-x divide-[#F0F0F0] border-t border-[#F0F0F0]">
          {[{ label: "Peak", value: formatCurrency(peakRev, { compact: true }), sub: peakMonth }, { label: "Total", value: formatCurrency(totalRev, { compact: true }), sub: "9 months" }, { label: "Avg CAC", value: formatCurrency(avgCac), sub: "per student" }].map((k) => (
            <div key={k.label} className="px-5 py-3.5">
              <p className="text-[10px] text-[#ACACAC] uppercase tracking-wider mb-1">{k.label}</p>
              <p className="text-[16px] font-medium text-[#1A1A1A] leading-none tabular-nums">{k.value}</p>
              <p className="text-[10px] text-[#CACACA] mt-0.5">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 10. Channel Attribution ─── */
function ChannelAttribution() {
  const { formatCurrency } = useCurrency();
  const totalStudents = channelAttribution.reduce((a, c) => a + c.students, 0);
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-[#F5F5F5]">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Channel Attribution</h3>
        <p className="text-[12px] text-[#ACACAC] mt-0.5">Student acquisition by source</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[580px]">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#F0F0F0]">
              <th className="py-2.5 pl-5 sm:pl-7 pr-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider">Channel</th>
              <th className="py-2.5 px-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Students</th>
              <th className="py-2.5 px-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider">Share</th>
              <th className="py-2.5 px-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Revenue</th>
              <th className="py-2.5 pr-5 sm:pr-7 pl-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">CAC</th>
            </tr>
          </thead>
          <tbody>
            {channelAttribution.map((c, i) => {
              const share = (c.students / totalStudents) * 100;
              return (
                <tr key={c.channel} className={`hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                  <td className="py-3.5 pl-5 sm:pl-7 pr-3">
                    <span className="flex items-center gap-2 text-[13px] font-medium text-[#1A1A1A]">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />{c.channel}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[12px] text-[#1A1A1A] tabular-nums text-right">{c.students.toLocaleString()}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-[60px] h-[5px] bg-[#F0F0F0] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${share}%`, backgroundColor: c.color }} />
                      </div>
                      <span className="text-[10px] text-[#ACACAC] tabular-nums">{share.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-[12px] text-[#888] tabular-nums text-right">{formatCurrency(c.revenue, { compact: true })}</td>
                  <td className="py-3.5 pr-5 sm:pr-7 pl-3 text-[12px] font-medium tabular-nums text-right" style={{ color: c.cac > 50 ? "#E08A3C" : "#1A1A1A" }}>{c.cac === 0 ? "—" : formatCurrency(c.cac)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── 11. Teacher Leaderboard ─── */
function TeacherLeaderboard() {
  const { formatCurrency } = useCurrency();
  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
      <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-[#F5F5F5]">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Top Teachers</h3>
        <p className="text-[12px] text-[#ACACAC] mt-0.5">By sessions delivered this month</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[540px]">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#F0F0F0]">
              <th className="py-2.5 pl-5 sm:pl-7 pr-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider w-8">#</th>
              <th className="py-2.5 px-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider">Teacher</th>
              <th className="py-2.5 px-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Sessions</th>
              <th className="py-2.5 px-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Rating</th>
              <th className="py-2.5 px-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Revenue</th>
              <th className="py-2.5 pr-5 sm:pr-7 pl-3 text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider text-right">Retention</th>
            </tr>
          </thead>
          <tbody>
            {topTeachers.map((t, i) => (
              <tr key={t.name} className={`hover:bg-[#FAFAFA] transition-colors ${i > 0 ? "border-t border-[#F8F8F8]" : ""}`}>
                <td className="py-3.5 pl-5 sm:pl-7 pr-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-[#FFF7ED] text-[#E08A3C]" : i < 3 ? "bg-[#F0F3FA] text-[#293763]" : "bg-[#F5F5F5] text-[#ACACAC]"}`}>{i + 1}</span>
                </td>
                <td className="py-3.5 px-3">
                  <p className="text-[13px] font-medium text-[#1A1A1A]">{t.name}</p>
                  <p className="text-[10px] text-[#CACACA]">{t.subject}</p>
                </td>
                <td className="py-3.5 px-3 text-[12px] font-medium text-[#1A1A1A] tabular-nums text-right">{t.sessions}</td>
                <td className="py-3.5 px-3 text-[12px] text-[#888] tabular-nums text-right">⭐ {t.rating}</td>
                <td className="py-3.5 px-3 text-[12px] text-[#888] tabular-nums text-right">{formatCurrency(t.revenue, { compact: true })}</td>
                <td className="py-3.5 pr-5 sm:pr-7 pl-3 text-right">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${t.retention >= 90 ? "bg-[#ECFDF5] text-[#059669]" : t.retention >= 80 ? "bg-[#F0F3FA] text-[#293763]" : "bg-[#FFF7ED] text-[#E08A3C]"}`}>{t.retention}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── 12. NPS + Quality & Infra ─── */
function NPSQuality() {
  const { ratingTrend } = qualityMetrics;
  const total = npsBreakdown.promoters + npsBreakdown.passives + npsBreakdown.detractors;

  const infraMetrics = [
    { label: "Tech Failure Rate", value: `${qualityMetrics.techFailureRate}%`, target: "< 2%", ok: qualityMetrics.techFailureRate < 2 },
    { label: "Dispute / Refund Rate", value: `${qualityMetrics.disputeRefundRate}%`, target: "< 3%", ok: qualityMetrics.disputeRefundRate < 3 },
    { label: "AI Auto-Resolution", value: `${qualityMetrics.aiAutoResolution}%`, target: "> 75%", ok: qualityMetrics.aiAutoResolution > 75 },
    { label: "Avg Response Time", value: qualityMetrics.avgResponseTime, target: "< 3s", ok: true },
    { label: "Uptime (30d)", value: `${qualityMetrics.uptimePct}%`, target: "> 99.9%", ok: qualityMetrics.uptimePct > 99.9 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* NPS */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 flex flex-col">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season mb-2">Net Promoter Score</h3>
        <p className="text-[42px] font-normal text-[#1A1A1A] tracking-tight leading-none mb-5">{npsBreakdown.score}</p>
        {/* Stacked bar */}
        <div className="flex h-[8px] rounded-full overflow-hidden mb-4">
          <div style={{ width: `${npsBreakdown.promoters}%` }} className="bg-[#059669]" />
          <div style={{ width: `${npsBreakdown.passives}%` }} className="bg-[#DCDCDC]" />
          <div style={{ width: `${npsBreakdown.detractors}%` }} className="bg-[#E08A3C]" />
        </div>
        <div className="flex items-center justify-between text-[11px] mb-5">
          <span className="flex items-center gap-1.5 text-[#059669]"><span className="w-2 h-2 rounded-full bg-[#059669]" /> Promoters {npsBreakdown.promoters}%</span>
          <span className="flex items-center gap-1.5 text-[#ACACAC]"><span className="w-2 h-2 rounded-full bg-[#DCDCDC]" /> Passive {npsBreakdown.passives}%</span>
          <span className="flex items-center gap-1.5 text-[#E08A3C]"><span className="w-2 h-2 rounded-full bg-[#E08A3C]" /> Detract {npsBreakdown.detractors}%</span>
        </div>
        {/* NPS trend */}
        <div className="flex-1 min-h-0" style={{ minHeight: 100 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={npsBreakdown.trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#CACACA" }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 80]} tick={{ fontSize: 9, fill: "#CACACA" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="score" name="NPS" stroke="#293763" strokeWidth={2} dot={{ r: 3, fill: "#293763", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#293763", stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Session Rating */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Session Rating</h3>
          <span className="text-[10px] text-[#ACACAC] bg-[#F7F7F7] px-2 py-0.5 rounded-full">Target: 4.7</span>
        </div>
        <p className="text-[32px] font-normal text-[#1A1A1A] tracking-tight leading-none mb-4">{qualityMetrics.avgRating}<span className="text-[14px] text-[#DCDCDC] ml-1">/ 5.0</span></p>
        <div className="flex-1 min-h-0" style={{ minHeight: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#CACACA" }} axisLine={false} tickLine={false} />
              <YAxis domain={[4.5, 4.85]} tick={{ fontSize: 9, fill: "#CACACA" }} axisLine={false} tickLine={false} />
              <ReferenceLine y={4.7} stroke="#E08A3C" strokeDasharray="4 3" strokeWidth={1} />
              <Tooltip content={({ active, payload, label }: any) => {
                if (!active || !payload?.length) return null;
                return (<div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)] px-4 py-3 font-matter">
                  <p className="text-[11px] font-medium text-[#1A1A1A] mb-1">{label}</p>
                  <p className="text-[12px] text-[#555]">Rating: <span className="font-medium text-[#1A1A1A]">{payload[0].value}</span></p>
                  {payload[0].payload.reviews && <p className="text-[10px] text-[#CACACA] mt-0.5">{payload[0].payload.reviews.toLocaleString()} reviews</p>}
                </div>);
              }} />
              <Line type="monotone" dataKey="rating" name="Rating" stroke="#1A1A1A" strokeWidth={2} dot={{ r: 3, fill: "#1A1A1A", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#1A1A1A", stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Infra & Quality */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 flex flex-col">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season mb-5">Infrastructure</h3>
        <div className="flex flex-col gap-0.5 flex-1">
          {infraMetrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between py-3 border-b border-[#F8F8F8] last:border-none">
              <div>
                <p className="text-[12px] text-[#555]">{m.label}</p>
                <p className="text-[10px] text-[#DCDCDC] mt-0.5">Target: {m.target}</p>
              </div>
              <span className={`text-[18px] font-normal tracking-tight ${m.ok ? "text-[#1A1A1A]" : "text-[#E08A3C]"}`}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── END OF SECTIONS ─── */

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 md:gap-10 pt-4">
      <KPIRibbon />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionFunnel />
        <WAUTrend />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8"><HourlyTraffic /></div>
        <div className="lg:col-span-4"><DurationChart /></div>
      </section>
      <SubjectDemandChart />
      <MarketplaceGeo />
      <CohortRetention />
      <RevenueEconomics />
      <ChannelAttribution />
      <TeacherLeaderboard />
      <NPSQuality />
    </div>
  );
}
