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

    // check if the name field is valid
    workflow.on('validateReview', function validation() {
        debug('Validate review');

        req.checkBody('rate', 'You must specify Rate!').notEmpty();
        req.checkBody('place', 'You must specify Place of Review!').notEmpty();

        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            workflow.emit('checkIfReviewExists');
        }
    });
    // check if the review name exists before
    workflow.on('checkIfReviewExists', function checkIfReviewExists() {
        debug('Validate if review exists', req.body.user);

        var user = req._user;
        // get the review from the db with a name passed
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
                    message: 'The Review already registered with the same info!'
                });
            } else {
                // got to the next workflow
                workflow.emit('createReview', user);
            }
        });

    });

    // create a review
    workflow.on('createReview', function createReview(user) {
        debug('create Place Category');

        ReviewDal.create({
            rate: req.body.rate,
            title: req.body.title ? req.body.title : '',
            desciption: req.body.desciption ? req.body.desciption : '',
            place: req.body.place,
            user_profile: user.user_profile
        }, function cb(err, review) {
            if (err) return next(err);

            if (!review._id) {
                res.status(500).json({ message: "Can not create Review!" });
                return;
            }
            // update the the place
            PlaceDal.update({ _id: req.body.place }, { $push: { review: review._id } }, function(err, place) {
                if (err) return next(err);

                if (!place._id) {
                    res.status(500).json({
                        error: true,
                        message: 'Could not update the place!'
                    });
                    return;
                }
            });
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
        debug('delete Place Category');

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
        debug('get Place Category');

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

// get a review based on place
exports.getReviewWithPlace = function getReviewWithPlace(req, res, next) {
    debug('get a review');

    var workflow = new events.EventEmitter();

    // check if the review ID field is valid
    workflow.on('validateReview', function validation() {
        debug('Validate review');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.placeId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct placeId!'
            });
            return;
        } else {
            workflow.emit('getReview');
        }
    });

    // get a review
    workflow.on('getReview', function createReview() {
        debug('get Place Category');

        ReviewDal.getCollection({
            place: req.params.placeId
                //_id: req.params.reviewId
        }, function cb(err, reviews) {
            if (err) return next(err);
            // check if the review exists or not
            if (!Array.isArray(reviews)) {
                res.status(400).json({
                    error: true,
                    message: 'NO Review has been registered with this Place ID!'
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
    workflow.emit('validateReview');
};

// update a review
exports.updateReview = function updateReview(req, res, next) {
    debug('update a review');

    var workflow = new events.EventEmitter();

    // check if the review ID field is valid
    workflow.on('validateReview', function validation() {
        debug('Validate review');

        req.checkBody('rate', 'You must specify rate!').notEmpty();
        req.checkBody('place', 'You must specify place of review!').notEmpty();

        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            // check if the objectId is right
            if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
                res.status(400).json({
                    error: true,
                    message: 'Please Use Correct reviewId!'
                });
                return;
            } else {
                ReviewDal.get({ _id: req.params._id }, function(err, review) {
                    if (err) return next(err);

                    if (!review._id) {
                        res.status(500).json({
                            error: true,
                            message: 'Review Could Not Found to Update!'
                        });
                    }

                    workflow.emit('updateReview', review);
                });
            }
        }
    });

    // update a review
    workflow.on('updateReview', function createReview(review) {
        debug('update Place Category');

        ReviewDal.update({
            _id: req.params.reviewId
        }, {
            rate: req.body.rate,
            title: req.body.title ? req.body.title : '',
            desciption: req.body.desciption ? req.body.desciption : review.desciption ? review.desciption : '',
            //place: req.body.place,
            //user_profile: user.user_profile
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
exports.getAllReviews = function getAllReviews(req, res, next) {
    debug('get a review');

    var workflow = new events.EventEmitter();

    // get a review
    workflow.on('getReviews', function createReview() {
        debug('get Reviews');

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
    workflow.emit('getReviews');
};