// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:auth-controller');
var _ = require('lodash');
var crypto = require('crypto');

// LOAD CONFIG
var config = require('../config');

// LOAD MODEL'S DAL
var UserDal = require('../dal/user');
var TokenDal = require('../dal/token');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};
/**
 * USER LOGIN / AUTHENTICATION CONTROLLER
 */
exports.login = function login(req, res, next) {
    debug('[Auth Controller] User Login...');

    var workflow = new events.EventEmitter();

    workflow.on('validateData', function validateData() {
        debug('[Login] [validateData]]');

        // validate the requested data
        req.checkBody('username', 'Username is Invalid!')
            .notEmpty().withMessage('Username should not be Empty!');
        req.checkBody('password', 'Password is Invalid!')
            .notEmpty().withMessage('Username should not be Empty!');

        // if there is any validation error response back with the error message
        var errs = req.validationErrors();
        if (errs) {
            res.status(400);  // Bad Request
            res.json(errs);
            return;
        }

        // initilaize the next workflow
        workflow.emit('validateUsername');

    });

    workflow.on('validateUsername', function validateUsername() {
        debug('[Login] [validateUsername]]');

        // Check Username
        UserDal.get({ username: req.body.username }, function done(err, user) {
            if (err) return next(err);

            if (!user._id) {
                res.status(404);    // Not Found
                res.json({
                    message: 'Wrong Credentials!'
                });
                return;
            }

            // initilaize the next workflow
            workflow.emit('validatePassword', user);
        });
    });

    workflow.on('validatePassword', function validatePassword(user) {
        debug('[Login] [validatePassword]]');

        // Check Password
        user.checkPassword(req.body.password, function done(err, isOk) {
            if (err) return next(err);

            // if the passwords DONOT match
            if (!isOk) {
                res.status(403);    // 
                res.json({
                    message: 'Wrong Credentials!'
                });
                return;
            }
            // Trigger the next workflow
            workflow.emit('generateToken', user);
        });
    });

    workflow.on('generateToken', function generateToken(user) {
        debug('[Login] [generateToken]]');

        TokenDal.get({ user: user._id }, function done(err, token) {
            if (err) return next(err);

            // generate token
            crypto.randomBytes(config.TOKEN_LENGTH, function tokenGenerator(err, buf) {
                if (err) return next(err);

                // generate 64bit token
                var tokenValue = buf.toString('base64');

                // If the user do not have a token
                if (!token._id) {
                    // create a token
                    TokenDal.create({ user: user._id, value: tokenValue, revoked: false }, function createToken(err, token) {
                        if (err) return next(err);
                        // Trigger next workflow with user and token value
                        workflow.emit('respond', user, tokenValue);
                    });

                } else {
                    // Update value
                    TokenDal.update({ _id: token._id }, { $set: { value: tokenValue, revoked: false } }, function updateToken(err, token) {
                        if (err) return next(err);
                        // Trigger next workflow
                        workflow.emit('respond', user, tokenValue);
                    });
                }
            });

        });

    });

    workflow.on('respond', function respond(user, token) {
        debug('[Login] [respond]]');

        var now = moment().toISOString();

        UserDal.update({ _id: user._id }, { last_login: now }, function updateLogin(err, user) {
            if (err) return next(err);

            //res.before(function(){}); 

            // create a user JSON object
            //user = user.toJSON();
            // remove password, realm and role
            //delete user.password; delete user.realm; delete user.role;
            // respond 
            //res.exclude(['user.password'])
            user.user_profile.omitFields(['user'], function (err, _user_profile) {
                if (err) return next(err);
                // remove the unwanted fields from the user
                user.omitFields([], function (err, _user) {
                    if (err) return next(err);
                    // replace the user_profile of the user with the removed user_profile
                    _user.user_profile = _user_profile;

                    var _jsonResponse = {
                        token: token,
                        user: _user
                    };
                    //res.exclude(['']);
                    res.json(_jsonResponse);
                    // return the user to the requester
                    //res.status(200).json(_user || {});
                });
            });

        });
    });

    // trigger data
    workflow.emit('validateData');

};

/**
 * USER LOGOUT CONTROLLER
 */
exports.logout = function logout(req, res, next) {
    debug('[Auth Controller] User Logout...');

    // fetch the user id from req object, which is appended on the authenticate middleware
    var userId = req._user;

    if (!userId) {
        // respond error to the request
        res.status(401);    // Unauthorized
        res.json({
            message: 'You need to be logged in to logout!, Use a correct token'
        });
        return;
    }

    // Revoke the token value of the user
    TokenDal.update({ user: userId }, { $set: { revoked: true } }, function updateCallback(err, token) {
        if (err) return next(err);

        // respond to the user
        res.status(200);    // Ok
        res.json({
            message: 'User Successfuly logged out!'
        })
    });

}