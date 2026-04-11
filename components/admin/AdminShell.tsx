"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import PageTransition from "@/components/admin/PageTransition";
import { DateRangeProvider } from "@/components/admin/context/DateRangeContext";
import { CurrencyProvider } from "@/components/admin/context/CurrencyContext";
import { useAuth } from "@/components/admin/context/AuthContext";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/");
  }, [isLoading, isAuthenticated, router]);

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  // Only show spinner during initial hydration check, not after login
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-matter">
        <div className="w-6 h-6 border-2 border-[#E08A3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated after loading, render nothing (redirect is in-flight)
  if (!isAuthenticated) return null;

  return (
    <CurrencyProvider>
    <DateRangeProvider>
      <div className="flex h-screen bg-white overflow-hidden font-matter">
        <div className="hidden md:block">
          <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        </div>

        {mobileSidebarOpen && (
          <>
            <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-[3px] z-40 md:hidden transition-opacity" onClick={closeMobileSidebar} />
            <div className="fixed left-0 top-0 h-full z-50 md:hidden">
              <AdminSidebar isOpen={true} setIsOpen={() => {}} />
            </div>
          </>
        )}

        <main className="flex-1 h-screen overflow-y-auto bg-white relative">
          <div className="sticky top-0 z-20 px-6 md:px-10 lg:px-12 pt-5 pb-4 bg-white/80 backdrop-blur-[12px] border-b border-[#F0F0F0]">
            <AdminHeader onToggleMobileSidebar={toggleMobileSidebar} />
          </div>
          <div className="px-6 md:px-10 lg:px-12 pb-10 pt-5">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </DateRangeProvider>
    </CurrencyProvider>
  );
}
