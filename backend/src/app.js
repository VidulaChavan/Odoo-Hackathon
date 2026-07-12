const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const driverRoutes = require("./routes/driver.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/auth', authRoutes);
app.use("/api/drivers", driverRoutes);

module.exports = app;