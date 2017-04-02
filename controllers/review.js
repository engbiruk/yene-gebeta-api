// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:review-controller');
var validator = require('express-validator');
var mongoose = require('mongoose');

// LOAD MODEL'S DAL
var ReviewDal = require('../dal/review');
var UserDal = require('../dal/user');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

// create a review
exports.createReview = function createReview(req, res, next) {
    debug('Create a review');

    var workflow = new events.EventEmitter();

    // check if the rate field is valid
    workflow.on('validateReview', function validation() {
        debug('Validate review');

        req.checkBody('rate', 'Rate Should not be Empty!').notEmpty();
        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            workflow.emit('checkIfReviewExists');
        }
    });

    // check if the review rate exists before
    workflow.on('checkIfReviewExists', function checkIfReviewExists() {
        debug('Validate if review exists');

        UserDal.get({ _id: req.body.user }, function(err, user) {
            if (err) return next(err);

            if (!user._id) {
                res.status(404).json({
                    error: true,
                    message: "No User Found with that user Id!"
                });
                return;
            }

            // get the review from the db with a rate passed
            ReviewDal.get({
                user_profile: user.user_profile,
                place: req.body.place
            }, function(err, review) {
                if (err) return next(err);
                // check if the review exists
                if (review._id) {
                    // return error
                    res.status(400).json({
                        error: true,
                        message: 'The User already submitted a review!'
                    });
                } else {
                    // got to the next workflow
                    workflow.emit('createReview', user);
                }
            });
        });

    });

    // create a review
    workflow.on('createReview', function createReview(user) {
        debug('create Review');

        ReviewDal.create({
            rate: req.body.rate,
            title: req.body.title ? req.body.title : '',
            description: req.body.description ? req.body.description : '',
            place: req.body.place,
            user_profile: user.user_profile
        }, function cb(err, review) {
            if (err) return next(err);

            // trigger the next workflow
            workflow.emit('respond', review);
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(review) {
        debug('respond');
        // omit the unecessary fields
        review.omitFields([], function(err, _review) {
            res.status(201).json(_review);
        });
    });

    // trigger the workflow
    workflow.emit('validateReview');
};

// delete review
exports.deleteReview = function deleteReview(req, res, next) {
    debug('Delete a review');

    var workflow = new events.EventEmitter();

    // check if the review ID field is valid
    workflow.on('validateReview', function validation() {
        debug('Validate review');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct reviewId!'
            });
            return;
        } else {
            workflow.emit('deleteReview');
        }
    });

    // delete a review
    workflow.on('deleteReview', function createReview() {
        debug('delete Review');

        ReviewDal.delete({
            _id: req.params.reviewId
        }, function cb(err, review) {
            if (err) return next(err);
            // check if the review exists or not
            if (!review._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Review has been registered to delete!'
                });
            } else {
                // trigger the next workflow
                workflow.emit('respond', review);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(review) {
        debug('respond');
        // omit the unecessary fields

        review.omitFields([], function(err, _review) {
            res.status(200).json({
                message: 'Review is successfuly Deleted!',
                data: _review
            });
        });
    });

    // trigger the workflow
    workflow.emit('validateReview');
};

// get a review
exports.getReview = function getReview(req, res, next) {
    debug('get a review');

    var workflow = new events.EventEmitter();

    // check if the review ID field is valid
    workflow.on('validateReview', function validation() {
        debug('Validate review');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct reviewId!'
            });
            return;
        } else {
            workflow.emit('getReview');
        }
    });

    // get a review
    workflow.on('getReview', function createReview() {
        debug('get Review');

        ReviewDal.get({
            _id: req.params.reviewId
        }, function cb(err, review) {
            if (err) return next(err);
            // check if the review exists or not
            if (!review._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Review has been registered with this ID!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', review);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(review) {
        debug('respond');
        // omit the unecessary fields

        review.omitFields([], function(err, _review) {
            res.status(200).json(_review);
        });
    });

    // trigger the workflow
    workflow.emit('validateReview');
};

// update a review
exports.updateReview = function updateReview(req, res, next) {
    debug('update a review');

    var workflow = new events.EventEmitter();

    // check if the review ID field is valid
    workflow.on('validateReview', function validation() {
        debug('Validate review');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct reviewId!'
            });
            return;
        } else {
            workflow.emit('updateReview');
        }
    });

    // update a review
    workflow.on('updateReview', function createReview() {
        debug('update Review');

        ReviewDal.update({
            _id: req.params.reviewId
        }, {
            rate: req.body.rate,
            title: req.body.title ? req.body.title : '',
            description: req.body.description ? req.body.description : ''
        }, function cb(err, review) {
            if (err) return next(err);
            // check if the review exists or not
            if (!review._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Review has been registered with this ID! to update.'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', review);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(review) {
        debug('respond');
        // omit the unecessary fields

        review.omitFields([], function(err, _review) {
            res.status(200).json(_review);
        });
    });

    // trigger the workflow
    workflow.emit('validateReview');
};

// get all review
exports.getAllPlaceCategories = function getAllPlaceCategories(req, res, next) {
    debug('get a review');

    var workflow = new events.EventEmitter();

    // get a review
    workflow.on('getPlaceCategories', function createReview() {
        debug('get Place Categories');

        ReviewDal.getCollection({}, function cb(err, reviews) {
            if (err) return next(err);
            // check if the review exists or not
            if (!Array.isArray(reviews)) {
                res.status(404).json({
                    error: true,
                    message: 'NO Reviews Found!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', reviews);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(reviews) {
        debug('respond');
        _reviews = [];
        // omit the unecessary fields
        reviews.forEach(function(review) {
            review.omitFields([], function(err, _review) {
                _reviews.push(_review);
            });
        });
        res.status(200).json(_reviews);
    });

    // trigger the workflow
    workflow.emit('getPlaceCategories');
};