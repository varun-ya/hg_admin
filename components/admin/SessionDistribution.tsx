"use client";
import { memo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { sessionDistribution } from "./healthData";

const total = sessionDistribution.reduce((s, d) => s + d.count, 0);

function SessionDistribution() {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Session Distribution</h3>
        <span className="text-[11px] text-[#ACACAC]">{total} active</span>
      </div>

      {/* Donut */}
      <div className="flex-1 min-h-0 flex items-center justify-center" style={{ minHeight: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active: isActive, payload }) => {
                if (!isActive || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.14)] px-4 py-3 font-matter min-w-[130px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-[12px] font-medium text-[#1A1A1A]">{d.subject}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] text-[#888]">Sessions</span>
                      <span className="text-[12px] font-medium text-[#1A1A1A] tabular-nums">{d.count}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] text-[#888]">Share</span>
                      <span className="text-[11px] font-medium text-[#E08A3C] tabular-nums">{((d.count / total) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                );
              }}
            />
            <Pie
              data={sessionDistribution}
              cx="50%" cy="50%"
              innerRadius={52} outerRadius={72}
              dataKey="count"
              onMouseEnter={(_, index) => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              animationDuration={600}
              stroke="none"
            >
              {sessionDistribution.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  strokeWidth={i === active ? 2 : 0}
                  stroke={i === active ? entry.color : "none"}
                  style={{ transform: i === active ? "scale(1.05)" : "scale(1)", transformOrigin: "center", transition: "transform 0.2s" }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Center label */}
      {hovered !== null && (
        <div className="text-center -mt-2 mb-2">
          <p className="text-[16px] font-medium text-[#1A1A1A]">{sessionDistribution[hovered].count}</p>
          <p className="text-[10px] text-[#ACACAC]">{sessionDistribution[hovered].subject}</p>
        </div>
      )}

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
        {sessionDistribution.map((d) => (
          <div key={d.subject} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[11px] text-[#888] flex-1 truncate">{d.subject}</span>
            <span className="text-[11px] font-medium text-[#1A1A1A] tabular-nums">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(SessionDistribution);
