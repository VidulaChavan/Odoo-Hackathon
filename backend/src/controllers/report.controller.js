const reportService = require("../services/report.service");

async function operationalCost(req, res) {
  try {
    const data = await reportService.getOperationalCost(req.params.vehicleId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function fuelEfficiency(req, res) {
  try {
    const data = await reportService.getFuelEfficiency(req.params.vehicleId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function fleetUtilization(req, res) {
  try {
    const data = await reportService.getFleetUtilization();
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function vehicleROI(req, res) {
  try {
    const data = await reportService.getVehicleROI(req.params.vehicleId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  operationalCost,
  fuelEfficiency,
  fleetUtilization,
  vehicleROI,
};