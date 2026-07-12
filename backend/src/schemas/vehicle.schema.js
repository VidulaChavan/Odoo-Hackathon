const { z } = require('zod');

const vehicleTypeEnum = z.enum(['VAN', 'TRUCK', 'MINI']);
const vehicleStatusEnum = z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']);

const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1, { message: "Registration number is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  type: vehicleTypeEnum,
  maxLoadCapacity: z.number().positive({ message: "Max load capacity must be positive" }),
  odometer: z.number().min(0, { message: "Odometer cannot be negative" }),
  acquisitionCost: z.number().min(0, { message: "Acquisition cost cannot be negative" }),
  status: vehicleStatusEnum.optional(),
});

const updateVehicleSchema = createVehicleSchema.partial();

module.exports = { createVehicleSchema, updateVehicleSchema };
