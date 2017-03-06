// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var place_category			= require('../controllers/place_category');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

// POST /place_categories
router.post('/:place_categoryId', place_category.noop);

// DELETE /place_categories/:place_categoryId
router.delete('/:place_categoryId', place_category.noop);

// GET /place_categories/:place_categoryId
router.get('/:place_categoryId', place_category.noop);

// PUT /place_categories/:place_categoryId
router.put('/:place_categoryId', place_category.noop);

// GET /place_categories/all
router.get('/all', place_category.noop);

module.exports = router;