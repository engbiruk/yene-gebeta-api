// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var image	= require('../controllers/image');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

// POST /images
router.post('/:imageId', image.noop);

// DELETE /images/:imageId
router.delete('/:imageId', image.noop);

// GET /images/:imageId
router.get('/:imageId', image.noop);

// PUT /images/:imageId
router.put('/:imageId', image.noop);

// GET /images/all
router.get('/all', image.noop);

module.exports = router;