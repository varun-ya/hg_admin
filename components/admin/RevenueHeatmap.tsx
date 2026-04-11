"use client";
import { memo, useState, useRef } from "react";
import { Fire } from "@phosphor-icons/react";
import { revenueHeatmap } from "./healthData";
import { useCurrency } from "./context/CurrencyContext";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const maxVal = Math.max(...revenueHeatmap.map((d) => d.value));

function cellColor(value: number): string {
  const pct = value / maxVal;
  if (pct > 0.8) return "#1E2A4A";
  if (pct > 0.6) return "#293763";
  if (pct > 0.45) return "#3D4D7A";
  if (pct > 0.3) return "#5A6A96";
  if (pct > 0.18) return "#8B96B5";
  if (pct > 0.08) return "#C8CEE0";
  return "#ECEEF4";
}

function RevenueHeatmap() {
  const [hover, setHover] = useState<{ day: string; hour: number; value: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useCurrency();

  const lookup = new Map(revenueHeatmap.map((d) => [`${d.day}-${d.hour}`, d.value]));

  const handleMouseEnter = (day: string, h: number, val: number, e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setHover({ day, hour: h, value: val });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 overflow-hidden relative" ref={containerRef}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Fire size={15} weight="regular" className="text-[#E08A3C]" />
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Revenue Heatmap</h3>
          <span className="text-[11px] text-[#CACACA]">This week · Hourly</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-[#CACACA]">Low</span>
          {["#ECEEF4", "#C8CEE0", "#8B96B5", "#5A6A96", "#3D4D7A", "#293763", "#1E2A4A"].map((c) => (
            <div key={c} className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: c }} />
          ))}
          <span className="text-[9px] text-[#CACACA]">High</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Hour labels */}
          <div className="flex items-center mb-1 pl-[44px]">
            {HOURS.map((h) => (
              <div key={h} className="flex-1 text-center">
                {h % 3 === 0 && <span className="text-[9px] text-[#CACACA] tabular-nums">{h.toString().padStart(2, "0")}</span>}
              </div>
            ))}
          </div>

          {/* Rows */}
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-1 mb-[3px]">
              <span className="text-[10px] text-[#ACACAC] w-[40px] text-right pr-1 shrink-0">{day}</span>
              <div className="flex-1 flex gap-[2px]">
                {HOURS.map((h) => {
                  const val = lookup.get(`${day}-${h}`) || 0;
                  return (
                    <div
                      key={h}
                      className="flex-1 h-[18px] rounded-[3px] cursor-pointer transition-all duration-100 hover:scale-y-125 hover:z-10"
                      style={{ backgroundColor: cellColor(val) }}
                      onMouseEnter={(e) => handleMouseEnter(day, h, val, e)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={() => setHover(null)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating tooltip */}
      {hover && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 8, transform: "translate(-50%, -100%)" }}
        >
          <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.16)] px-4 py-3 font-matter min-w-[140px]">
            <p className="text-[11px] font-medium text-[#1A1A1A] mb-1.5">{hover.day} · {hover.hour.toString().padStart(2, "0")}:00</p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] text-[#888]">Revenue</span>
              <span className="text-[12px] font-medium text-[#E08A3C] tabular-nums">{formatCurrency(hover.value)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 mt-0.5">
              <span className="text-[11px] text-[#888]">Intensity</span>
              <span className="text-[11px] font-medium text-[#1A1A1A] tabular-nums">{((hover.value / maxVal) * 100).toFixed(0)}%</span>
            </div>
          </div>
          {/* Arrow */}
          <div className="flex justify-center -mt-[1px]">
            <div className="w-2 h-2 bg-white border-r border-b border-[#F0F0F0] rotate-45 -translate-y-[3px]" />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(RevenueHeatmap);
