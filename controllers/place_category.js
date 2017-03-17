// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:place_category-controller');
var validator = require('express-validator');
var mongoose = require('mongoose');

// LOAD MODEL'S DAL
var Place_categoryDal = require('../dal/place_category');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

// create a place_category
exports.createPlaceCategory = function createPlaceCategory(req, res, next) {
    debug('Create a place category');

    var workflow = new events.EventEmitter();

    // check if the name field is valid
    workflow.on('validatePlaceCategory', function validation() {
        debug('Validate place category');

        req.checkBody('name', 'Name Should not be Empty!').notEmpty();
        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            workflow.emit('checkIfPlaceCategoryExists');
        }
    });
    // check if the category name exists before
    workflow.on('checkIfPlaceCategoryExists', function checkIfPlaceCategoryExists() {
        debug('Validate if place category exists');

        // get the place category from the db with a name passed
        Place_categoryDal.get({
            name: req.body.name
        }, function (err, place_category) {
            if (err) return next(err);
            // check if the place category exists
            if (place_category._id) {
                // return error
                res.status(400).json({
                    error: true,
                    message: 'The Place category already registered with the same name!'
                });
            } else {
                // got to the next workflow
                workflow.emit('createPlaceCategory');
            }
        });
    });

    // create a place category
    workflow.on('createPlaceCategory', function createPlaceCategory() {
        debug('create Place Category');

        Place_categoryDal.create({
            name: req.body.name,
            description: req.body.description || ''
        }, function cb(err, place_category) {
            if (err) return next(err);

            // trigger the next workflow
            workflow.emit('respond', place_category);
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_category) {
        debug('respond');
        // omit the unecessary fields
        place_category.omitFields([], function (err, _place_category) {
            res.status(201).json(_place_category);
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceCategory');
};

// delete place_category
exports.deletePlaceCategory = function deletePlaceCategory(req, res, next) {
    debug('Delete a place category');

    var workflow = new events.EventEmitter();

    // check if the place_category ID field is valid
    workflow.on('validatePlaceCategory', function validation() {
        debug('Validate place category');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.place_categoryId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct place_categoryId!'
            });
            return;
        } else {
            workflow.emit('deletePlaceCategory');
        }
    });

    // delete a place category
    workflow.on('deletePlaceCategory', function createPlaceCategory() {
        debug('delete Place Category');

        Place_categoryDal.delete({
            _id: req.params.place_categoryId
        }, function cb(err, place_category) {
            if (err) return next(err);
            // check if the category exists or not
            if (!place_category._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Place_category has been registered to delete!'
                });
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_category);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_category) {
        debug('respond');
        // omit the unecessary fields

        place_category.omitFields([], function (err, _place_category) {
            res.status(200).json({
                message: 'Place_category is successfuly Deleted!',
                data: _place_category
            });
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceCategory');
};

// get a place_category
exports.getPlaceCategory = function getPlaceCategory(req, res, next) {
    debug('get a place category');

    var workflow = new events.EventEmitter();

    // check if the place_category ID field is valid
    workflow.on('validatePlaceCategory', function validation() {
        debug('Validate place category');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.place_categoryId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct place_categoryId!'
            });
            return;
        } else {
            workflow.emit('getPlaceCategory');
        }
    });

    // get a place category
    workflow.on('getPlaceCategory', function createPlaceCategory() {
        debug('get Place Category');

        Place_categoryDal.get({
            _id: req.params.place_categoryId
        }, function cb(err, place_category) {
            if (err) return next(err);
            // check if the category exists or not
            if (!place_category._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Place_category has been registered with this ID!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_category);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_category) {
        debug('respond');
        // omit the unecessary fields

        place_category.omitFields([], function (err, _place_category) {
            res.status(200).json(_place_category);
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceCategory');
};

// update a place_category
exports.updatePlaceCategory = function updatePlaceCategory(req, res, next) {
    debug('update a place category');

    var workflow = new events.EventEmitter();

    // check if the place_category ID field is valid
    workflow.on('validatePlaceCategory', function validation() {
        debug('Validate place category');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.place_categoryId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct place_categoryId!'
            });
            return;
        } else {
            workflow.emit('updatePlaceCategory');
        }
    });

    // update a place category
    workflow.on('updatePlaceCategory', function createPlaceCategory() {
        debug('update Place Category');

        Place_categoryDal.update({
            _id: req.params.place_categoryId
        }, {
            description: req.body.description
        }, function cb(err, place_category) {
            if (err) return next(err);
            // check if the category exists or not
            if (!place_category._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Place_category has been registered with this ID! to update.'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_category);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_category) {
        debug('respond');
        // omit the unecessary fields

        place_category.omitFields([], function (err, _place_category) {
            res.status(200).json(_place_category);
        });
    });

    // trigger the workflow
    workflow.emit('validatePlaceCategory');
};

// get all place_category
exports.getAllPlaceCategories = function getAllPlaceCategories(req, res, next) {
    debug('get a place category');

    var workflow = new events.EventEmitter();

    // get a place category
    workflow.on('getPlaceCategories', function createPlaceCategory() {
        debug('get Place Categories');

        Place_categoryDal.getCollection({}, function cb(err, place_categories) {
            if (err) return next(err);
            // check if the category exists or not
            if (!Array.isArray(place_categories)) {
                res.status(404).json({
                    error: true,
                    message: 'NO Place_categories Found!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', place_categories);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(place_categories) {
        debug('respond');
        _place_categories = [];
        // omit the unecessary fields
        place_categories.forEach(function (place_category) {
            place_category.omitFields([], function (err, _place_category) {
                _place_categories.push(_place_category);
            });
        });
        res.status(200).json(_place_categories);
    });

    // trigger the workflow
    workflow.emit('getPlaceCategories');
};