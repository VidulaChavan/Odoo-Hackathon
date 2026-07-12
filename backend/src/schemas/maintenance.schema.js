const { z } = require('zod');

const maintenanceStatusEnum = z.enum(['ACTIVE', 'COMPLETED']);

const createMaintenanceSchema = z.object({
  serviceType: z.string().min(1, { message: "Service type is required" }),
  cost: z.number().min(0, { message: "Cost cannot be negative" }),
  date: z.coerce.date({ message: "A valid date is required" }),
  status: maintenanceStatusEnum.optional(),
  notes: z.string().optional(),
});

const updateMaintenanceSchema = createMaintenanceSchema.partial();

module.exports = { createMaintenanceSchema, updateMaintenanceSchema };
