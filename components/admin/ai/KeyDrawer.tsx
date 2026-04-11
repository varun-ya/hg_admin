"use client";
import { useState, useEffect, memo } from "react";
import {
  X, ArrowsClockwise, Prohibit, SlidersHorizontal, ShieldCheck, Clock,
} from "@phosphor-icons/react";
import { getApiKeyDetail } from "./aiMockData";
import type { ApiKey, ApiKeyDetail, KeyStatus } from "./aiTypes";
import ConfirmModal from "@/components/admin/ConfirmModal";

const STATUS_STYLE: Record<KeyStatus, string> = {
  active: "bg-[#FFF7ED] text-[#E08A3C]",
  revoked: "bg-[#FFF1E6] text-[#C2571A]",
  rate_limited: "bg-[#FFF7ED] text-[#D4956A]",
};

const ENGINE_BADGE: Record<string, string> = {
  osmium_llm: "bg-[#F3F0FF] text-[#293763]",
  lmlens: "bg-[#ECFEFF] text-[#3D4D7A]",
  videomeet: "bg-[#F0F0F0] text-[#1A1A1A]",
};

function formatTokens(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return String(v);
}

interface Props { apiKey: ApiKey | null; onClose: () => void }

function KeyDrawer({ apiKey, onClose }: Props) {
  const [detail, setDetail] = useState<ApiKeyDetail | null>(null);
  const [rotateModal, setRotateModal] = useState(false);
  const [revokeModal, setRevokeModal] = useState(false);
  const [quotaValue, setQuotaValue] = useState(0);

  useEffect(() => {
    if (apiKey) {
      setDetail(null);
      setQuotaValue(apiKey.monthlyQuota);
      const t = setTimeout(() => setDetail(getApiKeyDetail(apiKey.id)), 350);
      return () => clearTimeout(t);
    }
  }, [apiKey]);

  useEffect(() => {
    if (!apiKey) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [apiKey, onClose]);

  if (!apiKey) return null;

  const maxQuota = apiKey.engine === "osmium_llm" ? 10000000 : apiKey.engine === "lmlens" ? 50000 : 20000;
  const quotaStep = apiKey.engine === "osmium_llm" ? 500000 : 1000;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex justify-end font-matter">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" onClick={onClose} />
        <div className="relative w-[540px] max-w-full bg-white h-full shadow-[-8px_0_30px_-10px_rgba(0,0,0,0.08)] flex flex-col animate-slideIn">
          {/* Header */}
          <div className="px-7 py-5 border-b border-[#F0F0F0] shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-[15px] font-medium text-[#1A1A1A] font-season">{apiKey.keyName}</h2>
                <p className="text-[11px] text-[#ACACAC] font-mono">{apiKey.keyHash}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#F7F7F7] border border-[#F0F0F0] flex items-center justify-center text-[#ACACAC] hover:text-[#1A1A1A] hover:border-[#DCDCDC] cursor-pointer transition-all"><X size={14} weight="bold" /></button>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium capitalize ${STATUS_STYLE[apiKey.status]}`}>
                {apiKey.status === "rate_limited" ? "Rate Limited" : apiKey.status}
              </span>
              <span className={`inline-flex px-2.5 py-[3px] rounded-full text-[10.5px] font-medium ${ENGINE_BADGE[apiKey.engine]}`}>
                {apiKey.engine === "osmium_llm" ? "Osmium LLM" : apiKey.engine === "lmlens" ? "LMlens" : "VideoMeet"}
              </span>
              <span className="text-[11px] text-[#CACACA]">{apiKey.tenant}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-7 space-y-7">
            {/* Usage Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-4">
                <p className="text-[11px] text-[#ACACAC] mb-1">Current Usage</p>
                <p className="text-[17px] font-normal text-[#1A1A1A] tabular-nums tracking-tight">{formatTokens(apiKey.currentUsage)}</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-4">
                <p className="text-[11px] text-[#ACACAC] mb-1">Monthly Quota</p>
                <p className="text-[17px] font-normal text-[#1A1A1A] tabular-nums tracking-tight">{formatTokens(apiKey.monthlyQuota)}</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-4">
                <p className="text-[11px] text-[#ACACAC] mb-1">Utilization</p>
                <p className={`text-[17px] font-normal tabular-nums tracking-tight ${apiKey.usagePercent >= 90 ? "text-[#C2571A]" : apiKey.usagePercent >= 75 ? "text-[#D4956A]" : "text-[#E08A3C]"}`}>{apiKey.usagePercent}%</p>
              </div>
            </div>

            {/* Usage Bar */}
            <div>
              <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Quota Consumption</p>
              <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-5">
                <div className="h-3 bg-[#F0F0F0] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${apiKey.usagePercent}%`,
                      background: apiKey.usagePercent >= 90
                        ? "linear-gradient(90deg, #C2571A, #F43F5E)"
                        : apiKey.usagePercent >= 75
                        ? "linear-gradient(90deg, #D4956A, #FBBF24)"
                        : "linear-gradient(90deg, #293763, #A78BFA)",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#ACACAC]">{formatTokens(apiKey.currentUsage)} used</span>
                  <span className="text-[11px] text-[#ACACAC]">{formatTokens(apiKey.monthlyQuota)} quota</span>
                </div>
              </div>
            </div>

            {/* Top Endpoints */}
            {detail ? (
              <div>
                <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Top Endpoints</p>
                <div className="space-y-2">
                  {detail.topEndpoints.map((ep, i) => (
                    <div key={i} className="bg-white rounded-xl border border-[#F0F0F0] p-4 flex items-center justify-between">
                      <span className="text-[12px] font-mono text-[#777]">{ep.endpoint}</span>
                      <span className="text-[12px] font-medium text-[#1A1A1A] tabular-nums">{ep.calls.toLocaleString()} calls</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <Skeleton rows={4} />}

            {/* Key Details */}
            {detail && (
              <div>
                <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em] mb-3">Key Details</p>
                <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-5 space-y-3">
                  <Row label="Created" value={apiKey.createdAt} />
                  <Row label="Last Rotated" value={detail.lastRotated} />
                  <Row label="Rate Limit" value={detail.rateLimit} />
                </div>
              </div>
            )}

            {/* Adjust Quota */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal size={13} className="text-[#ACACAC]" />
                <p className="text-[10px] font-medium text-[#CACACA] uppercase tracking-[0.12em]">Adjust Quota</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-xl border border-[#F0F0F0] p-5">
                <input
                  type="range"
                  min={0}
                  max={maxQuota}
                  step={quotaStep}
                  value={quotaValue}
                  onChange={(e) => setQuotaValue(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F0F0F0] rounded-full appearance-none cursor-pointer accent-[#293763]"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-[#ACACAC]">0</span>
                  <span className="text-[13px] font-medium text-[#293763] tabular-nums">{formatTokens(quotaValue)}</span>
                  <span className="text-[11px] text-[#ACACAC]">{formatTokens(maxQuota)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-7 py-4 border-t border-[#F0F0F0] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#ACACAC]" />
              <span className="text-[11px] text-[#ACACAC]">Dual-confirmation required</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRevokeModal(true)}
                disabled={apiKey.status === "revoked"}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-[#C2571A] bg-transparent border border-[#F0F0F0] rounded-lg hover:bg-[#FFF1E6] hover:border-[#C2571A]/20 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Prohibit size={13} /> Revoke
              </button>
              <button
                onClick={() => setRotateModal(true)}
                disabled={apiKey.status === "revoked"}
                className="flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-medium text-white bg-[#293763] rounded-lg hover:bg-[#1E2A4A] transition-all cursor-pointer border-none active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowsClockwise size={13} weight="bold" /> Rotate Key
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={rotateModal}
        onClose={() => setRotateModal(false)}
        title="Rotate API Key"
        description={`This will generate a new key for "${apiKey.keyName}" and immediately invalidate the current key (${apiKey.keyHash}). All active integrations using this key will stop working.`}
        confirmString="CONFIRM-ROTATE"
        onConfirm={() => setRotateModal(false)}
        variant="warning"
      />
      <ConfirmModal
        isOpen={revokeModal}
        onClose={() => setRevokeModal(false)}
        title="Revoke API Access"
        description={`This will permanently revoke "${apiKey.keyName}" (${apiKey.keyHash}). All API calls using this key will be immediately blocked. This action cannot be undone.`}
        confirmString="CONFIRM-REVOKE"
        onConfirm={() => setRevokeModal(false)}
        variant="danger"
      />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (<div className="flex items-start justify-between gap-4"><span className="text-[12px] text-[#999] shrink-0">{label}</span><span className="text-[12px] text-[#1A1A1A] text-right">{value}</span></div>);
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (<div className="space-y-3 animate-pulse">{[...Array(rows)].map((_, i) => <div key={i} className="h-14 bg-[#F5F5F5] rounded-xl w-full" />)}</div>);
}

export default memo(KeyDrawer);
