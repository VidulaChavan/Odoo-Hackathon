const prisma = require("../lib/prisma");

async function createDriver(data) {
  const existing = await prisma.driver.findUnique({
    where: { licenseNumber: data.licenseNumber },
  });

  if (existing) throw new Error("License number already exists");

  return prisma.driver.create({
    data: {
      ...data,
      licenseExpiry: new Date(data.licenseExpiry),
    },
  });
}

async function getAllDrivers() {
  return prisma.driver.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getDriverById(id) {
  return prisma.driver.findUnique({
    where: {
      id: Number(id),
    },
  });
}

async function updateDriver(id, data) {
  return prisma.driver.update({
    where: {
      id: Number(id),
    },
    data: {
      ...data,
      ...(data.licenseExpiry && {
        licenseExpiry: new Date(data.licenseExpiry),
      }),
    },
  });
}

async function deleteDriver(id) {
  return prisma.driver.delete({
    where: {
      id: Number(id),
    },
  });
}

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};