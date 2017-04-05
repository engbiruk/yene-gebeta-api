// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:reservation-controller');
var validator = require('express-validator');
var mongoose = require('mongoose');

// LOAD MODEL'S DAL
var ReservationDal = require('../dal/reservation');
var UserDal = require('../dal/user');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

// create a reservation
exports.createReservation = function createReservation(req, res, next) {
    debug('Create a reservation');

    var workflow = new events.EventEmitter();

    // check if the name field is valid
    workflow.on('validateReservation', function validation() {
        debug('Validate reservation');

        req.checkBody('number_of_guests', 'You must specify number of guests!').notEmpty();
        req.checkBody('reservation_date', 'Reservation Date Should not be Empty!').notEmpty();
        req.checkBody('reservation_time', 'Reservation Time Should not be Empty!').notEmpty();
        req.checkBody('place', 'Place Id Should not be Empty!').notEmpty();

        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            workflow.emit('checkIfReservationExists');
        }
    });
    // check if the reservation name exists before
    workflow.on('checkIfReservationExists', function checkIfReservationExists() {
        debug('Validate if reservation exists', req.body.user);

        var user = req._user;
        // get the reservation from the db with a name passed
        ReservationDal.get({
            number_of_guests: req.body.number_of_guests,
            reservation_date: req.body.reservation_date,
            reservation_time: req.body.reservation_time,
            user_profile: user.user_profile,
            place: req.body.place
        }, function(err, reservation) {
            if (err) return next(err);
            // check if the reservation exists
            if (reservation._id) {
                // return error
                res.status(400).json({
                    error: true,
                    message: 'The Reservation already registered with the same info!'
                });
            } else {
                // got to the next workflow
                workflow.emit('createReservation', user);
            }
        });
    });

    // create a reservation
    workflow.on('createReservation', function createReservation(user) {
        debug('create Place Category');

        ReservationDal.create({
            number_of_guests: req.body.number_of_guests,
            reservation_date: req.body.reservation_date,
            reservation_time: req.body.reservation_time,
            note: req.body.note ? req.body.note : '',
            user_profile: user.user_profile,
            place: req.body.place
        }, function cb(err, reservation) {
            if (err) return next(err);

            if (!reservation._id) {
                res.status(500).json({ message: "Can not create Reservation!" });
                return;
            }
            // trigger the next workflow
            workflow.emit('respond', reservation);
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(reservation) {
        debug('respond');
        // omit the unecessary fields
        reservation.omitFields([], function(err, _reservation) {
            res.status(201).json(_reservation);
        });
    });

    // trigger the workflow
    workflow.emit('validateReservation');
};

// delete reservation
exports.deleteReservation = function deleteReservation(req, res, next) {
    debug('Delete a reservation');

    var workflow = new events.EventEmitter();

    // check if the reservation ID field is valid
    workflow.on('validateReservation', function validation() {
        debug('Validate reservation');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.reservationId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct reservationId!'
            });
            return;
        } else {
            workflow.emit('deleteReservation');
        }
    });

    // delete a reservation
    workflow.on('deleteReservation', function createReservation() {
        debug('delete Place Category');

        ReservationDal.delete({
            _id: req.params.reservationId
        }, function cb(err, reservation) {
            if (err) return next(err);
            // check if the reservation exists or not
            if (!reservation._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Reservation has been registered to delete!'
                });
            } else {
                // trigger the next workflow
                workflow.emit('respond', reservation);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(reservation) {
        debug('respond');
        // omit the unecessary fields

        reservation.omitFields([], function(err, _reservation) {
            res.status(200).json({
                message: 'Reservation is successfuly Deleted!',
                data: _reservation
            });
        });
    });

    // trigger the workflow
    workflow.emit('validateReservation');
};

// get a reservation
exports.getReservation = function getReservation(req, res, next) {
    debug('get a reservation');

    var workflow = new events.EventEmitter();

    // check if the reservation ID field is valid
    workflow.on('validateReservation', function validation() {
        debug('Validate reservation');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.reservationId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct reservationId!'
            });
            return;
        } else {
            workflow.emit('getReservation');
        }
    });

    // get a reservation
    workflow.on('getReservation', function createReservation() {
        debug('get Place Category');

        ReservationDal.get({
            _id: req.params.reservationId
        }, function cb(err, reservation) {
            if (err) return next(err);
            // check if the reservation exists or not
            if (!reservation._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Reservation has been registered with this ID!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', reservation);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(reservation) {
        debug('respond');
        // omit the unecessary fields

        reservation.omitFields([], function(err, _reservation) {
            res.status(200).json(_reservation);
        });
    });

    // trigger the workflow
    workflow.emit('validateReservation');
};

// update a reservation
exports.updateReservation = function updateReservation(req, res, next) {
    debug('update a reservation');

    var workflow = new events.EventEmitter();

    // check if the reservation ID field is valid
    workflow.on('validateReservation', function validation() {
        debug('Validate reservation');

        req.checkBody('number_of_guests', 'You must specify number of guests!').notEmpty();
        req.checkBody('reservation_date', 'Reservation Date Should not be Empty!').notEmpty();
        req.checkBody('reservation_time', 'Reservation Time Should not be Empty!').notEmpty();

        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            // check if the objectId is right
            if (!mongoose.Types.ObjectId.isValid(req.params.reservationId)) {
                res.status(400).json({
                    error: true,
                    message: 'Please Use Correct reservationId!'
                });
                return;
            } else {
                workflow.emit('updateReservation');
            }
        }
    });

    // update a reservation
    workflow.on('updateReservation', function createReservation() {
        debug('update Place Category');

        ReservationDal.update({
            _id: req.params.reservationId
        }, {
            number_of_guests: req.body.number_of_guests,
            reservation_date: req.body.reservation_date,
            reservation_time: req.body.reservation_time,
            note: req.body.note ? req.body.note : ''
        }, function cb(err, reservation) {
            if (err) return next(err);
            // check if the reservation exists or not
            if (!reservation._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Reservation has been registered with this ID! to update.'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', reservation);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(reservation) {
        debug('respond');
        // omit the unecessary fields

        reservation.omitFields([], function(err, _reservation) {
            res.status(200).json(_reservation);
        });
    });

    // trigger the workflow
    workflow.emit('validateReservation');
};

// get all reservation
exports.getAllReservations = function getAllReservations(req, res, next) {
    debug('get a reservation');

    var workflow = new events.EventEmitter();

    // get a reservation
    workflow.on('getReservations', function createReservation() {
        debug('get Reservations');

        ReservationDal.getCollection({}, function cb(err, reservations) {
            if (err) return next(err);
            // check if the reservation exists or not
            if (!Array.isArray(reservations)) {
                res.status(404).json({
                    error: true,
                    message: 'NO Reservations Found!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', reservations);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(reservations) {
        debug('respond');
        _reservations = [];
        // omit the unecessary fields
        reservations.forEach(function(reservation) {
            reservation.omitFields([], function(err, _reservation) {
                _reservations.push(_reservation);
            });
        });
        res.status(200).json(_reservations);
    });

    // trigger the workflow
    workflow.emit('getReservations');
};