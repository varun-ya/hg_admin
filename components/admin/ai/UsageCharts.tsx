"use client";
import { memo } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { dailyTokenBurn, latencyMetrics } from "./aiMockData";

function formatTokens(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return String(v);
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] px-4 py-3 font-matter">
      <p className="text-[11px] font-medium text-[#1A1A1A] mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-[11px] mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-[#777]">{p.name}:</span>
          <span className="text-[#1A1A1A] font-medium tabular-nums">
            {typeof p.value === "number" && p.value > 10000 ? formatTokens(p.value) : p.value}
            {p.name === "Error Rate" ? "%" : p.name === "p95 Latency" ? "ms" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

function UsageCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Daily Token Burn — Stacked Area */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6">
        <div className="mb-5">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Daily Token Burn</h3>
          <p className="text-[12px] text-[#CACACA] mt-1">Osmium LLM usage by feature</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={dailyTokenBurn} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gChatbot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E08A3C" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#E08A3C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSummarization" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#293763" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#293763" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gQuizGen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4956A" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#D4956A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} tickFormatter={formatTokens} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ fontSize: 11, color: "#999", paddingBottom: 8 }}
            />
            <Area type="monotone" dataKey="chatbot" name="Chatbot" stackId="1" stroke="#E08A3C" fill="url(#gChatbot)" strokeWidth={1.5} />
            <Area type="monotone" dataKey="summarization" name="Summarization" stackId="1" stroke="#293763" fill="url(#gSummarization)" strokeWidth={1.5} />
            <Area type="monotone" dataKey="quizGen" name="Quiz Gen" stackId="1" stroke="#D4956A" fill="url(#gQuizGen)" strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Latency & Error Rates — Dual Line */}
      <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6">
        <div className="mb-5">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] font-season">Latency & Error Rates</h3>
          <p className="text-[12px] text-[#CACACA] mt-1">Osmium endpoint p95 response time</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={latencyMetrics} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}ms`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#CACACA" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ fontSize: 11, color: "#999", paddingBottom: 8 }}
            />
            <Line yAxisId="left" type="monotone" dataKey="p95" name="p95 Latency" stroke="#293763" strokeWidth={2} dot={{ r: 3, fill: "#293763" }} activeDot={{ r: 5 }} />
            <Line yAxisId="right" type="monotone" dataKey="errorRate" name="Error Rate" stroke="#E08A3C" strokeWidth={2} dot={{ r: 3, fill: "#E08A3C" }} activeDot={{ r: 5 }} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default memo(UsageCharts);
