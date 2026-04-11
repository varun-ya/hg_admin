"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass, X, ClockCounterClockwise, Funnel, ArrowRight,
  // Icons used by the generated index
  House, ChartLineUp, Student, ChalkboardTeacher, IdentificationBadge,
  UsersThree, VideoCamera, ShieldCheck, Scales, Megaphone, CurrencyDollar,
  Wallet, ArrowsClockwise, Receipt, Brain, Key, GitBranch, ToggleRight,
  UserSwitch, Buildings, Percent, Heartbeat, TreeStructure, PaperPlaneTilt,
  Browser, ListBullets, Flag, ShieldWarning, Lightning, Wrench,
  Export, FilePdf, Prohibit, Gear,
} from "@phosphor-icons/react";
import {
  NAV_PAGES, ADMIN_ACTIONS, buildSearchIndex,
  TYPE_LABELS, TYPE_ORDER,
  type SearchItem, type SearchResultType,
} from "./searchIndex.generated";

// ── Icon resolver: maps iconName string → React element ──
const ICON_MAP: Record<string, React.ReactNode> = {
  House: <House size={15} />, ChartLineUp: <ChartLineUp size={15} />,
  Student: <Student size={15} />, ChalkboardTeacher: <ChalkboardTeacher size={15} />,
  IdentificationBadge: <IdentificationBadge size={15} />, UsersThree: <UsersThree size={15} />,
  VideoCamera: <VideoCamera size={15} />, ShieldCheck: <ShieldCheck size={15} />,
  Scales: <Scales size={15} />, Megaphone: <Megaphone size={15} />,
  CurrencyDollar: <CurrencyDollar size={15} />, Wallet: <Wallet size={15} />,
  ArrowsClockwise: <ArrowsClockwise size={15} />, Receipt: <Receipt size={15} />,
  Brain: <Brain size={15} />, Key: <Key size={15} />,
  GitBranch: <GitBranch size={15} />, ToggleRight: <ToggleRight size={15} />,
  UserSwitch: <UserSwitch size={15} />, Buildings: <Buildings size={15} />,
  Percent: <Percent size={15} />, Heartbeat: <Heartbeat size={15} />,
  TreeStructure: <TreeStructure size={15} />, PaperPlaneTilt: <PaperPlaneTilt size={15} />,
  Browser: <Browser size={15} />, ListBullets: <ListBullets size={15} />,
  Flag: <Flag size={15} />, ShieldWarning: <ShieldWarning size={15} />,
  Lightning: <Lightning size={15} />, Wrench: <Wrench size={15} />,
  Export: <Export size={15} />, FilePdf: <FilePdf size={15} />,
  Prohibit: <Prohibit size={15} />, Gear: <Gear size={15} />,
};

// Action icons get accent colors
const ACTION_ICON_COLORS: Record<string, string> = {
  Student: "text-[#E08A3C]", ChalkboardTeacher: "text-[#293763]",
  Export: "text-[#E08A3C]", FilePdf: "text-[#293763]",
  Prohibit: "text-[#C2571A]", Wallet: "text-[#E08A3C]",
  VideoCamera: "text-[#E08A3C]",
};

function resolveIcon(iconName: string, isAction = false): React.ReactNode {
  const color = isAction ? ACTION_ICON_COLORS[iconName] : undefined;
  if (color) {
    const Icon = { House, ChartLineUp, Student, ChalkboardTeacher, IdentificationBadge, UsersThree, VideoCamera, ShieldCheck, Scales, Megaphone, CurrencyDollar, Wallet, ArrowsClockwise, Receipt, Brain, Key, GitBranch, ToggleRight, UserSwitch, Buildings, Percent, Heartbeat, TreeStructure, PaperPlaneTilt, Browser, ListBullets, Flag, ShieldWarning, Lightning, Wrench, Export, FilePdf, Prohibit, Gear }[iconName];
    if (Icon) return <Icon size={15} className={color} />;
  }
  return ICON_MAP[iconName] || <MagnifyingGlass size={15} />;
}

// ── Filter tabs ──
const FILTER_TABS: { label: string; types: SearchResultType[] | null }[] = [
  { label: "All", types: null },
  { label: "Pages", types: ["page"] },
  { label: "Actions", types: ["action"] },
  { label: "Sessions", types: ["session"] },
  { label: "Audit", types: ["audit"] },
  { label: "CMS", types: ["cms"] },
];

const RECENT_KEY = "hg_recent_searches";
const MAX_RECENT = 5;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const [recents, setRecents] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load recents
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setRecents(JSON.parse(saved));
    } catch {}
  }, []);

  const saveRecent = useCallback((term: string) => {
    if (!term.trim()) return;
    setRecents((prev) => {
      const next = [term, ...prev.filter((r) => r !== term)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecents([]);
    localStorage.removeItem(RECENT_KEY);
  }, []);

  // Build full index from generated data
  const allResults = useMemo(() => buildSearchIndex(), []);

  const filterTypes = FILTER_TABS[activeFilter].types;

  // Filter + sort
  const filtered = useMemo(() => {
    let pool = allResults;
    if (filterTypes) pool = pool.filter((r) => filterTypes.includes(r.type));

    if (!query.trim()) {
      return [
        ...(filterTypes ? [] : ADMIN_ACTIONS.slice(0, 3)),
        ...pool.filter((r) => r.type === "page").slice(0, filterTypes ? 20 : 6),
      ];
    }
    const q = query.toLowerCase();
    const matches = pool.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.subtitle.toLowerCase().includes(q)
    );
    return matches.sort((a, b) => {
      const aOrder = TYPE_ORDER.indexOf(a.type);
      const bOrder = TYPE_ORDER.indexOf(b.type);
      if (aOrder !== bOrder) return (aOrder === -1 ? 99 : aOrder) - (bOrder === -1 ? 99 : bOrder);
      const aTitle = a.title.toLowerCase().indexOf(q);
      const bTitle = b.title.toLowerCase().indexOf(q);
      return (aTitle === -1 ? 99 : aTitle) - (bTitle === -1 ? 99 : bTitle);
    }).slice(0, 25);
  }, [query, allResults, filterTypes]);

  // Group by type
  const grouped = useMemo(() => {
    const groups: { type: SearchResultType; label: string; items: SearchItem[] }[] = [];
    const seen = new Set<SearchResultType>();
    filtered.forEach((r) => {
      if (!seen.has(r.type)) {
        seen.add(r.type);
        groups.push({ type: r.type, label: TYPE_LABELS[r.type], items: [] });
      }
      groups.find((g) => g.type === r.type)!.items.push(r);
    });
    return groups;
  }, [filtered]);

  const flatList = useMemo(() => filtered, [filtered]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setActiveFilter(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, flatList.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Tab") { e.preventDefault(); setActiveFilter((i) => (i + 1) % FILTER_TABS.length); setActiveIndex(0); }
      if (e.key === "Enter") { e.preventDefault(); const item = flatList[activeIndex]; if (item) executeResult(item); }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, activeIndex, flatList, onClose]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const executeResult = useCallback((r: SearchItem) => {
    if (query.trim()) saveRecent(query.trim());
    if (r.href) router.push(r.href);
    onClose();
  }, [router, onClose, query, saveRecent]);

  const useRecent = useCallback((term: string) => {
    setQuery(term);
    setActiveIndex(0);
    inputRef.current?.focus();
  }, []);

  if (!isOpen) return null;

  let flatIdx = -1;
  const showRecents = !query.trim() && recents.length > 0 && activeFilter === 0;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-start justify-center font-matter">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

      <div className="relative w-full h-full sm:h-auto sm:max-h-[min(600px,80vh)] sm:max-w-[640px] sm:mt-[10vh] sm:mx-4 bg-white sm:rounded-2xl shadow-[0_24px_80px_-20px_rgba(0,0,0,0.2)] border-0 sm:border border-[#EAEAEA] overflow-hidden flex flex-col animate-modalIn">
        {/* Input */}
        <div className="flex items-center px-4 sm:px-5 border-b border-[#F0F0F0] shrink-0">
          <MagnifyingGlass size={18} className="text-[#CACACA] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
            placeholder="Search pages, sessions, actions…"
            className="w-full h-[50px] sm:h-[56px] px-3 text-[14px] sm:text-[15px] font-matter bg-transparent border-none outline-none text-[#111] placeholder:text-[#CACACA]"
          />
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {query && (
              <button onClick={() => { setQuery(""); setActiveIndex(0); inputRef.current?.focus(); }} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#F5F5F5] text-[#CACACA] hover:text-[#999] transition-colors border-none bg-transparent cursor-pointer">
                <X size={12} weight="bold" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-medium bg-[#F5F5F5] border border-[#EBEBEB] rounded text-[#ACACAC] font-mono select-none">ESC</kbd>
            <button onClick={onClose} className="sm:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F5F5F5] text-[#CACACA] hover:text-[#999] transition-colors border-none bg-transparent cursor-pointer">
              <X size={14} weight="bold" />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-5 py-2 border-b border-[#F5F5F5] shrink-0 overflow-x-auto custom-scrollbar">
          <Funnel size={12} className="text-[#DCDCDC] shrink-0 mr-1" />
          {FILTER_TABS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => { setActiveFilter(i); setActiveIndex(0); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border-none whitespace-nowrap ${
                activeFilter === i ? "bg-[#1A1A1A] text-white" : "bg-transparent text-[#ACACAC] hover:text-[#666] hover:bg-[#F5F5F5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="hidden sm:inline text-[9px] text-[#DCDCDC] ml-auto shrink-0">Tab to switch</span>
        </div>

        {/* Results */}
        <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar py-1">
          {/* Recents */}
          {showRecents && (
            <div className="mb-1">
              <div className="px-4 sm:px-5 py-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#CACACA] uppercase tracking-[0.1em]">
                  <ClockCounterClockwise size={11} /> Recent
                </span>
                <button onClick={clearRecents} className="text-[10px] text-[#DCDCDC] hover:text-[#999] bg-transparent border-none cursor-pointer transition-colors">Clear</button>
              </div>
              {recents.map((term) => (
                <button key={term} onClick={() => useRecent(term)} className="w-full flex items-center gap-3 px-4 sm:px-5 py-2 text-left transition-colors cursor-pointer border-none bg-transparent hover:bg-[#FAFAFA]">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F7F7F7] flex items-center justify-center shrink-0 text-[#CACACA]">
                    <ClockCounterClockwise size={13} />
                  </div>
                  <span className="text-[13px] text-[#888] truncate">{term}</span>
                  <ArrowRight size={10} className="text-[#DCDCDC] ml-auto shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Empty */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 gap-3 px-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F7F7F7] flex items-center justify-center">
                <MagnifyingGlass size={20} className="text-[#DCDCDC]" />
              </div>
              <p className="text-[13px] text-[#ACACAC]">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-[#DCDCDC] text-center">Try a different search term or switch the filter tab</p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.type} className="mb-1">
                <div className="px-4 sm:px-5 py-2">
                  <span className="text-[10px] font-semibold text-[#CACACA] uppercase tracking-[0.1em]">
                    {group.label}
                    <span className="ml-1.5 text-[#DCDCDC] font-normal">{group.items.length}</span>
                  </span>
                </div>
                {group.items.map((r) => {
                  flatIdx++;
                  const idx = flatIdx;
                  const isActive = idx === activeIndex;
                  const isAction = r.type === "action";
                  return (
                    <button
                      key={r.id}
                      data-index={idx}
                      onClick={() => executeResult(r)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 sm:px-5 py-2.5 text-left transition-colors cursor-pointer border-none ${
                        isActive ? "bg-[#F7F7F8]" : "bg-transparent hover:bg-[#FAFAFA]"
                      }`}
                    >
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-white border border-[#EBEBEB] shadow-sm" : "bg-[#F7F7F7]"} text-[#999]`}>
                        {resolveIcon(r.iconName, isAction)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12px] sm:text-[13px] truncate ${isActive ? "text-[#111] font-medium" : "text-[#555]"}`}>{r.title}</p>
                        <p className="text-[10px] sm:text-[11px] text-[#CACACA] truncate">{r.subtitle}</p>
                      </div>
                      {isActive && (
                        <div className="hidden sm:flex items-center gap-1 shrink-0">
                          <kbd className="px-1.5 py-0.5 text-[9px] font-medium bg-[#F0F0F0] border border-[#EBEBEB] rounded text-[#CACACA] font-mono">↵</kbd>
                        </div>
                      )}
                      {isAction && !isActive && (
                        <ArrowRight size={10} className="text-[#DCDCDC] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-t border-[#F0F0F0] flex items-center justify-between shrink-0 bg-[#FAFAFA]">
          <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-[#CACACA]">
            <span className="hidden xs:flex items-center gap-1"><kbd className="px-1 py-0.5 bg-[#F0F0F0] border border-[#EBEBEB] rounded font-mono">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-[#F0F0F0] border border-[#EBEBEB] rounded font-mono">↵</kbd> Open</span>
            <span className="hidden sm:flex items-center gap-1"><kbd className="px-1 py-0.5 bg-[#F0F0F0] border border-[#EBEBEB] rounded font-mono">Tab</kbd> Filter</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-[#F0F0F0] border border-[#EBEBEB] rounded font-mono">esc</kbd> Close</span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-[#DCDCDC]">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
