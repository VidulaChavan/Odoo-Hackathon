const prisma = require('../lib/prisma');

const VALID_STATUSES = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];
const VALID_TYPES = ['VAN', 'TRUCK', 'MINI'];

const parseId = (value) => {
  const id = parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

const listVehicles = async (req, res) => {
  try {
    const where = {};

    if (req.query.status) {
      if (!VALID_STATUSES.includes(req.query.status)) {
        return res.status(400).json({ error: "Invalid status filter" });
      }
      where.status = req.query.status;
    }

    if (req.query.type) {
      if (!VALID_TYPES.includes(req.query.type)) {
        return res.status(400).json({ error: "Invalid type filter" });
      }
      where.type = req.query.type;
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getVehicle = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid vehicle ID" });
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { maintenanceLogs: { orderBy: { date: 'desc' } } },
    });

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const createVehicle = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.create({ data: req.body });
    res.status(201).json(vehicle);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: "Registration number already exists" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateVehicle = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid vehicle ID" });
  }

  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: req.body,
    });
    res.json(vehicle);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    if (err.code === 'P2002') {
      return res.status(400).json({ error: "Registration number already exists" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteVehicle = async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid vehicle ID" });
  }

  try {
    await prisma.vehicle.delete({ where: { id } });
    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    if (err.code === 'P2003') {
      return res.status(400).json({ error: "Cannot delete vehicle with existing records" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { listVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle };
