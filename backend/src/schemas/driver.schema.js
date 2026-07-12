const { z } = require("zod");

const driverSchema = z.object({
  name: z.string().min(2),
  licenseNumber: z.string().min(3),
  licenseCategory: z.string(),
  licenseExpiry: z.string().datetime(),
  contactNumber: z.string().min(10),
  safetyScore: z.number().min(0).max(100).optional(),
  status: z.enum([
    "AVAILABLE",
    "ON_TRIP",
    "OFF_DUTY",
    "SUSPENDED",
  ]).optional(),
});

module.exports = { driverSchema };