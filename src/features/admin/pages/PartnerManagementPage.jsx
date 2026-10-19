import React, { useEffect, useState, useCallback } from "react";
import {
  Server,
  Search,
  Filter,
  Key,
  Shield,
  Plus,
  Copy,
  Check,
  RefreshCw,
  Eye,
} from "lucide-react";
import { adminPartnerService } from "../services/adminPartnerService";
import { Card, Badge, Button, Input, Modal, Loader } from "../../../components/common";
import Swal from "sweetalert2";

export const PartnerManagementPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isIpModalOpen, setIsIpModalOpen] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminPartnerService.getPartners({
        search,
        status: statusFilter,
      });
      setPartners(res.partners || []);
    } catch (err) {
      console.error("Failed to load partners:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPartners();
  };

  const handleApprove = async (partner) => {
    const result = await Swal.fire({
      title: "Approve API Partner?",
      text: `Grant B2B integration access to ${partner.businessName}? Developer API keys will be activated.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#018EDE",
      confirmButtonText: "Yes, Approve Partner",
    });

    if (result.isConfirmed) {
      try {
        setActionLoading(true);
        await adminPartnerService.approvePartner(partner._id);
        Swal.fire("Approved!", `${partner.businessName} has been activated.`, "success");
        fetchPartners();
        if (selectedPartner?._id === partner._id) setIsDetailsOpen(false);
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to approve partner", "error");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async (partner) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Partner Application",
      input: "text",
      inputLabel: "Rejection Reason",
      inputPlaceholder: "Enter compliance or documentation reason...",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Reject Application",
      inputValidator: (value) => {
        if (!value) return "A rejection reason is required";
      },
    });

    if (reason) {
      try {
        setActionLoading(true);
        await adminPartnerService.rejectPartner(partner._id, reason);
        Swal.fire("Rejected", "Partner application has been rejected.", "info");
        fetchPartners();
        if (selectedPartner?._id === partner._id) setIsDetailsOpen(false);
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to reject partner", "error");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleRegenerateKeys = async (partner) => {
    const result = await Swal.fire({
      title: "Regenerate API Credentials?",
      text: "Old API credentials will immediately cease working. Ensure the partner updates their server environment.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F59E0B",
      confirmButtonText: "Yes, Invalidate & Regenerate",
    });

    if (result.isConfirmed) {
      try {
        setActionLoading(true);
        await adminPartnerService.regenerateApiKeys(partner._id);
        Swal.fire("Regenerated", "New credentials generated successfully.", "success");
        fetchPartners();
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to regenerate keys", "error");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleAddIp = async () => {
    if (!newIpAddress.trim()) return;
    try {
      await adminPartnerService.addIp(selectedPartner._id, newIpAddress.trim());
      setNewIpAddress("");
      setIsIpModalOpen(false);
      Swal.fire("IP Added", "Allowed server IP address registered.", "success");
      fetchPartners();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to add IP", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0C3D4C] flex items-center">
            <Server className="w-6 h-6 mr-2 text-brand-blue" />
            API Partner Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage B2B integration partners, approve developer accounts, and configure API access.
          </p>
        </div>

        <Badge variant="blue" size="md">
          {partners.length} Registered Partners
        </Badge>
      </div>

      {/* Search and Filters Bar */}
      <Card padding="sm" className="border-[#E2EEF5] shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search business name, contact, email, or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue text-slate-800"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400 ml-1 hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue font-medium text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending Review</option>
              <option value="REJECTED">Rejected</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <Button type="submit" variant="primary" size="sm">
              Search
            </Button>
          </div>
        </form>
      </Card>

      {/* Partners Table */}
      <Card padding="none" className="border-[#E2EEF5] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader size="md" text="Loading API Partners..." />
          </div>
        ) : partners.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Server className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-sm">No API Partners found matching criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Business & Contact</th>
                  <th className="py-3 px-4">Credentials & Security</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.map((partner) => (
                  <tr key={partner._id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {partner.businessName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {partner.contactPerson} · {partner.email} · {partner.mobile}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {partner.apiKey
                            ? `${partner.apiKey.substring(0, 10)}••••`
                            : "No key issued"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({partner.allowedIps?.length || 0} IPs)
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          partner.status === "ACTIVE"
                            ? "success"
                            : partner.status === "PENDING"
                            ? "warning"
                            : "error"
                        }
                        size="sm"
                      >
                        {partner.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(partner.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPartner(partner);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Details
                      </Button>

                      {partner.status === "PENDING" && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(partner)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(partner)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Partner Details & Credentials Modal */}
      {selectedPartner && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title={`Partner Profile: ${selectedPartner.businessName}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Business Name</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {selectedPartner.businessName}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Contact Person</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {selectedPartner.contactPerson}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Email</span>
                <p className="text-slate-700 mt-0.5">{selectedPartner.email}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Mobile</span>
                <p className="text-slate-700 mt-0.5">{selectedPartner.mobile}</p>
              </div>
            </div>

            {/* API Credentials Box */}
            <div className="border border-[#E2EEF5] rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-500 flex items-center">
                  <Key className="w-3.5 h-3.5 mr-1 text-amber-500" /> API Access Key
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRegenerateKeys(selectedPartner)}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
              </div>

              <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl font-mono text-xs">
                <span className="text-slate-700 truncate">
                  {selectedPartner.apiKey || "No active key"}
                </span>
                {selectedPartner.apiKey && (
                  <button
                    type="button"
                    onClick={() => handleCopyKey(selectedPartner.apiKey)}
                    className="ml-2 p-1.5 hover:bg-slate-200 rounded text-slate-500"
                    title="Copy Key"
                  >
                    {copiedKey ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* IP Whitelist Management */}
            <div className="border border-[#E2EEF5] rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-500 flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Allowed Server IPs
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsIpModalOpen(true)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add IP
                </Button>
              </div>

              {selectedPartner.allowedIps?.length ? (
                <div className="flex flex-wrap gap-2">
                  {selectedPartner.allowedIps.map((ip, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center space-x-1.5 bg-slate-100 text-slate-700 font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      <span>{ip}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No IP restrictions configured</p>
              )}
            </div>

            {/* Action Footer */}
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              {selectedPartner.status === "PENDING" && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => handleApprove(selectedPartner)}
                    disabled={actionLoading}
                  >
                    Approve Partner
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleReject(selectedPartner)}
                    disabled={actionLoading}
                  >
                    Reject
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add IP Modal */}
      <Modal
        isOpen={isIpModalOpen}
        onClose={() => setIsIpModalOpen(false)}
        title="Add Server IP to Whitelist"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <Input
            label="Server IPv4 / IPv6 Address"
            placeholder="e.g. 103.21.244.15"
            value={newIpAddress}
            onChange={(e) => setNewIpAddress(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsIpModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddIp}>
              Save IP
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PartnerManagementPage;
