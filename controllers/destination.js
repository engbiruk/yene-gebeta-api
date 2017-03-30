// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:destination-controller');
var validator = require('express-validator');
var mongoose = require('mongoose');

// LOAD MODEL'S DAL
var DestinationDal = require('../dal/destination');
var PlaceDal = require('../dal/place');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

// create a destination
exports.createDestination = function createDestination(req, res, next) {
    debug('Create a destination');

    var workflow = new events.EventEmitter();

    // check if the title field is valid
    workflow.on('validateDestination', function validation() {
        debug('Validate destination');

        req.checkBody('title', 'Title Should not be Empty!').notEmpty();
        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            workflow.emit('checkIfDestinationExists');
        }
    });
    // check if the destination title exists before
    workflow.on('checkIfDestinationExists', function checkIfDestinationExists() {
        debug('Validate if destination exists');

        // get the destination from the db with a title passed
        DestinationDal.get({
            title: req.body.title
        }, function(err, destination) {
            if (err) return next(err);
            console.log(destination);
            // check if the destination exists
            if (destination._id) {
                // return error
                res.status(400).json({
                    error: true,
                    message: 'The destination already registered with the same title!'
                });
            } else {
                // got to the next workflow
                workflow.emit('createDestination');
            }
        });
    });

    // create a destination
    workflow.on('createDestination', function createDestination() {
        debug('create Destination');

        DestinationDal.create({
            title: req.body.title,
            description: req.body.description || '',
            location_range: req.body.location_range || []
        }, function cb(err, destination) {
            if (err) return next(err);

            // trigger the next workflow
            workflow.emit('respond', destination);
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(destination) {
        debug('respond');
        // omit the unecessary fields
        destination.omitFields([], function(err, _destination) {
            res.status(201).json(_destination);
        });
    });

    // trigger the workflow
    workflow.emit('validateDestination');
};

// delete destination
exports.deleteDestination = function deleteDestination(req, res, next) {
    debug('Delete a destination');

    var workflow = new events.EventEmitter();

    // check if the destination ID field is valid
    workflow.on('validateDestination', function validation() {
        debug('Validate destination');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.destinationId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct destinationId!'
            });
            return;
        } else {
            workflow.emit('deleteDestination');
        }
    });

    // delete a destination
    workflow.on('deleteDestination', function createDestination() {
        debug('delete Destination');

        DestinationDal.delete({
            _id: req.params.destinationId
        }, function cb(err, destination) {
            if (err) return next(err);
            // check if the destination exists or not
            if (!destination._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Destination has been registered to delete!'
                });
            } else {
                // trigger the next workflow
                workflow.emit('respond', destination);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(destination) {
        debug('respond');
        // omit the unecessary fields

        destination.omitFields([], function(err, _destination) {
            res.status(200).json({
                message: 'Destination is successfuly Deleted!',
                data: _destination
            });
        });
    });

    // trigger the workflow
    workflow.emit('validateDestination');
};

// get a destination
exports.getDestination = function getDestination(req, res, next) {
    debug('get a destination');

    var workflow = new events.EventEmitter();

    // check if the destination ID field is valid
    workflow.on('validateDestination', function validation() {
        debug('Validate destination');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.destinationId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct destinationId!'
            });
            return;
        } else {
            workflow.emit('getDestination');
        }
    });

    // get a destination
    workflow.on('getDestination', function createDestination() {
        debug('get Destination');

        DestinationDal.get({
            _id: req.params.destinationId
        }, function cb(err, destination) {
            if (err) return next(err);
            // check if the destination exists or not
            if (!destination._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Destination has been registered with this ID!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', destination);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(destination) {
        debug('respond');
        // omit the unecessary fields

        destination.omitFields([], function(err, _destination) {
            res.status(200).json(_destination);
        });
    });

    // trigger the workflow
    workflow.emit('validateDestination');
};

// update a destination
exports.updateDestination = function updateDestination(req, res, next) {
    debug('update a destination');

    var workflow = new events.EventEmitter();

    // check if the destination ID field is valid
    workflow.on('validateDestinationId', function validation() {
        debug('Validate destination');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.destinationId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct destinationId!'
            });
            return;
        } else {
            DestinationDal.get({ _id: req.params.destinationId }, function(err, destination) {
                if (err) return next(err);

                if (!destination._id) {
                    res.status(400).json({
                        error: true,
                        message: 'NO Destination has been registered with this ID! to update.'
                    });
                    return;
                } else {
                    workflow.emit('validateDestination', destination);
                }
            });
        }
    });

    workflow.on('validateDestination', function validation(destination) {
        debug('Validate destination');

        if (req.body.place && Array.isArray(req.body.place)) {
            res.status(400).json({ "message": "Place should not be Array" });
            return;
            // }
            // req.checkBody('title', 'Title Should not be Empty!').notEmpty();
            // if (req.validationErrors()) {
            //     res.status(400).json(req.validationErrors());
            //     return;
        } else {
            workflow.emit('updateDestination', destination);
        }
    });

    // update a destination
    workflow.on('updateDestination', function updateDestination(destination) {
        debug('update Destination');
        // add push if defined in the body
        var _place = null;
        if (req.body.place) {
            console.log(destination.place);

            var itExists = destination.place.filter(function(value) {
                console.log(value._id);
                return value._id == req.body.place;
            });
            if (itExists.length === 0) {
                console.log(itExists, _place, req.body.place);
                _place = req.body.place;
            } else {
                console.log(itExists, _place, req.body.place);
                res.status(400).json({
                    error: true,
                    message: 'The place is already added on the destination!'
                });
                return;
            }
        }
        if (_place) {
            DestinationDal.update({
                _id: req.params.destinationId
            }, {
                description: req.body.description ? req.body.description : destination.description,
                location_range: req.body.location_range ? req.body.location_range : destination.location_range,
                $push: { "place": _place }
            }, function cb(err, destination) {
                if (err) return next(err);
                // check if the destination exists or not
                if (!destination._id) {
                    res.status(400).json({
                        error: true,
                        message: 'NO Destination has been registered with this ID! to update.'
                    });
                    return;
                } else {
                    // trigger the next workflow
                    workflow.emit('respond', destination);
                }
            });
        } else {
            DestinationDal.update({
                _id: req.params.destinationId
            }, {
                description: req.body.description ? req.body.description : destination.description,
                location_range: req.body.location_range ? req.body.location_range : destination.location_range
            }, function cb(err, destination) {
                if (err) return next(err);
                // check if the destination exists or not
                if (!destination._id) {
                    res.status(400).json({
                        error: true,
                        message: 'NO Destination has been registered with this ID! to update.'
                    });
                    return;
                } else {
                    // trigger the next workflow
                    workflow.emit('respond', destination);
                }
            });
        }

    });

    // respond the user with a message
    workflow.on('respond', function respond(destination) {
        debug('respond');
        // omit the unecessary fields
        DestinationDal.get(destination._id, function(err, destination) {
            if (err) return next(err);
            if (!destination._id) {
                res.status(500).json({
                    error: true,
                    message: 'Internal Error'
                });
            }
            destination.omitFields([], function(err, _destination) {
                res.status(200).json(_destination);
            });
        })

    });

    // trigger the workflow
    workflow.emit('validateDestinationId');
};

// get all destination
exports.getAllDestinations = function getAllDestinations(req, res, next) {
    debug('get a destination');

    var workflow = new events.EventEmitter();

    // get a destination
    workflow.on('getDestinations', function createDestination() {
        debug('get Destinations');

        DestinationDal.getCollection({}, function cb(err, destinations) {
            if (err) return next(err);
            // check if the destination exists or not
            if (!Array.isArray(destinations)) {
                res.status(404).json({
                    error: true,
                    message: 'NO Destinations Found!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', destinations);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(destinations) {
        debug('respond');
        _destinations = [];
        // omit the unecessary fields
        destinations.forEach(function(destination) {
            destination.omitFields([], function(err, _destination) {
                _destinations.push(_destination);
            });
        });
        res.status(200).json(_destinations);
    });

    // trigger the workflow
    workflow.emit('getDestinations');
};