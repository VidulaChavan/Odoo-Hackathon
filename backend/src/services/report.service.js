const prisma = require("../lib/prisma");

// Operational Cost = Fuel + Maintenance
async function getOperationalCost(vehicleId) {
  const fuel = await prisma.fuelLog.aggregate({
    where: {
      vehicleId: Number(vehicleId),
    },
    _sum: {
      cost: true,
    },
  });

  const maintenance = await prisma.maintenanceLog.aggregate({
    where: {
      vehicleId: Number(vehicleId),
    },
    _sum: {
      cost: true,
    },
  });

  const fuelCost = fuel._sum.cost || 0;
  const maintenanceCost = maintenance._sum.cost || 0;

  return {
    vehicleId: Number(vehicleId),
    fuelCost,
    maintenanceCost,
    operationalCost: fuelCost + maintenanceCost,
  };
}

// Fuel Efficiency = Distance / Fuel
async function getFuelEfficiency(vehicleId) {
  const trips = await prisma.trip.findMany({
    where: {
      vehicleId: Number(vehicleId),
      actualDistance: { not: null },
      fuelConsumed: { not: null },
    },
  });

  let distance = 0;
  let fuel = 0;

  trips.forEach((trip) => {
    distance += trip.actualDistance || 0;
    fuel += trip.fuelConsumed || 0;
  });

  return {
    vehicleId: Number(vehicleId),
    totalDistance: distance,
    totalFuel: fuel,
    fuelEfficiency: fuel === 0 ? 0 : distance / fuel,
  };
}

// Fleet Utilization
async function getFleetUtilization() {
  const total = await prisma.vehicle.count();

  const active = await prisma.vehicle.count({
    where: {
      status: "ON_TRIP",
    },
  });

  return {
    totalVehicles: total,
    activeVehicles: active,
    utilization: total === 0 ? 0 : (active / total) * 100,
  };
}

// Vehicle ROI
async function getVehicleROI(vehicleId) {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: Number(vehicleId),
    },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const revenue = await prisma.trip.aggregate({
    where: {
      vehicleId: Number(vehicleId),
    },
    _sum: {
      revenue: true,
    },
  });

  const maintenance = await prisma.maintenanceLog.aggregate({
    where: {
      vehicleId: Number(vehicleId),
    },
    _sum: {
      cost: true,
    },
  });

  const fuel = await prisma.fuelLog.aggregate({
    where: {
      vehicleId: Number(vehicleId),
    },
    _sum: {
      cost: true,
    },
  });

  const totalRevenue = revenue._sum.revenue || 0;
  const maintenanceCost = maintenance._sum.cost || 0;
  const fuelCost = fuel._sum.cost || 0;

  const roi =
    (totalRevenue - (maintenanceCost + fuelCost)) /
    vehicle.acquisitionCost;

  return {
    vehicleId: Number(vehicleId),
    revenue: totalRevenue,
    maintenanceCost,
    fuelCost,
    acquisitionCost: vehicle.acquisitionCost,
    roi,
  };
}

module.exports = {
  getOperationalCost,
  getFuelEfficiency,
  getFleetUtilization,
  getVehicleROI,
};