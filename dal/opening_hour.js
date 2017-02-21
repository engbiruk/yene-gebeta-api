/**
 * Access Layer for Opening_hour Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:opening_hour-dal');
var moment			= require('moment');

// LOAD MODELS
var Opening_hour			= require('../models/opening_hour');

// LOAD POPULATED AND RETURN FIELDS
var population = [{
    path: 'Restaurant'
}];

/**
 * CREATE A NEW OPENING HOUR
 * 
 * @desc creates a new opening_hour and save it to the database
 * @param {Object} opening_hourData Data for the opening_hour to creates
 * @param {Function} callback a callback function after saving opening_hour completes
 * 
 */
exports.create = function create(opening_hourData, callback) {
    debug('[Opening_hour DAL] Creating a new opening_hour...');

    // create an object from the passed opening_hour data
    var opening_hourModel = new Opening_hour(opening_hourData);

    // save the new opening_hour model to the database
    opening_hourModel.save(function saveOpening_hour(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a opening_hour data
        exports.get({_id: data._id}, function (err, opening_hour){
            if(err) return callback(err);
            // callback the opening_hour data if the opening_hour exists or send empity object if it doesn't
            callback(null, opening_hour || {});
        });

    });
};

/**
 * DELETE A OPENING HOUR
 * 
 * @desc deletes a opening_hour info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting opening_hour completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Opening_hour DAL] Deleting opening_hour: ', query);

    Opening_hour
        .findOne(query)     // find the opening_hour from the query
        .populate(population)   // populate with a Opening_hour_profile model link
        .exec(function deleteOpening_hour(err, opening_hour){   // executes the query
            if(err) return callback(err);
            
            // if the opening_hour is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!opening_hour) return callback(null, {});

            // if the opening_hour exist, try removing it from the database
            opening_hour.remove(function removeOpening_hour(err){
                if(err) return callback(err);

                // return the opening_hour to the callback
                callback(null, opening_hour);
            });
        });
};

/**
 * GET A OPENING HOUR
 * 
 * @desc fetch a opening_hour info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting opening_hour info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Opening_hour DAL] Geting a opening_hour: ' + query);

    Opening_hour
        .findOne(query)     // find the opening_hour profile from the query
        .populate(population)   // populate with a Opening_hour_profile model link
        .exec(function getOpening_hour(err, opening_hour){
            if(err) return callback(err);
            
            // return the opening_hour to the callback function. return empity object if the opening_hour doesn't exist in the database
            callback(null, opening_hour || {});
        });
};

/**
 * UPDATE A OPENING HOUR
 * 
 * @desc update a opening_hour info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateOpening_hour Updated fields of the opening_hour
 * @param {Function} callback a callback function after updating a opening_hour info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Opening_hour DAL] Updating a opening_hour: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Opening_hour
        .findOneAndUpdate(query, updates) // find the opening_hour from the query and updates them with new updates
        .populate(population)   // populate with a Opening_hour_profile model link
        .exec(function updateOpening_hour(err, opening_hour){
            if(err) return callback(err);
            
            // return the updated opening_hour to the callback function and send an empity object if the opening_hour doesn't exist anymore
            callback(null, opening_hour || {});
        });
};

/**
 * GET A COLLECTION OF OPENING HOURS
 * 
 * @desc fetch a collection of opening_hours from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching opening_hours info from the database
 * 
 */
exports.getCollection = function getACollectionOfOpening_hours(query, callback) {
    debug('[Opening_hour DAL] fetching a collection of opening_hours', query);

    Opening_hour
    .find(query)
    .populate(population)
    .exec(function getOpening_hoursCollection(err, opening_hours){
        if(err) return callback(err);
        
        // return opening_hours to the callback function
        callback(null, opening_hours || {});
    });
};
