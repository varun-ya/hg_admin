"use client";
import { memo, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
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
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)] px-4 py-3 font-matter">
      <p className="text-[11px] font-medium text-[#1A1A1A] mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-[11px] mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-[#777]">{p.name}:</span>
          <span className="text-[#1A1A1A] font-medium tabular-nums">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function FinancialReconciliation() {
  const { totalRevenue, pendingEscrow, dailyData } = financialSummary;
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 h-full flex flex-col">
        <div className="flex items-center justify-between mb-7">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Financial Reconciliation</h3>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#293763] text-white rounded-full text-[12px] font-medium hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95"
          >
            Initiate Batch Payout
            <ArrowRight size={12} weight="bold" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-7">
          <div>
            <p className="text-[11px] font-normal text-[#ACACAC] uppercase tracking-wider mb-1.5">Monthly Revenue</p>
            <p className="text-[22px] font-normal text-[#1A1A1A] tracking-tight">{totalRevenue}</p>
          </div>
          <div>
            <p className="text-[11px] font-normal text-[#ACACAC] uppercase tracking-wider mb-1.5">Pending Escrow</p>
            <p className="text-[22px] font-normal text-[#1A1A1A] tracking-tight">{pendingEscrow}</p>
          </div>
        </div>

        <div className="flex-1 min-h-0" style={{ minHeight: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="finRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="finEscGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E08A3C" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#E08A3C" stopOpacity={0} />
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
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={6}
                wrapperStyle={{ fontSize: 11, color: "#999", paddingBottom: 8 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#4F46E5"
                fill="url(#finRevGrad)"
                strokeWidth={2}
                dot={{ r: 2.5, fill: "#4F46E5", strokeWidth: 0 }}
                activeDot={{ r: 4, fill: "#4F46E5", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={800}
              />
              <Area
                type="monotone"
                dataKey="pendingEscrow"
                name="Escrow"
                stroke="#E08A3C"
                fill="url(#finEscGrad)"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                activeDot={{ r: 4, fill: "#E08A3C", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={800}
              />
            </AreaChart>
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
