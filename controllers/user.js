// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:user-controller');
var lodash = require('lodash');
var _ = require('underscore');

// LOAD CONFIG
var config = require('../config');

// LOAD MODEL'S DAL
var UserDal = require('../dal/user');
var User_profileDal = require('../dal/user_profile');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

/**
 * CREATE USER
 *  1. Validate the user data
 *  2. Create a User
 *  3. Create a User_profile
 *  4. Send a Response back
 */
exports.createUser = function createUser(req, res, next) {
    debug('[User Controller] Create user');

    // create a workflow event
    var workflow = new events.EventEmitter();
    var body = req.body;

    // [Workflow] 1. Validate the user data 
    workflow.on('validateUser', function validateUser() {
        debug('[User Controller: Create User][Workflow: validateUser] validating user...');

        // check for validation
        req
            .checkBody('password', 'Password Invalid!')
            .notEmpty().withMessage('Password shouldn\'t be empty!')
            .isLength(8).withMessage('Password length has to be longer than 7 characters!');
        req
            .checkBody('email', 'Email Invalid!')
            .notEmpty().withMessage('Email shouldn\'t be empty!')
            .isEmail().withMessage('Email field has to be a correct email!');
        req
            .checkBody('first_name', 'First Name Invalid!')
            .notEmpty().withMessage('First Name shouldn\'t be empty!');
        req
            .checkBody('last_name', 'Last Name Invalid!')
            .notEmpty().withMessage('Last Name shouldn\'t be empty!');
        req
            .checkBody('user_type', 'User Type Invalid!')
            .notEmpty().withMessage('User Type shouldn\'t be empty!')
            .isIn(config.USER_TYPES).withMessage('User Type should be in ' + config.USER_TYPES);
        req
            .checkBody('date_of_birth', 'Date of Birth Invalid!')
            .notEmpty().withMessage('Date of Birth shouldn\'t be empty!')
            .isDate().withMessage('Date of Birth should be a Date');
        req
            .checkBody('phone_number', 'Phone Number')
            .notEmpty().withMessage('Phone Number shouldn\'t be empty!');

        req
            .checkBody('gender', 'Gender is Invalid!')
            .notEmpty().withMessage('Gender shouldn\'t be empty!')
            .isIn(['M', 'F']).withMessage('Gender should have only have one character: [M] or [F]');
        // check for validation errors
        var validationErrors = req.validationErrors();

        // if there is a validation error, return a bad request
        if (validationErrors) {
            res.status(400); // Bad Request
            res.json(validationErrors);
            // return to the user
            return;
        } else {
            // if no errors pass to the next workflow (saving the user)
            workflow.emit('checkIfUserExist');
        }

    });

    // [Workflow] 2. Check if the user already exist
    workflow.on('checkIfUserExist', function checkUserExist() {
        debug('[User Controller: Create User][Workflow: checkIfUserExist] check if the user exists...');

        // Check if the user already exists in the database (checking the username from the submitted email)
        UserDal.get({ username: body.email }, function getUser(err, user) {
            if (err) return next(err);

            // if user exist response back
            if (user._id) {
                res.status(400); // Bad Request
                res.json({
                    message: 'The email is already taken. Please use another email!'
                });
            } else {
                // since the user doesnot exist, go to the next workflow (creating the user)
                workflow.emit('createUser');
            }
        });
    });

    // [Workflow] 3. Create user
    workflow.on('createUser', function createUser() {
        debug('[User Controller: Create User][Workflow: createUser] creating user...');

        // Create a user from the data
        UserDal.create({
            password: body.password,
            username: body.email,
            role: body.user_type,
            realm: body.realm ? body.realm : 'user'

        }, function callback(err, user) {
            if (err) return next(err);

            // if no errors pass to the next workflow (saving the user_profile)
            workflow.emit('createUser_profile', user);

        });
    });

    // [Workflow] 4. Create user_profile
    workflow.on('createUser_profile', function createUser_profile(user) {
        debug('[User Controller: Create User][Workflow: createUser_profile] creating user_profile...');

        // Create a user profile from the data
        User_profileDal.create({
            user: user._id,
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            gender: body.gender,
            about: body.about,
            country: body.country,
            city: body.city,
            date_of_birth: body.date_of_birth,
            phone_number: body.phone_number
        }, function callback(err, user_profile) {
            if (err) return next(err);

            // Update back the user's user_profile id
            UserDal.update({ _id: user._id }, { user_profile: user_profile._id }, function callback1(err, user) {
                if (err) return next(err);

                // if there is no err, got to the next workflow (respond back to the request)
                workflow.emit('respond', user);

            });


        });
    });

    // [Workflow] 5. Send response back
    workflow.on('respond', function respond(user) {
        debug('[User Controller: Create User][Workflow: respond] respond to the request...');

        // create a json object
        user = user.toJSON();

        // remove user's password, last_login abd realm info to be send as a respond
        delete user.password, user.last_login, user.realm;

        // send back a respond
        res.status(201); // Created
        res.json(user); // send the user
    });

    // [Workflow] Emit to a Validation workflow
    workflow.emit('validateUser');
};

/**
 * GET ALL USERS
 * 
 */
exports.getAllUsers = function getAllUsers(req, res, next) {
    debug('[User Controller] Get all users');

    UserDal.getCollection({}, function getAllUsersCollection(err, users) {
        if (err) return next(err);

        // return all the users for the requester
        var _users = [];
        users.forEach(function getUser(user) {
            // remove unwanted fields from populated user_profile field in the user
            user.user_profile.omitFields(['user'], function (err, _user_profile) {
                if (err) return next(err);
                // remove the unwanted fields from the user
                user.omitFields([], function (err, _user) {
                    if (err) return next(err);
                    // replace the user_profile of the user with the removed user_profile
                    _user.user_profile = _user_profile;
                    // return the user to the requester
                    _users.push(_user);
                    //res.status(200).json(_user || {});
                });
            });
            // var _user = user.toJSON();
            // delete _user.password; delete _user.realm; delete _user.role;
            // _users.push(_user);
        });
        res.status(200).json(_users);
    });
}

/**
 * GET A USER
 * 
 * @params {Object} req Request
 * @params {Object} res Response
 * @params {Object} next Next Middleware Dispatcher
 * 
 * @return {Object} user A User as Json Object
 */
exports.getUser = function getUser(req, res, next) {
    debug('Get a User...');

    // fetch user id
    var userId = req.params.userId;

    // fetch a user
    UserDal.get({ _id: userId }, function getAUser(err, user) {
        if (err) return next(err);

        // if the user doesnot exist, return that to the user
        if (!user._id) {
            res.status(404).json({ message: 'User does not exist!' });
            return;
        }

        // remove unwanted fields from populated user_profile field in the user
        user.user_profile.omitFields(['user'], function (err, _user_profile) {
            if (err) return next(err);
            // remove the unwanted fields from the user
            user.omitFields([], function (err, _user) {
                if (err) return next(err);
                // replace the user_profile of the user with the removed user_profile
                _user.user_profile = _user_profile;
                // return the user to the requester
                res.status(200).json(_user || {});
            });
        });

    });
}