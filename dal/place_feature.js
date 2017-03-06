/**
 * Access Layer for Place_feature Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:place_feature-dal');
var moment			= require('moment');

// LOAD MODELS
var Place_feature			= require('../models/place_feature');

// LOAD POPULATED AND RETURN FIELDS
var population = [];

/**
 * CREATE A NEW PLACE FEATURE
 * 
 * @desc creates a new place_feature and save it to the database
 * @param {Object} place_featureData Data for the place_feature to creates
 * @param {Function} callback a callback function after saving place_feature completes
 * 
 */
exports.create = function create(place_featureData, callback) {
    debug('[Place_feature DAL] Creating a new place_feature...');

    // create an object from the passed place_feature data
    var place_featureModel = new Place_feature(place_featureData);

    // save the new place_feature model to the database
    place_featureModel.save(function savePlace_feature(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a place_feature data
        exports.get({_id: data._id}, function (err, place_feature){
            if(err) return callback(err);
            // callback the place_feature data if the place_feature exists or send empity object if it doesn't
            callback(null, place_feature || {});
        });

    });
};

/**
 * DELETE A PLACE FEATURE
 * 
 * @desc deletes a place_feature info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting place_feature completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Place_feature DAL] Deleting place_feature: ', query);

    Place_feature
        .findOne(query)     // find the place_feature from the query
        .populate(population)   // populate with a Place_feature_profile model link
        .exec(function deletePlace_feature(err, place_feature){   // executes the query
            if(err) return callback(err);
            
            // if the place_feature is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!place_feature) return callback(null, {});

            // if the place_feature exist, try removing it from the database
            place_feature.remove(function removePlace_feature(err){
                if(err) return callback(err);

                // return the place_feature to the callback
                callback(null, place_feature);
            });
        });
};

/**
 * GET A PLACE FEATURE
 * 
 * @desc fetch a place_feature info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting place_feature info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Place_feature DAL] Geting a place_feature: ' + query);

    Place_feature
        .findOne(query)     // find the place_feature profile from the query
        .populate(population)   // populate with a Place_feature_profile model link
        .exec(function getPlace_feature(err, place_feature){
            if(err) return callback(err);
            
            // return the place_feature to the callback function. return empity object if the place_feature doesn't exist in the database
            callback(null, place_feature || {});
        });
};

/**
 * UPDATE A PLACE FEATURE
 * 
 * @desc update a place_feature info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updatePlace_feature Updated fields of the place_feature
 * @param {Function} callback a callback function after updating a place_feature info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Place_feature DAL] Updating a place_feature: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Place_feature
        .findOneAndUpdate(query, updates) // find the place_feature from the query and updates them with new updates
        .populate(population)   // populate with a Place_feature_profile model link
        .exec(function updatePlace_feature(err, place_feature){
            if(err) return callback(err);
            
            // return the updated place_feature to the callback function and send an empity object if the place_feature doesn't exist anymore
            callback(null, place_feature || {});
        });
};

/**
 * GET A COLLECTION OF PLACE FEATURES
 * 
 * @desc fetch a collection of place_features from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching place_features info from the database
 * 
 */
exports.getCollection = function getACollectionOfPlace_features(query, callback) {
    debug('[Place_feature DAL] fetching a collection of place_features', query);

    Place_feature
    .find(query)
    .populate(population)
    .exec(function getPlace_featuresCollection(err, place_features){
        if(err) return callback(err);
        
        // return place_features to the callback function
        callback(null, place_features || {});
    });
};
