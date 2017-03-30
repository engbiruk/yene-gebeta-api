/**
 * Access Layer for Place Data
 */

// LOAD MODULE DEPEDENCIES
var debug = require('debug')('yene-gebeta-api:place-dal');
var moment = require('moment');
var _ = require('underscore');

// LOAD MODELS
var Place = require('../models/place');

// LOAD POPULATED AND RETURN FIELDS
var population = [
    // {path: 'place_category'},
    { path: 'destination' },
    // {path: 'image'},
    // {path: 'branch'},
    // {path: 'reservation'},
    // {path: 'opening_hours'},
    // {path: 'menu'},
    // {path: 'review'}
    { path: 'logo' }
];

/**
 * GET A RESTAURANT
 * 
 * @desc fetch a place info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting place info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Place DAL] Getting a place: ' + query);

    Place
        .findOne(query) // find the place profile from the query
        .populate(population) // populate with a Place_profile model link
        .exec(function getPlace(err, place) {
            if (err) return callback(err);

            // return the place to the callback function. return empity object if the place doesn't exist in the database
            callback(null, place || {});
        });
};
/**
 * CREATE A NEW RESTAURANT
 * 
 * @desc creates a new place and save it to the database
 * @param {Object} placeData Data for the place to creates
 * @param {Function} callback a callback function after saving place completes
 * 
 */
exports.create = function create(placeData, callback) {
    debug('[Place DAL] Creating a new place...');

    // create an object from the passed place data
    var placeModel = new Place(placeData);

    // save the new place model to the database
    placeModel.save(function savePlace(err, data) {
        if (err) return callback(err);

        // check if the comming data is indeed a place data
        exports.get({ _id: data._id }, function(err, place) {
            if (err) return callback(err);
            // callback the place data if the place exists or send empity object if it doesn't
            callback(null, place || {});
        });

    });
};

/**
 * DELETE A RESTAURANT
 * 
 * @desc deletes a place info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting place completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Place DAL] Deleting place: ', query);

    Place
        .findOne(query) // find the place from the query
        .populate(population) // populate with a Place_profile model link
        .exec(function deletePlace(err, place) { // executes the query
            if (err) return callback(err);

            // if the place is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if (!place) return callback(null, {});

            // if the place exist, try removing it from the database
            place.remove(function removePlace(err) {
                if (err) return callback(err);

                // return the place to the callback
                callback(null, place);
            });
        });
};



/**
 * UPDATE A RESTAURANT
 * 
 * @desc update a place info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updatePlace Updated fields of the place
 * @param {Function} callback a callback function after updating a place info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Place DAL] Updating a place: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Place
        .findOneAndUpdate(query, updates) // find the place from the query and updates them with new updates
        .populate(population) // populate with a Place_profile model link
        .exec(function updatePlace(err, place) {
            if (err) return callback(err);

            // return the updated place to the callback function and send an empity object if the place doesn't exist anymore
            callback(null, place || {});
        });
};

/**
 * GET A COLLECTION OF RESTAURANTS
 * 
 * @desc fetch a collection of places from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching places info from the database
 * 
 */
exports.getCollection = function getACollectionOfPlaces(query, callback) {
    debug('[Place DAL] fetching a collection of places', query);

    Place
        .find(query)
        .populate(population)
        .exec(function getPlacesCollection(err, places) {
            if (err) return callback(err);

            var _places = [];
            places.forEach(function(place) {

                place.omitFields([], function(err, _place) {
                    if (err) return next(err);

                    // if logo is defined
                    if (place.logo) {
                        var _logo = place.logo.toJSON();
                        // filter the fields
                        _place.logo = _.omit(_place.logo, ['__v', 'last_modified', 'date_created']);
                    }

                    // push to _places
                    _places.push(_place);
                });
            });
            // return places to the callback function
            callback(null, _places || {});
        });
};