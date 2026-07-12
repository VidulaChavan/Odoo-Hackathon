const prisma = require('../lib/prisma');

const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(trips);
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
    const tripRef = `TRP-${Math.floor(Math.random() * 9000 + 1000)}`;
    const trip = await prisma.trip.create({
      data: {
        tripRef,
        sourceDepot,
        destinationHub,
        vehicleId,
        vehicleType,
        driverName,
        status: 'Active',
      },
    });
    res.status(201).json(trip);
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

  try {
    const trip = await prisma.trip.update({
      where: { tripRef },
      data: { status },
    });
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to update trip status' });
  }
};

const deleteTrip = async (req, res) => {
  const { tripRef } = req.params;
  try {
    await prisma.trip.delete({ where: { tripRef } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to delete trip' });
  }
};

module.exports = { getTrips, createTrip, updateTripStatus, deleteTrip };