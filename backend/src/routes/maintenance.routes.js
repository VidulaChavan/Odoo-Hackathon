const express = require('express');
const router = express.Router({ mergeParams: true });
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createMaintenanceSchema, updateMaintenanceSchema } = require('../schemas/maintenance.schema');
const {
  listMaintenance,
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenance.controller');

router.use(authMiddleware);

router.get('/', listMaintenance);
router.post('/', validate(createMaintenanceSchema), createMaintenance);
router.get('/:id', getMaintenance);
router.patch('/:id', validate(updateMaintenanceSchema), updateMaintenance);
router.delete('/:id', deleteMaintenance);

module.exports = router;
