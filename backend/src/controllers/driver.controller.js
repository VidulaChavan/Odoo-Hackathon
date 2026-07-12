const driverService = require("../services/driver.service");
const { driverSchema } = require("../schemas/driver.schema");

async function createDriver(req, res) {
  try {
    const data = driverSchema.parse(req.body);
    const driver = await driverService.createDriver(data);
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getAllDrivers(req, res) {
  try {
    const drivers = await driverService.getAllDrivers();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getDriverById(req, res) {
  try {
    const driver = await driverService.getDriverById(req.params.id);

    if (!driver)
      return res.status(404).json({ message: "Driver not found" });

    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateDriver(req, res) {
  try {
    const driver = await driverService.updateDriver(
      req.params.id,
      req.body
    );

    res.json(driver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deleteDriver(req, res) {
  try {
    await driverService.deleteDriver(req.params.id);

    res.json({
      message: "Driver deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};