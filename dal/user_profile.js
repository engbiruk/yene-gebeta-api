/**
 * Access Layer for User_profile
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:user_profile-dal');
var moment			= require('moment');

// LOAD MODELS
var User_profile	= require('../models/user_profile');

// LOAD POPULATED AND RETURN FIELDS
var population = [{
    path: 'User'
}];

/**
 * CREATE A NEW USER PROFILE
 * 
 * @desc creates a new user profle and save it to the database
 * @param {Object} userProfileData Data for the user profile to creates
 * @param {Function} callback a callback function after saving user's profile completes
 * 
 */
exports.create = function create(userProfileData, callback) {
    debug('[User_profile DAL] Creating a new user profile...');

    // create an object from the passed user profile data
    var userProfileModel = new User(userProfileData);

    // save the new user profile model to the database
    userProfileModel.save(function saveUserProfile(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a user profile data
        exports.get({_id: data._id}, function (err, userProfile){
            if(err) return callback(err);
            // callback the user profile data if the user profile exists if not send an empity object
            callback(null, userProfile || {});
        });

    });
};

/**
 * DELETE A USER PROFILE
 * 
 * @desc deletes a user info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting user completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[User_profile DAL] Deleting user profile: ', query);

    User
        .findOne(query)     // find the user profile from the query
        .populate(population)   // populate with a User model link
        .exec(function deleteUserProfile(err, userProfile){   // executes the query
            if(err) return callback(err);
            
            // if the user profile is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!userProfile) return callback(null, {});

            // if the user profile exist, try removing it from the database
            userProfile.remove(function removeUserProfile(err){
                if(err) return callback(err);

                // return the user profile to the callback
                callback(null, userProfile);
            });
        });
};

/**
 * GET A USER PROFILE
 * 
 * @desc fetch a user profile info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting user profile info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[User_profile DAL] Geting a user profile: ' + query);

    User
        .findOne(query)     // find the user profile from the query
        .populate(population)       // populate with a User model link
        .exec(function getUser(err, userProfile){
            if(err) return callback(err);
            
            // return the user profile to the callback function. return empity object if the user profile doesn't exist in the database
            callback(null, userProfile || {});
        });
};

/**
 * UPDATE A USER PROFILE
 * 
 * @desc update a user profile info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateUser Updated fields of the user's profile
 * @param {Function} callback a callback function after updating a user profile info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[User_profile DAL] Updating a user profile: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    User
        .findOneAndUpdate(query, updates) // find the user profile from the query and updates them with a new updates
        .populate(population)       // populate fields with a new user model
        .exec(function updateUserProfile(err, userProfile){
            if(err) return callback(err);
            
            // return the updated user profile to the callback function and send an empity object if the user profile doesn't exist anymore
            callback(null, userProfile || {});
        });
};

/**
 * GET A COLLECTION OF USER PROFILES
 * 
 * @desc fetch a collection of user profiles from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching users' profile info from the database
 * 
 */

exports.getCollection = function getACollectionOfUsers(query, callback) {
    debug('[User_profile DAL] fetching a collection of users\' profile' , query);

    User
    .find(query)
    .populate(population)
    .exec(function getUsersProfileCollection(err, userProfiles){
        if(err) return callback(err);
        
        // return users' profile to the callback function
        callback(null, userProfiles || {});
    });
};
