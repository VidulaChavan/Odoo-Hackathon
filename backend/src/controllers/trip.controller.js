const prisma = require('../lib/prisma');

const uiToDbStatus = {
  Active: 'DISPATCHED',
  Pending: 'DRAFT',
  Completed: 'COMPLETED',
  Cancelled: 'CANCELLED',
};

const dbToUiStatus = {
  DRAFT: 'Pending',
  DISPATCHED: 'Active',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const vehicleTypeMap = {
  'Heavy Cargo Truck': 'TRUCK',
  'Electric Semi': 'TRUCK',
  'Express Van': 'VAN',
  'Refrigerated Carrier': 'TRUCK',
};

const formatTripResponse = (trip) => ({
  tripRef: `TRP-${trip.id}`,
  sourceDepot: trip.source,
  destinationHub: trip.destination,
  vehicleId: trip.vehicle?.registrationNumber || trip.vehicleId,
  driverName: trip.driver?.name || '',
  status: dbToUiStatus[trip.status] || 'Pending',
  startAt: trip.createdAt,
});

const parseTripRef = (tripRef) => {
  const match = /^TRP-(\d+)$/i.exec(tripRef);
  return match ? Number(match[1]) : null;
};

const findOrCreateVehicle = async (registrationNumber, vehicleType) => {
  let vehicle = await prisma.vehicle.findUnique({ where: { registrationNumber } });
  if (!vehicle) {
    vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber,
        name: registrationNumber,
        type: vehicleTypeMap[vehicleType] || 'TRUCK',
        maxLoadCapacity: 10000,
        odometer: 0,
        acquisitionCost: 0,
      },
    });
  }
  return vehicle;
};

const findOrCreateDriver = async (driverName) => {
  let driver = await prisma.driver.findFirst({ where: { name: driverName } });
  if (!driver) {
    const uniqueSuffix = Date.now().toString().slice(-4);
    driver = await prisma.driver.create({
      data: {
        name: driverName,
        licenseNumber: `DL-${uniqueSuffix}`,
        licenseCategory: 'C',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        contactNumber: '0000000000',
      },
    });
  }
  return driver;
};

const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
      include: { vehicle: true, driver: true },
    });
    res.json(trips.map(formatTripResponse));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to load trips' });
  }
};

const createTrip = async (req, res) => {
  const { sourceDepot, destinationHub, vehicleId, vehicleType, driverName } = req.body;

  if (!sourceDepot || !destinationHub || !vehicleId || !vehicleType || !driverName) {
    return res.status(400).json({ error: 'Missing required trip details' });
  }

  try {
    const vehicle = await findOrCreateVehicle(vehicleId, vehicleType);
    const driver = await findOrCreateDriver(driverName);

    const trip = await prisma.trip.create({
      data: {
        source: sourceDepot,
        destination: destinationHub,
        vehicleId: vehicle.id,
        driverId: driver.id,
        cargoWeight: 0,
        plannedDistance: 0,
        status: uiToDbStatus.Active,
      },
      include: { vehicle: true, driver: true },
    });

    res.status(201).json(formatTripResponse(trip));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create trip' });
  }
};

const updateTripStatus = async (req, res) => {
  const { tripRef } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const id = parseTripRef(tripRef);
  if (!id) {
    return res.status(400).json({ error: 'Invalid trip reference' });
  }

  const dbStatus = uiToDbStatus[status];
  if (!dbStatus) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const trip = await prisma.trip.update({
      where: { id },
      data: { status: dbStatus },
      include: { vehicle: true, driver: true },
    });
    res.json(formatTripResponse(trip));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to update trip status' });
  }
};

const deleteTrip = async (req, res) => {
  const { tripRef } = req.params;
  const id = parseTripRef(tripRef);
  if (!id) {
    return res.status(400).json({ error: 'Invalid trip reference' });
  }

  try {
    await prisma.trip.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to delete trip' });
  }
};

module.exports = { getTrips, createTrip, updateTripStatus, deleteTrip };