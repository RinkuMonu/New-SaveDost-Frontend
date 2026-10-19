import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../app/providers/AuthContext";
import { ROLES } from "../../utils/constants";

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
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left Side: Sidebar Toggle & Scrolling News Banner */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <button
            type="button"
            id="sidebar-toggle-btn"
            aria-label="Toggle Navigation Sidebar"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:text-[#018EDE] hover:bg-[#F5FBFF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#018EDE]/30"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Scrolling/Live Announcement Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF6FD] border border-sky-100 text-xs text-[#0C3D4C] max-w-xl truncate">
            <span className="px-2 py-0.5 rounded-full bg-[#018EDE] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 fill-current" /> Live System
            </span>
            <span className="text-[#018EDE] font-bold">7 Providers Active</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 truncate font-medium">
              ⚡ Direct payment gateway & 18 platform services live · RBI-Aligned Infrastructure
            </span>
          </div>
        </div>

        {/* Right Side: Balance Pill, Notifications & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          {/* Live Balance Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF6FF] border border-sky-100 text-xs font-bold text-[#0C3D4C] shadow-xs">
            <div className="w-4 h-4 rounded-full bg-amber-400 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
              ₹
            </div>
            <span>
              ₹ {Number(user?.settlementBalance !== undefined ? user.settlementBalance : (user?.balance || 50000.0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              id="header-notifications-btn"
              aria-label="Notifications"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-full text-slate-600 hover:text-[#018EDE] hover:bg-[#F5FBFF] transition-colors relative focus:outline-none"
            >
              <Bell className="w-5 h-5 text-sky-500" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#018EDE] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                2
              </span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E2EEF5] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Notifications & Alerts
                  </h3>
                  <span className="text-[11px] font-semibold text-brand-blue">
                    SaveDost System
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  <div className="p-3 hover:bg-[#F5FBFF] transition-colors flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800">
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

                  <div className="p-3 hover:bg-[#F5FBFF] transition-colors flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800">
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

                <div className="px-4 pt-2 border-t border-slate-100 text-center">
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
              className="flex items-center space-x-2 p-1 rounded-xl hover:bg-[#F5FBFF] transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#E7F6FF] text-[#018EDE] border border-sky-200 flex items-center justify-center font-bold text-xs shadow-xs">
                {initial}
              </div>
              <div className="hidden sm:block text-left pr-1 leading-tight">
                <span className="block text-xs font-bold text-[#0C3D4C] max-w-[120px] truncate">
                  {displayName === "User" ? "Finunique" : displayName}
                </span>
                <span className="block text-[10px] text-slate-400 capitalize">
                  {role ? role.toLowerCase() : "Admin"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-[#E2EEF5] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Summary */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
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
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-[#F5FBFF] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>
                  )}
                  {role === ROLES.ADMIN && (
                    <Link
                      to="/admin/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-[#F5FBFF] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>Admin Settings</span>
                    </Link>
                  )}
                  {role === ROLES.API_PARTNER && (
                    <Link
                      to="/api-partner/docs"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-[#F5FBFF] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>API Credentials & Docs</span>
                    </Link>
                  )}
                </div>

                {/* Sign Out */}
                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    id="header-logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
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
