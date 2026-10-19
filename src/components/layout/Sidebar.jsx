import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Fingerprint,
  Server,
  KeyRound,
  Smartphone,
  Tv,
  Bus,
  Shield,
  Receipt,
  Landmark,
  CreditCard,
  Layers,
  Package,
  BadgePercent,
  Scan,
  Radio,
  ArrowRightLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Headphones,
  PhoneCall,
  Newspaper,
  Image as ImageIcon,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../app/providers/AuthContext";
import { getNavigationForRole } from "../../utils/navigationConfig";
import { getRoleDashboardPath } from "../../utils/constants";

// Map string icon names to Lucide icon components
const ICON_MAP = {
  LayoutDashboard,
  Users,
  UserPlus,
  Fingerprint,
  Server,
  KeyRound,
  Smartphone,
  Tv,
  Bus,
  Shield,
  Receipt,
  Landmark,
  CreditCard,
  Layers,
  Package,
  BadgePercent,
  Scan,
  Radio,
  ArrowRightLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Headphones,
  PhoneCall,
  Newspaper,
  Image: ImageIcon,
  BookOpen,
  Settings,
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

  // Expanded accordion groups: { [itemId]: boolean }
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
      return item.subItems.some(
        (sub) =>
          location.pathname === sub.path ||
          (sub.path.includes("?") &&
            location.pathname + location.search === sub.path)
      );
    }
    return false;
  };

  const displayName = user?.name || user?.mobile || user?.mobileNumber || "Finunique Admin";
  const initial = (displayName.charAt(0) || "F").toUpperCase();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container - Pure White Light Theme */}
      <aside
        id="app-navigation-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-[0_2px_8px_rgba(34,48,62,0.06)]
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isDesktopCollapsed ? "lg:w-20" : "lg:w-72"}
          w-72 max-w-[85vw]
        `}
      >
        {/* Sidebar Header with Finunique logo and blue collapse button */}
        <div className="h-20 px-4 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
          {!isDesktopCollapsed || isMobileOpen ? (
            <Link
              to={getRoleDashboardPath(role)}
              onClick={onCloseMobile}
              className="flex items-center gap-2 overflow-hidden group"
            >
              <img
                src="/7unique.png"
                alt="Finunique"
                className="h-12 w-auto object-contain max-w-[170px]"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Link>
          ) : (
            <div className="mx-auto">
              <Link to={getRoleDashboardPath(role)}>
                <img
                  src="/7unique.png"
                  alt="Finunique"
                  className="h-9 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </Link>
            </div>
          )}

          {/* Desktop Collapse Button on right edge */}
          <div className="hidden lg:flex items-center -mr-4">
            <button
              type="button"
              aria-label="Toggle Navigation Sidebar"
              onClick={onToggleDesktop}
              className="w-7 h-9 flex items-center justify-center rounded-l-lg bg-[#018EDE] hover:bg-[#0277bd] text-white shadow-sm transition-colors"
            >
              {isDesktopCollapsed ? (
                <ChevronRight className="w-4 h-4 font-bold" />
              ) : (
                <ChevronLeft className="w-4 h-4 font-bold" />
              )}
            </button>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            aria-label="Close Navigation Sidebar"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Services Menu */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-1.5">
          {navGroups.map((group, groupIdx) => (
            <div key={group.group || groupIdx} className="space-y-1">
              {/* Category Items */}
              {group.items.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || ShieldCheck;
                const active = isItemActive(item);
                const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
                const isExpanded = expandedGroups[item.id] !== undefined ? expandedGroups[item.id] : active;

                // Simple top items without subitems (like Dashboard)
                if (!hasSubItems && (item.id === "admin-dashboard" || item.id === "user-dashboard" || item.id === "partner-dashboard")) {
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "text-[#018EDE] font-bold bg-[#E7F6FF]"
                          : "text-[#0C3D4C] hover:bg-slate-50"
                      }`}
                      title={isDesktopCollapsed && !isMobileOpen ? item.label : undefined}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ml-1 ${active ? "bg-[#018EDE]" : "bg-slate-300"}`} />
                      {(!isDesktopCollapsed || isMobileOpen) && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                }

                return (
                  <div key={item.id} className="relative">
                    {hasSubItems ? (
                      <div>
                        {/* Expandable Accordion Menu Item */}
                        <div
                          onClick={() => toggleGroup(item.id)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group ${
                            active
                              ? "bg-[#018EDE] text-white shadow-sm font-semibold"
                              : "text-[#0C3D4C] hover:bg-slate-50 font-medium"
                          }`}
                          title={isDesktopCollapsed && !isMobileOpen ? item.label : undefined}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Circular Icon Wrapper (matching reference screenshot) */}
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                active
                                  ? "bg-white text-[#018EDE] shadow-xs"
                                  : "bg-[#E7F6FF] text-[#018EDE]"
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>

                            {(!isDesktopCollapsed || isMobileOpen) && (
                              <span className="text-[13.5px] truncate">
                                {item.label}
                              </span>
                            )}
                          </div>

                          {/* Right Chevron Arrow */}
                          {(!isDesktopCollapsed || isMobileOpen) && (
                            <ChevronLeft
                              className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                                isExpanded ? "-rotate-90" : ""
                              } ${active ? "text-white" : "text-[#018EDE]"}`}
                            />
                          )}
                        </div>

                        {/* Collapsible Sub-menu Items with Blue Guide Line */}
                        {isExpanded && (!isDesktopCollapsed || isMobileOpen) && (
                          <div className="ml-7 pl-4 border-l-2 border-[#018EDE] space-y-1.5 py-1.5">
                            {item.subItems.map((sub) => {
                              const isSubActive =
                                location.pathname === sub.path ||
                                (sub.path.includes("?") &&
                                  location.pathname + location.search === sub.path);
                              return (
                                <Link
                                  key={sub.id}
                                  to={sub.path}
                                  onClick={onCloseMobile}
                                  className={`flex items-center gap-2 py-1 text-xs transition-colors ${
                                    isSubActive
                                      ? "text-[#018EDE] font-bold"
                                      : "text-slate-600 hover:text-[#018EDE] font-medium"
                                  }`}
                                >
                                  <span
                                    className={`rounded-full shrink-0 ${
                                      isSubActive
                                        ? "w-2 h-2 bg-[#018EDE]"
                                        : "w-1.5 h-1.5 bg-slate-300"
                                    }`}
                                  />
                                  <span className="truncate">{sub.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Direct Leaf Link */
                      <Link
                        to={item.path}
                        onClick={onCloseMobile}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group ${
                          active
                            ? "bg-[#018EDE] text-white shadow-sm font-semibold"
                            : "text-[#0C3D4C] hover:bg-slate-50 font-medium"
                        }`}
                        title={isDesktopCollapsed && !isMobileOpen ? item.label : undefined}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              active
                                ? "bg-white text-[#018EDE] shadow-xs"
                                : "bg-[#E7F6FF] text-[#018EDE]"
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>

                          {(!isDesktopCollapsed || isMobileOpen) && (
                            <span className="text-[13.5px] truncate">
                              {item.label}
                            </span>
                          )}
                        </div>

                        {(!isDesktopCollapsed || isMobileOpen) && (
                          <ChevronLeft className={`w-4 h-4 flex-shrink-0 ${active ? "text-white" : "text-[#018EDE]"}`} />
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
        <div className="p-3 border-t border-gray-100 flex-shrink-0 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#018EDE] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                {initial}
              </div>

              {(!isDesktopCollapsed || isMobileOpen) && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0C3D4C] truncate">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">{role}</p>
                </div>
              )}
            </div>

            {(!isDesktopCollapsed || isMobileOpen) && (
              <button
                type="button"
                id="sidebar-signout-btn"
                onClick={handleLogout}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
