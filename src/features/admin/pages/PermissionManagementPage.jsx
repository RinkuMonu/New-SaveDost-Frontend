import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  KeyRound,
  ShieldCheck,
  UserCheck,
  Search,
  Plus,
  RotateCcw,
  Save,
  Layers,
  User,
  Sliders,
} from "lucide-react";
import {
  Card,
  Button,
  Badge,
  PageContainer,
  Loader,
  Modal,
} from "../../../components/common";
import adminPermissionService from "../services/adminPermissionService";
import adminUserService from "../services/adminUserService";
import Swal from "sweetalert2";

export const PermissionManagementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId: routeUserId } = useParams();

  // Determine active tab based on path
  const isRolePath = location.pathname.includes("/roles");
  const [activeTab, setActiveTab] = useState(isRolePath ? "roles" : "assign");

  // Keep tab in sync with URL
  useEffect(() => {
    if (location.pathname.includes("/roles")) {
      setActiveTab("roles");
    } else {
      setActiveTab("assign");
    }
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "roles") {
      navigate("/admin/permissions/roles");
    } else {
      navigate("/admin/permissions/assign");
    }
  };

  // -------------------------------------------------------------
  // SHARED STATE: Grouped Permissions Master Catalog
  // -------------------------------------------------------------
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [loadingMaster, setLoadingMaster] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

  // Load master catalog of grouped permissions
  const loadMasterPermissions = useCallback(async () => {
    try {
      setLoadingMaster(true);
      const data = await adminPermissionService.getGroupedPermissions();
      setGroupedPermissions(data || {});
    } catch (err) {
      console.error("Error loading master permissions:", err);
    } finally {
      setLoadingMaster(false);
    }
  }, []);

  useEffect(() => {
    loadMasterPermissions();
  }, [loadMasterPermissions]);

  // Flattened master permissions list for lookups
  const allMasterPermissions = useMemo(() => {
    const list = [];
    Object.values(groupedPermissions).forEach((group) => {
      if (group?.children && Array.isArray(group.children)) {
        group.children.forEach((c) => list.push(c));
      }
    });
    return list;
  }, [groupedPermissions]);

  // Filtered categories based on user search
  const filteredGroupedPermissions = useMemo(() => {
    if (!searchFilter.trim()) return groupedPermissions;
    const q = searchFilter.toLowerCase().trim();
    const result = {};

    Object.entries(groupedPermissions).forEach(([categoryName, group]) => {
      const parentMatches = categoryName.toLowerCase().includes(q);
      const matchingChildren = (group?.children || []).filter(
        (child) =>
          child.key?.toLowerCase().includes(q) ||
          child.description?.toLowerCase().includes(q)
      );

      if (parentMatches || matchingChildren.length > 0) {
        result[categoryName] = {
          ...group,
          children: parentMatches ? group.children || [] : matchingChildren,
        };
      }
    });

    return result;
  }, [groupedPermissions, searchFilter]);

  // -------------------------------------------------------------
  // TAB 1: ASSIGN PERMISSION (USER-WISE) STATE
  // -------------------------------------------------------------
  const [usersList, setUsersList] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // User permission sets
  const [userRolePermissions, setUserRolePermissions] = useState([]); // from user's base role
  const [userExtraPermissions, setUserExtraPermissions] = useState([]); // granted extra ObjectIds
  const [userRestrictedPermissions, setUserRestrictedPermissions] = useState([]); // revoked ObjectIds
  const [savingUserPerms, setSavingUserPerms] = useState(false);

  // Fetch users for selector
  const fetchUsers = useCallback(async (query = "") => {
    try {
      const res = await adminUserService.getUsers({
        search: query,
        limit: 15,
        status: "Active",
      });
      const data = res.data?.users || res.data || [];
      const list = Array.isArray(data) ? data : [];
      setUsersList(list);

      // Auto-select first user if none selected
      if (!selectedUser && list.length > 0 && !routeUserId) {
        handleSelectUser(list[0]);
      }
    } catch (err) {
      console.error("Failed to load users for permission assignment:", err);
    }
  }, [routeUserId, selectedUser]);

  useEffect(() => {
    fetchUsers(userSearchQuery);
  }, [fetchUsers, userSearchQuery]);

  // Handle selecting a user
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      const data = await adminPermissionService.getUserPermissions(user.id || user._id);
      const roleIds = (data.rolePermissions || []).map((p) => p._id || p);
      const extraIds = (data.extraPermissions || []).map((p) => p._id || p);
      const restrictedIds = (data.restrictedPermissions || []).map((p) => p._id || p);

      setUserRolePermissions(roleIds);
      setUserExtraPermissions(extraIds);
      setUserRestrictedPermissions(restrictedIds);
    } catch (err) {
      console.error("Failed to load single user permissions:", err);
    }
  };

  // If route has userId parameter, select that user
  useEffect(() => {
    if (routeUserId) {
      adminUserService
        .getUserById(routeUserId)
        .then((res) => {
          if (res?.data) handleSelectUser(res.data);
        })
        .catch((e) => console.warn("Could not load user from route:", e));
    }
  }, [routeUserId]);

  // Check state of a permission for the selected user
  const getUserPermissionStatus = useCallback(
    (permId) => {
      const isRestricted = userRestrictedPermissions.includes(permId);
      const isExtra = userExtraPermissions.includes(permId);
      const isInRole = userRolePermissions.includes(permId);

      if (isRestricted) return "RESTRICTED";
      if (isExtra) return "EXTRA";
      if (isInRole) return "ROLE_DEFAULT";
      return "DISABLED";
    },
    [userRolePermissions, userExtraPermissions, userRestrictedPermissions]
  );

  // Toggle user permission state:
  // - If it was DISABLED -> make it EXTRA (granted)
  // - If it was EXTRA -> make it DISABLED (removed)
  // - If it was ROLE_DEFAULT -> make it RESTRICTED (revoked)
  // - If it was RESTRICTED -> revert to ROLE_DEFAULT
  const toggleUserPermission = (permId) => {
    const current = getUserPermissionStatus(permId);

    if (current === "DISABLED") {
      // Grant as extra
      setUserExtraPermissions((prev) => [...prev, permId]);
    } else if (current === "EXTRA") {
      // Remove from extra
      setUserExtraPermissions((prev) => prev.filter((id) => id !== permId));
    } else if (current === "ROLE_DEFAULT") {
      // Restrict
      setUserRestrictedPermissions((prev) => [...prev, permId]);
    } else if (current === "RESTRICTED") {
      // Un-restrict
      setUserRestrictedPermissions((prev) => prev.filter((id) => id !== permId));
    }
  };

  // Category select-all for user
  const handleUserCategoryCheckAll = (children) => {
    const childIds = children.map((c) => c._id);
    // Add all non-role children to extra, and remove from restricted
    setUserRestrictedPermissions((prev) => prev.filter((id) => !childIds.includes(id)));
    setUserExtraPermissions((prev) => {
      const additions = childIds.filter((id) => !userRolePermissions.includes(id) && !prev.includes(id));
      return [...prev, ...additions];
    });
  };

  // Category clear-all for user
  const handleUserCategoryClearAll = (children) => {
    const childIds = children.map((c) => c._id);
    // Remove all from extra, and add all role-based ones to restricted
    setUserExtraPermissions((prev) => prev.filter((id) => !childIds.includes(id)));
    setUserRestrictedPermissions((prev) => {
      const restrictions = childIds.filter((id) => userRolePermissions.includes(id) && !prev.includes(id));
      return [...prev, ...restrictions];
    });
  };

  // Save User Permissions
  const handleSaveUserPermissions = async () => {
    if (!selectedUser) return;
    setSavingUserPerms(true);
    try {
      await adminPermissionService.updateUserPermissions(
        selectedUser.id || selectedUser._id,
        {
          extraPermissions: userExtraPermissions,
          restrictedPermissions: userRestrictedPermissions,
        }
      );

      Swal.fire({
        title: "Permissions Assigned",
        text: `Permissions for ${selectedUser.name || selectedUser.UserId || "User"} have been successfully updated.`,
        icon: "success",
        confirmButtonColor: "#018EDE",
      });
    } catch (err) {
      console.error("Save user permissions error:", err);
      Swal.fire({
        title: "Update Failed",
        text: err?.response?.data?.message || "Failed to update user permissions. Please try again.",
        icon: "error",
        confirmButtonColor: "#018EDE",
      });
    } finally {
      setSavingUserPerms(false);
    }
  };

  // Reset to role defaults
  const handleResetToRoleDefault = () => {
    setUserExtraPermissions([]);
    setUserRestrictedPermissions([]);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Reset to default role permissions",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // -------------------------------------------------------------
  // TAB 2: ROLE PERMISSION (ROLE-WISE) STATE
  // -------------------------------------------------------------
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]); // selected role's current permission IDs
  const [savingRole, setSavingRole] = useState(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [creatingRole, setCreatingRole] = useState(false);

  // Fetch all roles
  const fetchRoles = useCallback(async () => {
    try {
      const data = await adminPermissionService.getAllRoles();
      setRoles(data || []);
      if (!selectedRole && data && data.length > 0) {
        handleSelectRole(data[0]);
      }
    } catch (err) {
      console.error("Failed to load roles:", err);
    }
  }, [selectedRole]);

  useEffect(() => {
    if (activeTab === "roles") {
      fetchRoles();
    }
  }, [activeTab, fetchRoles]);

  // Select a role
  const handleSelectRole = async (role) => {
    setSelectedRole(role);
    try {
      const data = await adminPermissionService.getRolePermissions(role.role);
      const permIds = (data.permissions || []).map((p) => (typeof p === "object" ? p._id : p));
      setRolePermissions(permIds);
    } catch (err) {
      console.error("Failed to fetch role permissions:", err);
      const fallbackIds = (role.permissions || []).map((p) => (typeof p === "object" ? p._id : p));
      setRolePermissions(fallbackIds);
    }
  };

  // Toggle child permission for role
  const toggleRolePermission = (permId) => {
    setRolePermissions((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  // Toggle all children in category for role
  const toggleRoleCategory = (children) => {
    const childIds = children.map((c) => c._id);
    const allSelected = childIds.every((id) => rolePermissions.includes(id));

    if (allSelected) {
      // Deselect all
      setRolePermissions((prev) => prev.filter((id) => !childIds.includes(id)));
    } else {
      // Select all
      setRolePermissions((prev) => {
        const toAdd = childIds.filter((id) => !prev.includes(id));
        return [...prev, ...toAdd];
      });
    }
  };

  // Save role permissions
  const handleSaveRole = async () => {
    if (!selectedRole) return;
    setSavingRole(true);
    try {
      await adminPermissionService.updateRolePermissions(selectedRole.role, rolePermissions);
      Swal.fire({
        title: "Role Updated",
        text: `Permissions for role "${selectedRole.role}" have been successfully saved across the platform.`,
        icon: "success",
        confirmButtonColor: "#018EDE",
      });
      fetchRoles();
    } catch (err) {
      console.error("Failed to save role permissions:", err);
      Swal.fire({
        title: "Error",
        text: err?.response?.data?.message || "Failed to update role permissions.",
        icon: "error",
        confirmButtonColor: "#018EDE",
      });
    } finally {
      setSavingRole(false);
    }
  };

  // Create new role
  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    setCreatingRole(true);
    try {
      await adminPermissionService.createRole(newRoleName.trim().toUpperCase(), []);
      setIsCreateRoleModalOpen(false);
      setNewRoleName("");
      Swal.fire({
        title: "Role Created",
        text: `Role "${newRoleName.trim().toUpperCase()}" created successfully. You can now assign permissions to it.`,
        icon: "success",
        confirmButtonColor: "#018EDE",
      });
      fetchRoles();
    } catch (err) {
      Swal.fire({
        title: "Failed to Create Role",
        text: err?.response?.data?.message || "Role creation failed or already exists.",
        icon: "error",
        confirmButtonColor: "#018EDE",
      });
    } finally {
      setCreatingRole(false);
    }
  };

  // Count active effective permissions for selected user
  const effectiveUserPermCount = useMemo(() => {
    const active = new Set(userRolePermissions);
    userExtraPermissions.forEach((id) => active.add(id));
    userRestrictedPermissions.forEach((id) => active.delete(id));
    return active.size;
  }, [userRolePermissions, userExtraPermissions, userRestrictedPermissions]);

  return (
    <PageContainer>
      <div className="space-y-6 max-w-7xl pb-16">
        {/* ========================================================= */}
        {/* 1. PAGE HEADER & DUAL TAB NAVIGATION                     */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center space-x-2 text-brand-navy">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0C3D4C]">
                  Permission Management & Access Control
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Configure role-based access matrix, assign custom privileges, and override user service permissions.
                </p>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => handleTabChange("assign")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "assign"
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Assign Permission (User-wise)</span>
            </button>

            <button
              onClick={() => handleTabChange("roles")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "roles"
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Role Permission (Role-wise)</span>
            </button>
          </div>
        </div>

        {/* Global Permission Search & Quick Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E2EEF5] shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search permission or module (e.g. Recharge, BBPS, DMT, User)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span className="flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1 text-brand-blue" />
              Total Modules: <strong className="ml-1 text-slate-800">{Object.keys(groupedPermissions).length}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Total Platform Permissions: <strong className="text-slate-800">{allMasterPermissions.length || 86}</strong>
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: ASSIGN PERMISSION (USER-WISE)                     */}
        {/* ========================================================= */}
        {activeTab === "assign" && (
          <div className="space-y-6">
            {/* User Selection Banner */}
            <div className="bg-white rounded-2xl border border-[#E2EEF5] shadow-xs p-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* Search & Select User Dropdown */}
                <div className="lg:col-span-5 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Select Target User / API Partner
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or mobile..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  {/* Quick User Picker Suggestions */}
                  {usersList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto">
                      {usersList.slice(0, 8).map((u) => {
                        const isSelected = selectedUser?.id === u.id || selectedUser?._id === u._id;
                        return (
                          <button
                            key={u.id || u._id}
                            onClick={() => handleSelectUser(u)}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                              isSelected
                                ? "bg-brand-blue text-white border-brand-blue shadow-xs"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {u.name || u.UserId || "User"} ({u.role})
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Selected User Summary Details */}
                <div className="lg:col-span-7 bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
                  {selectedUser ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-[#0C3D4C]">
                            {selectedUser.name || "Administrative User"}
                          </h3>
                          <Badge
                            variant={
                              selectedUser.role === "ADMIN"
                                ? "info"
                                : selectedUser.role === "API_PARTNER"
                                ? "warning"
                                : "default"
                            }
                            size="sm"
                          >
                            {selectedUser.role || "USER"}
                          </Badge>
                          <Badge
                            variant={selectedUser.status === "Active" ? "success" : "default"}
                            size="sm"
                          >
                            {selectedUser.status || "Active"}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">
                          ID: {selectedUser.UserId || selectedUser.id || selectedUser._id} • Mobile: {selectedUser.mobile || selectedUser.mobileNumber || "—"} • {selectedUser.email || "No email"}
                        </p>
                      </div>

                      {/* Stat Badges */}
                      <div className="flex items-center gap-2">
                        <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-center shadow-xs">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Effective</span>
                          <span className="text-base font-extrabold text-brand-blue">{effectiveUserPermCount}</span>
                        </div>
                        <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-center shadow-xs">
                          <span className="text-[10px] uppercase font-bold text-amber-600 block">Extra Granted</span>
                          <span className="text-base font-extrabold text-amber-600">+{userExtraPermissions.length}</span>
                        </div>
                        <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-center shadow-xs">
                          <span className="text-[10px] uppercase font-bold text-rose-600 block">Restricted</span>
                          <span className="text-base font-extrabold text-rose-600">-{userRestrictedPermissions.length}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-slate-400 text-sm">
                      Select a user on the left to configure individual permission overrides.
                    </div>
                  )}

                  {/* User Level Quick Toggles */}
                  {selectedUser && (
                    <div className="flex items-center justify-between border-t border-slate-200 mt-3 pt-3">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
                          Role Default
                        </span>
                        <span className="flex items-center text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5 inline-block" />
                          Custom Extra
                        </span>
                        <span className="flex items-center text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5 inline-block" />
                          Explicitly Restricted
                        </span>
                      </div>

                      <button
                        onClick={handleResetToRoleDefault}
                        className="text-xs text-brand-blue hover:underline font-semibold flex items-center"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        Reset Overrides
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Categorized Permissions Grid for User */}
            {loadingMaster ? (
              <div className="py-20 flex justify-center">
                <Loader size="lg" text="Loading permission matrix..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.entries(filteredGroupedPermissions).map(([categoryName, group]) => {
                  const children = group?.children || [];
                  if (children.length === 0) return null;

                  return (
                    <Card
                      key={categoryName}
                      padding="md"
                      className="border-[#E2EEF5] shadow-xs hover:border-slate-300 transition-all bg-white"
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-[#0C3D4C] flex items-center">
                            <Sliders className="w-4 h-4 mr-2 text-brand-blue" />
                            {categoryName}
                          </h3>
                          <Badge variant="default" size="sm">
                            {children.length}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                          <button
                            onClick={() => handleUserCategoryCheckAll(children)}
                            className="text-brand-blue hover:text-brand-navy font-semibold hover:underline"
                          >
                            Grant All
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={() => handleUserCategoryClearAll(children)}
                            className="text-slate-400 hover:text-slate-600 font-semibold hover:underline"
                          >
                            Revoke All
                          </button>
                        </div>
                      </div>

                      {/* Items Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {children.map((perm) => {
                          const permId = perm._id;
                          const status = getUserPermissionStatus(permId);
                          const isActive = status === "ROLE_DEFAULT" || status === "EXTRA";

                          return (
                            <div
                              key={permId}
                              onClick={() => toggleUserPermission(permId)}
                              className={`p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all flex items-center justify-between ${
                                status === "EXTRA"
                                  ? "bg-amber-50/70 border-amber-300 text-amber-900"
                                  : status === "RESTRICTED"
                                  ? "bg-rose-50/70 border-rose-300 text-rose-900"
                                  : status === "ROLE_DEFAULT"
                                  ? "bg-emerald-50/40 border-emerald-300 text-emerald-950"
                                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100/80"
                              }`}
                            >
                              <div className="flex items-center space-x-2 min-w-0 pr-2">
                                <input
                                  type="checkbox"
                                  checked={isActive}
                                  onChange={() => {}} // handled by parent onClick
                                  className="w-4 h-4 rounded text-brand-blue accent-[#018EDE] pointer-events-none"
                                />
                                <span className="font-semibold truncate">{perm.key}</span>
                              </div>

                              <div>
                                {status === "ROLE_DEFAULT" && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                    Role
                                  </span>
                                )}
                                {status === "EXTRA" && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                                    Extra
                                  </span>
                                )}
                                {status === "RESTRICTED" && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-900">
                                    Revoked
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Sticky Bottom Save Action Bar */}
            {selectedUser && (
              <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-brand-blue/30 shadow-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Configuring permissions for:</p>
                    <p className="text-sm font-bold text-[#0C3D4C]">
                      {selectedUser.name || selectedUser.UserId} ({selectedUser.role}) • {effectiveUserPermCount} Active Permissions
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetToRoleDefault}
                  >
                    Reset Overrides
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={savingUserPerms}
                    onClick={handleSaveUserPermissions}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {savingUserPerms ? "Saving Permissions..." : "Save User Permissions"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: ROLE PERMISSION (ROLE-WISE MATRIX)                */}
        {/* ========================================================= */}
        {activeTab === "roles" && (
          <div className="space-y-6">
            {/* Roles Header Banner */}
            <div className="bg-white rounded-2xl border border-[#E2EEF5] shadow-xs p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Role Selector Tabs */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Select System Role
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {roles.map((roleObj) => {
                      const isSelected = selectedRole?.role === roleObj.role;
                      return (
                        <button
                          key={roleObj._id || roleObj.role}
                          onClick={() => handleSelectRole(roleObj)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                            isSelected
                              ? "bg-brand-blue text-white border-brand-blue shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{roleObj.role}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {roleObj.permissions?.length || (isSelected ? rolePermissions.length : 0)}
                          </span>
                        </button>
                      );
                    })}

                    {/* Create New Role Button */}
                    <button
                      onClick={() => setIsCreateRoleModalOpen(true)}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-blue border border-dashed border-brand-blue/50 hover:bg-brand-blue/5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Role</span>
                    </button>
                  </div>
                </div>

                {/* Bulk Actions for Selected Role */}
                {selectedRole && (
                  <div className="flex items-center space-x-2 pt-2 md:pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const allIds = allMasterPermissions.map((p) => p._id);
                        setRolePermissions(allIds);
                      }}
                    >
                      Select All ({allMasterPermissions.length || 86})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRolePermissions([])}
                    >
                      Deselect All
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={savingRole}
                      onClick={handleSaveRole}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {savingRole ? "Saving..." : "Save Role"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Categorized Permissions Grid for Role */}
            {loadingMaster ? (
              <div className="py-20 flex justify-center">
                <Loader size="lg" text="Loading role matrix..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.entries(filteredGroupedPermissions).map(([categoryName, group]) => {
                  const children = group?.children || [];
                  if (children.length === 0) return null;

                  const childIds = children.map((c) => c._id);
                  const selectedChildrenCount = childIds.filter((id) => rolePermissions.includes(id)).length;
                  const isAllSelected = selectedChildrenCount === childIds.length;
                  const isPartiallySelected = selectedChildrenCount > 0 && !isAllSelected;

                  return (
                    <Card
                      key={categoryName}
                      padding="md"
                      className="border-[#E2EEF5] shadow-xs hover:border-slate-300 transition-all bg-white"
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = isPartiallySelected;
                            }}
                            onChange={() => toggleRoleCategory(children)}
                            className="w-4 h-4 rounded text-brand-blue accent-[#018EDE] cursor-pointer"
                          />
                          <h3 className="text-sm font-bold text-[#0C3D4C]">
                            {categoryName}
                          </h3>
                          <Badge variant="default" size="sm">
                            {selectedChildrenCount}/{children.length}
                          </Badge>
                        </div>

                        <button
                          onClick={() => toggleRoleCategory(children)}
                          className="text-xs text-brand-blue hover:text-brand-navy font-semibold hover:underline"
                        >
                          {isAllSelected ? "Deselect All" : "Select All"}
                        </button>
                      </div>

                      {/* Items Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {children.map((perm) => {
                          const isChecked = rolePermissions.includes(perm._id);

                          return (
                            <label
                              key={perm._id}
                              className={`p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all flex items-center justify-between ${
                                isChecked
                                  ? "bg-blue-50/50 border-brand-blue/40 text-[#0C3D4C]"
                                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100/80"
                              }`}
                            >
                              <div className="flex items-center space-x-2 min-w-0 pr-2">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleRolePermission(perm._id)}
                                  className="w-4 h-4 rounded text-brand-blue accent-[#018EDE]"
                                />
                                <span className="font-semibold truncate">{perm.key}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Sticky Bottom Save Action Bar for Role */}
            {selectedRole && (
              <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-brand-blue/30 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Configuring Role Permissions:</p>
                  <p className="text-sm font-bold text-[#0C3D4C]">
                    {selectedRole.role} • {rolePermissions.length} of {allMasterPermissions.length || 86} Permissions Active
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="primary"
                    size="md"
                    disabled={savingRole}
                    onClick={handleSaveRole}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {savingRole ? "Saving Role..." : "Save Role Permissions"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: Create New Role */}
        <Modal
          isOpen={isCreateRoleModalOpen}
          onClose={() => setIsCreateRoleModalOpen(false)}
          title="Create New Administrative Role"
        >
          <form onSubmit={handleCreateRole} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Role Identifier (e.g. SUB_ADMIN, SALES_OFFICER, ACCOUNTANT)
              </label>
              <input
                type="text"
                placeholder="ROLE_NAME"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value.toUpperCase().replace(/\s+/g, "_"))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue font-mono uppercase"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Roles define baseline platform permissions for groups of users.
              </span>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsCreateRoleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={creatingRole || !newRoleName.trim()}
              >
                {creatingRole ? "Creating..." : "Create Role"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default PermissionManagementPage;
