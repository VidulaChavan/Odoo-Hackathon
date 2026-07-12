const prisma = require('../lib/prisma');

const parseId = (value) => {
  const id = parseInt(value, 10);
  return Number.isNaN(id) ? null : id;
};

const listMaintenance = async (req, res) => {
  const vehicleId = parseId(req.params.vehicleId);
  if (vehicleId === null) {
    return res.status(400).json({ error: "Invalid vehicle ID" });
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const logs = await prisma.maintenanceLog.findMany({
      where: { vehicleId },
      orderBy: { date: 'desc' },
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getMaintenance = async (req, res) => {
  const vehicleId = parseId(req.params.vehicleId);
  const id = parseId(req.params.id);
  if (vehicleId === null || id === null) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const log = await prisma.maintenanceLog.findFirst({
      where: { id, vehicleId },
    });

    if (!log) {
      return res.status(404).json({ error: "Maintenance log not found" });
    }

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const createMaintenance = async (req, res) => {
  const vehicleId = parseId(req.params.vehicleId);
  if (vehicleId === null) {
    return res.status(400).json({ error: "Invalid vehicle ID" });
  }

  const status = req.body.status ?? 'ACTIVE';

  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const log = await prisma.$transaction(async (tx) => {
      const created = await tx.maintenanceLog.create({
        data: {
          vehicleId,
          serviceType: req.body.serviceType,
          cost: req.body.cost,
          date: req.body.date,
          status,
          notes: req.body.notes,
        },
      });

      if (status === 'ACTIVE') {
        await tx.vehicle.update({
          where: { id: vehicleId },
          data: { status: 'IN_SHOP' },
        });
      }

      return created;
    });

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateMaintenance = async (req, res) => {
  const vehicleId = parseId(req.params.vehicleId);
  const id = parseId(req.params.id);
  if (vehicleId === null || id === null) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const existing = await prisma.maintenanceLog.findFirst({
      where: { id, vehicleId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Maintenance log not found" });
    }

    const log = await prisma.$transaction(async (tx) => {
      const updated = await tx.maintenanceLog.update({
        where: { id },
        data: req.body,
      });

      if (req.body.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
        await tx.vehicle.update({
          where: { id: vehicleId },
          data: { status: 'AVAILABLE' },
        });
      } else if (req.body.status === 'ACTIVE' && existing.status !== 'ACTIVE') {
        await tx.vehicle.update({
          where: { id: vehicleId },
          data: { status: 'IN_SHOP' },
        });
      }

      return updated;
    });

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteMaintenance = async (req, res) => {
  const vehicleId = parseId(req.params.vehicleId);
  const id = parseId(req.params.id);
  if (vehicleId === null || id === null) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const existing = await prisma.maintenanceLog.findFirst({
      where: { id, vehicleId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Maintenance log not found" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.maintenanceLog.delete({ where: { id } });

      if (existing.status === 'ACTIVE') {
        const otherActive = await tx.maintenanceLog.count({
          where: { vehicleId, status: 'ACTIVE' },
        });

        if (otherActive === 0) {
          await tx.vehicle.update({
            where: { id: vehicleId },
            data: { status: 'AVAILABLE' },
          });
        }
      }
    });

    res.json({ message: "Maintenance log deleted" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  listMaintenance,
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
