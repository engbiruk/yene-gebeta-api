// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var menu			= require('../controllers/menu');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

// POST /menues
router.create('/:menuId', menu.noop);

// DELETE /menues/:menuId
router.delete('/:menuId', menu.noop);

// GET /menues/:menuId
router.get('/:menuId', menu.noop);

// PUT /menues/:menuId
router.put('/:menuId', menu.noop);

// GET /menues/all
router.get('/all', menu.noop);

module.exports = router;