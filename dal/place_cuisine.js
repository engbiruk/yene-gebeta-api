/**
 * Access Layer for Place_cuisine Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:place_cuisine-dal');
var moment			= require('moment');

// LOAD MODELS
var Place_cuisine			= require('../models/place_cuisine');

// LOAD POPULATED AND RETURN FIELDS
var population = [];

/**
 * CREATE A NEW RESTAURANT CATEGORY
 * 
 * @desc creates a new place_cuisine and save it to the database
 * @param {Object} place_cuisineData Data for the place_cuisine to creates
 * @param {Function} callback a callback function after saving place_cuisine completes
 * 
 */
exports.create = function create(place_cuisineData, callback) {
    debug('[Place_cuisine DAL] Creating a new place_cuisine...');

    // create an object from the passed place_cuisine data
    var place_cuisineModel = new Place_cuisine(place_cuisineData);

    // save the new place_cuisine model to the database
    place_cuisineModel.save(function savePlace_cuisine(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a place_cuisine data
        exports.get({_id: data._id}, function (err, place_cuisine){
            if(err) return callback(err);
            // callback the place_cuisine data if the place_cuisine exists or send empity object if it doesn't
            callback(null, place_cuisine || {});
        });

    });
};

/**
 * DELETE A RESTAURANT CATEGORY
 * 
 * @desc deletes a place_cuisine info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting place_cuisine completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Place_cuisine DAL] Deleting place_cuisine: ', query);

    Place_cuisine
        .findOne(query)     // find the place_cuisine from the query
        .populate(population)   // populate with a Place_cuisine_profile model link
        .exec(function deletePlace_cuisine(err, place_cuisine){   // executes the query
            if(err) return callback(err);
            
            // if the place_cuisine is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!place_cuisine) return callback(null, {});

            // if the place_cuisine exist, try removing it from the database
            place_cuisine.remove(function removePlace_cuisine(err){
                if(err) return callback(err);

                // return the place_cuisine to the callback
                callback(null, place_cuisine);
            });
        });
};

/**
 * GET A RESTAURANT CATEGORY
 * 
 * @desc fetch a place_cuisine info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting place_cuisine info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Place_cuisine DAL] Geting a place_cuisine: ' + query);

    Place_cuisine
        .findOne(query)     // find the place_cuisine profile from the query
        .populate(population)   // populate with a Place_cuisine_profile model link
        .exec(function getPlace_cuisine(err, place_cuisine){
            if(err) return callback(err);
            
            // return the place_cuisine to the callback function. return empity object if the place_cuisine doesn't exist in the database
            callback(null, place_cuisine || {});
        });
};

/**
 * UPDATE A RESTAURANT CATEGORY
 * 
 * @desc update a place_cuisine info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updatePlace_cuisine Updated fields of the place_cuisine
 * @param {Function} callback a callback function after updating a place_cuisine info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Place_cuisine DAL] Updating a place_cuisine: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Place_cuisine
        .findOneAndUpdate(query, updates) // find the place_cuisine from the query and updates them with new updates
        .populate(population)   // populate with a Place_cuisine_profile model link
        .exec(function updatePlace_cuisine(err, place_cuisine){
            if(err) return callback(err);
            
            // return the updated place_cuisine to the callback function and send an empity object if the place_cuisine doesn't exist anymore
            callback(null, place_cuisine || {});
        });
};

/**
 * GET A COLLECTION OF RESTAURANT CATEGORYS
 * 
 * @desc fetch a collection of place_cuisines from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching place_cuisines info from the database
 * 
 */
exports.getCollection = function getACollectionOfPlace_cuisines(query, callback) {
    debug('[Place_cuisine DAL] fetching a collection of place_cuisines', query);

    Place_cuisine
    .find(query)
    .populate(population)
    .exec(function getPlace_cuisinesCollection(err, place_cuisines){
        if(err) return callback(err);
        
        // return place_cuisines to the callback function
        callback(null, place_cuisines || {});
    });
};
