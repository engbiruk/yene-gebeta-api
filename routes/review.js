// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var review			= require('../controllers/review');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');
//var authenticate = require('./lib/authenticate');

// CREATE A ROUTER
var router = express.Router();

// POST /reviewes
router.post('/:reviewId', review.noop);

// DELETE /reviewes/:reviewId
router.delete('/:reviewId', review.noop);

// GET /reviewes/:reviewId
router.get('/:reviewId', review.noop);

// PUT /reviewes/:reviewId
router.put('/:reviewId', review.noop);

// GET /reviewes/all
router.get('/all', review.noop);

module.exports = router;