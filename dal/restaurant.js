/**
 * Access Layer for Restaurant Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:restaurant-dal');
var moment			= require('moment');

// LOAD MODELS
var Restaurant			= require('../models/restaurant');

// LOAD POPULATED AND RETURN FIELDS
var population = [
    {path: 'Category'},{path: 'Image'},{path: 'Branch'},{path: 'Reservation'},{path: 'Opening_hours'},{path: 'Menu'},{path: 'Review'}
];

/**
 * CREATE A NEW RESTAURANT
 * 
 * @desc creates a new restaurant and save it to the database
 * @param {Object} restaurantData Data for the restaurant to creates
 * @param {Function} callback a callback function after saving restaurant completes
 * 
 */
exports.create = function create(restaurantData, callback) {
    debug('[Restaurant DAL] Creating a new restaurant...');

    // create an object from the passed restaurant data
    var restaurantModel = new Restaurant(restaurantData);

    // save the new restaurant model to the database
    restaurantModel.save(function saveRestaurant(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a restaurant data
        exports.get({_id: data._id}, function (err, restaurant){
            if(err) return callback(err);
            // callback the restaurant data if the restaurant exists or send empity object if it doesn't
            callback(null, restaurant || {});
        });

    });
};

/**
 * DELETE A RESTAURANT
 * 
 * @desc deletes a restaurant info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting restaurant completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Restaurant DAL] Deleting restaurant: ', query);

    Restaurant
        .findOne(query)     // find the restaurant from the query
        .populate(population)   // populate with a Restaurant_profile model link
        .exec(function deleteRestaurant(err, restaurant){   // executes the query
            if(err) return callback(err);
            
            // if the restaurant is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!restaurant) return callback(null, {});

            // if the restaurant exist, try removing it from the database
            restaurant.remove(function removeRestaurant(err){
                if(err) return callback(err);

                // return the restaurant to the callback
                callback(null, restaurant);
            });
        });
};

/**
 * GET A RESTAURANT
 * 
 * @desc fetch a restaurant info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting restaurant info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Restaurant DAL] Geting a restaurant: ' + query);

    Restaurant
        .findOne(query)     // find the restaurant profile from the query
        .populate(population)   // populate with a Restaurant_profile model link
        .exec(function getRestaurant(err, restaurant){
            if(err) return callback(err);
            
            // return the restaurant to the callback function. return empity object if the restaurant doesn't exist in the database
            callback(null, restaurant || {});
        });
};

/**
 * UPDATE A RESTAURANT
 * 
 * @desc update a restaurant info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateRestaurant Updated fields of the restaurant
 * @param {Function} callback a callback function after updating a restaurant info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Restaurant DAL] Updating a restaurant: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Restaurant
        .findOneAndUpdate(query, updates) // find the restaurant from the query and updates them with new updates
        .populate(population)   // populate with a Restaurant_profile model link
        .exec(function updateRestaurant(err, restaurant){
            if(err) return callback(err);
            
            // return the updated restaurant to the callback function and send an empity object if the restaurant doesn't exist anymore
            callback(null, restaurant || {});
        });
};

/**
 * GET A COLLECTION OF RESTAURANTS
 * 
 * @desc fetch a collection of restaurants from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching restaurants info from the database
 * 
 */
exports.getCollection = function getACollectionOfRestaurants(query, callback) {
    debug('[Restaurant DAL] fetching a collection of restaurants', query);

    Restaurant
    .find(query)
    .populate(population)
    .exec(function getRestaurantsCollection(err, restaurants){
        if(err) return callback(err);
        
        // return restaurants to the callback function
        callback(null, restaurants || {});
    });
};
