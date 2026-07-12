import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./tripDispatcher.css";
const TODAY = "Jul 12, 2026";
/* ── tiny SVG icons ── */
const Icon = {
  menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  truck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  driver: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.2 20a8 8 0 0 1 13.6 0"/></svg>,
  trip: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  wrench: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  fuel: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22V7l9-5 9 5v15H3z"/><line x1="12" y1="7" x2="12" y2="22"/><path d="M3 15h18"/></svg>,
  chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  filter: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  up: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>,
  down: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>,
  plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  alert: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  info: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

/* ── Donut chart (pure SVG) ── */
function DonutChart({ segments, total }) {
  const r = 70, cx = 90, cy = 90, stroke = 22;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 180 180" className="donut-svg">
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

/* ── Mini sparkline (pure SVG) ── */
function Sparkline({ data, color = "#f97316", height = 60 }) {
  const w = 300, h = height;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sparkline-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2.5" points={pts}/>
      <polygon fill={`url(#grad-${color.replace("#","")})`}
        points={`0,${h} ${pts} ${w},${h}`}/>
    </svg>
  );
}

/* ── Bar chart (pure SVG) ── */
function BarChart({ data, color = "#f97316" }) {
  const w = 300, h = 80, max = Math.max(...data.map(d => d.value));
  const bw = w / data.length - 6;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="bar-svg">
      {data.map((d, i) => {
        const bh = (d.value / max) * (h - 16);
        const x = i * (w / data.length) + 3;
        return (
          <g key={i}>
            <rect x={x} y={h - bh - 2} width={bw} height={bh} rx="3"
              fill={d.highlight ? color : "rgba(249,115,22,0.25)"}/>
          </g>
        );
      })}
    </svg>
  );
}
export default function TripDispatcher() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [tripData, setTripData] = useState({
    sourceDepot: "Mumbai",
    destinationHub: "Pune",
    vehicleId: "",
    vehicleType: "Heavy Cargo Truck",
    driverName: "",
  });
  const [liveTrips, setLiveTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [searchQuery, setSearchQuery]   = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toasts, setToasts]             = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const formatTrip = trip => ({
    id: trip.tripRef,
    driver: trip.driverName,
    status: trip.status,
    route: `${trip.sourceDepot} → ${trip.destinationHub}`,
    vehicle: trip.vehicleId,
    type: trip.vehicleType,
    startDate: trip.startAt ? new Date(trip.startAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : TODAY,
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get('/api/trips');
        setLiveTrips(response.data.map(formatTrip));
      } catch (error) {
        addToast('Unable to load trips from server', 'error');
      } finally {
        setLoadingTrips(false);
      }
    };
    fetchTrips();
  }, []);
  const removeToast = id => setToasts(prev => prev.filter(t => t.id !== id));
  useEffect(() => {
    if (toasts.length > 0) {
      const t = setTimeout(() => removeToast(toasts[0].id), 3500);
      return () => clearTimeout(t);
    }
  }, [toasts]);
  const handleChange = e => setTripData({ ...tripData, [e.target.name]: e.target.value });
  const handleDispatch = async e => {
    e.preventDefault();
    if (!tripData.vehicleId || !tripData.driverName) {
      addToast("Please fill Vehicle ID and Driver Name!", "error");
      return;
    }
    try {
      const response = await api.post('/api/trips', {
        sourceDepot: tripData.sourceDepot,
        destinationHub: tripData.destinationHub,
        vehicleId: tripData.vehicleId,
        vehicleType: tripData.vehicleType,
        driverName: tripData.driverName,
      });
      setLiveTrips(prev => [formatTrip(response.data), ...prev]);
      addToast(`Trip ${response.data.tripRef} dispatched successfully!`, "success");
      setTripData({ sourceDepot:"Mumbai", destinationHub:"Pune", vehicleId:"", vehicleType:"Heavy Cargo Truck", driverName:"" });
      setShowDispatchModal(false);
    } catch (error) {
      addToast('Unable to dispatch trip. Please try again.', 'error');
    }
  };
  const updateTripStatus = async (tripId, newStatus) => {
    try {
      await api.patch(`/api/trips/${tripId}/status`, { status: newStatus });
      setLiveTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: newStatus } : t));
      addToast(`Trip ${tripId} → ${newStatus}`, "info");
    } catch (error) {
      addToast('Unable to update trip status', 'error');
    }
  };
  const deleteTrip = async tripId => {
    try {
      await api.delete(`/api/trips/${tripId}`);
      setLiveTrips(prev => prev.filter(t => t.id !== tripId));
      addToast(`Trip ${tripId} archived`, "warning");
    } catch (error) {
      addToast('Unable to archive trip', 'error');
    }
  };

  const uniqueVehicles = [...new Set(liveTrips.map(t => t.vehicle))];
  const activeVehicleCount = new Set(
    liveTrips.filter(t => t.status === "Active").map(t => t.vehicle)
  ).size;
  const availableVehicleCount = Math.max(uniqueVehicles.length - activeVehicleCount, 0);
  const driversOnDutyCount = new Set(
    liveTrips.filter(t => ["Active", "Pending"].includes(t.status)).map(t => t.driver)
  ).size;

  const stats = {
    total:            liveTrips.length,
    active:           activeVehicleCount,
    available:        availableVehicleCount,
    activeVehicles:   activeVehicleCount,
    availableVehicles: availableVehicleCount,
    maintenance:      3,
    activeTrips:      liveTrips.filter(t => t.status === "Active").length,
    pending:          liveTrips.filter(t => t.status === "Pending").length,
    completed:        liveTrips.filter(t => t.status === "Completed").length,
    cancelled:        liveTrips.filter(t => t.status === "Cancelled").length,
    driversOnDuty:    driversOnDutyCount,
  };
  const filtered = liveTrips.filter(trip => {
    const q = searchQuery.toLowerCase();
    const matchSearch = trip.driver.toLowerCase().includes(q) ||
      trip.id.toLowerCase().includes(q) ||
      trip.route.toLowerCase().includes(q) ||
      trip.vehicle.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || trip.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const statusClass = s => ({
    Active:"badge-active", Pending:"badge-pending",
    Completed:"badge-completed", Cancelled:"badge-cancelled",
  }[s] || "");
  const donutSegs = [
    { value: stats.completed, color: "#22c55e" },
    { value: stats.activeTrips, color: "#f97316" },
    { value: stats.pending,   color: "#eab308" },
    { value: stats.cancelled, color: "#ef4444" },
  ];
  const sparkData = [42, 55, 48, 70, 65, 80, 68];
  const fuelData = [
    {value:10},{value:14},{value:12},{value:16},{value:13},
    {value:18,highlight:true},{value:12},{value:15},
  ];
  const maintenance = [
    { vehicle:"MH12 AB 1234", task:"Oil Change",        dueIn:"Due in 2 days",  urgent:true  },
    { vehicle:"KA01 KY 5678", task:"Brake Inspection",  dueIn:"Due in 5 days",  urgent:false },
    { vehicle:"DL1L AA 0001", task:"Tyre Rotation",     dueIn:"Due in 7 days",  urgent:false },
  ];

  const alerts = [
    { icon:"alert",  color:"#ef4444", text:"Driver license expired for 2 drivers – Please update immediately", time:"12m ago" },
    { icon:"alert",  color:"#f97316", text:"Vehicle MH12 AB 1234 requires maintenance",                         time:"1h ago"  },
    { icon:"info",   color:"#eab308", text:"Oil change is due in 3 days",                                        time:"2h ago"  },
    { icon:"truck",  color:"#3b82f6", text:"Trip TRP-0001 has been dispatched – Hyderabad → Vizag",             time:"2h ago"  },
    { icon:"check",  color:"#22c55e", text:"Trip TRP-0068 completed successfully",                               time:"Yesterday"},
  ];
  const navItems = [
    { label:"Dashboard",      icon:"chart",   section:"MAIN", to:"/dashboard", active:false },
    { label:"Vehicles",       icon:"truck",   section:"MAIN", to:null,          active:false },
    { label:"Drivers",        icon:"driver",  section:"MAIN", to:null,          active:false },
    { label:"Trips",          icon:"trip",    section:"MAIN", to:"/trips",      active:true  },
    { label:"Maintenance",    icon:"wrench",  section:"MAIN", to:null,          active:false },
    { label:"Fuel & Expenses",icon:"fuel",    section:"MAIN", to:null,          active:false },
    { label:"Reports",        icon:"chart",   section:"MAIN", to:null,          active:false },
    { label:"Users",          icon:"users",   section:"ADMIN",to:null,          active:false },
    { label:"Settings",       icon:"settings",section:"ADMIN",to:null,          active:false },
  ];
  return (
    <div className={`td-root ${sidebarCollapsed ? "collapsed" : ""}`}>
      {/* ── TOASTS ── */}
      <div className="td-toasts">
        {toasts.map(t => (
          <div key={t.id} className={`td-toast td-toast--${t.type}`}>
            <span className="td-toast__icon">
              {t.type==="success"?"✓":t.type==="error"?"✕":t.type==="info"?"ℹ":"⚠"}
            </span>
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)}>&times;</button>
          </div>
        ))}
      </div>

       {/* ── DISPATCH MODAL ── */}
      {showDispatchModal && (
        <div className="td-modal-overlay" onClick={() => setShowDispatchModal(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <div className="td-modal__header">
              <h3>Dispatch New Trip</h3>
              <button className="td-modal__close" onClick={() => setShowDispatchModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleDispatch} className="td-modal__form">
              <div className="td-modal__grid">
                <div className="td-field">
                  <label>Source Depot</label>
                  <select name="sourceDepot" value={tripData.sourceDepot} onChange={handleChange}>
                    <option>Mumbai</option><option>Delhi</option>
                    <option>Bengaluru</option><option>Chennai</option>
                    <option>Hyderabad</option><option>Ahmedabad</option>
                  </select>
                </div>
                <div className="td-field">
                  <label>Destination Hub</label>
                  <select name="destinationHub" value={tripData.destinationHub} onChange={handleChange}>
                    <option>Pune</option><option>Jaipur</option>
                    <option>Mysore</option><option>Vizag</option>
                    <option>Surat</option><option>Noida</option>
                  </select>
                </div>
                <div className="td-field">
                  <label>Vehicle ID</label>
                  <input name="vehicleId" placeholder="e.g. MH12 AB 1234"
                    value={tripData.vehicleId} onChange={handleChange}/>
                </div>
                <div className="td-field">
                  <label>Vehicle Type</label>
                  <select name="vehicleType" value={tripData.vehicleType} onChange={handleChange}>
                    <option>Heavy Cargo Truck</option>
                    <option>Electric Semi</option>
                    <option>Express Van</option>
                    <option>Refrigerated Carrier</option>
                  </select>
                </div>
                <div className="td-field td-field--full">
                  <label>Driver Name</label>
                  <input name="driverName" placeholder="Enter driver's full name"
                    value={tripData.driverName} onChange={handleChange}/>
                </div>
              </div>
              <button type="submit" className="td-modal__submit">🚀 Dispatch Trip</button>
            </form>
          </div>
        </div>
      )}
      {/* ── SIDEBAR ── */}
      <aside className="td-sidebar">
        <div className="td-sidebar__brand">
          <div className="td-sidebar__logo">T</div>
          {!sidebarCollapsed && <span className="td-sidebar__name">TransitOps</span>}
        </div>
        {["MAIN","ADMIN"].map(section => (
          <div key={section} className="td-sidebar__section">
            {!sidebarCollapsed && <p className="td-sidebar__section-label">{section}</p>}
            {navItems.filter(n => n.section === section).map(item => {
              const IconComp = Icon[item.icon];
              const inner = (
                <>
                  <span className="td-sidebar__icon"><IconComp/></span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </>
              );
              return item.to ? (
                <Link key={item.label} to={item.to}
                  className={`td-sidebar__item ${item.active?"td-sidebar__item--active":""}`}>
                  {inner}
                </Link>
              ) : (
                <div key={item.label}
                  className={`td-sidebar__item ${item.active?"td-sidebar__item--active":""}`}>
                  {inner}
                </div>
              );
            })}
          </div>
        ))}
        <div className="td-sidebar__user">
          <div className="td-sidebar__avatar">R</div>
          {!sidebarCollapsed && (
            <div className="td-sidebar__user-info">
              <span className="td-sidebar__user-name">Rohan Mehta</span>
              <span className="td-sidebar__user-role">Fleet Manager</span>
            </div>
          )}
        </div>
      </aside>
      {/* ── MAIN ── */}
      <div className="td-main">
        {/* Top bar */}
        <header className="td-topbar">
          <div className="td-topbar__left">
            <button className="td-topbar__menu" onClick={() => setSidebarCollapsed(c => !c)}>
              <Icon.menu/>
            </button>
            <div>
              <h1 className="td-topbar__title">Trip Dispatcher</h1>
            </div>
          </div>
          <div className="td-topbar__right">
            <span className="td-topbar__date">{TODAY}</span>
            <button className="td-topbar__btn"><Icon.filter/> Filters</button>
            <button className="td-topbar__icon-btn"><Icon.bell/></button>
            <div className="td-topbar__avatar">R</div>
            <span className="td-topbar__username">Rohan Mehta</span>
          </div>
        </header>

        <div className="td-content">
          {/* Welcome */}
          <div className="td-welcome">
            <h2>Welcome back, Rohan! 👋</h2>
            <p>Here's what's happening with your fleet today.</p>
          </div>
          {/* Stat cards */}
          <div className="td-stats">
            {[
              { label:"Active Vehicles",        value: stats.activeVehicles,      delta:"+12%", up:true,  color:"#f97316", icon:"truck"  },
              { label:"Available Vehicles",      value: stats.availableVehicles,   delta:"+8%",  up:true,  color:"#22c55e", icon:"truck"  },
              { label:"Vehicles in Maintenance", value: stats.maintenance,        delta:"-2%",  up:false, color:"#a855f7", icon:"wrench" },
              { label:"Active Trips",            value: stats.activeTrips,        delta:"+18%", up:true,  color:"#3b82f6", icon:"trip"  },
              { label:"Pending Trips",           value: stats.pending,            delta:"-6%",  up:false, color:"#f59e0b", icon:"trip"  },
              { label:"Drivers On Duty",         value: stats.driversOnDuty,      delta:"+9%",  up:true,  color:"#06b6d4", icon:"driver" },
            ].map(s => {
              const IC = Icon[s.icon];
              return (
                <div key={s.label} className="td-stat-card"
                  onClick={() => s.label.includes("Trip") && setStatusFilter(s.label.includes("Active")?"Active":"Pending")}>
                  <div className="td-stat-card__icon" style={{background:`${s.color}22`,color:s.color}}><IC/></div>
                  <div className="td-stat-card__body">
                    <span className="td-stat-card__label">{s.label}</span>
                    <span className="td-stat-card__value">{s.value}</span>
                    <span className={`td-stat-card__delta ${s.up?"up":"down"}`}>
                      {s.up ? <Icon.up/> : <Icon.down/>} {s.delta} vs last week
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Charts row */}
          <div className="td-charts-row">
            {/* Fleet Utilization */}
            <div className="td-card td-card--chart">
              <div className="td-card__head">
                <div><h3>Fleet Utilization (%)</h3></div>
                <select className="td-select-sm"><option>This Week</option></select>
              </div>
              <div className="td-chart-labels">
                {["May 12","May 13","May 14","May 15","May 16","May 17","May 18"].map(l=>(
                  <span key={l}>{l}</span>
                ))}
              </div>
              <Sparkline data={sparkData} color="#f97316" height={70}/>
              <div className="td-chart-yaxis">
                {[100,75,50,25,0].map(v=><span key={v}>{v}%</span>)}
              </div>
            </div>
            {/* Trips by Status – Donut */}
            <div className="td-card td-card--donut">
              <div className="td-card__head"><h3>Trips by Status</h3></div>
              <div className="td-donut-wrap">
                <DonutChart segments={donutSegs} total={stats.total}/>
                <div className="td-donut-legend">
                  {[
                    {label:"Completed",color:"#22c55e",value:stats.completed},
                    {label:"Active",   color:"#f97316",value:stats.active},
                    {label:"Pending",  color:"#eab308",value:stats.pending},
                    {label:"Cancelled",color:"#ef4444",value:stats.cancelled},
                  ].map(l=>(
                    <div key={l.label} className="td-legend-item">
                      <span className="td-legend-dot" style={{background:l.color}}/>
                      <span className="td-legend-label">{l.label}</span>
                      <span className="td-legend-value">{l.value} ({Math.round(l.value/stats.total*100)||0}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

     {/* Fuel Efficiency */}
            <div className="td-card td-card--chart">
              <div className="td-card__head">
                <h3>Fuel Efficiency (km/l)</h3>
                <select className="td-select-sm"><option>This Week</option></select>
              </div>
              <BarChart data={fuelData} color="#f97316"/>
              <div className="td-chart-labels">
                {["May 12","May 13","May 14","May 15","May 16","May 17","May 18","May 18"].map((l,i)=>(
                  <span key={i}>{l}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Bottom row: Recent Trips + Right Panels */}
          <div className="td-bottom-row">
            {/* Recent Trips table */}
            <div className="td-card td-card--table">
              <div className="td-card__head">
                <h3>Recent Trips</h3>
                <div className="td-head-controls">
                  <input className="td-search" placeholder="🔍 Search..."
                    value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
                  <div className="td-filter-pills">
                    {["All","Active","Pending","Completed","Cancelled"].map(s=>(
                      <button key={s}
                        className={`td-pill ${statusFilter===s?"td-pill--active":""}`}
                        onClick={()=>setStatusFilter(s)}>{s}
                      </button>
                    ))}
                  </div>
                  <button className="td-dispatch-btn" onClick={()=>setShowDispatchModal(true)}>
                    <Icon.plus/> New Trip
                  </button>
                </div>
              </div>
              <div className="td-table-wrap">
                <table className="td-table">
                  <thead>
                    <tr>
                      <th>Trip ID</th><th>Route</th><th>Vehicle</th>
                      <th>Driver</th><th>Status</th><th>Start Date</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="td-empty">No trips found.</td></tr>
                    ) : filtered.map(trip => (
                      <tr key={trip.id}>
                        <td><span className="td-trip-id">{trip.id}</span></td>
                        <td className="td-route">{trip.route}</td>
                        <td className="td-muted">{trip.vehicle}</td>
                        <td>{trip.driver}</td>
                        <td><span className={`td-badge ${statusClass(trip.status)}`}>{trip.status}</span></td>
                        <td className="td-muted">{trip.startDate}</td>
                        <td>
                          <div className="td-actions">
                            {trip.status!=="Active"    && trip.status!=="Completed" && trip.status!=="Cancelled" &&
                              <button className="td-act td-act--transit"
                                title="Mark Active" onClick={()=>updateTripStatus(trip.id,"Active")}>▶</button>}
                            {trip.status!=="Completed" && trip.status!=="Cancelled" &&
                              <button className="td-act td-act--complete"
                                title="Complete" onClick={()=>updateTripStatus(trip.id,"Completed")}>✓</button>}
                            {trip.status!=="Cancelled" && trip.status!=="Completed" &&
                              <button className="td-act td-act--cancel"
                                title="Cancel" onClick={()=>updateTripStatus(trip.id,"Cancelled")}>✕</button>}
                            <button className="td-act td-act--delete"
                              title="Archive" onClick={()=>deleteTrip(trip.id)}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Right column */}
            <div className="td-right-col">
              {/* Upcoming Maintenance */}
              <div className="td-card td-card--panel">
                <div className="td-card__head"><h3>Upcoming Maintenance</h3></div>
                <div className="td-maint-list">
                  {maintenance.map((m,i)=>(
                    <div key={i} className="td-maint-item">
                      <div className="td-maint-info">
                        <span className="td-maint-vehicle">{m.vehicle}</span>
                        <span className="td-maint-task">{m.task}</span>
                      </div>
                      <span className={`td-maint-due ${m.urgent?"td-maint-due--urgent":"td-maint-due--ok"}`}>
                        {m.dueIn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Alerts & Notifications */}
              <div className="td-card td-card--panel">
                <div className="td-card__head"><h3>Alerts &amp; Notifications</h3></div>
                <div className="td-alerts-list">
                  {alerts.map((a,i)=>{
                    const IC = Icon[a.icon] || Icon.info;
                    return (
                      <div key={i} className="td-alert-item">
                        <div className="td-alert-icon" style={{color:a.color}}><IC/></div>
                        <div className="td-alert-body">
                          <p className="td-alert-text">{a.text}</p>
                          <span className="td-alert-time">{a.time}</span>
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
    </div>
  );
}