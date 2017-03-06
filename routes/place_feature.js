// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var place_feature	= require('../controllers/place_feature');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

// POST /place_features
router.post('/:place_featureId', place_feature.noop);

// DELETE /place_features/:place_featureId
router.delete('/:place_featureId', place_feature.noop);

// GET /place_features/:place_featureId
router.get('/:place_featureId', place_feature.noop);

// PUT /place_features/:place_featureId
router.put('/:place_featureId', place_feature.noop);

// GET /place_features/all
router.get('/all', place_feature.noop);

module.exports = router;