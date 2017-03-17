// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:place_feature-controller');
var validator = require('express-validator');
var mongoose = require('mongoose');

// LOAD MODEL'S DAL
var Place_featureDal = require('../dal/place_feature');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

// create a place_feature
exports.createPlaceFeature = function createPlaceFeature(req, res, next) {
    debug('Create a place feature');

    var workflow = new events.EventEmitter();

    // check if the name field is valid
    workflow.on('validatePlaceFeature', function validation() {
        debug('Validate place feature');

        req.checkBody('name', 'Name Should not be Empty!').notEmpty();
        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            workflow.emit('checkIfPlaceFeatureExists');
        }
    });
    // check if the feature name exists before
    workflow.on('checkIfPlaceFeatureExists', function checkIfPlaceFeatureExists() {
        debug('Validate if place feature exists');

        // get the place feature from the db with a name passed
        Place_featureDal.get({
            name: req.body.name
        }, function (err, place_feature) {
            if (err) return next(err);
            // check if the place feature exists
            if (place_feature._id) {
                // return error
                res.status(400).json({
                    error: true,
                    message: 'The Place feature already registered with the same name!'
                });
            } else {
                // got to the next workflow
                workflow.emit('createPlaceFeature');
            }
        });
    });

    // create a place feature
    workflow.on('createPlaceFeature', function createPlaceFeature() {
        debug('create Place Feature');

        Place_featureDal.create({
            name: req.body.name,
            description: req.body.description || ''
        }, function cb(err, place_feature) {
            if (err) return next(err);

            // trigger the next workflow
            workflow.emit('respond', place_feature);
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_feature) {
        debug('respond');
        // omit the unecessary fields
        place_feature.omitFields([], function (err, _place_feature) {
            res.status(201).json(_place_feature);
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceFeature');
};

// delete place_feature
exports.deletePlaceFeature = function deletePlaceFeature(req, res, next) {
    debug('Delete a place feature');

    var workflow = new events.EventEmitter();

    // check if the place_feature ID field is valid
    workflow.on('validatePlaceFeature', function validation() {
        debug('Validate place feature');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.place_featureId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct place_featureId!'
            });
            return;
        } else {
            workflow.emit('deletePlaceFeature');
        }
    });

    // delete a place feature
    workflow.on('deletePlaceFeature', function createPlaceFeature() {
        debug('delete Place Feature');

        Place_featureDal.delete({
            _id: req.params.place_featureId
        }, function cb(err, place_feature) {
            if (err) return next(err);
            // check if the feature exists or not
            if (!place_feature._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Place_feature has been registered to delete!'
                });
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_feature);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_feature) {
        debug('respond');
        // omit the unecessary fields

        place_feature.omitFields([], function (err, _place_feature) {
            res.status(200).json({
                message: 'Place_feature is successfuly Deleted!',
                data: _place_feature
            });
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceFeature');
};

// get a place_feature
exports.getPlaceFeature = function getPlaceFeature(req, res, next) {
    debug('get a place feature');

    var workflow = new events.EventEmitter();

    // check if the place_feature ID field is valid
    workflow.on('validatePlaceFeature', function validation() {
        debug('Validate place feature');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.place_featureId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct place_featureId!'
            });
            return;
        } else {
            workflow.emit('getPlaceFeature');
        }
    });

    // get a place feature
    workflow.on('getPlaceFeature', function createPlaceFeature() {
        debug('get Place Feature');

        Place_featureDal.get({
            _id: req.params.place_featureId
        }, function cb(err, place_feature) {
            if (err) return next(err);
            // check if the feature exists or not
            if (!place_feature._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Place_feature has been registered with this ID!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_feature);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_feature) {
        debug('respond');
        // omit the unecessary fields

        place_feature.omitFields([], function (err, _place_feature) {
            res.status(200).json(_place_feature);
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceFeature');
};

// update a place_feature
exports.updatePlaceFeature = function updatePlaceFeature(req, res, next) {
    debug('update a place feature');

    var workflow = new events.EventEmitter();

    // check if the place_feature ID field is valid
    workflow.on('validatePlaceFeature', function validation() {
        debug('Validate place feature');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.place_featureId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct place_featureId!'
            });
            return;
        } else {
            workflow.emit('updatePlaceFeature');
        }
    });

    // update a place feature
    workflow.on('updatePlaceFeature', function createPlaceFeature() {
        debug('update Place Feature');

        Place_featureDal.update({
            _id: req.params.place_featureId
        }, {
            description: req.body.description
        }, function cb(err, place_feature) {
            if (err) return next(err);
            // check if the feature exists or not
            if (!place_feature._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Place_feature has been registered with this ID! to update.'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_feature);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_feature) {
        debug('respond');
        // omit the unecessary fields

        place_feature.omitFields([], function (err, _place_feature) {
            res.status(200).json(_place_feature);
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceFeature');
};

// get all place_feature
exports.getAllPlaceFeatures = function getAllPlaceFeatures(req, res, next) {
    debug('get a place feature');

    var workflow = new events.EventEmitter();

    // get a place feature
    workflow.on('getPlaceFeatures', function createPlaceFeature() {
        debug('get Place Features');

        Place_featureDal.getCollection({}, function cb(err, place_features) {
            if (err) return next(err);
            // check if the feature exists or not
            if (!Array.isArray(place_features)) {
                res.status(404).json({
                    error: true,
                    message: 'NO Place_features Found!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_features);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_features) {
        debug('respond');
        _place_features = [];
        // omit the unecessary fields
        place_features.forEach(function (place_feature) {
            place_feature.omitFields([], function (err, _place_feature) {
                _place_features.push(_place_feature);
            });
        });
        res.status(200).json(_place_features);
    });

    // trigger the workflow
    workflow.emit('getPlaceFeatures');
};