const express = require('express');
const router = express.Router();
const { getTrips, createTrip, updateTripStatus, deleteTrip } = require('../controllers/trip.controller');

router.get('/', getTrips);
router.post('/', createTrip);
router.patch('/:tripRef/status', updateTripStatus);
router.delete('/:tripRef', deleteTrip);

module.exports = router; 