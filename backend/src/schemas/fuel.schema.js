const { z } = require("zod");

const fuelSchema = z.object({
  vehicleId: z.number().int().positive(),
  liters: z.number().positive(),
  cost: z.number().positive(),
  date: z.string().datetime(),
});

module.exports = { fuelSchema };