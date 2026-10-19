import React, { useState, useEffect, useCallback } from "react";
import { Server, Activity, RefreshCw } from "lucide-react";
import { Card, Badge, Button, Loader } from "../../../components/common";
import adminProviderService from "../services/adminProviderService";
import Swal from "sweetalert2";

export const ServiceProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProviders = useCallback(async () => {
    try {
      const data = await adminProviderService.getProviders();
      setProviders(data);
    } catch (err) {
      console.error("Failed to load providers from backend:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProviders();
  };

  const handleToggleStatus = (provider) => {
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

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader size="lg" text="Loading Live Service Providers from Backend..." />
      </div>
    );
  }

  const activeCount = providers.filter((p) => p.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0C3D4C] flex items-center">
            <Server className="w-6 h-6 mr-2 text-brand-blue" />
            Service Providers & Integrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live upstream service provider connectivity, latency, and routing rules from backend.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant={activeCount === providers.length ? "success" : "warning"} size="md">
            {activeCount} of {providers.length} Gateways Operational
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>
        </div>
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card
            key={provider.id || provider.providerKey}
            padding="md"
            className="border-[#E2EEF5] bg-white shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#E7F6FF] text-[#018EDE] flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                    {provider.environment || "PROD"}
                  </span>
                  <Badge
                    variant={provider.status === "ACTIVE" ? "success" : "warning"}
                    size="sm"
                  >
                    {provider.status}
                  </Badge>
                </div>
              </div>

              <h3 className="font-bold text-[#0C3D4C] text-base">
                {provider.name}
              </h3>
              <span className="text-xs font-semibold text-slate-500 block mb-3">
                {provider.category}
              </span>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2 bg-[#F8FAFC] p-3 rounded-xl border border-slate-200/80 text-xs mb-4">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Success Rate
                  </span>
                  <strong className="text-emerald-600 font-bold text-sm">
                    {provider.health}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    Avg Latency
                  </span>
                  <strong className="text-[#0C3D4C] font-bold text-sm">
                    {provider.latency}
                  </strong>
                </div>
              </div>

              {/* Supported Services Chips */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Handled Services ({provider.services?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {provider.services?.map((svc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#EBF6FD] text-[11px] font-medium text-[#018EDE] border border-sky-100"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Sync: {provider.lastCheck}
              </span>
              <Button
                variant={provider.status === "ACTIVE" ? "outline" : "primary"}
                size="sm"
                onClick={() => handleToggleStatus(provider)}
              >
                {provider.status === "ACTIVE" ? "Pause Gateway" : "Activate"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceProvidersPage;
