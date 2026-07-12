const prisma = require("../lib/prisma");

async function createFuelLog(data) {
  return prisma.fuelLog.create({
    data: {
      ...data,
      date: new Date(data.date),
    },
  });
}

async function getAllFuelLogs() {
  return prisma.fuelLog.findMany({
    include: {
      vehicle: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

async function getFuelLogById(id) {
  return prisma.fuelLog.findUnique({
    where: { id: Number(id) },
  });
}

async function updateFuelLog(id, data) {
  return prisma.fuelLog.update({
    where: { id: Number(id) },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
    },
  });
}

async function deleteFuelLog(id) {
  return prisma.fuelLog.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  createFuelLog,
  getAllFuelLogs,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog,
};