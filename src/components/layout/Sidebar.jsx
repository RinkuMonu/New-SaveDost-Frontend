import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Server,
  FileText,
  Settings,
  Wallet,
  Code,
  Activity,
  Smartphone,
  Zap,
  CreditCard,
  Receipt,
  User as UserIcon,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../app/providers/AuthContext";
import { getNavigationForRole } from "../../utils/navigationConfig";
import { getRoleDashboardPath } from "../../utils/constants";

// Icon mapping helper
const ICON_MAP = {
  LayoutDashboard,
  Users,
  Server,
  FileText,
  Settings,
  Wallet,
  Code,
  Activity,
  Smartphone,
  Zap,
  CreditCard,
  Receipt,
  User: UserIcon,
};

export const Sidebar = ({
  isDesktopCollapsed,
  isMobileOpen,
  onCloseMobile,
  onToggleDesktop,
}) => {
  const { role, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Local state for expandable submenus: { [itemId]: boolean }
  const [expandedGroups, setExpandedGroups] = useState({});

  const navGroups = getNavigationForRole(role);

  const toggleGroup = (itemId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleLogout = async () => {
    if (onCloseMobile) onCloseMobile();
    await logout();
    navigate("/login");
  };

  const isItemActive = (item) => {
    if (location.pathname === item.path) return true;
    if (item.subItems) {
      return item.subItems.some((sub) => location.pathname === sub.path);
    }
    return false;
  };

  const displayName = user?.name || user?.mobile || user?.mobileNumber || "User";
  const initial = (displayName.charAt(0) || "U").toUpperCase();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-navigation-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-[#E2EEF5] dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out
          ${/* Mobile drawer positioning */ ""}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${/* Desktop width */ ""}
          ${isDesktopCollapsed ? "lg:w-20" : "lg:w-64"}
          w-72 max-w-[85vw] shadow-xl lg:shadow-none
        `}
      >
        {/* Sidebar Header / Branding */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#E2EEF5] dark:border-slate-800 flex-shrink-0">
          <Link
            to={getRoleDashboardPath(role)}
            onClick={onCloseMobile}
            className="flex items-center space-x-3 group focus:outline-none overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-blue text-white flex items-center justify-center shadow-md shadow-brand-blue/20 flex-shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>

            {(!isDesktopCollapsed || isMobileOpen) && (
              <div className="transition-opacity duration-200">
                <span className="text-lg font-black text-brand-navy dark:text-white tracking-tight">
                  Save<span className="text-brand-blue">Dost</span>
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
                  {role}
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            aria-label="Close Navigation Sidebar"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, groupIdx) => (
            <div key={group.group || groupIdx} className="space-y-1">
              {/* Section Header (hidden when desktop collapsed) */}
              {(!isDesktopCollapsed || isMobileOpen) && group.group && (
                <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.group}
                </div>
              )}

              {/* Section Items */}
              {group.items.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || ShieldCheck;
                const active = isItemActive(item);
                const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
                const isExpanded = expandedGroups[item.id] || active;

                return (
                  <div key={item.id} className="relative">
                    {hasSubItems ? (
                      /* Expandable Menu Accordion */
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleGroup(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group
                            ${
                              active
                                ? "bg-blue-50/80 dark:bg-blue-950/40 text-brand-blue"
                                : "text-slate-600 dark:text-slate-400 hover:bg-[#F5FBFF] dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                            }
                          `}
                          title={isDesktopCollapsed && !isMobileOpen ? item.label : undefined}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <IconComponent
                              className={`w-4 h-4 flex-shrink-0 transition-colors ${
                                active ? "text-brand-blue" : "text-slate-400 group-hover:text-slate-600"
                              }`}
                            />
                            {(!isDesktopCollapsed || isMobileOpen) && (
                              <span className="truncate">{item.label}</span>
                            )}
                          </div>

                          {(!isDesktopCollapsed || isMobileOpen) && (
                            <span className="ml-2 text-slate-400">
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </span>
                          )}
                        </button>

                        {/* Sub-menu Items */}
                        {isExpanded && (!isDesktopCollapsed || isMobileOpen) && (
                          <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 dark:border-slate-800 space-y-1">
                            {item.subItems.map((sub) => {
                              const isSubActive = location.pathname === sub.path;
                              return (
                                <Link
                                  key={sub.id}
                                  to={sub.path}
                                  onClick={onCloseMobile}
                                  className={`block px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                    isSubActive
                                      ? "bg-brand-blue text-white shadow-sm font-semibold"
                                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                                  }`}
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Single Nav Link */
                      <Link
                        to={item.path}
                        onClick={onCloseMobile}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                          active
                            ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20 font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-[#F5FBFF] dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                        }`}
                        title={isDesktopCollapsed && !isMobileOpen ? item.label : undefined}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <IconComponent
                            className={`w-4 h-4 flex-shrink-0 transition-colors ${
                              active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                            }`}
                          />
                          {(!isDesktopCollapsed || isMobileOpen) && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </div>

                        {(!isDesktopCollapsed || isMobileOpen) && item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-blue-50 dark:bg-blue-950 text-brand-blue border border-brand-blue/20"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-[#E2EEF5] dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                {initial}
              </div>
              {(!isDesktopCollapsed || isMobileOpen) && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider">
                    {role}
                  </p>
                </div>
              )}
            </div>

            {(!isDesktopCollapsed || isMobileOpen) && (
              <button
                type="button"
                id="sidebar-signout-btn"
                title="Sign Out"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
