const express = require("express");

const router = express.Router();

const fuelController = require("../controllers/fuel.controller");

router.post("/", fuelController.createFuelLog);

router.get("/", fuelController.getAllFuelLogs);

router.get("/:id", fuelController.getFuelLogById);

router.put("/:id", fuelController.updateFuelLog);

router.delete("/:id", fuelController.deleteFuelLog);

module.exports = router;