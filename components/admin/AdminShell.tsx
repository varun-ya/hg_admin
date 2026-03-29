"use client";
import { useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import PageTransition from "@/components/admin/PageTransition";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  return (
    <div className="flex h-screen bg-white overflow-hidden font-matter">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:block">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-40 md:hidden transition-opacity"
            onClick={closeMobileSidebar}
          />
          <div className="fixed left-0 top-0 h-full z-50 md:hidden">
            <AdminSidebar isOpen={true} setIsOpen={() => {}} />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-white relative">
        {/* Mobile Menu Button - Styled as a floating fab to avoid header clutter */}
        <div className="md:hidden fixed bottom-6 right-6 z-30">
          <button
            onClick={toggleMobileSidebar}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-[#EAEAEA] active:scale-95 transition-transform"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X size={20} className="text-[#111]" aria-hidden="true" /> : <Menu size={20} className="text-[#111]" aria-hidden="true" />}
          </button>
        </div>

        {/* Header Container — sticky frosted glass */}
        <div className="sticky top-0 z-20 px-6 md:px-10 lg:px-12 pt-5 pb-4 bg-white/80 backdrop-blur-[12px] border-b border-[#F0F0F0]">
          <AdminHeader />
        </div>

        {/* Main Content Canvas */}
        <div className="px-6 md:px-10 lg:px-12 pb-10 pt-5">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}

// chore: UI cleanup pass 1

// chore: UI cleanup pass 2

// chore: UI cleanup pass 3

// chore: UI cleanup pass 4

// chore: UI cleanup pass 5

// chore: UI cleanup pass 6

// chore: UI cleanup pass 7

// chore: UI cleanup pass 8

// chore: UI cleanup pass 9

// chore: UI cleanup pass 10

// chore: clean up pass 31

// chore: clean up pass 32
