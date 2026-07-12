import React, { useState, useMemo, useEffect } from "react";
import {
  Truck, CheckCircle, Wrench, Route, Clock, Users, Gauge,
  ArrowUp, ArrowDown, Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const baseData = {
  All: { activeVehicles: 24, availableVehicles: 15, inMaintenance: 3, activeTrips: 8, pendingTrips: 5, driversOnDuty: 12, utilization: 67 },
  Van: { activeVehicles: 10, availableVehicles: 6, inMaintenance: 1, activeTrips: 3, pendingTrips: 2, driversOnDuty: 5, utilization: 60 },
  Truck: { activeVehicles: 9, availableVehicles: 5, inMaintenance: 1, activeTrips: 4, pendingTrips: 2, driversOnDuty: 5, utilization: 70 },
  Mini: { activeVehicles: 5, availableVehicles: 4, inMaintenance: 1, activeTrips: 1, pendingTrips: 1, driversOnDuty: 2, utilization: 55 },
};

const statusFactor = { All: 1, Available: 0.6, "On Trip": 0.3, "In Shop": 0.1, Retired: 0.05 };
const regionFactor = { All: 1, North: 0.4, South: 0.3, East: 0.2, West: 0.15 };

function scale(value, factor) {
  return Math.max(0, Math.round(value * factor));
}

function DashboardContent() {
  const { user } = useAuth();
  const [vehicleType, setVehicleType] = useState("All");
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");
  const [dateRange, setDateRange] = useState("This Week");
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("hasLoggedInBefore");
    if (seen) setIsReturning(true);
    else localStorage.setItem("hasLoggedInBefore", "true");
  }, []);

  const displayName = user?.email?.split("@")[0] || "there";

  const data = useMemo(() => {
    const base = baseData[vehicleType] || baseData.All;
    const combinedFactor = (statusFactor[status] ?? 1) * (regionFactor[region] ?? 1);
    return {
      activeVehicles: scale(base.activeVehicles, combinedFactor || 1),
      availableVehicles: scale(base.availableVehicles, combinedFactor || 1),
      inMaintenance: scale(base.inMaintenance, combinedFactor || 1),
      activeTrips: scale(base.activeTrips, combinedFactor || 1),
      pendingTrips: scale(base.pendingTrips, combinedFactor || 1),
      driversOnDuty: scale(base.driversOnDuty, combinedFactor || 1),
      utilization: Math.min(100, Math.round(base.utilization * (0.7 + combinedFactor * 0.3))),
    };
  }, [vehicleType, status, region]);

  const kpiData = [
    { label: "Active Vehicles", value: data.activeVehicles, trend: "+12%", up: true, icon: Truck },
    { label: "Available Vehicles", value: data.availableVehicles, trend: "+8%", up: true, icon: CheckCircle },
    { label: "Vehicles in Maintenance", value: data.inMaintenance, trend: "-2%", up: false, icon: Wrench },
    { label: "Active Trips", value: data.activeTrips, trend: "+16%", up: true, icon: Route },
    { label: "Pending Trips", value: data.pendingTrips, trend: "-5%", up: false, icon: Clock },
    { label: "Drivers On Duty", value: data.driversOnDuty, trend: "+7%", up: true, icon: Users },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text">
            {isReturning ? `Welcome back, ${displayName}! 👋` : `Welcome, ${displayName}!`}
          </h1>
          <p className="text-muted text-sm mt-1">Here's what's happening with your fleet today</p>
        </div>

        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2">
          <Calendar size={16} className="text-muted" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-sm text-text focus:outline-none"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-muted text-xs">Vehicle Type</label>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}
            className="bg-surface border border-border text-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent">
            <option>All</option><option>Van</option><option>Truck</option><option>Mini</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted text-xs">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="bg-surface border border-border text-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent">
            <option>All</option><option>Available</option><option>On Trip</option><option>In Shop</option><option>Retired</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted text-xs">Region</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}
            className="bg-surface border border-border text-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent">
            <option>All</option><option>North</option><option>South</option><option>East</option><option>West</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.up ? ArrowUp : ArrowDown;
          return (
            <div key={kpi.label} className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-accent/10 rounded-full p-2"><Icon size={18} className="text-accent" /></div>
              </div>
              <p className="text-muted text-sm">{kpi.label}</p>
              <p className="text-text text-3xl font-semibold mt-1">{kpi.value}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs ${kpi.up ? "text-success" : "text-danger"}`}>
                <TrendIcon size={12} /><span>{kpi.trend} vs last week</span>
              </div>
            </div>
          );
        })}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-accent/10 rounded-full p-2"><Gauge size={18} className="text-accent" /></div>
          </div>
          <p className="text-muted text-sm">Fleet Utilization %</p>
          <p className="text-text text-3xl font-semibold mt-1">{data.utilization}%</p>
          <div className="w-full bg-elevated rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-accent h-2 rounded-full transition-all duration-500" style={{ width: `${data.utilization}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-surface border border-border rounded-xl p-5 min-h-[140px] flex items-center justify-center">
          <p className="text-muted text-sm">Alerts panel — coming next</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 min-h-[140px] flex items-center justify-center">
          <p className="text-muted text-sm">Fleet Health Score — coming next</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 min-h-[140px] flex items-center justify-center">
          <p className="text-muted text-sm">Upcoming Maintenance — coming next</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5 min-h-[140px] flex items-center justify-center">
          <p className="text-muted text-sm">Recent Trips — built by Reports module</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 min-h-[140px] flex items-center justify-center">
          <p className="text-muted text-sm">Trips by Status / Fuel Efficiency — built by Reports module</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;