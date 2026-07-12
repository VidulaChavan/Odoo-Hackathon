import api from './axios';

/**
 * 🚗 VEHICLE REGISTRY ENDPOINTS
 * Plugs directly into your vehicle controller functions.
 */
export const vehicleService = {
  // Triggers listVehicles: supports optional filter args like { status: 'AVAILABLE', type: 'TRUCK' }
  getAll: async (filters = {}) => {
    const res = await api.get('/api/vehicles', { params: filters });
    return res.data;
  },

  // Triggers getVehicle: Returns data object complete with sorted maintenanceLogs
  getById: async (id) => {
    const res = await api.get(`/api/vehicles/${id}`);
    return res.data;
  },

  // Triggers createVehicle: Creates record (handles P2002 conflict error if registration code duplicates)
  create: async (vehicleData) => {
    const res = await api.post('/api/vehicles', vehicleData);
    return res.data;
  },

  // Triggers updateVehicle: Updates specifications or manually transitions asset status
  update: async (id, updatedData) => {
    const res = await api.patch(`/api/vehicles/${id}`, updatedData);
    return res.data;
  },

  // Triggers deleteVehicle: Removes asset and handles relational safety barriers (P2003)
  delete: async (id) => {
    const res = await api.delete(`/api/vehicles/${id}`);
    return res.data;
  }
};

export const reportService = {
  getFleetUtilization: async () => {
    const res = await api.get('/api/reports/fleet-utilization');
    return res.data;
  },
  getFuelEfficiency: async (vehicleId) => {
    const res = await api.get(`/api/reports/fuel-efficiency/${vehicleId}`);
    return res.data;
  },
};

export const tripService = {
  getAll: async () => {
    const res = await api.get('/api/trips');
    return res.data;
  },
};

/**
 * 🔧 MAINTENANCE LEDGER ENDPOINTS
 * Plugs directly into your maintenance controller functions.
 */
export const maintenanceService = {
  // Triggers listMaintenance: Fetches log records array assigned to a specific asset
  getAllLogs: async (vehicleId) => {
    const res = await api.get(`/api/vehicles/${vehicleId}/maintenance`);
    return res.data;
  },

  // Triggers getMaintenance: Fetches a single specific maintenance log card entry
  getLogById: async (vehicleId, logId) => {
    const res = await api.get(`/api/vehicles/${vehicleId}/maintenance/${logId}`);
    return res.data;
  },

  // Triggers createMaintenance: Auto-triggers backend atomic state transition to IN_SHOP[cite: 1]
  start: async (vehicleId, logData) => {
    const res = await api.post(`/api/vehicles/${vehicleId}/maintenance`, logData);
    return res.data;
  },

  // Triggers updateMaintenance: Passing { status: 'COMPLETED' } auto-triggers backend transition back to AVAILABLE[cite: 1]
  update: async (vehicleId, logId, updatedFields) => {
    const res = await api.patch(`/api/vehicles/${vehicleId}/maintenance/${logId}`, updatedFields);
    return res.data;
  },

  // Triggers deleteMaintenance: Cleans up log; auto-restores vehicle availability if no other active logs exist
  deleteLog: async (vehicleId, logId) => {
    const res = await api.delete(`/api/vehicles/${vehicleId}/maintenance/${logId}`);
    return res.data;
  }
};
export const getFleetUtilization = () =>
  api.get("/api/reports/fleet-utilization");

export const getOperationalCost = (vehicleId) =>
  api.get(`/api/reports/operational-cost/${vehicleId}`);

export const getFuelEfficiency = (vehicleId) =>
  api.get(`/api/reports/fuel-efficiency/${vehicleId}`);

export const getVehicleROI = (vehicleId) =>
  api.get(`/api/reports/vehicle-roi/${vehicleId}`);

export const exportCSV = () =>
  api.get("/api/reports/export/csv", {
    responseType: "blob",
  });