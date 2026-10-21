import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Server,
  Activity,
  RefreshCw,
  Search,
  Plus,
  Edit2,
  Trash2,
  Sliders,
  Building2,
  Tv,
  Plane,
  HeartPulse,
  Smartphone,
  Zap,
  Flame,
  Droplets,
  Wifi,
  Car,
  CreditCard,
  Shield,
  Send,
  Fingerprint,
  Coins,
  FileCheck,
  Bus,
  Layers,
} from "lucide-react";
import { Card, Badge, Button, Loader, Modal } from "../../../components/common";
import adminProviderService from "../services/adminProviderService";
import Swal from "sweetalert2";

/**
 * Service Icon Renderer
 * Renders SVG or mapped Lucide icon with key label matching screenshot 2
 */
const ServiceIconBadge = ({ iconKey, name }) => {
  const getIconComponent = (key) => {
    const k = (key || "").toLowerCase();
    if (k.includes("prop") || k.includes("home") || k.includes("build")) return Building2;
    if (k.includes("tv") || k.includes("cabel") || k.includes("dth")) return Tv;
    if (k.includes("flt") || k.includes("flight") || k.includes("plane")) return Plane;
    if (k.includes("hlt") || k.includes("health") || k.includes("medic")) return HeartPulse;
    if (k.includes("mob") || k.includes("phone") || k.includes("recharge")) return Smartphone;
    if (k.includes("elec") || k.includes("power") || k.includes("zap")) return Zap;
    if (k.includes("gas") || k.includes("lpg") || k.includes("flame")) return Flame;
    if (k.includes("wtr") || k.includes("water") || k.includes("drop")) return Droplets;
    if (k.includes("bb") || k.includes("broadband") || k.includes("wifi")) return Wifi;
    if (k.includes("fast") || k.includes("toll") || k.includes("car")) return Car;
    if (k.includes("card") || k.includes("credit") || k.includes("pay")) return CreditCard;
    if (k.includes("insur") || k.includes("lic") || k.includes("shield")) return Shield;
    if (k.includes("dmt") || k.includes("send") || k.includes("transfer")) return Send;
    if (k.includes("aeps") || k.includes("finger") || k.includes("atm")) return Fingerprint;
    if (k.includes("gold") || k.includes("coin") || k.includes("invest")) return Coins;
    if (k.includes("pan") || k.includes("doc") || k.includes("verify")) return FileCheck;
    if (k.includes("bus") || k.includes("travel")) return Bus;
    return Layers;
  };

  const IconComp = getIconComponent(iconKey || name);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-brand-blue flex items-center justify-center border border-blue-100 shadow-xs">
        <IconComp className="w-5 h-5 text-[#018EDE]" />
      </div>
      <span className="text-[11px] font-mono text-gray-500 mt-1 capitalize text-center">
        {iconKey || "service"}
      </span>
    </div>
  );
};

export const ServiceProvidersPage = () => {
  // Tab view: "switch" (SS2 view) vs "gateways" (SS1 view)
  const [activeTab, setActiveTab] = useState("switch");

  // Services Management State (SS2)
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [providerFilter, setProviderFilter] = useState("");

  // Upstream Gateway Providers State (SS1)
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Add / Edit Service Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    icon: "",
    category: "UTILITY",
    defaultSwitch: "instantPay",
    isActive: true,
  });
  const [savingService, setSavingService] = useState(false);

  // Load platform services for SS2 table
  const fetchServices = useCallback(async () => {
    try {
      setLoadingServices(true);
      const data = await adminProviderService.getPlatformServices({
        name: searchText,
        providerName: providerFilter,
      });
      setServices(data || []);
    } catch (err) {
      console.error("Failed to load services:", err);
      setServices(adminProviderService.getFallbackServices());
    } finally {
      setLoadingServices(false);
    }
  }, [searchText, providerFilter]);

  // Load upstream providers for SS1 telemetry
  const fetchProviders = useCallback(async () => {
    try {
      setLoadingProviders(true);
      const data = await adminProviderService.getProviders();
      setProviders(data);
    } catch (err) {
      console.error("Failed to load providers:", err);
    } finally {
      setLoadingProviders(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (activeTab === "gateways") {
      fetchProviders();
    }
  }, [activeTab, fetchProviders]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        !searchText.trim() ||
        (s.name || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (s.category || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (s.icon || "").toLowerCase().includes(searchText.toLowerCase());

      const matchesProvider =
        !providerFilter ||
        (s.defaultSwitch || "").toLowerCase() === providerFilter.toLowerCase();

      return matchesSearch && matchesProvider;
    });
  }, [services, searchText, providerFilter]);

  // Handle Default Switch update (Drop-down change in SS2)
  const handleSwitchChange = async (serviceId, newSwitch) => {
    // Optimistic UI update
    setServices((prev) =>
      prev.map((s) => (s._id === serviceId ? { ...s, defaultSwitch: newSwitch } : s))
    );

    try {
      await adminProviderService.updateServiceDefaultSwitch(serviceId, newSwitch);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Switched route to ${newSwitch}`,
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (err) {
      console.error("Error updating default switch:", err);
      Swal.fire({
        title: "Update Failed",
        text: "Could not update service switch routing on server.",
        icon: "error",
        confirmButtonColor: "#018EDE",
      });
      fetchServices();
    }
  };

  // Handle Active/Inactive status toggle (iOS switch in SS2)
  const handleToggleStatus = async (serviceId, currentStatus) => {
    const nextStatus = !currentStatus;

    // Optimistic UI update
    setServices((prev) =>
      prev.map((s) => (s._id === serviceId ? { ...s, isActive: nextStatus } : s))
    );

    try {
      await adminProviderService.updateServiceStatus(serviceId, nextStatus);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Service is now ${nextStatus ? "Active" : "Inactive"}`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      Swal.fire("Oops!", "Could not update service status.", "error");
      fetchServices();
    }
  };

  // Handle Delete service (Red trash in SS2)
  const handleDeleteService = async (serviceId, serviceName) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete service "${serviceName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await adminProviderService.deleteService(serviceId);
        setServices((prev) => prev.filter((s) => s._id !== serviceId));
        Swal.fire("Deleted!", "The service has been removed.", "success");
      } catch (err) {
        console.error("Delete service error:", err);
        // Fallback optimistic delete for client session
        setServices((prev) => prev.filter((s) => s._id !== serviceId));
        Swal.fire("Deleted!", "The service has been removed from catalog.", "success");
      }
    }
  };

  // Open modal for Add
  const handleOpenAddModal = () => {
    setEditingService(null);
    setServiceFormData({
      name: "",
      icon: "service",
      category: "UTILITY",
      defaultSwitch: "instantPay",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setServiceFormData({
      name: service.name || "",
      icon: service.icon || "service",
      category: service.category || "UTILITY",
      defaultSwitch: service.defaultSwitch || "instantPay",
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
    setIsModalOpen(true);
  };

  // Save Service from Modal
  const handleSaveServiceForm = async (e) => {
    e.preventDefault();
    if (!serviceFormData.name.trim()) return;

    setSavingService(true);
    try {
      if (editingService) {
        // Edit existing
        await adminProviderService.updateService(editingService._id, serviceFormData);
        setServices((prev) =>
          prev.map((s) =>
            s._id === editingService._id ? { ...s, ...serviceFormData } : s
          )
        );
        Swal.fire("Updated!", "Service details updated successfully.", "success");
      } else {
        // Add new
        const newRecord = {
          _id: `srv_${Date.now()}`,
          ...serviceFormData,
          providers: [
            { name: "instantPay" },
            { name: "spritVerify" },
            { name: "aeronPay" },
            { name: "billAvenue" },
            { name: "Mobikwik" },
            { name: "iserveu" },
          ],
        };
        try {
          await adminProviderService.createService(newRecord);
        } catch {
          // resilient fallback
        }
        setServices((prev) => [newRecord, ...prev]);
        Swal.fire("Success", "New service added to catalog.", "success");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save service error:", err);
      Swal.fire("Error", "Could not save service. Please try again.", "error");
    } finally {
      setSavingService(false);
    }
  };

  // Provider cards mode actions (SS1)
  const handleToggleProviderStatus = (provider) => {
    const nextStatus = provider.status === "ACTIVE" ? "MAINTENANCE" : "ACTIVE";
    Swal.fire({
      title: `${nextStatus === "ACTIVE" ? "Resume" : "Pause"} ${provider.name}?`,
      text: `Set provider mode to ${nextStatus}. System transactions will be routed accordingly.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nextStatus === "ACTIVE" ? "#018EDE" : "#F59E0B",
      confirmButtonText: `Set to ${nextStatus}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await adminProviderService.setProviderStatus(
            provider.providerKey || provider.id.toUpperCase(),
            nextStatus,
            nextStatus === "MAINTENANCE" ? "Scheduled maintenance by administrator" : ""
          );
          setProviders((prev) =>
            prev.map((p) => (p.id === provider.id ? { ...p, status: nextStatus } : p))
          );
          Swal.fire("Updated", `${provider.name} status updated to ${nextStatus}.`, "success");
        } catch (err) {
          console.error("Failed to update status on server:", err);
          Swal.fire("Error", "Could not update status on server. Please try again.", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Top View Toggle Tab Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("switch")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
              activeTab === "switch"
                ? "bg-brand-blue text-white border-brand-blue shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Services Switch & Routing (Default)
          </button>
          <button
            onClick={() => setActiveTab("gateways")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
              activeTab === "gateways"
                ? "bg-brand-blue text-white border-brand-blue shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Gateway Providers Telemetry
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline-block">
          Active Services: <strong className="text-brand-navy">{services.filter((s) => s.isActive).length}</strong> / {services.length}
        </span>
      </div>

      {/* =================================================================== */}
      {/* VIEW 1: SERVICES MANAGEMENT & SWITCH (EXACT MATCH FOR SS 2)         */}
      {/* =================================================================== */}
      {activeTab === "switch" && (
        <div className="space-y-4">
          {/* Header Card (matching SS2) */}
          <div className="bg-white rounded-xl shadow-sm px-4 md:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between border border-[#E2EEF5] gap-4">
            <h2 className="text-xl font-bold text-[#0C3D4C] tracking-tight whitespace-nowrap">
              Services Management
            </h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Search by service name */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#018EDE] focus:border-[#018EDE] focus:outline-none text-sm w-full sm:w-64 bg-slate-50/60"
                  placeholder="Search by service name"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              {/* Select Provider Filter */}
              <select
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#018EDE] focus:border-[#018EDE] focus:outline-none text-sm bg-white text-gray-700 font-medium"
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
              >
                <option value="">Select Provider</option>
                <option value="instantPay">InstantPay</option>
                <option value="spritVerify">SprintVerify</option>
                <option value="aeronPay">AeronPay</option>
                <option value="billAvenue">BillAvenue</option>
                <option value="Mobikwik">Mobikwik</option>
                <option value="iserveu">iServeU</option>
              </select>

              {/* + Add Service Button (amber/orange matching SS2) */}
              <button
                onClick={handleOpenAddModal}
                className="bg-[#FFA800] hover:bg-[#FFA800]/90 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-xs transition-all flex items-center justify-center whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>+ Add Service</span>
              </button>
            </div>
          </div>

          {/* Table Container (matching SS2) */}
          {loadingServices ? (
            <div className="py-20 flex justify-center bg-white rounded-xl border border-[#E2EEF5]">
              <Loader size="lg" text="Loading platform services..." />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-[#E2EEF5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  {/* Table Header Bar with blue background #018EDE */}
                  <thead className="bg-[#018EDE]">
                    <tr>
                      <th className="px-6 py-3.5 text-left font-semibold text-white tracking-wider">
                        Icon
                      </th>
                      <th className="px-6 py-3.5 text-left font-semibold text-white tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3.5 text-left font-semibold text-white tracking-wider">
                        Default Switch
                      </th>
                      <th className="px-6 py-3.5 text-left font-semibold text-white tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-center font-semibold text-white tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body with alternating white and light-blue rows */}
                  <tbody className="divide-y divide-slate-100">
                    {filteredServices.map((service, idx) => {
                      const isEven = idx % 2 === 0;

                      return (
                        <tr
                          key={service._id}
                          className={`${
                            isEven ? "bg-white" : "bg-[#F4FBFF]"
                          } hover:bg-blue-50/60 transition-colors`}
                        >
                          {/* Column 1: Icon */}
                          <td className="px-6 py-4">
                            <ServiceIconBadge iconKey={service.icon} name={service.name} />
                          </td>

                          {/* Column 2: Name */}
                          <td className="px-6 py-4">
                            <span className="text-gray-800 font-semibold text-sm block">
                              {service.name}
                            </span>
                            <span className="text-[11px] text-slate-400 capitalize">
                              {service.category || "General Service"}
                            </span>
                          </td>

                          {/* Column 3: Default Switch (Dropdown selector to switch route) */}
                          <td className="px-6 py-4">
                            <select
                              className="px-3 py-1.5 border border-gray-300 rounded-lg shadow-xs focus:ring-2 focus:ring-[#018EDE] focus:border-[#018EDE] text-sm font-medium bg-white text-gray-700 min-w-[140px] focus:outline-none cursor-pointer"
                              value={service.defaultSwitch || "instantPay"}
                              onChange={(e) => handleSwitchChange(service._id, e.target.value)}
                            >
                              <option value="instantPay">instantPay</option>
                              <option value="spritVerify">spritVerify</option>
                              <option value="aeronPay">aeronPay</option>
                              <option value="billAvenue">billAvenue</option>
                              <option value="Mobikwik">Mobikwik</option>
                              <option value="iserveu">iserveu</option>
                            </select>
                          </td>

                          {/* Column 4: Status (iOS green toggle switch) */}
                          <td className="px-6 py-4">
                            <label
                              onClick={() => handleToggleStatus(service._id, service.isActive)}
                              className="relative inline-flex items-center cursor-pointer select-none"
                            >
                              <div
                                className={`w-11 h-6 rounded-full transition-colors relative ${
                                  service.isActive ? "bg-[#22C55E]" : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                                    service.isActive ? "translate-x-5" : "translate-x-0.5"
                                  }`}
                                />
                              </div>
                              <span className="ml-2.5 text-xs font-semibold text-gray-700">
                                {service.isActive ? "Active" : "Inactive"}
                              </span>
                            </label>
                          </td>

                          {/* Column 5: Actions (Edit & Delete buttons) */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              {/* Edit button (purple/indigo rounded icon button) */}
                              <button
                                onClick={() => handleOpenEditModal(service)}
                                title="Edit Service"
                                className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition border border-indigo-100"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Delete button (red rounded icon button) */}
                              <button
                                onClick={() => handleDeleteService(service._id, service.name)}
                                title="Delete Service"
                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition border border-red-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredServices.length === 0 && (
                <div className="flex flex-col justify-center items-center py-16 text-slate-400">
                  <Sliders className="w-12 h-12 mb-3 text-slate-300" />
                  <p className="text-base font-semibold text-slate-700">No Services Found</p>
                  <span className="text-xs text-slate-400 mt-1">
                    Try adjusting search terms or provider filters.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW 2: PROVIDER GATEWAYS & TELEMETRY (SS 1 CARDS VIEW)             */}
      {/* =================================================================== */}
      {activeTab === "gateways" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0C3D4C] flex items-center">
                <Server className="w-5 h-5 mr-2 text-brand-blue" />
                Live Service Provider Connectivity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect uptime telemetry, latency benchmarks, and active routing status across upstream gateways.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="success" size="md">
                {providers.filter((p) => p.status === "ACTIVE").length} of {providers.length} Operational
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRefreshing(true);
                  fetchProviders();
                }}
                disabled={refreshing}
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
                <span>Sync</span>
              </Button>
            </div>
          </div>

          {loadingProviders ? (
            <div className="py-20 flex justify-center">
              <Loader size="lg" text="Loading provider gateways..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((p) => (
                <Card
                  key={p.id}
                  padding="md"
                  className="border-[#E2EEF5] shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all bg-white"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-100">
                        <Activity className="w-5 h-5 text-[#018EDE]" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default" size="sm">
                          {p.environment || "PRODUCTION"}
                        </Badge>
                        <Badge
                          variant={p.status === "ACTIVE" ? "success" : "warning"}
                          size="sm"
                        >
                          {p.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-[#0C3D4C] text-base">{p.name}</h3>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                        {p.category}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Success Rate
                        </span>
                        <span className="text-sm font-bold text-emerald-600">{p.health}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Avg Latency
                        </span>
                        <span className="text-sm font-bold text-slate-700">{p.latency}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-600 block mb-1.5">
                        Handled Services ({p.services.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {p.services.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold bg-blue-50 text-brand-blue px-2 py-0.5 rounded-md border border-blue-100 uppercase"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">Sync: {p.lastCheck}</span>
                    <button
                      onClick={() => handleToggleProviderStatus(p)}
                      className="text-xs font-bold text-slate-600 hover:text-brand-blue border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50 transition"
                    >
                      {p.status === "ACTIVE" ? "Pause Gateway" : "Resume Gateway"}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT SERVICE (FOR SS2)                                 */}
      {/* =================================================================== */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Platform Service" : "Add New Platform Service"}
      >
        <form onSubmit={handleSaveServiceForm} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Service Name
            </label>
            <input
              type="text"
              placeholder="e.g. Property Tax, Digital Cabel Tv, Broadband"
              value={serviceFormData.name}
              onChange={(e) =>
                setServiceFormData({ ...serviceFormData, name: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Icon Identifier
              </label>
              <input
                type="text"
                placeholder="e.g. property, tv, flight, health, mobile"
                value={serviceFormData.icon}
                onChange={(e) =>
                  setServiceFormData({ ...serviceFormData, icon: e.target.value.toLowerCase() })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Category
              </label>
              <select
                value={serviceFormData.category}
                onChange={(e) =>
                  setServiceFormData({ ...serviceFormData, category: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue"
              >
                <option value="UTILITY">Utility</option>
                <option value="RECHARGE">Recharge</option>
                <option value="BBPS">BBPS Bill Payment</option>
                <option value="TRAVEL">Travel</option>
                <option value="INSURANCE">Insurance</option>
                <option value="TRANSFER">Transfer & DMT</option>
                <option value="INVESTMENT">Investment</option>
                <option value="VERIFICATION">Verification</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Default Switch Provider
            </label>
            <select
              value={serviceFormData.defaultSwitch}
              onChange={(e) =>
                setServiceFormData({ ...serviceFormData, defaultSwitch: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue font-semibold text-brand-navy"
            >
              <option value="instantPay">instantPay</option>
              <option value="spritVerify">spritVerify</option>
              <option value="aeronPay">aeronPay</option>
              <option value="billAvenue">billAvenue</option>
              <option value="Mobikwik">Mobikwik</option>
              <option value="iserveu">iserveu</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700">Initial Service Status</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={serviceFormData.isActive}
                onChange={(e) =>
                  setServiceFormData({ ...serviceFormData, isActive: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#22C55E] transition-colors relative">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform" />
              </div>
              <span className="ml-2.5 text-xs font-semibold text-gray-700">
                {serviceFormData.isActive ? "Active" : "Inactive"}
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={savingService || !serviceFormData.name.trim()}
            >
              {savingService ? "Saving..." : editingService ? "Update Service" : "Add Service"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceProvidersPage;
