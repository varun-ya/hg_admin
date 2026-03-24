"use client";
import { memo, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { financialSummary } from "./mockData";
import ConfirmModal from "./ConfirmModal";

function fmt(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const rev = payload.find((p: any) => p.dataKey === "revenue");
  const esc = payload.find((p: any) => p.dataKey === "pendingEscrow");
  const delta = rev && esc ? rev.value - esc.value : 0;
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)] px-4 py-3 font-matter min-w-[160px]">
      <p className="text-[11px] font-medium text-[#1A1A1A] mb-2.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 text-[11px] mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            <span className="text-[#777]">{p.name}</span>
          </span>
          <span className="text-[#1A1A1A] font-medium tabular-nums">{fmt(p.value)}</span>
        </div>
      ))}
      {rev && esc && (
        <div className="flex items-center justify-between gap-4 text-[11px] mt-2 pt-2 border-t border-[#F5F5F5]">
          <span className="text-[#ACACAC]">Net Delta</span>
          <span className={`font-medium tabular-nums ${delta < 0 ? "text-[#E08A3C]" : "text-[#22C55E]"}`}>
            {delta < 0 ? "-" : "+"}{fmt(Math.abs(delta))}
          </span>
        </div>
      )}
    </div>
  );
}

function FinancialReconciliation() {
  const { totalRevenue, pendingEscrow, dailyData } = financialSummary;
  const [showConfirm, setShowConfirm] = useState(false);

  const totalRev = dailyData.reduce((s, d) => s + d.revenue, 0);
  const totalEsc = dailyData.reduce((s, d) => s + d.pendingEscrow, 0);
  const escrowRatio = ((totalEsc / (totalRev + totalEsc)) * 100).toFixed(1);

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Financial Reconciliation</h3>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#293763] text-white rounded-full text-[12px] font-medium hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95"
          >
            Initiate Batch Payout
            <ArrowRight size={12} weight="bold" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-[11px] font-normal text-[#ACACAC] uppercase tracking-wider mb-1">Monthly Revenue</p>
            <p className="text-[20px] font-normal text-[#1A1A1A] tracking-tight">{totalRevenue}</p>
          </div>
          <div>
            <p className="text-[11px] font-normal text-[#ACACAC] uppercase tracking-wider mb-1">Pending Escrow</p>
            <p className="text-[20px] font-normal text-[#1A1A1A] tracking-tight">{pendingEscrow}</p>
          </div>
          <div>
            <p className="text-[11px] font-normal text-[#ACACAC] uppercase tracking-wider mb-1">Escrow Ratio</p>
            <p className="text-[20px] font-normal text-[#E08A3C] tracking-tight">{escrowRatio}%</p>
          </div>
        </div>

        <div className="flex-1 min-h-0" style={{ minHeight: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dailyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="finBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#CACACA" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#CACACA" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={fmt}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={6}
                wrapperStyle={{ fontSize: 11, color: "#999", paddingBottom: 8 }}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="url(#finBarGrad)"
                radius={[4, 4, 0, 0]}
                barSize={14}
                animationDuration={600}
              />
              <Line
                type="monotone"
                dataKey="pendingEscrow"
                name="Escrow"
                stroke="#E08A3C"
                strokeWidth={2}
                dot={{ r: 2.5, fill: "#E08A3C", strokeWidth: 0 }}
                activeDot={{ r: 4, fill: "#E08A3C", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={800}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Initiate Batch Payout"
        description="This will process pending settlements for all eligible teachers. This action cannot be undone."
        confirmString="CONFIRM-PAYOUT"
        onConfirm={() => {}}
        variant="warning"
      />
    </>
  );
}

export default memo(FinancialReconciliation);
