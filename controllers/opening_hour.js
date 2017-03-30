// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:opening_hour-controller');
var validator = require('express-validator');
var mongoose = require('mongoose');

// LOAD MODEL'S DAL
var Opening_hourDal = require('../dal/opening_hour');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

// create a opening_hour
exports.createOpening_hour = function createOpening_hour(req, res, next) {
    debug('Create a opening_hour');

    var workflow = new events.EventEmitter();

    // check if the title field is valid
    workflow.on('validateOpening_hour', function validation() {
        debug('Validate opening_hour');

        req.checkBody('monday', 'monday Should not be Empty!').notEmpty();
        req.checkBody('tuesday', 'tuesday Should not be Empty!').notEmpty();
        req.checkBody('wednesday', 'wednesday Should not be Empty!').notEmpty();
        req.checkBody('thursday', 'thursday Should not be Empty!').notEmpty();
        req.checkBody('friday', 'friday Should not be Empty!').notEmpty();
        req.checkBody('saturday', 'saturday Should not be Empty!').notEmpty();
        req.checkBody('sunday', 'sunday Should not be Empty!').notEmpty();
        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            workflow.emit('checkIfOpening_hourExists');
        }
    });
    // check if the opening_hour title exists before
    workflow.on('checkIfOpening_hourExists', function checkIfOpening_hourExists() {
        debug('Validate if opening_hour exists');

        // get the opening_hour from the db with a title passed
        Opening_hourDal.get({
            monday: req.body.monday,
            tuesday: req.body.tuesday,
            wednesday: req.body.wednesday,
            thursday: req.body.thursday,
            friday: req.body.friday,
            saturday: req.body.saturday,
            sunday: req.body.sunday,
            place: req.body.place
        }, function(err, opening_hour) {
            if (err) return next(err);
            // check if the opening_hour exists
            if (opening_hour._id) {
                // return error
                res.status(400).json({
                    error: true,
                    message: 'The opening_hour already registered with the same days info!'
                });
            } else {
                // got to the next workflow
                workflow.emit('createOpening_hour');
            }
        });
    });

    // create a opening_hour
    workflow.on('createOpening_hour', function createOpening_hour() {
        debug('create Opening_hour');

        Opening_hourDal.create({
            monday: req.body.monday || { open: '7:00', close: '21:00' },
            tuesday: req.body.tuesday || { open: '7:00', close: '21:00' },
            wednesday: req.body.wednesday || { open: '7:00', close: '21:00' },
            thursday: req.body.thursday || { open: '7:00', close: '21:00' },
            friday: req.body.friday || { open: '7:00', close: '21:00' },
            saturday: req.body.saturday || { open: '7:00', close: '21:00' },
            sunday: req.body.sunday || { open: '7:00', close: '21:00' },
            place: req.body.place
        }, function cb(err, opening_hour) {
            if (err) return next(err);
            // trigger the next workflow
            workflow.emit('respond', opening_hour);
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(opening_hour) {
        debug('respond');
        // omit the unecessary fields
        opening_hour.omitFields([], function(err, _opening_hour) {
            res.status(201).json(_opening_hour);
        });
    });

    // trigger the workflow
    workflow.emit('validateOpening_hour');
};

// delete opening_hour
exports.deleteOpening_hour = function deleteOpening_hour(req, res, next) {
    debug('Delete a opening_hour');

    var workflow = new events.EventEmitter();

    // check if the opening_hour ID field is valid
    workflow.on('validateOpening_hour', function validation() {
        debug('Validate opening_hour');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.opening_hourId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct opening_hourId!'
            });
            return;
        } else {
            workflow.emit('deleteOpening_hour');
        }
    });

    // delete a opening_hour
    workflow.on('deleteOpening_hour', function createOpening_hour() {
        debug('delete Opening_hour');

        Opening_hourDal.delete({
            _id: req.params.opening_hourId
        }, function cb(err, opening_hour) {
            if (err) return next(err);
            // check if the opening_hour exists or not
            if (!opening_hour._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Opening_hour has been registered to delete!'
                });
            } else {
                // trigger the next workflow
                workflow.emit('respond', opening_hour);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(opening_hour) {
        debug('respond');
        // omit the unecessary fields

        opening_hour.omitFields([], function(err, _opening_hour) {
            res.status(200).json({
                message: 'Opening_hour is successfuly Deleted!',
                data: _opening_hour
            });
        });
    });

    // trigger the workflow
    workflow.emit('validateOpening_hour');
};

// get a opening_hour
exports.getOpening_hour = function getOpening_hour(req, res, next) {
    debug('get a opening_hour');

    var workflow = new events.EventEmitter();

    // check if the opening_hour ID field is valid
    workflow.on('validateOpening_hour', function validation() {
        debug('Validate opening_hour');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.opening_hourId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct opening_hourId!'
            });
            return;
        } else {
            workflow.emit('getOpening_hour');
        }
    });

    // get a opening_hour
    workflow.on('getOpening_hour', function createOpening_hour() {
        debug('get Opening_hour');

        Opening_hourDal.get({
            _id: req.params.opening_hourId
        }, function cb(err, opening_hour) {
            if (err) return next(err);
            // check if the opening_hour exists or not
            if (!opening_hour._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Opening_hour has been registered with this ID!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', opening_hour);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(opening_hour) {
        debug('respond');
        // omit the unecessary fields

        opening_hour.omitFields([], function(err, _opening_hour) {
            res.status(200).json(_opening_hour);
        });
    });

    // trigger the workflow
    workflow.emit('validateOpening_hour');
};

// update a opening_hour
exports.updateOpening_hour = function updateOpening_hour(req, res, next) {
    debug('update a opening_hour');

    var workflow = new events.EventEmitter();

    // check if the opening_hour ID field is valid
    workflow.on('validateOpening_hour', function validation() {
        debug('Validate opening_hour');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.opening_hourId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct opening_hourId!'
            });
            return;
        } else {
            Opening_hourDal.get({
                _id: req.params.opening_hourId
            }, function cb(err, opening_hour) {
                if (err) return next(err);

                workflow.emit('updateOpening_hour', opening_hour);
            });
        }
    });

    // update a opening_hour
    workflow.on('updateOpening_hour', function updateOpening_hour(opening_hour) {
        debug('update Opening_hour');

        Opening_hourDal.update({
            _id: req.params.opening_hourId
        }, {
            monday: req.body.monday || opening_hour.monday,
            tuesday: req.body.tuesday || opening_hour.tuesday,
            wednesday: req.body.wednesday || opening_hour.wednesday,
            thursday: req.body.thursday || opening_hour.thursday,
            friday: req.body.friday || opening_hour.friday,
            saturday: req.body.saturday || opening_hour.saturday,
            sunday: req.body.sunday || opening_hour.sunday
        }, function cb(err, opening_hour) {
            if (err) return next(err);
            // check if the opening_hour exists or not
            if (!opening_hour._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Opening_hour has been registered with this ID! to update.'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', opening_hour);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(opening_hour) {
        debug('respond');
        // omit the unecessary fields

        opening_hour.omitFields([], function(err, _opening_hour) {
            res.status(200).json(_opening_hour);
        });
    });

    // trigger the workflow
    workflow.emit('validateOpening_hour');
};

// get all opening_hour
exports.getAllOpening_hours = function getAllOpening_hours(req, res, next) {
    debug('get a opening_hours');

    var workflow = new events.EventEmitter();

    // get a opening_hour
    workflow.on('getOpening_hours', function createOpening_hour() {
        debug('get Opening_hours');

        Opening_hourDal.getCollection({}, function cb(err, opening_hours) {
            if (err) return next(err);
            // check if the opening_hour exists or not
            if (!Array.isArray(opening_hours)) {
                res.status(404).json({
                    error: true,
                    message: 'NO Opening_hours Found!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', opening_hours);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(opening_hours) {
        debug('respond');
        _opening_hours = [];
        // omit the unecessary fields
        opening_hours.forEach(function(opening_hour) {
            opening_hour.omitFields([], function(err, _opening_hour) {
                _opening_hours.push(_opening_hour);
            });
        });
        res.status(200).json(_opening_hours);
    });

    // trigger the workflow
    workflow.emit('getOpening_hours');
};