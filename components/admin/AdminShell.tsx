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
    <div className="flex h-screen bg-[#293763] overflow-hidden font-matter">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMobileSidebar}
          />
          <div className="fixed left-0 top-0 h-full z-50 md:hidden">
            <AdminSidebar isOpen={true} setIsOpen={() => {}} />
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#FAFAFA]">
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 left-4 z-30">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 bg-white rounded-lg shadow-sm border border-[#EBEBEB]"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Header */}
        <div className="px-6 md:px-10 lg:px-12 pt-8 pb-2 mt-16 md:mt-0">
          <AdminHeader />
        </div>

        {/* Content */}
        <div className="px-6 md:px-10 lg:px-12 pb-12">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
