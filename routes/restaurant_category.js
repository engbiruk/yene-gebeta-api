// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var restaurant_category			= require('../controllers/restaurant_category');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

// POST /restaurant_categoryes
router.post('/:restaurant_categoryId', restaurant_category.noop);

// DELETE /restaurant_categoryes/:restaurant_categoryId
router.delete('/:restaurant_categoryId', restaurant_category.noop);

// GET /restaurant_categoryes/:restaurant_categoryId
router.get('/:restaurant_categoryId', restaurant_category.noop);

// PUT /restaurant_categoryes/:restaurant_categoryId
router.put('/:restaurant_categoryId', restaurant_category.noop);

// GET /restaurant_categoryes/all
router.get('/all', restaurant_category.noop);

module.exports = router;