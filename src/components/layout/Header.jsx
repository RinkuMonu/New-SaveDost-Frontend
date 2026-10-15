import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../app/providers/AuthContext";
import { ROLES, getRoleDashboardPath } from "../../utils/constants";
import { Badge } from "../common";

export const Header = ({ onToggleSidebar, isDesktopCollapsed, isMobileOpen }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    navigate("/login");
  };

  const getRoleBadgeVariant = (userRole) => {
    switch (userRole) {
      case ROLES.ADMIN:
        return "purple";
      case ROLES.API_PARTNER:
        return "warning";
      case ROLES.USER:
      default:
        return "success";
    }
  };

  const getRoleLabel = (userRole) => {
    switch (userRole) {
      case ROLES.ADMIN:
        return "Platform Administrator";
      case ROLES.API_PARTNER:
        return "B2B API Partner";
      case ROLES.USER:
      default:
        return "Direct Pay Customer";
    }
  };

  // Safe user display name
  const displayName = user?.name || user?.mobile || user?.mobileNumber || "User";
  const userIdentifier = user?.email || user?.mobile || user?.mobileNumber || "";
  const initial = (displayName.charAt(0) || "U").toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#E2EEF5] dark:border-slate-800 shadow-sm transition-all">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left Side: Sidebar Toggle & Branding */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            type="button"
            id="sidebar-toggle-btn"
            aria-label="Toggle Navigation Sidebar"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-brand-blue hover:bg-[#F5FBFF] dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            to={getRoleDashboardPath(role)}
            className="flex items-center space-x-2 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-blue text-white flex items-center justify-center shadow-md shadow-brand-blue/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-extrabold text-brand-navy dark:text-white tracking-tight">
                Save<span className="text-brand-blue">Dost</span>
              </span>
              <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">
                {role === ROLES.ADMIN ? "Admin Console" : role === ROLES.API_PARTNER ? "Partner Hub" : "Utility Portal"}
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Role Badge, Notifications & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Role Badge (Desktop) */}
          <div className="hidden md:flex items-center">
            <Badge variant={getRoleBadgeVariant(role)} size="sm">
              {role}
            </Badge>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              id="header-notifications-btn"
              aria-label="Notifications"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-brand-blue hover:bg-[#F5FBFF] dark:hover:bg-slate-800 transition-colors relative focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#E2EEF5] dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Notifications & Alerts
                  </h3>
                  <span className="text-[11px] font-semibold text-brand-blue">
                    SaveDost System
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="p-3 hover:bg-[#F5FBFF] dark:hover:bg-slate-800/60 transition-colors flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Session Verified
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Authenticated as <strong>{role}</strong> with verified role permissions.
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 inline-flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Just now</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3 hover:bg-[#F5FBFF] dark:hover:bg-slate-800/60 transition-colors flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-brand-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        SaveDost Platform 2.0
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {role === ROLES.USER
                          ? "Direct payment gateway checkout is enabled for all utility services."
                          : role === ROLES.API_PARTNER
                          ? "B2B API partner integration and webhook services available."
                          : "Administrative governance panel active."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-brand-blue transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              id="header-user-menu-btn"
              aria-label="User profile menu"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-[#F5FBFF] dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-navy to-brand-blue text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {initial}
              </div>
              <div className="hidden sm:block text-left pr-1">
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight max-w-[120px] truncate">
                  {displayName}
                </span>
                <span className="block text-[10px] text-slate-400 leading-tight">
                  {role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#E2EEF5] dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Summary */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {userIdentifier}
                  </p>
                  <div className="mt-2">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {getRoleLabel(role)}
                    </span>
                  </div>
                </div>

                {/* Profile Links */}
                <div className="py-1">
                  {role === ROLES.USER && (
                    <Link
                      to="/user/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-[#F5FBFF] dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>
                  )}
                  {role === ROLES.ADMIN && (
                    <Link
                      to="/admin/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-[#F5FBFF] dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>Admin Settings</span>
                    </Link>
                  )}
                  {role === ROLES.API_PARTNER && (
                    <Link
                      to="/api-partner/docs"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-[#F5FBFF] dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>API Credentials & Docs</span>
                    </Link>
                  )}
                </div>

                {/* Sign Out */}
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    id="header-logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
