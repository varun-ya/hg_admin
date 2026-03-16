"use client";
import { useState, useEffect, useRef, memo } from "react";
import {
  MagnifyingGlass,
  Bell,
  ShieldCheck,
  CalendarBlank,
  Info,
  X,
  Warning,
  CheckCircle,
} from "@phosphor-icons/react";
import { adminNotifications } from "./mockData";

export default memo(function AdminHeader() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { setIsSearchOpen(false); setShowNotifications(false); }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) inputRef.current.focus();
  }, [isSearchOpen]);

  const unreadCount = adminNotifications.filter((n) => !n.isRead).length;

  const NOTIF_ICONS: Record<string, React.ReactNode> = {
    security: <Warning weight="fill" className="text-[#999]" />,
    financial: <CheckCircle weight="fill" className="text-[#999]" />,
    alert: <Warning weight="fill" className="text-[#999]" />,
    system: <Info weight="fill" className="text-[#CACACA]" />,
  };

  return (
    <header className="flex items-center justify-between w-full flex-wrap gap-4 font-matter">
      <h1 className="text-[22px] text-[#1A1A1A] font-season font-normal">
        Welcome back, <span className="font-medium">Admin</span>
      </h1>

      <div className="flex items-center gap-3">
        {/* Search + Command */}
        <div className="hidden lg:flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#293763] text-white rounded-full text-[12px] font-medium hover:bg-[#1E2A4A] transition-all active:scale-95 whitespace-nowrap border-none cursor-pointer">
            <ShieldCheck size={15} weight="bold" />
            Command Center
          </button>

          <div className="relative flex items-center" ref={searchRef}>
            <div className={`flex items-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isSearchOpen ? "w-[280px] opacity-100" : "w-0 opacity-0 pointer-events-none"
            } overflow-hidden`}>
              <div className="relative w-full pr-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search users, transactions..."
                  className="w-full h-[38px] pl-9 pr-9 bg-white border border-[#EBEBEB] rounded-full text-[13px] font-matter focus:outline-none focus:border-[#1A1A1A] transition-all"
                />
                <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CACACA]" />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] text-[#CACACA] transition-colors border-none bg-transparent cursor-pointer"
                >
                  <X size={12} weight="bold" />
                </button>
              </div>
            </div>

            <div className={`flex items-center transition-all duration-300 ${
              isSearchOpen ? "w-0 opacity-0 pointer-events-none overflow-hidden" : "w-[38px] opacity-100"
            }`}>
              <button
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center bg-white hover:bg-[#FAFAFA] border border-[#EBEBEB] cursor-pointer transition-colors"
              >
                <MagnifyingGlass size={17} className="text-[#888]" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all border border-[#EBEBEB] cursor-pointer ${
              showNotifications ? "bg-[#F5F5F5]" : "bg-white hover:bg-[#FAFAFA]"
            }`}
          >
            <Bell size={17} weight={showNotifications ? "fill" : "regular"} className="text-[#888]" />
            {unreadCount > 0 && (
              <span className="absolute top-[8px] right-[10px] w-1.5 h-1.5 bg-[#E08A3C] rounded-full border border-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-[320px] bg-white rounded-2xl shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] border border-[#F0F0F0] z-[100] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F5F5F5] flex items-center justify-between">
                <h3 className="text-[14px] font-medium text-[#1A1A1A]">Notifications</h3>
                <button className="text-[11px] font-medium text-[#999] hover:text-[#555] transition-colors border-none bg-transparent cursor-pointer">
                  Mark all read
                </button>
              </div>
              <div className="max-h-[380px] overflow-y-auto">
                {adminNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-5 py-4 flex gap-3 hover:bg-[#FAFAFA] cursor-pointer transition-colors border-b border-[#F8F8F8] last:border-none ${
                      !notif.isRead ? "bg-[#FAFAFA]/50" : ""
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#F7F7F7] flex items-center justify-center shrink-0 text-[18px]">
                      {NOTIF_ICONS[notif.type]}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-medium text-[#1A1A1A] truncate">{notif.title}</p>
                        {!notif.isRead && <div className="w-1.5 h-1.5 bg-[#293763] rounded-full shrink-0" />}
                      </div>
                      <p className="text-[12px] text-[#999] leading-snug line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-[#CACACA] font-normal mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 text-[11px] font-medium text-[#999] bg-[#FAFAFA] hover:bg-[#F5F5F5] transition-colors border-t border-[#F0F0F0] border-b-0 border-l-0 border-r-0 cursor-pointer">
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Status */}
        <div
          onClick={() => setIsOnline(!isOnline)}
          className="hidden sm:flex rounded-full items-center gap-2 cursor-pointer transition-all bg-white border border-[#EBEBEB] px-3 h-[36px]"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[#1A1A1A] animate-pulse" : "bg-[#DCDCDC]"}`} />
          <span className={`text-[12px] font-normal ${isOnline ? "text-[#555]" : "text-[#ACACAC]"}`}>
            {isOnline ? "Active" : "Offline"}
          </span>
        </div>

        {/* Date */}
        <div className="hidden md:flex rounded-full items-center gap-2 bg-white border border-[#EBEBEB] px-3 h-[36px]">
          <CalendarBlank size={15} className="text-[#999]" />
          <span className="text-[12px] font-normal text-[#555]">12 Mar</span>
        </div>

        {/* Avatar */}
        <button className="w-[38px] h-[38px] rounded-full overflow-hidden border border-[#EBEBEB] hover:opacity-90 transition-opacity cursor-pointer bg-transparent p-0">
          <img
            src="https://i.pravatar.cc/150?img=68"
            alt="Admin profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
});
