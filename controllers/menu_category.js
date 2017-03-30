// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:menu_category-controller');
var mongoose = require('mongoose');
// LOAD MODEL'S DAL
var Menu_categoryDal = require('../dal/menu_category');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

// create a menu_category
exports.createMenu_category = function createMenu_category(req, res, next) {
    debug('Create a menu_category');

    var workflow = new events.EventEmitter();

    // check if the title field is valid
    workflow.on('validateMenu_category', function validation() {
        debug('Validate menu_category');

        req.checkBody('title', 'Title Should not be Empty!').notEmpty();
        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            workflow.emit('checkIfMenu_categoryExists');
        }
    });
    // check if the menu_category title exists before
    workflow.on('checkIfMenu_categoryExists', function checkIfMenu_categoryExists() {
        debug('Validate if menu_category exists');

        // get the menu_category from the db with a title passed
        Menu_categoryDal.get({
            title: req.body.title
        }, function(err, menu_category) {
            if (err) return next(err);
            // check if the menu_category exists
            if (menu_category._id) {
                // return error
                res.status(400).json({
                    error: true,
                    message: 'The menu_category already registered with the same title!'
                });
            } else {
                // got to the next workflow
                workflow.emit('createMenu_category');
            }
        });
    });

    // create a menu_category
    workflow.on('createMenu_category', function createMenu_category() {
        debug('create Menu_category');

        Menu_categoryDal.create({
            title: req.body.title,
            description: req.body.description
        }, function cb(err, menu_category) {
            if (err) return next(err);
            // trigger the next workflow
            workflow.emit('respond', menu_category);
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(menu_category) {
        debug('respond');
        // omit the unecessary fields
        menu_category.omitFields([], function(err, _menu_category) {
            res.status(201).json(_menu_category);
        });
    });

    // trigger the workflow
    workflow.emit('validateMenu_category');
};

// delete menu_category
exports.deleteMenu_category = function deleteMenu_category(req, res, next) {
    debug('Delete a menu_category');

    var workflow = new events.EventEmitter();

    // check if the menu_category ID field is valid
    workflow.on('validateMenu_category', function validation() {
        debug('Validate menu_category');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.menu_categoryId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct menu_categoryId!'
            });
            return;
        } else {
            workflow.emit('deleteMenu_category');
        }
    });

    // delete a menu_category
    workflow.on('deleteMenu_category', function createMenu_category() {
        debug('delete Menu_category');

        Menu_categoryDal.delete({
            _id: req.params.menu_categoryId
        }, function cb(err, menu_category) {
            if (err) return next(err);
            // check if the menu_category exists or not
            if (!menu_category._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Menu_category has been registered to delete!'
                });
            } else {
                // trigger the next workflow
                workflow.emit('respond', menu_category);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(menu_category) {
        debug('respond');
        // omit the unecessary fields

        menu_category.omitFields([], function(err, _menu_category) {
            res.status(200).json({
                message: 'Menu_category is successfuly Deleted!',
                data: _menu_category
            });
        });
    });

    // trigger the workflow
    workflow.emit('validateMenu_category');
};

// get a menu_category
exports.getMenu_category = function getMenu_category(req, res, next) {
    debug('get a menu_category');

    var workflow = new events.EventEmitter();

    // check if the menu_category ID field is valid
    workflow.on('validateMenu_category', function validation() {
        debug('Validate menu_category');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.menu_categoryId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct menu_categoryId!'
            });
            return;
        } else {
            workflow.emit('getMenu_category');
        }
    });

    // get a menu_category
    workflow.on('getMenu_category', function createMenu_category() {
        debug('get Menu_category');

        Menu_categoryDal.get({
            _id: req.params.menu_categoryId
        }, function cb(err, menu_category) {
            if (err) return next(err);
            // check if the menu_category exists or not
            if (!menu_category._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Menu_category has been registered with this ID!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', menu_category);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(menu_category) {
        debug('respond');
        // omit the unecessary fields

        menu_category.omitFields([], function(err, _menu_category) {
            res.status(200).json(_menu_category);
        });
    });

    // trigger the workflow
    workflow.emit('validateMenu_category');
};

// update a menu_category
exports.updateMenu_category = function updateMenu_category(req, res, next) {
    debug('update a menu_category');

    var workflow = new events.EventEmitter();

    // check if the menu_category ID field is valid
    workflow.on('validateMenu_category', function validation() {
        debug('Validate menu_category');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.menu_categoryId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct menu_categoryId!'
            });
            return;
        } else {
            workflow.emit('updateMenu_category');
        }
    });

    // update a menu_category
    workflow.on('updateMenu_category', function updateMenu_category() {
        debug('update Menu_category', req.body.description);

        Menu_categoryDal.update({
            _id: req.params.menu_categoryId
        }, {
            description: req.body.description
        }, function cb(err, menu_category) {
            if (err) return next(err);
            // check if the menu_category exists or not
            if (!menu_category._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Menu_category has been registered with this ID! to update.'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', menu_category);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(menu_category) {
        debug('respond');
        // omit the unecessary fields

        menu_category.omitFields([], function(err, _menu_category) {
            res.status(200).json(_menu_category);
        });
    });

    // trigger the workflow
    workflow.emit('validateMenu_category');
};

// get all menu_category
exports.getAllPlaceCategories = function getAllPlaceCategories(req, res, next) {
    debug('get a menu_category');

    var workflow = new events.EventEmitter();

    // get a menu_category
    workflow.on('getPlaceCategories', function createMenu_category() {
        debug('get Place Categories');

        Menu_categoryDal.getCollection({}, function cb(err, place_categories) {
            if (err) return next(err);
            // check if the menu_category exists or not
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
        place_categories.forEach(function(menu_category) {
            menu_category.omitFields([], function(err, _menu_category) {
                _place_categories.push(_menu_category);
            });
        });
        res.status(200).json(_place_categories);
    });

    // trigger the workflow
    workflow.emit('getPlaceCategories');
};