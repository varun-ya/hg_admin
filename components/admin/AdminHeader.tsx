"use client";
import { useState, useEffect, useRef, memo } from "react";
import {
  MagnifyingGlass,
  Bell,
  CalendarBlank,
  Info,
  Warning,
  CheckCircle,
  X,
  Plus,
  VideoCamera,
  Lightning
} from "@phosphor-icons/react";
import { adminNotifications } from "./mockData";

export default memo(function AdminHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchClosing, setIsSearchClosing] = useState(false);

  const closeSearch = () => {
    setIsSearchClosing(true);
    setTimeout(() => {
      setIsSearchOpen(false);
      setIsSearchClosing(false);
    }, 150);
  };
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowNotifications(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { if (isSearchOpen) closeSearch(); setShowNotifications(false); }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  const unreadCount = adminNotifications.filter((n) => !n.isRead).length;

  const NOTIF_ICONS: Record<string, React.ReactNode> = {
    security: <Warning weight="fill" className="text-[#DC2626]" />,
    financial: <CheckCircle weight="fill" className="text-[#059669]" />,
    alert: <Warning weight="fill" className="text-[#D97706]" />,
    system: <Info weight="fill" className="text-[#6B7280]" />,
  };

  // Format current date\n  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <header className="flex items-center justify-between w-full flex-wrap gap-4 font-matter">
      {/* Vercel-style Breadcrumb */}
      <div className="flex items-center gap-2.5 text-[14px]">
        <div className="flex items-center gap-2 text-[#888]">
          <span className="hover:text-[#111] cursor-pointer transition-colors px-1 rounded hover:bg-[#EAEAEA]">HomeGuru</span>
          <span className="text-[#D0D0D0] select-none">/</span>
          <span className="text-[#111] font-medium px-1">Dashboard</span>
        </div>
        <div className="h-4 w-[1px] bg-[#EAEAEA] mx-1 hidden sm:block" />
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-[#EAEAEA] text-[11px] font-medium text-[#666] shadow-sm">
          Production <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] ml-0.5" />
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Toggle Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="h-[38px] flex items-center gap-2 px-3 rounded-lg bg-white border border-[#EAEAEA] hover:bg-[#F9FAFB] hover:border-[#D0D0D0] transition-colors text-[#888] cursor-pointer shadow-sm"
        >
          <MagnifyingGlass size={15} weight="bold" />
          <span className="hidden lg:inline text-[12px] font-medium text-[#BBB]">Search...</span>
          <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] font-semibold bg-[#F4F4F5] border border-[#E4E4E7] rounded text-[#999] font-sans select-none ml-1">⌘K</kbd>
        </button>

        {/* Activity Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-[42px] h-[42px] flex items-center justify-center rounded-full bg-white border border-[#EAEAEA] hover:bg-[#F9FAFB] transition-colors text-[#555] cursor-pointer shadow-sm"
          >
            <Bell size={18} weight={showNotifications ? "fill" : "bold"} />
            {unreadCount > 0 && (
              <span className="absolute top-[7px] right-[7px] w-2 h-2 bg-[#4F46E5] rounded-full border-2 border-white box-content" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[340px] bg-white rounded-xl shadow-[0_12px_44px_-12px_rgba(0,0,0,0.12)] border border-[#EAEAEA] z-[100] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#F0F0F0] flex items-center justify-between">
                <h3 className="text-[14px] font-medium text-[#111]">Inbox</h3>
                <button className="text-[11px] font-medium text-[#999] hover:text-[#111] transition-colors border-none bg-transparent cursor-pointer">
                  Mark all read
                </button>
              </div>
              <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                {adminNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-5 py-3.5 flex gap-3 hover:bg-[#FAFAFA] cursor-pointer transition-colors border-b border-[#F5F5F5] last:border-none ${
                      !notif.isRead ? "bg-[#F8F9FA]" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FFF] border border-[#EAEAEA] shadow-sm flex items-center justify-center shrink-0">
                      {NOTIF_ICONS[notif.type]}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-[13px] truncate ${notif.isRead ? "text-[#555] font-normal" : "text-[#111] font-medium"}`}>
                          {notif.title}
                        </p>
                        {!notif.isRead && <div className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full shrink-0" />}
                      </div>
                      <p className="text-[12px] text-[#888] leading-snug line-clamp-2 mt-0.5">{notif.message}</p>
                      <p className="text-[10px] text-[#BBB] font-normal mt-1.5">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-2.5 text-[12px] font-medium text-[#666] bg-white hover:bg-[#FAFAFA] transition-colors border-t border-[#EAEAEA] border-b-0 border-l-0 border-r-0 cursor-pointer">
                View complete inbox
              </button>
            </div>
          )}
        </div>

        {/* Current Date Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#EAEAEA] shadow-sm rounded-lg text-[13px] font-medium text-[#555]">
          <CalendarBlank size={15} weight="regular" className="text-[#4F46E5]" />
          {dateStr}
        </div>

        {/* User Avatar Menu */}
        <button className="w-[42px] h-[42px] rounded-full overflow-hidden border border-[#EAEAEA] hover:opacity-90 transition-opacity cursor-pointer bg-transparent p-0 object-cover shadow-sm">
          <img
             src="https://i.pravatar.cc/150?img=47"
             alt="Admin profile"
             className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className={`fixed inset-0 bg-[#000000]/20 backdrop-blur-sm z-[200] flex items-start justify-center pt-[10vh] transition-opacity duration-150 ${
          isSearchClosing ? "opacity-0" : "animate-[fadeIn_150ms_ease-out]"
        }`}>
          <div className={`w-full max-w-[600px] bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-[#EAEAEA] overflow-hidden mx-4 flex flex-col transition-all duration-150 ${
            isSearchClosing ? "opacity-0 scale-95 translate-y-2" : "animate-[modalIn_150ms_ease-out]"
          }`}>
            <div className="flex items-center px-4 border-b border-[#EAEAEA]">
              <MagnifyingGlass size={18} className="text-[#888] shrink-0" />
              <input 
                type="text" 
                autoFocus
                placeholder="Search commands, users, transactions..." 
                className="w-full h-[52px] px-3 text-[15px] font-matter bg-transparent border-none outline-none text-[#111] placeholder:text-[#BBB]"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-[#FAFAFA] border border-[#EAEAEA] rounded text-[#888] font-sans select-none">ESC</kbd>
                <button
                  onClick={closeSearch}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F0F0F0] text-[#888] hover:text-[#111] transition-colors border-none bg-transparent cursor-pointer"
                  aria-label="Close search"
                >
                  <X size={14} weight="bold" />
                </button>
              </div>
            </div>
            <div className="p-2 py-4 flex flex-col gap-1">
               <span className="px-3 text-[11px] font-medium text-[#888] tracking-widest uppercase mb-1">Suggestions</span>
               <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer w-full text-[14px] text-[#333]">
                 <span className="w-6 h-6 rounded border border-[#EAEAEA] flex items-center justify-center bg-white shadow-sm"><CheckCircle size={14} className="text-[#666]"/></span>
                 Review Pending KYC Documents
               </button>
               <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FAFAFA] text-left transition-colors cursor-pointer w-full text-[14px] text-[#333]">
                 <span className="w-6 h-6 rounded border border-[#EAEAEA] flex items-center justify-center bg-white shadow-sm"><Info size={14} className="text-[#666]"/></span>
                 View System Audit Logs
               </button>
            </div>
          </div>
          <div className="fixed inset-0 z-[-1]" onClick={closeSearch} />
        </div>
      )}
    </header>
  );
});

// chore: UI cleanup pass 16

// chore: UI cleanup pass 17
