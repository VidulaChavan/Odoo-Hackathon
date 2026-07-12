import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Sidebar from "../components/common/Sidebar";
import "./tripDispatcher.css";

const TODAY = "Jul 12, 2026";

const Icon = {
  menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  truck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  driver: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.2 20a8 8 0 0 1 13.6 0"/></svg>,
  trip: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  wrench: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  fuel: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22V7l9-5 9 5v15H3z"/><line x1="12" y1="7" x2="12" y2="22"/><path d="M3 15h18"/></svg>,
  chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  filter: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  up: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>,
  down: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>,
  plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  info: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

function DonutChart({ segments, total }) {
  const r = 70, cx = 90, cy = 90, stroke = 22;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 180 180" style={{ width: 160, height: 160 }}>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circumference;
        const gap = circumference - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#fff" fontSize="26" fontWeight="800">{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#9ca3af" fontSize="11">Total Trips</text>
    </svg>
  );
}

function Sparkline({ data, color = "#f97316", height = 60 }) {
  const w = 300, h = height;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2.5" points={pts}/>
      <polygon fill={`url(#grad-${color.replace("#","")})`} points={`0,${h} ${pts} ${w},${h}`}/>
    </svg>
  );
}

function BarChart({ data, color = "#f97316" }) {
  const w = 300, h = 80, max = Math.max(...data.map(d => d.value));
  const bw = w / data.length - 6;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }}>
      {data.map((d, i) => {
        const bh = (d.value / max) * (h - 16);
        const x = i * (w / data.length) + 3;
        return <rect key={i} x={x} y={h - bh - 2} width={bw} height={bh} rx="3" fill={d.highlight ? color : "rgba(249,115,22,0.25)"}/>;
      })}
    </svg>
  );
}

export default function TripDispatcher() {
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [tripData, setTripData] = useState({
    sourceDepot: "Mumbai",
    destinationHub: "Pune",
    vehicleId: "",
    vehicleType: "Heavy Cargo Truck",
    driverName: "",
  });
  const [liveTrips, setLiveTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const formatTrip = (trip) => ({
    id: trip.tripRef,
    driver: trip.driverName,
    status: trip.status,
    route: `${trip.sourceDepot} → ${trip.destinationHub}`,
    vehicle: trip.vehicleId,
    startDate: trip.startAt
      ? new Date(trip.startAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
      : TODAY,
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get("/api/trips");
        setLiveTrips(response.data.map(formatTrip));
      } catch (error) {
        addToast("Unable to load trips from server", "error");
      }
    };
    fetchTrips();
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  useEffect(() => {
    if (toasts.length > 0) {
      const t = setTimeout(() => removeToast(toasts[0].id), 3500);
      return () => clearTimeout(t);
    }
  }, [toasts]);

  const handleChange = (e) => setTripData({ ...tripData, [e.target.name]: e.target.value });

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!tripData.vehicleId || !tripData.driverName) {
      addToast("Please fill Vehicle ID and Driver Name!", "error");
      return;
    }
    try {
      const response = await api.post("/api/trips", tripData);
      setLiveTrips((prev) => [formatTrip(response.data), ...prev]);
      addToast(`Trip ${response.data.tripRef} dispatched successfully!`, "success");
      setTripData({ sourceDepot: "Mumbai", destinationHub: "Pune", vehicleId: "", vehicleType: "Heavy Cargo Truck", driverName: "" });
      setShowDispatchModal(false);
    } catch (error) {
      addToast("Unable to dispatch trip. Please try again.", "error");
    }
  };

  const updateTripStatus = async (tripId, newStatus) => {
    try {
      await api.patch(`/api/trips/${tripId}/status`, { status: newStatus });
      setLiveTrips((prev) => prev.map((t) => (t.id === tripId ? { ...t, status: newStatus } : t)));
      addToast(`Trip ${tripId} → ${newStatus}`, "info");
    } catch (error) {
      addToast("Unable to update trip status", "error");
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      await api.delete(`/api/trips/${tripId}`);
      setLiveTrips((prev) => prev.filter((t) => t.id !== tripId));
      addToast(`Trip ${tripId} archived`, "warning");
    } catch (error) {
      addToast("Unable to archive trip", "error");
    }
  };

  const uniqueVehicles = [...new Set(liveTrips.map((t) => t.vehicle))];
  const activeVehicleCount = new Set(liveTrips.filter((t) => t.status === "Active").map((t) => t.vehicle)).size;
  const availableVehicleCount = Math.max(uniqueVehicles.length - activeVehicleCount, 0);
  const driversOnDutyCount = new Set(
    liveTrips.filter((t) => ["Active", "Pending"].includes(t.status)).map((t) => t.driver)
  ).size;

  const stats = {
    total: liveTrips.length,
    activeVehicles: activeVehicleCount,
    availableVehicles: availableVehicleCount,
    maintenance: 3,
    activeTrips: liveTrips.filter((t) => t.status === "Active").length,
    pending: liveTrips.filter((t) => t.status === "Pending").length,
    completed: liveTrips.filter((t) => t.status === "Completed").length,
    cancelled: liveTrips.filter((t) => t.status === "Cancelled").length,
    driversOnDuty: driversOnDutyCount,
  };

  const filtered = liveTrips.filter((trip) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      trip.driver.toLowerCase().includes(q) ||
      trip.id.toLowerCase().includes(q) ||
      trip.route.toLowerCase().includes(q) ||
      trip.vehicle.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || trip.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusClass = (s) =>
    ({ Active: "badge-active", Pending: "badge-pending", Completed: "badge-completed", Cancelled: "badge-cancelled" }[s] || "");

  const donutSegs = [
    { value: stats.completed, color: "#22c55e" },
    { value: stats.activeTrips, color: "#f97316" },
    { value: stats.pending, color: "#eab308" },
    { value: stats.cancelled, color: "#ef4444" },
  ];
  const sparkData = [42, 55, 48, 70, 65, 80, 68];
  const fuelData = [{ value: 10 }, { value: 14 }, { value: 12 }, { value: 16 }, { value: 13 }, { value: 18, highlight: true }, { value: 12 }, { value: 15 }];
  const maintenance = [
    { vehicle: "MH12 AB 1234", task: "Oil Change", dueIn: "Due in 2 days", urgent: true },
    { vehicle: "KA01 KY 5678", task: "Brake Inspection", dueIn: "Due in 5 days", urgent: false },
    { vehicle: "DL1L AA 0001", task: "Tyre Rotation", dueIn: "Due in 7 days", urgent: false },
  ];
  const alerts = [
    { icon: "alert", color: "#ef4444", text: "Driver license expired for 2 drivers – Please update immediately", time: "12m ago" },
    { icon: "alert", color: "#f97316", text: "Vehicle MH12 AB 1234 requires maintenance", time: "1h ago" },
    { icon: "info", color: "#eab308", text: "Oil change is due in 3 days", time: "2h ago" },
    { icon: "truck", color: "#3b82f6", text: "Trip TRP-0001 has been dispatched – Hyderabad → Vizag", time: "2h ago" },
    { icon: "check", color: "#22c55e", text: "Trip TRP-0068 completed successfully", time: "Yesterday" },
  ];

  const statCards = [
    { label: "Active Vehicles", value: stats.activeVehicles, delta: "+12%", up: true, color: "#f97316", icon: "truck" },
    { label: "Available Vehicles", value: stats.availableVehicles, delta: "+8%", up: true, color: "#22c55e", icon: "truck" },
    { label: "Vehicles in Maintenance", value: stats.maintenance, delta: "-2%", up: false, color: "#a855f7", icon: "wrench" },
    { label: "Active Trips", value: stats.activeTrips, delta: "+18%", up: true, color: "#3b82f6", icon: "trip" },
    { label: "Pending Trips", value: stats.pending, delta: "-6%", up: false, color: "#f59e0b", icon: "trip" },
    { label: "Drivers On Duty", value: stats.driversOnDuty, delta: "+9%", up: true, color: "#06b6d4", icon: "driver" },
  ];

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <div key={t.id} className={`flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-3 shadow-lg ${t.type === "error" ? "border-l-4 border-l-danger" : t.type === "success" ? "border-l-4 border-l-success" : "border-l-4 border-l-secondary"}`}>
              <span className="text-text text-sm">{t.message}</span>
              <button onClick={() => removeToast(t.id)} className="text-muted hover:text-text">×</button>
            </div>
          ))}
        </div>

        {showDispatchModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowDispatchModal(false)}>
            <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-text text-lg font-semibold">Dispatch New Trip</h3>
                <button onClick={() => setShowDispatchModal(false)} className="text-muted hover:text-text text-2xl leading-none">×</button>
              </div>
              <form onSubmit={handleDispatch} className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted text-xs uppercase font-semibold">Source Depot</label>
                  <select name="sourceDepot" value={tripData.sourceDepot} onChange={handleChange} className="w-full bg-elevated border border-border text-text p-2 rounded-lg mt-1">
                    <option>Mumbai</option><option>Delhi</option><option>Bengaluru</option><option>Chennai</option><option>Hyderabad</option><option>Ahmedabad</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted text-xs uppercase font-semibold">Destination Hub</label>
                  <select name="destinationHub" value={tripData.destinationHub} onChange={handleChange} className="w-full bg-elevated border border-border text-text p-2 rounded-lg mt-1">
                    <option>Pune</option><option>Jaipur</option><option>Mysore</option><option>Vizag</option><option>Surat</option><option>Noida</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted text-xs uppercase font-semibold">Vehicle ID</label>
                  <input name="vehicleId" placeholder="e.g. MH12 AB 1234" value={tripData.vehicleId} onChange={handleChange} className="w-full bg-elevated border border-border text-text p-2 rounded-lg mt-1" />
                </div>
                <div>
                  <label className="text-muted text-xs uppercase font-semibold">Vehicle Type</label>
                  <select name="vehicleType" value={tripData.vehicleType} onChange={handleChange} className="w-full bg-elevated border border-border text-text p-2 rounded-lg mt-1">
                    <option>Heavy Cargo Truck</option><option>Electric Semi</option><option>Express Van</option><option>Refrigerated Carrier</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-muted text-xs uppercase font-semibold">Driver Name</label>
                  <input name="driverName" placeholder="Enter driver's full name" value={tripData.driverName} onChange={handleChange} className="w-full bg-elevated border border-border text-text p-2 rounded-lg mt-1" />
                </div>
                <button type="submit" className="col-span-2 mt-2 bg-accent text-white p-3 rounded-lg font-semibold hover:opacity-90">Dispatch Trip</button>
              </form>
            </div>
          </div>
        )}

        <header className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h1 className="text-text text-xl font-bold">Trip Dispatcher</h1>
          <div className="flex items-center gap-3">
            <span className="text-muted text-sm">{TODAY}</span>
            <button className="flex items-center gap-1 text-text text-sm border border-border px-3 py-1.5 rounded-lg hover:bg-elevated">
              <Icon.filter /> Filters
            </button>
            <button className="text-text hover:text-accent"><Icon.bell /></button>
          </div>
        </header>

        <div className="p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-text text-2xl font-bold">Welcome back! 👋</h2>
            <p className="text-muted text-sm">Here's what's happening with your fleet today.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statCards.map((s) => {
              const IC = Icon[s.icon];
              return (
                <div key={s.label} className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}22`, color: s.color }}>
                    <IC />
                  </div>
                  <span className="text-muted text-xs">{s.label}</span>
                  <span className="text-text text-2xl font-bold">{s.value}</span>
                  <span className={`text-xs flex items-center gap-1 ${s.up ? "text-success" : "text-danger"}`}>
                    {s.up ? <Icon.up /> : <Icon.down />} {s.delta} vs last week
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="text-text font-semibold mb-3">Fleet Utilization (%)</h3>
              <Sparkline data={sparkData} color="#f97316" height={70} />
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-col items-center">
              <h3 className="text-text font-semibold mb-3 self-start">Trips by Status</h3>
              <DonutChart segments={donutSegs} total={stats.total} />
              <div className="w-full mt-3 flex flex-col gap-1">
                {[
                  { label: "Completed", color: "#22c55e", value: stats.completed },
                  { label: "Active", color: "#f97316", value: stats.activeTrips },
                  { label: "Pending", color: "#eab308", value: stats.pending },
                  { label: "Cancelled", color: "#ef4444", value: stats.cancelled },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2 text-xs text-muted">
                    <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                    <span className="flex-1">{l.label}</span>
                    <span>{l.value} ({Math.round((l.value / stats.total) * 100) || 0}%)</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="text-text font-semibold mb-3">Fuel Efficiency (km/l)</h3>
              <BarChart data={fuelData} color="#f97316" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-4">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <h3 className="text-text font-semibold">Recent Trips</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-elevated border border-border text-text text-sm px-3 py-1.5 rounded-lg"
                  />
                  {["All", "Active", "Pending", "Completed", "Cancelled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border ${statusFilter === s ? "bg-elevated border-accent text-accent" : "border-border text-muted"}`}
                    >
                      {s}
                    </button>
                  ))}
                  <button onClick={() => setShowDispatchModal(true)} className="flex items-center gap-1 bg-accent text-white text-xs px-3 py-1.5 rounded-lg font-semibold">
                    <Icon.plus /> New Trip
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted text-xs uppercase text-left border-b border-border">
                      <th className="py-2">Trip ID</th><th>Route</th><th>Vehicle</th><th>Driver</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="py-6 text-center text-muted">No trips found.</td></tr>
                    ) : (
                      filtered.map((trip) => (
                        <tr key={trip.id} className="border-b border-border">
                          <td className="py-2 text-text font-mono">{trip.id}</td>
                          <td className="text-text">{trip.route}</td>
                          <td className="text-muted">{trip.vehicle}</td>
                          <td className="text-text">{trip.driver}</td>
                          <td><span className={`text-xs px-2 py-1 rounded-full ${statusClass(trip.status)}`}>{trip.status}</span></td>
                          <td className="flex gap-1 py-2">
                            <button onClick={() => updateTripStatus(trip.id, "Completed")} className="text-success">✓</button>
                            <button onClick={() => updateTripStatus(trip.id, "Cancelled")} className="text-danger">✕</button>
                            <button onClick={() => deleteTrip(trip.id)} className="text-muted">🗑</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="text-text font-semibold mb-3">Upcoming Maintenance</h3>
                {maintenance.map((m, i) => (
                  <div key={i} className="flex justify-between text-sm mb-2">
                    <div>
                      <p className="text-text">{m.vehicle}</p>
                      <p className="text-muted text-xs">{m.task}</p>
                    </div>
                    <span className={`text-xs ${m.urgent ? "text-danger" : "text-muted"}`}>{m.dueIn}</span>
                  </div>
                ))}
              </div>
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="text-text font-semibold mb-3">Alerts & Notifications</h3>
                {alerts.map((a, i) => {
                  const IC = Icon[a.icon] || Icon.info;
                  return (
                    <div key={i} className="flex gap-2 mb-3">
                      <div style={{ color: a.color }}><IC /></div>
                      <div>
                        <p className="text-text text-sm">{a.text}</p>
                        <span className="text-muted text-xs">{a.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}