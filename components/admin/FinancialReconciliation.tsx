"use client";
import { memo, useState, useMemo } from "react";
import { ArrowRight, TrendUp } from "@phosphor-icons/react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { financialSummary } from "./mockData";
import ConfirmModal from "./ConfirmModal";
import { useCurrency } from "./context/CurrencyContext";

function FinancialReconciliation() {
  const { dailyData } = financialSummary;
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { formatCurrency, convert, currency } = useCurrency();

  // All raw values are in USD — convert for display
  const totalRev = dailyData.reduce((s, d) => s + d.revenue, 0);
  const totalEsc = dailyData.reduce((s, d) => s + d.pendingEscrow, 0);
  const escrowRatio = ((totalEsc / (totalRev + totalEsc)) * 100).toFixed(1);

  const last = dailyData[dailyData.length - 1];
  const prev = dailyData[dailyData.length - 2];
  const growth = prev ? (((last.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1) : null;

  // Convert chart data to active currency
  const chartData = useMemo(() => dailyData.map((d) => ({
    date: d.date,
    revenue: convert(d.revenue),
    pendingEscrow: convert(d.pendingEscrow),
  })), [dailyData, convert]);

  function fmt(v: number) {
    if (Math.abs(v) >= 1_000_000) return `${currency.symbol}${(v / 1_000_000).toFixed(1)}M`;
    if (Math.abs(v) >= 1_000) return `${currency.symbol}${(v / 1_000).toFixed(0)}K`;
    return `${currency.symbol}${v.toFixed(0)}`;
  }

  function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const rev = payload.find((p: any) => p.dataKey === "revenue");
    const esc = payload.find((p: any) => p.dataKey === "pendingEscrow");
    return (
      <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.14)] px-4 py-3.5 font-matter min-w-[170px]">
        <p className="text-[11px] font-medium text-[#1A1A1A] mb-3">{label}</p>
        {rev && (
          <div className="flex items-center justify-between gap-6 mb-1.5">
            <span className="flex items-center gap-1.5 text-[11px] text-[#777]">
              <span className="w-2 h-2 rounded-sm bg-[#293763]" /> Revenue
            </span>
            <span className="text-[12px] font-medium text-[#1A1A1A] tabular-nums">{fmt(rev.value)}</span>
          </div>
        )}
        {esc && (
          <div className="flex items-center justify-between gap-6 mb-1.5">
            <span className="flex items-center gap-1.5 text-[11px] text-[#777]">
              <span className="w-2 h-2 rounded-full bg-[#E08A3C]" /> Escrow
            </span>
            <span className="text-[12px] font-medium text-[#1A1A1A] tabular-nums">{fmt(esc.value)}</span>
          </div>
        )}
        {rev && esc && (
          <div className="flex items-center justify-between gap-6 pt-2.5 mt-1 border-t border-[#F5F5F5]">
            <span className="text-[10px] text-[#CACACA]">Ratio</span>
            <span className="text-[11px] font-medium text-[#E08A3C] tabular-nums">
              {((esc.value / (rev.value + esc.value)) * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Financial Reconciliation</h3>
            <p className="text-[11px] text-[#CACACA] mt-0.5">Oct 2025 – Mar 2026 · {currency.code}</p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#293763] text-white rounded-full text-[12px] font-medium hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95"
          >
            Initiate Batch Payout
            <ArrowRight size={12} weight="bold" />
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#FAFAFA] rounded-xl px-4 py-3">
            <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-wider mb-1.5">Monthly Revenue</p>
            <p className="text-[20px] font-normal text-[#1A1A1A] tracking-tight leading-none">{formatCurrency(847230, { compact: true })}</p>
            {growth && (
              <span className="flex items-center gap-1 text-[10px] text-[#E08A3C] mt-1.5">
                <TrendUp size={10} weight="bold" /> +{growth}% MoM
              </span>
            )}
          </div>
          <div className="bg-[#FAFAFA] rounded-xl px-4 py-3">
            <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-wider mb-1.5">Pending Escrow</p>
            <p className="text-[20px] font-normal text-[#1A1A1A] tracking-tight leading-none">{formatCurrency(2412800, { compact: true })}</p>
            <span className="text-[10px] text-[#CACACA] mt-1.5 block">Held in trust</span>
          </div>
          <div className="bg-[#FFF8F3] rounded-xl px-4 py-3">
            <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-wider mb-1.5">Escrow Ratio</p>
            <p className="text-[20px] font-normal text-[#E08A3C] tracking-tight leading-none">{escrowRatio}%</p>
            <span className="text-[10px] text-[#E08A3C]/60 mt-1.5 block">Target &lt; 65%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mb-4">
          <span className="flex items-center gap-1.5 text-[11px] text-[#999]">
            <span className="w-3 h-3 rounded-sm bg-[#293763]" /> Revenue
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[#999]">
            <span className="w-3 h-[2px] bg-[#E08A3C] rounded-full inline-block" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#E08A3C] -ml-2.5" />
            Escrow
          </span>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-0" style={{ minHeight: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <defs>
                <linearGradient id="finBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#293763" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3D4D7A" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="finBarGradHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E2A4A" stopOpacity={1} />
                  <stop offset="100%" stopColor="#293763" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#CACACA", fontFamily: "Matter, sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#CACACA", fontFamily: "Matter, sans-serif" }} axisLine={false} tickLine={false} tickFormatter={fmt} width={56} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.025)", radius: 6 }} />
              <Bar dataKey="revenue" name="Revenue" radius={[5, 5, 0, 0]} barSize={28} animationDuration={700} onMouseEnter={(_, index) => setActiveIndex(index)}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={activeIndex === index ? "url(#finBarGradHover)" : "url(#finBarGrad)"} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="pendingEscrow" name="Escrow" stroke="#E08A3C" strokeWidth={2} dot={{ r: 3, fill: "#E08A3C", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#E08A3C", stroke: "#fff", strokeWidth: 2 }} animationDuration={900} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ConfirmModal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Initiate Batch Payout" description="This will process pending settlements for all eligible teachers. This action cannot be undone." confirmString="CONFIRM-PAYOUT" onConfirm={() => {}} variant="warning" />
    </>
  );
}

export default memo(FinancialReconciliation);
