// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var restaurant		= require('../controllers/restaurant');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

// POST /restaurantes
router.post('/:restaurantId', restaurant.noop);

// DELETE /restaurantes/:restaurantId
router.delete('/:restaurantId', restaurant.noop);

// GET /restaurantes/:restaurantId
router.get('/:restaurantId', restaurant.noop);

// PUT /restaurantes/:restaurantId
router.put('/:restaurantId', restaurant.noop);

// GET /restaurantes/all
router.get('/all', restaurant.noop);

module.exports = router;