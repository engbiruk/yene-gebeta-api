// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var place_cuisine			= require('../controllers/place_cuisine');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

// POST /place_categories
router.post('/:place_cuisineId', place_cuisine.noop);

// DELETE /place_categories/:place_cuisineId
router.delete('/:place_cuisineId', place_cuisine.noop);

// GET /place_categories/:place_cuisineId
router.get('/:place_cuisineId', place_cuisine.noop);

// PUT /place_categories/:place_cuisineId
router.put('/:place_cuisineId', place_cuisine.noop);

// GET /place_categories/all
router.get('/all', place_cuisine.noop);

module.exports = router;