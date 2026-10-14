import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../../app/providers/AuthContext";
import { Loader } from "../common";

export const AppLayout = () => {
  const { isLoading } = useAuth();

  // Desktop sidebar collapsed state
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Toggle handlers
  const handleToggleSidebar = () => {
    // If on mobile screen (< 1024px), toggle mobile drawer
    if (window.innerWidth < 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      // On desktop, toggle collapse
      setIsDesktopCollapsed((prev) => !prev);
    }
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
  };

  // Lock background scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  // Handle window resize cleanly
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5FBFF] dark:bg-slate-900">
        <Loader size="lg" text="Loading SaveDost Portal..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FBFF] dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col antialiased">
      {/* 1. Navigation Sidebar */}
      <Sidebar
        isDesktopCollapsed={isDesktopCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={handleCloseMobile}
        onToggleDesktop={() => setIsDesktopCollapsed((prev) => !prev)}
      />

      {/* 2. Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isDesktopCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Header */}
        <Header
          onToggleSidebar={handleToggleSidebar}
          isDesktopCollapsed={isDesktopCollapsed}
          isMobileOpen={isMobileOpen}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Outlet />
        </main>

        {/* Global Footer info bar */}
        <footer className="py-4 px-6 border-t border-[#E2EEF5] dark:border-slate-800 text-center text-[11px] text-slate-400">
          SaveDost Platform &bull; Secure Digital Services &bull; Powered by Direct Payment Gateway Architecture
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
