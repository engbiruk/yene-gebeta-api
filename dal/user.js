/**
 * Access Layer for User Data
 */

// LOAD MODULE DEPEDENCIES
var debug = require('debug')('yene-gebeta-api:user-dal');
var moment = require('moment');
var bcrypt = require('bcrypt');

// LOAD MODELS
var User = require('../models/user');

// LOAD POPULATED AND RETURN FIELDS
var population = [{
    path: 'user_profile'
}];

/**
 * CREATE A NEW USER
 * 
 * @desc creates a new user and save it to the database
 * @param {Object} userData Data for the user to creates
 * @param {Function} callback a callback function after saving user completes
 * 
 */
exports.create = function create(userData, callback) {
    debug('[User DAL] Creating a new user...');

    // create an object from the passed user data
    var userModel = new User(userData);

    // save the new user model to the database
    userModel.save(function saveUser(err, data) {
        if (err) return callback(err);

        // check if the comming data is indeed a user data
        exports.get({ _id: data._id }, function(err, user) {
            if (err) return callback(err);
            // callback the user data if the user exists or send empity object if it doesn't
            callback(null, user || {});
        });

    });
};

/**
 * DELETE A USER
 * 
 * @desc deletes a user info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting user completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[User DAL] Deleting user: ', query);

    User
        .findOne(query) // find the user from the query
        .populate(population) // populate with a User_profile model link
        .exec(function deleteUser(err, user) { // executes the query
            if (err) return callback(err);

            // if the user is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if (!user) return callback(null, {});

            // if the user exist, try removing it from the database
            user.remove(function removeUser(err) {
                if (err) return callback(err);

                // return the user to the callback
                callback(null, user);
            });
        });
};

/**
 * GET A USER
 * 
 * @desc fetch a user info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting user info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[User DAL] Geting a user: ' + query);

    User
        .findOne(query) // find the user profile from the query
        .populate(population) // populate with a User_profile model link
        .exec(function getUser(err, user) {
            if (err) return callback(err);

            // return the user to the callback function. return empity object if the user doesn't exist in the database
            callback(null, user || {});
        });
};

/**
 * UPDATE A USER
 * 
 * @desc update a user info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateUser Updated fields of the user
 * @param {Function} callback a callback function after updating a user info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[User DAL] Updating a user: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    User
        .findOneAndUpdate(query, updates) // find the user from the query and updates them with new updates
        .populate(population) // populate with a User_profile model link
        .exec(function updateUser(err, user) {
            if (err) return callback(err);

            // return the updated user to the callback function and send an empity object if the user doesn't exist anymore
            callback(null, user || {});
        });
};

/**
 * GET A COLLECTION OF USERS
 * 
 * @desc fetch a collection of users from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching users info from the database
 * 
 */
exports.getCollection = function getACollectionOfUsers(query, callback) {
    debug('[User DAL] fetching a collection of users', query);

    User
        .find(query)
        .populate(population)
        .exec(function getUsersCollection(err, users) {
            if (err) return callback(err);

            // return users to the callback function
            callback(null, users || {});
        });
};


exports.hashPassword = function hashPassword(password, callback) {
    debug('[Hashing Passwords]')

    User.hashPassword(password, function(err, HASH) {
        if (err) return callback(err);

        callback(null, HASH);
    });
};