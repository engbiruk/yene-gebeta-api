// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:place_cuisine-controller');
var validator = require('express-validator');
var mongoose = require('mongoose');

// LOAD MODEL'S DAL
var Place_cuisineDal = require('../dal/place_cuisine');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

// create a place_cuisine
exports.createPlaceCuisine = function createPlaceCuisine(req, res, next) {
    debug('Create a place cuisine');

    var workflow = new events.EventEmitter();

    // check if the name field is valid
    workflow.on('validatePlaceCuisine', function validation() {
        debug('Validate place cuisine');

        req.checkBody('name', 'Name Should not be Empty!').notEmpty();
        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            workflow.emit('checkIfPlaceCuisineExists');
        }
    });
    // check if the cuisine name exists before
    workflow.on('checkIfPlaceCuisineExists', function checkIfPlaceCuisineExists() {
        debug('Validate if place cuisine exists');

        // get the place cuisine from the db with a name passed
        Place_cuisineDal.get({
            name: req.body.name
        }, function (err, place_cuisine) {
            if (err) return next(err);
            // check if the place cuisine exists
            if (place_cuisine._id) {
                // return error
                res.status(400).json({
                    error: true,
                    message: 'The Place cuisine already registered with the same name!'
                });
            } else {
                // got to the next workflow
                workflow.emit('createPlaceCuisine');
            }
        });
    });

    // create a place cuisine
    workflow.on('createPlaceCuisine', function createPlaceCuisine() {
        debug('create Place Category');

        Place_cuisineDal.create({
            name: req.body.name,
            description: req.body.description || ''
        }, function cb(err, place_cuisine) {
            if (err) return next(err);

            // trigger the next workflow
            workflow.emit('respond', place_cuisine);
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_cuisine) {
        debug('respond');
        // omit the unecessary fields
        place_cuisine.omitFields([], function (err, _place_cuisine) {
            res.status(201).json(_place_cuisine);
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceCuisine');
};

// delete place_cuisine
exports.deletePlaceCuisine = function deletePlaceCuisine(req, res, next) {
    debug('Delete a place cuisine');

    var workflow = new events.EventEmitter();

    // check if the place_cuisine ID field is valid
    workflow.on('validatePlaceCuisine', function validation() {
        debug('Validate place cuisine');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.place_cuisineId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct place_cuisineId!'
            });
            return;
        } else {
            workflow.emit('deletePlaceCuisine');
        }
    });

    // delete a place cuisine
    workflow.on('deletePlaceCuisine', function createPlaceCuisine() {
        debug('delete Place Category');

        Place_cuisineDal.delete({
            _id: req.params.place_cuisineId
        }, function cb(err, place_cuisine) {
            if (err) return next(err);
            // check if the cuisine exists or not
            if (!place_cuisine._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Place_cuisine has been registered to delete!'
                });
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_cuisine);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_cuisine) {
        debug('respond');
        // omit the unecessary fields

        place_cuisine.omitFields([], function (err, _place_cuisine) {
            res.status(200).json({
                message: 'Place_cuisine is successfuly Deleted!',
                data: _place_cuisine
            });
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceCuisine');
};

// get a place_cuisine
exports.getPlaceCuisine = function getPlaceCuisine(req, res, next) {
    debug('get a place cuisine');

    var workflow = new events.EventEmitter();

    // check if the place_cuisine ID field is valid
    workflow.on('validatePlaceCuisine', function validation() {
        debug('Validate place cuisine');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.place_cuisineId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct place_cuisineId!'
            });
            return;
        } else {
            workflow.emit('getPlaceCuisine');
        }
    });

    // get a place cuisine
    workflow.on('getPlaceCuisine', function createPlaceCuisine() {
        debug('get Place Category');

        Place_cuisineDal.get({
            _id: req.params.place_cuisineId
        }, function cb(err, place_cuisine) {
            if (err) return next(err);
            // check if the cuisine exists or not
            if (!place_cuisine._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Place_cuisine has been registered with this ID!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_cuisine);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_cuisine) {
        debug('respond');
        // omit the unecessary fields

        place_cuisine.omitFields([], function (err, _place_cuisine) {
            res.status(200).json(_place_cuisine);
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceCuisine');
};

// update a place_cuisine
exports.updatePlaceCuisine = function updatePlaceCuisine(req, res, next) {
    debug('update a place cuisine');

    var workflow = new events.EventEmitter();

    // check if the place_cuisine ID field is valid
    workflow.on('validatePlaceCuisine', function validation() {
        debug('Validate place cuisine');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.place_cuisineId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct place_cuisineId!'
            });
            return;
        } else {
            workflow.emit('updatePlaceCuisine');
        }
    });

    // update a place cuisine
    workflow.on('updatePlaceCuisine', function createPlaceCuisine() {
        debug('update Place Category');

        Place_cuisineDal.update({
            _id: req.params.place_cuisineId
        }, {
            description: req.body.description
        }, function cb(err, place_cuisine) {
            if (err) return next(err);
            // check if the cuisine exists or not
            if (!place_cuisine._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Place_cuisine has been registered with this ID! to update.'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_cuisine);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_cuisine) {
        debug('respond');
        // omit the unecessary fields

        place_cuisine.omitFields([], function (err, _place_cuisine) {
            res.status(200).json(_place_cuisine);
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceCuisine');
};

// get all place_cuisine
exports.getAllPlaceCuisines = function getAllPlaceCuisines(req, res, next) {
    debug('get a place cuisine');

    var workflow = new events.EventEmitter();

    // get a place cuisine
    workflow.on('getPlaceCuisines', function createPlaceCuisine() {
        debug('get Place Cuisines');

        Place_cuisineDal.getCollection({}, function cb(err, place_cuisines) {
            if (err) return next(err);
            // check if the cuisine exists or not
            if (!Array.isArray(place_cuisines)) {
                res.status(404).json({
                    error: true,
                    message: 'NO Place_cuisines Found!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_cuisines);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_cuisines) {
        debug('respond');
        _place_cuisines = [];
        // omit the unecessary fields
        place_cuisines.forEach(function (place_cuisine) {
            place_cuisine.omitFields([], function (err, _place_cuisine) {
                _place_cuisines.push(_place_cuisine);
            });
        });
        res.status(200).json(_place_cuisines);
    });

    // trigger the workflow
    workflow.emit('getPlaceCuisines');
};