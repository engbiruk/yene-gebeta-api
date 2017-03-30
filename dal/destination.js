/**
 * Access Layer for Destination Data
 */

// LOAD MODULE DEPEDENCIES
var debug = require('debug')('yene-gebeta-api:destination-dal');
var moment = require('moment');

// LOAD MODELS
var Destination = require('../models/destination');

// LOAD POPULATED AND RETURN FIELDS
var population = [{
    path: 'place'
}];

/**
 * CREATE A NEW DESTINATION
 * 
 * @desc creates a new destination and save it to the database
 * @param {Object} destinationData Data for the destination to creates
 * @param {Function} callback a callback function after saving destination completes
 * 
 */
exports.create = function create(destinationData, callback) {
    debug('[Destination DAL] Creating a new destination...');

    // create an object from the passed destination data
    var destinationModel = new Destination(destinationData);

    // save the new destination model to the database
    destinationModel.save(function saveDestination(err, data) {
        if (err) return callback(err);

        // check if the comming data is indeed a destination data
        exports.get({ _id: data._id }, function(err, destination) {
            if (err) return callback(err);
            // callback the destination data if the destination exists or send empity object if it doesn't
            callback(null, destination || {});
        });

    });
};

/**
 * DELETE A DESTINATION
 * 
 * @desc deletes a destination info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting destination completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Destination DAL] Deleting destination: ', query);

    Destination
        .findOne(query) // find the destination from the query
        .populate(population) // populate with a Destination model link
        .exec(function deleteDestination(err, destination) { // executes the query
            if (err) return callback(err);

            // if the destination is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if (!destination) return callback(null, {});

            // if the destination exist, try removing it from the database
            destination.remove(function removeDestination(err) {
                if (err) return callback(err);

                // return the destination to the callback
                callback(null, destination);
            });
        });
};

/**
 * GET A DESTINATION
 * 
 * @desc fetch a destination info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting destination info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Destination DAL] Geting a destination: ' + query);

    Destination
        .findOne(query) // find the destination profile from the query
        .populate(population) // populate with a Destination model link
        .exec(function getDestination(err, destination) {
            if (err) return callback(err);

            // return the destination to the callback function. return empity object if the destination doesn't exist in the database
            callback(null, destination || {});
        });
};

/**
 * UPDATE A DESTINATION
 * 
 * @desc update a destination info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateDestination Updated fields of the destination
 * @param {Function} callback a callback function after updating a destination info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Destination DAL] Updating a destination: ', query, updates);

    // set update's set value 
    updates.$set = updates.$set || {};

    Destination
        .findOneAndUpdate(query, updates) // find the destination from the query and updates them with new updates
        .populate(population) // populate with a Destination model link
        .exec(function updateDestination(err, destination) {
            if (err) return callback(err);

            // return the updated destination to the callback function and send an empity object if the destination doesn't exist anymore
            callback(null, destination || {});
        });
};

/**
 * GET A COLLECTION OF DESTINATIONS
 * 
 * @desc fetch a collection of destinations from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching destinations info from the database
 * 
 */
exports.getCollection = function getACollectionOfDestinations(query, callback) {
    debug('[Destination DAL] fetching a collection of destinations', query);

    Destination
        .find(query)
        .populate(population)
        .exec(function getDestinationsCollection(err, destinations) {
            if (err) return callback(err);

            // return destinations to the callback function
            callback(null, destinations || {});
        });
};