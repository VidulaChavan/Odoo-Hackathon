const fuelService = require("../services/fuel.service");
const { fuelSchema } = require("../schemas/fuel.schema");

async function createFuelLog(req, res) {
  try {
    const data = fuelSchema.parse(req.body);

    const fuel = await fuelService.createFuelLog(data);

    res.status(201).json(fuel);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}

async function getAllFuelLogs(req, res) {
  try {
    const fuelLogs = await fuelService.getAllFuelLogs();

    res.json(fuelLogs);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function getFuelLogById(req, res) {
  try {
    const fuel = await fuelService.getFuelLogById(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        message: "Fuel log not found",
      });
    }

    res.json(fuel);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function updateFuelLog(req, res) {
  try {
    const fuel = await fuelService.updateFuelLog(
      req.params.id,
      req.body
    );

    res.json(fuel);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}

async function deleteFuelLog(req, res) {
  try {
    await fuelService.deleteFuelLog(req.params.id);

    res.json({
      message: "Fuel log deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}

module.exports = {
  createFuelLog,
  getAllFuelLogs,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog,
};