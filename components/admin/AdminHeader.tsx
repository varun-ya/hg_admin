"use client";
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MagnifyingGlass, Bell, CalendarBlank, Info, Warning, CheckCircle, X,
  CaretDown, Student, ChalkboardTeacher, SignOut, Export, FileCsv, FilePdf,
} from "@phosphor-icons/react";
import { adminNotifications } from "./mockData";
import { useDateRange } from "./context/DateRangeContext";
import { exportCSV, exportPDF } from "@/lib/exportUtils";
import { auditTrail } from "./mockData";
import CommandPalette from "./CommandPalette";

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard/admin": "Health Dashboard",
  "/dashboard/admin/analytics": "Global Analytics",
  "/dashboard/admin/students": "Students",
  "/dashboard/admin/teachers": "Teachers",
  "/dashboard/admin/kyc": "KYC Pipeline",
  "/dashboard/admin/staff": "Agents / Staff",
  "/dashboard/admin/classes": "Class Monitor",
  "/dashboard/admin/moderation": "Content Moderation",
  "/dashboard/admin/disputes": "Dispute Resolution",
  "/dashboard/admin/leads": "Lead Management",
  "/dashboard/admin/revenue": "Revenue & Escrow",
  "/dashboard/admin/payouts": "Payouts",
  "/dashboard/admin/refunds": "Refunds",
  "/dashboard/admin/invoices": "Invoices & Taxes",
  "/dashboard/admin/ai-usage": "Usage Metrics",
  "/dashboard/admin/api-keys": "Quotas & API Keys",
  "/dashboard/admin/ai-workflows": "AI Workflow Rules",
  "/dashboard/admin/ai-ethics": "Ethics Controls",
  "/dashboard/admin/impersonation": "Impersonation",
  "/dashboard/admin/tenants": "B2B Tenants",
  "/dashboard/admin/commission": "Commission Engine",
  "/dashboard/admin/churn": "Churn Prediction",
  "/dashboard/admin/taxonomy": "Taxonomy",
  "/dashboard/admin/broadcast": "Broadcast Hub",
  "/dashboard/admin/cms": "CMS Pages",
  "/dashboard/admin/audit": "Audit Logs",
  "/dashboard/admin/flags": "Feature Flags",
  "/dashboard/admin/security": "Security Center",
  "/dashboard/admin/emergency": "Emergency Controls",
  "/dashboard/admin/overrides": "Overrides",
};

const ROUTE_GROUPS: Record<string, string> = {
  "/dashboard/admin/analytics": "Platform Command",
  "/dashboard/admin/students": "User Lifecycle",
  "/dashboard/admin/teachers": "User Lifecycle",
  "/dashboard/admin/kyc": "User Lifecycle",
  "/dashboard/admin/staff": "User Lifecycle",
  "/dashboard/admin/classes": "Live Ops",
  "/dashboard/admin/moderation": "Live Ops",
  "/dashboard/admin/disputes": "Live Ops",
  "/dashboard/admin/leads": "Live Ops",
  "/dashboard/admin/revenue": "Financial",
  "/dashboard/admin/payouts": "Financial",
  "/dashboard/admin/refunds": "Financial",
  "/dashboard/admin/invoices": "Financial",
  "/dashboard/admin/ai-usage": "AI Governance",
  "/dashboard/admin/api-keys": "AI Governance",
  "/dashboard/admin/ai-workflows": "AI Governance",
  "/dashboard/admin/ai-ethics": "AI Governance",
  "/dashboard/admin/impersonation": "Orchestration",
  "/dashboard/admin/tenants": "Orchestration",
  "/dashboard/admin/commission": "Orchestration",
  "/dashboard/admin/churn": "Orchestration",
  "/dashboard/admin/taxonomy": "Orchestration",
  "/dashboard/admin/broadcast": "Orchestration",
  "/dashboard/admin/cms": "Website",
  "/dashboard/admin/audit": "System & Audit",
  "/dashboard/admin/flags": "System & Audit",
  "/dashboard/admin/security": "System & Audit",
  "/dashboard/admin/emergency": "System & Audit",
  "/dashboard/admin/overrides": "System & Audit",
};

/* ─── Dropdown wrapper: positions dropdown via fixed coords so it never overflows ─── */
function FixedDropdown({ anchorRef, open, children, width = 220 }: { anchorRef: React.RefObject<HTMLElement | null>; open: boolean; children: React.ReactNode; width?: number }) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (open && anchorRef.current) {
      const r = anchorRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const safeW = Math.min(width, vw - 16);
      // Try right-align to button; if it overflows left, switch to left-align with margin
      let right = vw - r.right;
      if (right + safeW > vw - 8) right = 8;
      if (right < 8) right = 8;
      setStyle({ top: r.bottom + 8, right, width: safeW });
    }
  }, [open, anchorRef, width]);

  if (!open) return null;
  return (
    <div className="fixed z-[200] animate-contextIn" style={style}>
      {children}
    </div>
  );
}

export default memo(function AdminHeader({ onToggleMobileSidebar }: { onToggleMobileSidebar?: () => void }) {
  const pathname = usePathname();
  const pageLabel = ROUTE_LABELS[pathname] || "Dashboard";
  const groupLabel = ROUTE_GROUPS[pathname] || null;
  const isHome = pathname === "/dashboard/admin";
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showImpersonate, setShowImpersonate] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [impersonating, setImpersonating] = useState<{ role: string; name: string } | null>(null);

  const { range, setRange, presets } = useDateRange();
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const notifDropRef = useRef<HTMLDivElement>(null);
  const dateBtnRef = useRef<HTMLButtonElement>(null);
  const impBtnRef = useRef<HTMLButtonElement>(null);
  const exportBtnRef = useRef<HTMLButtonElement>(null);

  // Close all on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const t = e.target as Node;
      if (showNotifications && notifBtnRef.current && !notifBtnRef.current.contains(t) && notifDropRef.current && !notifDropRef.current.contains(t)) setShowNotifications(false);
      if (showDatePicker && dateBtnRef.current && !dateBtnRef.current.contains(t)) setShowDatePicker(false);
      if (showImpersonate && impBtnRef.current && !impBtnRef.current.contains(t)) setShowImpersonate(false);
      if (showExport && exportBtnRef.current && !exportBtnRef.current.contains(t)) setShowExport(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showNotifications, showDatePicker, showImpersonate, showExport]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { setShowNotifications(false); setShowDatePicker(false); setShowImpersonate(false); setShowExport(false); }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setIsSearchOpen(true); }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  const [notifications, setNotifications] = useState(adminNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const NOTIF_ICONS: Record<string, React.ReactNode> = {
    security: <Warning weight="fill" className="text-[#C2571A]" />,
    financial: <CheckCircle weight="fill" className="text-[#059669]" />,
    alert: <Warning weight="fill" className="text-[#B45309]" />,
    system: <Info weight="fill" className="text-[#6B7280]" />,
  };

  const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const dateLabel = range.label === "Today" ? fmtDate(range.from) : `${fmtDate(range.from)} – ${fmtDate(range.to)}`;

  const handleImpersonate = useCallback((role: string, name: string) => {
    setImpersonating({ role, name });
    setShowImpersonate(false);
  }, []);

  const handleExportCSV = useCallback(() => {
    const headers = ["Timestamp", "Actor", "Action", "Target", "Category", "IP"];
    const rows = auditTrail.map((e) => [e.timestamp, e.actor, e.action, e.target, e.category, e.ip]);
    exportCSV(`audit-trail-${new Date().toISOString().slice(0, 10)}`, headers, rows);
    setShowExport(false);
  }, []);

  const handleExportPDF = useCallback(() => {
    const headers = ["Timestamp", "Actor", "Action", "Target", "Category", "IP"];
    const rows = auditTrail.map((e) => [e.timestamp, e.actor, e.action, e.target, e.category, e.ip]);
    exportPDF(`audit-trail-${new Date().toISOString().slice(0, 10)}`, "System Audit Trail", headers, rows, { dateRange: dateLabel, generatedBy: "Super Admin" });
    setShowExport(false);
  }, [dateLabel]);

  // Shared icon button style
  const iconBtn = "w-[36px] h-[36px] sm:w-[38px] sm:h-[38px] flex items-center justify-center rounded-lg bg-white border border-[#EAEAEA] hover:bg-[#F9FAFB] hover:border-[#D0D0D0] transition-colors text-[#666] cursor-pointer shadow-sm shrink-0";

  return (
    <header className="flex items-center justify-between w-full gap-3 font-matter">
      {/* ── Left: Breadcrumb ── */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 text-[13px] sm:text-[14px] min-w-0 overflow-hidden">
        {/* Mobile: just page label */}
        <div className="flex items-center gap-0 text-[#888] min-w-0">
          {groupLabel && !isHome ? (
            <>
              {/* Desktop: full breadcrumb */}
              <Link href="/dashboard/admin" className="hover:text-[#111] transition-colors px-1 rounded hover:bg-[#EAEAEA] text-[#888] no-underline hidden md:inline shrink-0">HomeGuru</Link>
              <span className="text-[#D0D0D0] select-none mx-1 hidden md:inline shrink-0">/</span>
              {/* Tablet: ellipsis */}
              <Link href="/dashboard/admin" className="hover:text-[#111] transition-colors px-1 rounded hover:bg-[#EAEAEA] text-[#CACACA] no-underline hidden sm:inline md:hidden shrink-0" title="HomeGuru">…</Link>
              <span className="text-[#D0D0D0] select-none mx-0.5 hidden sm:inline md:hidden shrink-0">/</span>
              {/* Group label — hidden on mobile */}
              <span className="text-[#ACACAC] px-1 shrink-0 hidden lg:inline">{groupLabel}</span>
              <span className="text-[#D0D0D0] select-none mx-1 shrink-0 hidden lg:inline">/</span>
              <span className="text-[#111] font-medium px-1 truncate">{pageLabel}</span>
            </>
          ) : (
            <>
              <Link href="/dashboard/admin" className="hover:text-[#111] transition-colors px-1 rounded hover:bg-[#EAEAEA] text-[#888] no-underline shrink-0 hidden sm:inline">HomeGuru</Link>
              <span className="text-[#D0D0D0] select-none mx-1 shrink-0 hidden sm:inline">/</span>
              <span className="text-[#111] font-medium px-1 truncate">{pageLabel}</span>
            </>
          )}
        </div>
        {/* Production badge — desktop only */}
        <div className="h-4 w-[1px] bg-[#EAEAEA] mx-1 hidden lg:block shrink-0" />
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-[#EAEAEA] text-[11px] font-medium text-[#666] shadow-sm shrink-0">
          Production <span className="w-1.5 h-1.5 rounded-full bg-[#E08A3C] ml-0.5" />
        </span>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Impersonation Banner — hidden on small screens */}
        {impersonating && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#FFF7ED] border border-[#E08A3C]/20 rounded-lg text-[11px] sm:text-[12px] font-medium text-[#B45309]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E08A3C] animate-pulse" />
            <span className="hidden md:inline">Viewing as</span> {impersonating.role}: {impersonating.name}
            <button onClick={() => setImpersonating(null)} className="ml-1 text-[#C2571A] hover:text-[#9A3412] bg-transparent border-none cursor-pointer">
              <X size={12} weight="bold" />
            </button>
          </div>
        )}

        {/* Search — icon on mobile, expanded on lg */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className={iconBtn}
          title="Search (⌘K)"
        >
          <MagnifyingGlass size={15} weight="bold" />
        </button>

        {/* Export — icon only on mobile */}
        <button
          ref={exportBtnRef}
          onClick={() => setShowExport(!showExport)}
          className={`${iconBtn} hidden sm:flex`}
          title="Export"
        >
          <Export size={14} weight="bold" />
        </button>

        {/* Impersonate — icon only, hidden on xs */}
        <button
          ref={impBtnRef}
          onClick={() => setShowImpersonate(!showImpersonate)}
          className={`${iconBtn} hidden sm:flex`}
          title="Impersonate"
        >
          <SignOut size={14} weight="bold" className="text-[#E08A3C]" />
        </button>

        {/* Notifications */}
        <button
          ref={notifBtnRef}
          aria-label="Notifications"
          onClick={() => setShowNotifications(!showNotifications)}
          className={`relative ${iconBtn}`}
        >
          <Bell size={15} weight={showNotifications ? "fill" : "bold"} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#E08A3C] rounded-full text-[9px] font-bold text-white px-1 border-2 border-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Date Range — icon on tablet, full on desktop */}
        <button
          ref={dateBtnRef}
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 bg-white border border-[#EAEAEA] shadow-sm rounded-lg text-[11px] sm:text-[12px] font-medium text-[#555] hover:bg-[#F9FAFB] hover:border-[#D0D0D0] transition-colors cursor-pointer h-[36px] sm:h-[38px] shrink-0"
        >
          <CalendarBlank size={14} weight="regular" className="text-[#E08A3C]" />
          <span className="hidden md:inline">{dateLabel}</span>
          <CaretDown size={10} className="text-[#ACACAC] hidden md:inline" />
        </button>

        {/* Mobile hamburger */}
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className={`md:hidden ${iconBtn}`}
            aria-label="Toggle sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        )}
      </div>

      {/* ── Dropdowns (fixed position — never overflow) ── */}

      {/* Export dropdown */}
      {showExport && <div className="fixed inset-0 z-[199]" onClick={() => setShowExport(false)} />}
      <FixedDropdown anchorRef={exportBtnRef} open={showExport} width={200}>
        <div className="bg-white rounded-xl shadow-[0_12px_44px_-12px_rgba(0,0,0,0.12)] border border-[#EAEAEA] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#F0F0F0]">
            <p className="text-[11px] font-medium text-[#888] uppercase tracking-wider">Export Report</p>
          </div>
          <button onClick={handleExportCSV} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent">
            <FileCsv size={16} className="text-[#E08A3C]" />
            <div>
              <p className="text-[13px] font-medium text-[#1A1A1A]">CSV Spreadsheet</p>
              <p className="text-[11px] text-[#ACACAC]">Excel / Google Sheets</p>
            </div>
          </button>
          <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent border-t border-[#F5F5F5]">
            <FilePdf size={16} className="text-[#293763]" />
            <div>
              <p className="text-[13px] font-medium text-[#1A1A1A]">PDF Report</p>
              <p className="text-[11px] text-[#ACACAC]">Formatted document</p>
            </div>
          </button>
        </div>
      </FixedDropdown>

      {/* Impersonate dropdown */}
      {showImpersonate && <div className="fixed inset-0 z-[199]" onClick={() => setShowImpersonate(false)} />}
      <FixedDropdown anchorRef={impBtnRef} open={showImpersonate} width={280}>
        <div className="bg-white rounded-xl shadow-[0_12px_44px_-12px_rgba(0,0,0,0.12)] border border-[#EAEAEA] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#F0F0F0]">
            <p className="text-[13px] font-medium text-[#111]">Quick Impersonation</p>
            <p className="text-[11px] text-[#ACACAC] mt-0.5">Login as a user to debug their experience</p>
          </div>
          <div className="p-2">
            <button onClick={() => handleImpersonate("Student", "Aarav Mehta")} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent">
              <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] flex items-center justify-center shrink-0"><Student size={16} className="text-[#E08A3C]" /></div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[#1A1A1A]">Student Dashboard</p>
                <p className="text-[11px] text-[#ACACAC] truncate">View as Aarav Mehta (#STU-4421)</p>
              </div>
            </button>
            <button onClick={() => handleImpersonate("Teacher", "Cersei Lannister")} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer border-none bg-transparent">
              <div className="w-9 h-9 rounded-xl bg-[#F0F3FA] flex items-center justify-center shrink-0"><ChalkboardTeacher size={16} className="text-[#293763]" /></div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[#1A1A1A]">Teacher Dashboard</p>
                <p className="text-[11px] text-[#ACACAC] truncate">View as Cersei Lannister (#TCH-2201)</p>
              </div>
            </button>
          </div>
          <div className="px-4 py-2.5 border-t border-[#F0F0F0] bg-[#FAFAFA]">
            <p className="text-[10px] text-[#CACACA]">All impersonation sessions are audit-logged</p>
          </div>
        </div>
      </FixedDropdown>

      {/* Notifications dropdown */}
      {showNotifications && <div className="fixed inset-0 z-[199]" onClick={() => setShowNotifications(false)} />}
      <FixedDropdown anchorRef={notifBtnRef} open={showNotifications} width={340}>
        <div ref={notifDropRef} className="bg-white rounded-xl shadow-[0_12px_44px_-12px_rgba(0,0,0,0.12)] border border-[#EAEAEA] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#F0F0F0] flex items-center justify-between">
            <h3 className="text-[13px] font-medium text-[#111]">Inbox</h3>
            <button onClick={markAllRead} className="text-[11px] font-medium text-[#888] hover:text-[#111] transition-colors border-none bg-transparent cursor-pointer">Mark all read</button>
          </div>
          <div className="max-h-[min(380px,50vh)] overflow-y-auto custom-scrollbar">
            {notifications.map((notif) => (
              <div key={notif.id} className={`px-5 py-3.5 flex gap-3 hover:bg-[#FAFAFA] cursor-pointer transition-colors border-b border-[#F5F5F5] last:border-none ${!notif.isRead ? "bg-[#F8F9FA]" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-[#FFF] border border-[#EAEAEA] shadow-sm flex items-center justify-center shrink-0">{NOTIF_ICONS[notif.type]}</div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[13px] truncate ${notif.isRead ? "text-[#555] font-normal" : "text-[#111] font-medium"}`}>{notif.title}</p>
                    {!notif.isRead && <div className="w-1.5 h-1.5 bg-[#E08A3C] rounded-full shrink-0" />}
                  </div>
                  <p className="text-[12px] text-[#888] leading-snug line-clamp-2 mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-[#BBB] font-normal mt-1.5">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 text-[12px] font-medium text-[#666] bg-white hover:bg-[#FAFAFA] transition-colors border-t border-[#EAEAEA] border-b-0 border-l-0 border-r-0 cursor-pointer">View complete inbox</button>
        </div>
      </FixedDropdown>

      {/* Date picker dropdown */}
      {showDatePicker && <div className="fixed inset-0 z-[199]" onClick={() => setShowDatePicker(false)} />}
      <FixedDropdown anchorRef={dateBtnRef} open={showDatePicker} width={220}>
        <div className="bg-white rounded-xl shadow-[0_12px_44px_-12px_rgba(0,0,0,0.12)] border border-[#EAEAEA] max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-4 py-2.5 border-b border-[#F0F0F0] sticky top-0 bg-white z-10">
            <p className="text-[11px] font-medium text-[#888] uppercase tracking-wider">Date Range</p>
          </div>
          <div className="py-1">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => { setRange(p); setShowDatePicker(false); }}
                className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors cursor-pointer border-none ${
                  range.label === p.label ? "bg-[#FFF7ED] text-[#E08A3C] font-medium" : "bg-transparent text-[#555] hover:bg-[#FAFAFA]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-[#F0F0F0] sticky bottom-0 bg-white">
            <p className="text-[10px] text-[#CACACA] mb-2">Custom range</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#ACACAC] w-[34px] shrink-0">From</span>
                <input
                  type="date"
                  value={range.from.toISOString().slice(0, 10)}
                  onChange={(e) => { const d = new Date(e.target.value); if (!isNaN(d.getTime())) setRange({ from: d, to: range.to, label: "Custom" }); }}
                  className="flex-1 h-[32px] px-2 border border-[#EBEBEB] rounded-lg text-[11px] font-mono text-[#555] bg-white focus:outline-none focus:border-[#E08A3C] w-full min-w-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#ACACAC] w-[34px] shrink-0">To</span>
                <input
                  type="date"
                  value={range.to.toISOString().slice(0, 10)}
                  onChange={(e) => { const d = new Date(e.target.value); if (!isNaN(d.getTime())) setRange({ from: range.from, to: d, label: "Custom" }); }}
                  className="flex-1 h-[32px] px-2 border border-[#EBEBEB] rounded-lg text-[11px] font-mono text-[#555] bg-white focus:outline-none focus:border-[#E08A3C] w-full min-w-0"
                />
              </div>
            </div>
          </div>
        </div>
      </FixedDropdown>

      <CommandPalette isOpen={isSearchOpen} onClose={closeSearch} />
    </header>
  );
});
