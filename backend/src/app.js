const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const driverRoutes = require("./routes/driver.routes");
const fuelRoutes = require("./routes/fuel.routes");
const expenseRoutes = require("./routes/expense.routes");
const vehicleRoutes = require('./routes/vehicle.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const reportRoutes = require("./routes/report.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/auth', authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/expenses", expenseRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vehicles/:vehicleId/maintenance', maintenanceRoutes);
app.use("/api/reports", reportRoutes);
module.exports = app;