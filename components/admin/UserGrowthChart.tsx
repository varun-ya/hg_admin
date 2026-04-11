"use client";
import { memo } from "react";
import { Users, Student, ChalkboardTeacher, TrendUp } from "@phosphor-icons/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { userGrowth } from "./healthData";

function fmt(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K`;
  return v.toString();
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.14)] px-4 py-3.5 font-matter min-w-[160px]">
      <p className="text-[11px] font-medium text-[#1A1A1A] mb-2.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5 text-[11px] text-[#777]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.stroke }} />
            {p.dataKey === "students" ? "Students" : "Teachers"}
          </span>
          <span className="text-[12px] font-medium text-[#1A1A1A] tabular-nums">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function UserGrowthChart() {
  const latest = userGrowth[userGrowth.length - 1];
  const prev = userGrowth[userGrowth.length - 2];
  const studentGrowth = (((latest.students - prev.students) / prev.students) * 100).toFixed(1);
  const teacherGrowth = (((latest.teachers - prev.teachers) / prev.teachers) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-7 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={15} weight="regular" className="text-[#999]" />
            <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">User Growth</h3>
          </div>
          <p className="text-[11px] text-[#CACACA]">12-month trend · Students & Teachers</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1 text-[11px] text-[#293763]">
              <Student size={11} weight="fill" /> {fmt(latest.students)}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-[#059669]">
              <TrendUp size={9} weight="bold" /> +{studentGrowth}%
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1 text-[11px] text-[#E08A3C]">
              <ChalkboardTeacher size={11} weight="fill" /> {fmt(latest.teachers)}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-[#059669]">
              <TrendUp size={9} weight="bold" /> +{teacherGrowth}%
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        <span className="flex items-center gap-1.5 text-[11px] text-[#999]">
          <span className="w-3 h-[2px] bg-[#293763] rounded-full" /> Students
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#999]">
          <span className="w-3 h-[2px] bg-[#E08A3C] rounded-full" /> Teachers
        </span>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0" style={{ minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={userGrowth} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="ugStudentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#293763" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#293763" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ugTeacherGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E08A3C" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#E08A3C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#CACACA" }} axisLine={false} tickLine={false} dy={6} />
            <YAxis tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} tickFormatter={fmt} width={44} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="students" name="Students"
              stroke="#293763" fill="url(#ugStudentGrad)" strokeWidth={2}
              dot={false} activeDot={{ r: 4, fill: "#293763", stroke: "#fff", strokeWidth: 2 }}
              animationDuration={800}
            />
            <Area
              type="monotone" dataKey="teachers" name="Teachers"
              stroke="#E08A3C" fill="url(#ugTeacherGrad)" strokeWidth={2}
              dot={false} activeDot={{ r: 4, fill: "#E08A3C", stroke: "#fff", strokeWidth: 2 }}
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default memo(UserGrowthChart);
