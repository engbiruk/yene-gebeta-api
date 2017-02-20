// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var menu_category			= require('../controllers/menu_category');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

// POST /menu_categoryes
router.post('/:menu_categoryId', menu_category.noop);

// DELETE /menu_categoryes/:menu_categoryId
router.delete('/:menu_categoryId', menu_category.noop);

// GET /menu_categoryes/:menu_categoryId
router.get('/:menu_categoryId', menu_category.noop);

// PUT /menu_categoryes/:menu_categoryId
router.put('/:menu_categoryId', menu_category.noop);

// GET /menu_categoryes/all
router.get('/all', menu_category.noop);

module.exports = router;