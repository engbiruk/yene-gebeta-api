// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var destination	= require('../controllers/destination');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

// POST /destinations
router.post('/:destinationId', destination.noop);

// DELETE /destinations/:destinationId
router.delete('/:destinationId', destination.noop);

// GET /destinations/:destinationId
router.get('/:destinationId', destination.noop);

// PUT /destinations/:destinationId
router.put('/:destinationId', destination.noop);

// GET /destinations/all
router.get('/all', destination.noop);

module.exports = router;