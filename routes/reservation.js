// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var reservation			= require('../controllers/reservation');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

// POST /reservationes
router.create('/:reservationId', reservation.noop);

// DELETE /reservationes/:reservationId
router.delete('/:reservationId', reservation.noop);

// GET /reservationes/:reservationId
router.get('/:reservationId', reservation.noop);

// PUT /reservationes/:reservationId
router.put('/:reservationId', reservation.noop);

// GET /reservationes/all
router.get('/all', reservation.noop);

module.exports = router;