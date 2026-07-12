const { z } = require("zod");

const expenseSchema = z.object({
  vehicleId: z.number().int().positive(),
  type: z.enum(["TOLL", "MISC"]),
  amount: z.number().positive(),
  date: z.string().datetime(),
});

module.exports = { expenseSchema };