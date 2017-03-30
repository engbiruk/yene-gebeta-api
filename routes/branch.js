// LOAD MODULE DEPENDECIES
var express = require('express');

// LOAD CONTROLLERS
var branch = require('../controllers/branch');
var auth = require('../controllers/auth');
var authorize = require('../lib/authorize');
//var authenticate = require('./lib/authenticate');

// CREATE A ROUTER
var router = express.Router();

// POST /branches
router.post('/:branchId', branch.noop);

// DELETE /branches/:branchId
router.delete('/:branchId', branch.noop);

// GET /branches/:branchId
router.get('/:branchId', branch.noop);

// PUT /branches/:branchId
router.put('/:branchId', branch.noop);

// GET /branches/all
router.get('/all', branch.noop);

module.exports = router;