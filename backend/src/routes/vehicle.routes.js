const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createVehicleSchema, updateVehicleSchema } = require('../schemas/vehicle.schema');
const {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicle.controller');

router.use(authMiddleware);

router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.post('/', validate(createVehicleSchema), createVehicle);
router.patch('/:id', validate(updateVehicleSchema), updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
