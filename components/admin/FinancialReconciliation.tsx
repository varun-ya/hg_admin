"use client";
import { memo, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { financialSummary } from "./mockData";
import ConfirmModal from "./ConfirmModal";

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpx = (p0.x + p1.x) / 2;
    d += ` C ${cpx} ${p0.y}, ${cpx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

function FinancialReconciliation() {
  const { totalRevenue, pendingEscrow, dailyData } = financialSummary;
  const [showConfirm, setShowConfirm] = useState(false);

  const maxVal = Math.max(...dailyData.flatMap((d) => [d.revenue, d.pendingEscrow])) * 1.1;
  const svgW = 400;
  const svgH = 150;
  const padX = 16;
  const padY = 14;

  const toX = (i: number) => padX + (i / (dailyData.length - 1)) * (svgW - padX * 2);
  const toY = (v: number) => svgH - padY - (v / maxVal) * (svgH - padY * 2);

  const revenuePoints = dailyData.map((d, i) => ({ x: toX(i), y: toY(d.revenue) }));
  const escrowPoints = dailyData.map((d, i) => ({ x: toX(i), y: toY(d.pendingEscrow) }));

  const revenuePath = smoothPath(revenuePoints);
  const escrowPath = smoothPath(escrowPoints);
  const revenueArea = `${revenuePath} L ${revenuePoints[revenuePoints.length - 1].x} ${svgH - padY} L ${revenuePoints[0].x} ${svgH - padY} Z`;

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

        {/* Summary */}
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

        {/* Chart */}
        <div className="flex-1 min-h-0">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((f) => (
              <line key={f} x1={padX} y1={toY(maxVal * f)} x2={svgW - padX} y2={toY(maxVal * f)} stroke="#F5F5F5" strokeWidth="1" />
            ))}
            <path d={revenueArea} fill="url(#revGrad)" />
            <path d={revenuePath} fill="none" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={escrowPath} fill="none" stroke="#E08A3C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
            {revenuePoints.map((p, i) => (
              <circle key={`r-${i}`} cx={p.x} cy={p.y} r="2" fill="#4F46E5" />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-5 text-[11px] font-normal text-[#888]">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-[1px] bg-[#E08A3C]" />Escrow</span>
          </div>
          <span className="text-[10px] text-[#CACACA] font-normal">{dailyData[0].date} — {dailyData[dailyData.length - 1].date}</span>
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
