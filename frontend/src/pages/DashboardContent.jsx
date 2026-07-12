import React, { useState, useMemo, useEffect } from "react";
import {
  Truck,
  CheckCircle,
  Wrench,
  Route,
  Clock,
  Users,
  Gauge,
  ArrowUp,
  ArrowDown,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const baseData = {
  All: {
    activeVehicles: 24,
    availableVehicles: 15,
    inMaintenance: 3,
    activeTrips: 8,
    pendingTrips: 5,
    driversOnDuty: 12,
    utilization: 67,
  },
  Van: {
    activeVehicles: 10,
    availableVehicles: 6,
    inMaintenance: 1,
    activeTrips: 3,
    pendingTrips: 2,
    driversOnDuty: 5,
    utilization: 60,
  },
  Truck: {
    activeVehicles: 9,
    availableVehicles: 5,
    inMaintenance: 1,
    activeTrips: 4,
    pendingTrips: 2,
    driversOnDuty: 5,
    utilization: 70,
  },
  Mini: {
    activeVehicles: 5,
    availableVehicles: 4,
    inMaintenance: 1,
    activeTrips: 1,
    pendingTrips: 1,
    driversOnDuty: 2,
    utilization: 55,
  },
};

const statusFactor = {
  All: 1,
  Available: 0.6,
  "On Trip": 0.3,
  "In Shop": 0.1,
  Retired: 0.05,
};

const regionFactor = {
  All: 1,
  North: 0.4,
  South: 0.3,
  East: 0.2,
  West: 0.15,
};

const statusColors = {
  Active: "bg-accent/10 text-accent",
  Pending: "bg-yellow-100 text-yellow-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

const fallbackTrips = [
  {
    tripRef: "TRP-1002",
    sourceDepot: "Mumbai",
    destinationHub: "Pune",
    status: "Active",
    vehicleId: 1,
  },
  {
    tripRef: "TRP-1003",
    sourceDepot: "Delhi",
    destinationHub: "Jaipur",
    status: "Pending",
    vehicleId: 1,
  },
];

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

  // Existing
  const [fleetUtil, setFleetUtil] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    Active: 0,
    Pending: 0,
    Completed: 0,
    Cancelled: 0,
  });

  // Your APIs
  const [fuelEfficiency, setFuelEfficiency] = useState(null);
  const [operationalCost, setOperationalCost] = useState(null);
  const [vehicleROI, setVehicleROI] = useState(null);

  useEffect(() => {
    const seen = localStorage.getItem("hasLoggedInBefore");

    if (seen) setIsReturning(true);
    else localStorage.setItem("hasLoggedInBefore", "true");
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [fleetRes, tripsRes] = await Promise.all([
          api.get("/api/reports/fleet-utilization"),
          api.get("/api/trips"),
        ]);

        setFleetUtil(fleetRes.data);

        const trips =
          Array.isArray(tripsRes.data) && tripsRes.data.length
            ? tripsRes.data
            : fallbackTrips;

        setRecentTrips(trips.slice(0, 6));

        const counts = trips.reduce(
          (acc, trip) => {
            const s = trip.status || "Pending";
            acc[s] = (acc[s] || 0) + 1;
            return acc;
          },
          {
            Active: 0,
            Pending: 0,
            Completed: 0,
            Cancelled: 0,
          }
        );

        setStatusCounts(counts);

        const vehicleId = trips[0]?.vehicleId;

        if (vehicleId) {
          try {
            const fuel = await api.get(
              `/api/reports/fuel-efficiency/${vehicleId}`
            );
            setFuelEfficiency(fuel.data);
          } catch (e) {
            console.log(e);
          }

          try {
            const cost = await api.get(
              `/api/reports/operational-cost/${vehicleId}`
            );
            setOperationalCost(cost.data);
          } catch (e) {
            console.log(e);
          }

          try {
            const roi = await api.get(
              `/api/reports/vehicle-roi/${vehicleId}`
            );
            setVehicleROI(roi.data);
          } catch (e) {
            console.log(e);
          }
        }
      } catch (err) {
        console.log(err);
        setRecentTrips(fallbackTrips);
      }
    }

    loadDashboard();
  }, []);

  // Abk
  const displayName = user?.email?.split("@")[0] || "there";

  const data = useMemo(() => {
  const base = baseData[vehicleType] || baseData.All;

  const combinedFactor =
    (statusFactor[status] ?? 1) *
    (regionFactor[region] ?? 1);

  return {
    activeVehicles: scale(base.activeVehicles, combinedFactor),
    availableVehicles: scale(base.availableVehicles, combinedFactor),
    inMaintenance: scale(base.inMaintenance, combinedFactor),
    activeTrips: scale(base.activeTrips, combinedFactor),
    pendingTrips: scale(base.pendingTrips, combinedFactor),
    driversOnDuty: scale(base.driversOnDuty, combinedFactor),
    utilization: Math.min(
      100,
      Math.round(
        base.utilization * (0.7 + combinedFactor * 0.3)
      )
    ),
  };
}, [vehicleType, status, region]);

// Backend Fleet Utilization
const effectiveUtilization =
  fleetUtil?.utilization ??
  fleetUtil?.fleetUtilization ??
  data.utilization;

const kpiData = [
  {
    label: "Active Vehicles",
    value: data.activeVehicles,
    trend: "+12%",
    up: true,
    icon: Truck,
  },
  {
    label: "Available Vehicles",
    value: data.availableVehicles,
    trend: "+8%",
    up: true,
    icon: CheckCircle,
  },
  {
    label: "Vehicles in Maintenance",
    value: data.inMaintenance,
    trend: "-2%",
    up: false,
    icon: Wrench,
  },
  {
    label: "Active Trips",
    value: data.activeTrips,
    trend: "+16%",
    up: true,
    icon: Route,
  },
  {
    label: "Pending Trips",
    value: data.pendingTrips,
    trend: "-5%",
    up: false,
    icon: Clock,
  },
  {
    label: "Drivers On Duty",
    value: data.driversOnDuty,
    trend: "+7%",
    up: true,
    icon: Users,
  },
];

const tripSegments = [
  {
    label: "Active",
    value: statusCounts.Active || 0,
    color: "#22c55e",
  },
  {
    label: "Pending",
    value: statusCounts.Pending || 0,
    color: "#facc15",
  },
  {
    label: "Completed",
    value: statusCounts.Completed || 0,
    color: "#3b82f6",
  },
  {
    label: "Cancelled",
    value: statusCounts.Cancelled || 0,
    color: "#ef4444",
  },
];

const tripTotal = tripSegments.reduce(
  (sum, item) => sum + item.value,
  0
);

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
          <p className="text-text text-3xl font-semibold mt-1">{Math.round(effectiveUtilization)}%</p>
          <div className="w-full bg-elevated rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-accent h-2 rounded-full transition-all duration-500" style={{ width: `${Math.round(effectiveUtilization)}%` }} />
          </div>
          {fleetUtil && (
            <p className="text-muted text-xs mt-3">{fleetUtil.activeVehicles} / {fleetUtil.totalVehicles} vehicles active</p>
          )}
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
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-text font-semibold">Recent Trips</h3>
              <p className="text-muted text-sm">Latest dispatch activity from the fleet.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_0.9fr_0.8fr] gap-3 text-xs text-muted border-b border-border pb-3 mb-3">
              <span>Trip</span><span>Route</span><span>Status</span>
            </div>
            {recentTrips.map((trip) => (
              <div key={trip.tripRef} className="grid grid-cols-[1fr_0.9fr_0.8fr] gap-3 text-sm items-center py-3 border-b border-border last:border-b-0">
                <span className="font-mono text-text">{trip.tripRef}</span>
                <span className="text-text">{trip.sourceDepot} → {trip.destinationHub}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[trip.status] || statusColors.Pending}`}>{trip.status}</span>
              </div>
            ))}
            {recentTrips.length === 0 && <p className="text-muted text-sm">No recent trip data available yet.</p>}
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-text font-semibold">Trips by Status</h3>
              <p className="text-muted text-sm">Visual overview of active dispatch health.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-1/2">
              <DonutChart segments={tripSegments} total={tripTotal} />
            </div>
            <div className="w-full sm:w-1/2 flex flex-col gap-3">
              {tripSegments.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: item.color }} />{item.label}</span>
                  <span className="text-text font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">

  {/* Fuel Efficiency */}
  <div className="bg-surface border border-border rounded-xl p-5">
    <h3 className="text-text font-semibold mb-3">
      Fuel Efficiency
    </h3>

    {fuelEfficiency ? (
      <div className="space-y-3">
        <p className="text-text text-3xl font-semibold">
          {fuelEfficiency.fuelEfficiency.toFixed(2)} km/L
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-elevated rounded-xl p-3">
            <p className="text-xs text-muted">
              Distance
            </p>

            <p className="font-semibold">
              {fuelEfficiency.totalDistance ?? 0} km
            </p>
          </div>

          <div className="bg-elevated rounded-xl p-3">
            <p className="text-xs text-muted">
              Fuel Used
            </p>

            <p className="font-semibold">
              {fuelEfficiency.totalFuel ?? 0} L
            </p>
          </div>
        </div>
      </div>
    ) : (
      <p className="text-muted">
        No fuel data available.
      </p>
    )}
  </div>

  {/* Operational Cost */}
  <div className="bg-surface border border-border rounded-xl p-5">
    <h3 className="text-text font-semibold mb-3">
      Operational Cost
    </h3>

    {operationalCost ? (
      <>
        <p>Fuel Cost</p>

        <p className="font-semibold mb-2">
          ₹ {operationalCost.fuelCost}
        </p>

        <p>Maintenance Cost</p>

        <p className="font-semibold mb-2">
          ₹ {operationalCost.maintenanceCost}
        </p>

        <hr className="my-3"/>

        <p className="text-2xl font-bold">
          ₹ {operationalCost.operationalCost}
        </p>
      </>
    ) : (
      <p>No Operational Cost Data</p>
    )}
  </div>

  {/* Vehicle ROI */}
  <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">

    <div>
      <h3 className="text-text font-semibold mb-3">
        Vehicle ROI
      </h3>

      {vehicleROI ? (
        <>
          <p className="text-3xl font-bold">
            {vehicleROI.roi.toFixed(2)}%
          </p>

          <p className="mt-3">
            Revenue
          </p>

          <p className="font-semibold">
            ₹ {vehicleROI.revenue}
          </p>

          <p className="mt-2">
            Acquisition Cost
          </p>

          <p className="font-semibold">
            ₹ {vehicleROI.acquisitionCost}
          </p>
        </>
      ) : (
        <p>No ROI Data</p>
      )}
    </div>

    <button
      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
      onClick={async () => {
        const response = await api.get(
          "/api/reports/export-csv",
          {
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );

        const link = document.createElement("a");

        link.href = url;

        link.download = "fleet-report.csv";

        link.click();
      }}
    >
      Export CSV
    </button>

  </div>

</div>
    </div>
  );
}

function DonutChart({ segments, total }) {
  const r = 70;
  const cx = 90;
  const cy = 90;
  const stroke = 18;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 180 180" className="mx-auto" style={{ width: 180, height: 180 }}>
      {segments.map((seg, index) => {
        const dash = (seg.value / total) * circumference;
        const gap = circumference - dash;
        const circle = (
          <circle key={index} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
          />
        );
        offset += dash;
        return circle;
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#fff" fontSize="24" fontWeight="700">{total}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="#9ca3af" fontSize="11">Total Trips</text>
    </svg>
  );
}

export default DashboardContent;