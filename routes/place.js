// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var place		= require('../controllers/place');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

// POST /places
router.post('/', place.createPlace);

// DELETE /places/:placeId
router.delete('/:placeId', place.noop);

// GET /places/:placeId
router.get('/:placeId', place.getPlace);

// PUT /places/:placeId
router.put('/:placeId', place.noop);

// GET /places/all
router.get('/all', place.noop);

module.exports = router;