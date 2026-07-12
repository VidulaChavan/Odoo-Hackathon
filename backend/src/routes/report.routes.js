const express = require("express");

const router = express.Router();

const reportController = require("../controllers/report.controller");

router.get(
  "/operational-cost/:vehicleId",
  reportController.operationalCost
);

router.get(
  "/fuel-efficiency/:vehicleId",
  reportController.fuelEfficiency
);

router.get(
  "/fleet-utilization",
  reportController.fleetUtilization
);

router.get(
  "/vehicle-roi/:vehicleId",
  reportController.vehicleROI
);

module.exports = router;