import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  Edit2,
  Power,
  KeyRound,
  ShieldCheck,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  Card,
  Table,
  Badge,
  Button,
  Input,
  PageContainer,
} from "../../../components/common";
import adminUserService from "../services/adminUserService";
import {
  UserDetailsModal,
  EditUserModal,
  StatusChangeModal,
  ResetPasswordModal,
} from "../components";
import { ROLES } from "../../../utils/constants";
import { getErrorMessage } from "../../../utils/apiError";

/**
 * Admin User Management Page
 * Allows administrators to search, filter, view details, edit profiles,
 * toggle account status and reset passwords for platform users.
 */
export const UserListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Filters state (synced with query params if provided)
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState(() => searchParams.get("role") || "ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedKyc, setSelectedKyc] = useState(() => searchParams.get("kyc") || "ALL");

  useEffect(() => {
    const roleParam = searchParams.get("role") || "ALL";
    setSelectedRole(roleParam);
    const kycParam = searchParams.get("kyc") || "ALL";
    setSelectedKyc(kycParam);
    const statusParam = searchParams.get("status") || "ALL";
    setSelectedStatus(statusParam);
    setCurrentPage(1);
  }, [searchParams]);

  // Modals state
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  // Debounce search query input by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Auto-dismiss toast notification after 4s
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  const showNotification = (msg) => {
    setSuccessToast(msg);
  };

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit,
        search: debouncedSearch,
        role: selectedRole,
        status: selectedStatus,
        isKYC: selectedKyc,
      };

      const res = await adminUserService.getUsers(params);

      // Res shape: { statusCode: 200, data: { users: [...], totalUsers, totalPages, currentPage } }
      const payload = res.data || {};
      const userList = Array.isArray(payload) ? payload : (payload.users || []);
      setUsers(userList);
      setTotalUsers(
        payload.totalUsers !== undefined
          ? payload.totalUsers
          : payload.pagination?.total !== undefined
          ? payload.pagination.total
          : userList.length
      );
      setTotalPages(payload.totalPages || payload.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(getErrorMessage(err, "Could not fetch user directory."));
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, debouncedSearch, selectedRole, selectedStatus, selectedKyc]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedRole("ALL");
    setSelectedStatus("ALL");
    setSelectedKyc("ALL");
    setCurrentPage(1);
  };

  // Modal actions handlers
  const handleOpenDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleOpenStatus = (user) => {
    setSelectedUser(user);
    setIsStatusOpen(true);
  };

  const handleOpenResetPassword = (user) => {
    setSelectedUser(user);
    setIsResetPasswordOpen(true);
  };

  // Callback on successful status toggle
  const handleStatusUpdated = (newStatus) => {
    showNotification(`User account status updated to ${newStatus} successfully.`);
    fetchUsers();
  };

  // Callback on successful profile edit
  const handleUserUpdated = () => {
    showNotification("User profile updated successfully.");
    fetchUsers();
  };

  // Callback on successful password reset
  const handlePasswordReset = () => {
    showNotification("User password reset successfully.");
  };

  // Table columns definition
  const columns = useMemo(() => [
    {
      key: "user",
      title: "User Profile",
      render: (_, row) => {
        const name = row.name || "Customer User";
        const email = row.email || "No email registered";
        const initials = (name.charAt(0) || "U").toUpperCase();
        return (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-brand-blue/10 text-brand-blue font-bold flex items-center justify-center text-xs shrink-0 border border-brand-blue/20">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-brand-navy truncate">{name}</p>
              <p className="text-xs text-brand-muted truncate">{email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "mobile",
      title: "Mobile Number",
      render: (val, row) => (
        <span className="font-mono text-xs font-semibold text-brand-navy">
          {val || row.mobileNumber || "—"}
        </span>
      ),
    },
    {
      key: "role",
      title: "Role",
      align: "center",
      render: (role) => {
        let variant = "primary";
        if (role === ROLES.ADMIN) variant = "navy";
        else if (role === ROLES.API_PARTNER) variant = "warning";
        return (
          <Badge variant={variant} size="sm">
            {role || "USER"}
          </Badge>
        );
      },
    },
    {
      key: "status",
      title: "Account Status",
      align: "center",
      render: (_, row) => {
        const isActive =
          row.isActive === true ||
          row.status === "Active" ||
          row.status === "ACTIVE";
        return (
          <Badge
            variant={isActive ? "success" : "error"}
            size="sm"
            dot
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      key: "kyc",
      title: "KYC Standing",
      align: "center",
      render: (_, row) => {
        const isVerified = row.isKycVerified || row.isKYC === "Approved";
        const isPending = row.isKYC === "Pending" || (!isVerified && !row.isKYC);
        return (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              isVerified
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : isPending
                ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            {isVerified ? "Verified" : isPending ? "Pending" : "Unverified"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      title: "Joined On",
      render: (val) => (
        <span className="text-xs text-brand-muted">
          {val
            ? new Date(val).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      align: "right",
      render: (_, row) => (
        <div className="flex items-center justify-end space-x-1.5">
          <button
            type="button"
            title="Inspect Details"
            onClick={() => handleOpenDetails(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-blue hover:bg-brand-blue/10 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Edit Profile"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-navy hover:bg-brand-navy/10 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Toggle Status"
            onClick={() => handleOpenStatus(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Reset Password"
            onClick={() => handleOpenResetPassword(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Assign Permissions"
            onClick={() => navigate(`/admin/permissions/user/${row.id || row._id}`)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], [navigate]);

  const isLeads = location.pathname.includes("/admin/leads");
  const isActionRequests = location.pathname.includes("action-requests");
  const isAdminRole = selectedRole === "ADMIN";
  const isKycFilter = selectedKyc !== "ALL";

  const pageTitle = isLeads
    ? "Lead Management"
    : isActionRequests
    ? "Action Requests"
    : isAdminRole
    ? "Active Administrators"
    : isKycFilter
    ? `KYC Requests (${selectedKyc})`
    : "Active Users";

  const pageSubtitle = isLeads
    ? "Track and manage customer onboarding inquiries, leads, and sales requests"
    : isActionRequests
    ? "Review and process user account modification and status escalation requests"
    : isAdminRole
    ? "Management of platform administrators, team permissions, and security roles"
    : "Comprehensive administration of active users, customer profiles, and account standing";

  return (
    <PageContainer
      title={pageTitle}
      subtitle={pageSubtitle}
      actions={
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <button
            type="button"
            onClick={() => showNotification("Exporting data as Excel spreadsheet...")}
            className="px-3 py-1.5 rounded-lg border border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            📊 Excel
          </button>
          <button
            type="button"
            onClick={() => showNotification("Exporting data as PDF document...")}
            className="px-3 py-1.5 rounded-lg border border-rose-500 text-rose-600 bg-white hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            📄 PDF
          </button>
          <button
            type="button"
            onClick={() => showNotification("Exporting data as JSON payload...")}
            className="px-3 py-1.5 rounded-lg border border-purple-500 text-purple-600 bg-white hover:bg-purple-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            ⚡ JSON
          </button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
            onClick={fetchUsers}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Success Toast */}
        {successToast && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm shadow-sm transition-all animate-fadeIn">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{successToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessToast(null)}
              className="text-emerald-600 hover:text-emerald-800 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              Retry
            </Button>
          </div>
        )}

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 bg-white border border-brand-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Total Users</p>
                <p className="text-2xl font-bold text-brand-navy mt-1">{totalUsers}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-brand-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Active Accounts</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {users.filter((u) => u.isActive === true || u.status === "Active").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-brand-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">KYC Verified</p>
                <p className="text-2xl font-bold text-brand-blue mt-1">
                  {users.filter((u) => u.isKycVerified || u.isKYC === "Approved").length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-brand-blue flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-brand-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Page Limit</p>
                <p className="text-2xl font-bold text-slate-700 mt-1">{limit}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <Card className="p-4 border border-brand-border bg-white space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Input
                placeholder="Search by name, email, or mobile number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                rightIcon={
                  searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null
                }
              />
            </div>

            {/* Role Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-[42px] px-3 rounded-xl border border-brand-border text-sm text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 font-medium"
              >
                <option value="ALL">All Roles</option>
                <option value={ROLES.USER}>Customer (USER)</option>
                <option value={ROLES.API_PARTNER}>API Partner</option>
                <option value={ROLES.ADMIN}>Administrator</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-[42px] px-3 rounded-xl border border-brand-border text-sm text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            {/* KYC Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedKyc}
                onChange={(e) => {
                  setSelectedKyc(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-[42px] px-3 rounded-xl border border-brand-border text-sm text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 font-medium"
              >
                <option value="ALL">All KYC</option>
                <option value="Approved">Verified / Approved</option>
                <option value="Pending">Pending Review</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Reset Filters Button */}
            <div className="md:col-span-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="w-full h-[42px]"
                title="Reset all search filters"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Table */}
        <Table
          columns={columns}
          data={users}
          isLoading={isLoading}
          emptyMessage={
            debouncedSearch || selectedRole !== "ALL" || selectedStatus !== "ALL"
              ? "No platform users matched your filter criteria."
              : "No users registered in the system yet."
          }
        />

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div className="text-xs text-brand-muted">
            Showing{" "}
            <span className="font-semibold text-brand-navy">
              {totalUsers === 0 ? 0 : (currentPage - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-brand-navy">
              {Math.min(currentPage * limit, totalUsers)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-brand-navy">{totalUsers}</span> users
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-brand-muted">
              <span>Per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg border border-brand-border bg-white text-brand-navy font-semibold text-xs focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <span className="px-3 text-xs font-semibold text-brand-navy">
                Page {currentPage} of {Math.max(1, totalPages)}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      <UserDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        user={selectedUser}
        onEdit={handleOpenEdit}
        onChangeStatus={handleOpenStatus}
        onResetPassword={handleOpenResetPassword}
      />

      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={selectedUser}
        onSuccess={handleUserUpdated}
      />

      <StatusChangeModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        user={selectedUser}
        onSuccess={handleStatusUpdated}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        user={selectedUser}
        onSuccess={handlePasswordReset}
      />
    </PageContainer>
  );
};

export default UserListPage;
