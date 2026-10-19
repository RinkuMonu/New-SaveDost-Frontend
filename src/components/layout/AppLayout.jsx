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
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FA]">
        <Loader size="lg" text="Loading SaveDost Portal..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-[#0C3D4C] flex flex-col antialiased">
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
          isDesktopCollapsed ? "lg:pl-20" : "lg:pl-72"
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
        <footer className="py-4 px-6 border-t border-gray-200/60 bg-white/50 text-center text-[11px] text-slate-400">
          Finunique / SaveDost Platform &bull; Secure Digital Services &bull; Direct Payment Gateway Architecture
        </footer>
      </div>

      {/* Floating Support Button (matching screenshot bottom right) */}
      <div
        title="Help & Support"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#018EDE] hover:bg-[#0277bd] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer z-40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 18v-6a9 9 0 0118 0v6M3 18a3 3 0 003 3h1a2 2 0 002-2v-3a2 2 0 00-2-2H4a1 1 0 00-1 1v4zm18 0a3 3 0 01-3 3h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3a1 1 0 011 1v4z"
          />
        </svg>
      </div>
    </div>
  );
};

export default AppLayout;
