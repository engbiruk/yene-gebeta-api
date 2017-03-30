// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:menu-controller');
var validator = require('express-validator');
var mongoose = require('mongoose');

// LOAD MODEL'S DAL
var MenuDal = require('../dal/menu');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

// create a menu
exports.createMenu = function createMenu(req, res, next) {
    debug('Create a menu');

    var workflow = new events.EventEmitter();

    // check if the title field is valid
    workflow.on('validateMenu', function validation() {
        debug('Validate menu');

        req.checkBody('title', 'Title Should not be Empty!').notEmpty();
        req.checkBody('place', 'Place Should not be Empty!').notEmpty();
        if (req.validationErrors()) {
            res.status(400).json(req.validationErrors());
            return;
        } else {
            workflow.emit('checkIfMenuExists');
        }
    });
    // check if the menu title exists before
    workflow.on('checkIfMenuExists', function checkIfMenuExists() {
        debug('Validate if menu exists');

        // get the menu from the db with a title passed
        MenuDal.get({
            title: req.body.title,
            description: req.body.description,
            place: req.body.place
        }, function(err, menu) {
            if (err) return next(err);
            // check if the menu exists
            if (menu._id) {
                // return error
                res.status(400).json({
                    error: true,
                    message: 'The menu already registered with the same title!'
                });
            } else {
                // got to the next workflow
                workflow.emit('createMenu');
            }
        });
    });

    // create a menu
    workflow.on('createMenu', function createMenu() {
        debug('create Menu');

        MenuDal.create({
            title: req.body.title,
            description: req.body.description || '',
            ingredient: req.body.ingredient || '',
            price: req.body.price || 0,
            place: req.body.place
        }, function cb(err, menu) {
            if (err) return next(err);
            // trigger the next workflow
            workflow.emit('respond', menu);
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(menu) {
        debug('respond');
        // omit the unecessary fields
        menu.omitFields([], function(err, _menu) {
            res.status(201).json(_menu);
        });
    });

    // trigger the workflow
    workflow.emit('validateMenu');
};

// delete menu
exports.deleteMenu = function deleteMenu(req, res, next) {
    debug('Delete a menu');

    var workflow = new events.EventEmitter();

    // check if the menu ID field is valid
    workflow.on('validateMenu', function validation() {
        debug('Validate menu');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.menuId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct menuId!'
            });
            return;
        } else {
            workflow.emit('deleteMenu');
        }
    });

    // delete a menu
    workflow.on('deleteMenu', function createMenu() {
        debug('delete Menu');

        MenuDal.delete({
            _id: req.params.menuId
        }, function cb(err, menu) {
            if (err) return next(err);
            // check if the menu exists or not
            if (!menu._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Menu has been registered to delete!'
                });
            } else {
                // trigger the next workflow
                workflow.emit('respond', menu);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(menu) {
        debug('respond');
        // omit the unecessary fields

        menu.omitFields([], function(err, _menu) {
            res.status(200).json({
                message: 'Menu is successfuly Deleted!',
                data: _menu
            });
        });
    });

    // trigger the workflow
    workflow.emit('validateMenu');
};

// get a menu
exports.getMenu = function getMenu(req, res, next) {
    debug('get a menu');

    var workflow = new events.EventEmitter();

    // check if the menu ID field is valid
    workflow.on('validateMenu', function validation() {
        debug('Validate menu');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.menuId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct menuId!'
            });
            return;
        } else {
            workflow.emit('getMenu');
        }
    });

    // get a menu
    workflow.on('getMenu', function createMenu() {
        debug('get Menu');

        MenuDal.get({
            _id: req.params.menuId
        }, function cb(err, menu) {
            if (err) return next(err);
            // check if the menu exists or not
            if (!menu._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Menu has been registered with this ID!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', menu);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(menu) {
        debug('respond');
        // omit the unecessary fields

        menu.omitFields([], function(err, _menu) {
            res.status(200).json(_menu);
        });
    });

    // trigger the workflow
    workflow.emit('validateMenu');
};

// update a menu
exports.updateMenu = function updateMenu(req, res, next) {
    debug('update a menu');

    var workflow = new events.EventEmitter();

    // check if the menu ID field is valid
    workflow.on('validateMenu', function validation() {
        debug('Validate menu');

        // check if the objectId is right
        if (!mongoose.Types.ObjectId.isValid(req.params.menuId)) {
            res.status(400).json({
                error: true,
                message: 'Please Use Correct menuId!'
            });
            return;
        } else {
            Opening_hourDal.get({
                _id: req.params.menuId
            }, function cb(err, menu) {
                if (err) return next(err);

                workflow.emit('updateMenu', menu);
            });
            workflow.emit('updateMenu');
        }
    });

    // update a menu
    workflow.on('updateMenu', function updateMenu(menu) {
        debug('update Menu');

        MenuDal.update({
            _id: req.params.menuId
        }, {
            title: req.body.title || menu.title,
            ingredient: req.body.ingredient || menu.ingredient,
            description: req.body.description || menu.description,
            price: req.body.price || menu.price
        }, function cb(err, menu) {
            if (err) return next(err);
            // check if the menu exists or not
            if (!menu._id) {
                res.status(400).json({
                    error: true,
                    message: 'NO Menu has been registered with this ID! to update.'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', menu);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(menu) {
        debug('respond');
        // omit the unecessary fields

        menu.omitFields([], function(err, _menu) {
            res.status(200).json(_menu);
        });
    });

    // trigger the workflow
    workflow.emit('validateMenu');
};

// get all menu
exports.getAllMenus = function getAllMenus(req, res, next) {
    debug('get a menus');

    var workflow = new events.EventEmitter();

    // get a menu
    workflow.on('getMenus', function createMenu() {
        debug('get Menus');

        MenuDal.getCollection({}, function cb(err, menus) {
            if (err) return next(err);
            // check if the menu exists or not
            if (!Array.isArray(menus)) {
                res.status(404).json({
                    error: true,
                    message: 'NO Menus Found!'
                });
                return;
            } else {
                // trigger the next workflow
                workflow.emit('respond', menus);
            }
        });
    });

    // respond the user with a message
    workflow.on('respond', function respond(menus) {
        debug('respond');
        _menus = [];
        // omit the unecessary fields
        menus.forEach(function(menu) {
            menu.omitFields([], function(err, _menu) {
                _menus.push(_menu);
            });
        });
        res.status(200).json(_menus);
    });

    // trigger the workflow
    workflow.emit('getMenus');
};