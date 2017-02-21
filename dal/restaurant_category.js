/**
 * Access Layer for Restaurant_category Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:restaurant_category-dal');
var moment			= require('moment');

// LOAD MODELS
var Restaurant_category			= require('../models/restaurant_category');

// LOAD POPULATED AND RETURN FIELDS
var population = [];

/**
 * CREATE A NEW RESTAURANT CATEGORY
 * 
 * @desc creates a new restaurant_category and save it to the database
 * @param {Object} restaurant_categoryData Data for the restaurant_category to creates
 * @param {Function} callback a callback function after saving restaurant_category completes
 * 
 */
exports.create = function create(restaurant_categoryData, callback) {
    debug('[Restaurant_category DAL] Creating a new restaurant_category...');

    // create an object from the passed restaurant_category data
    var restaurant_categoryModel = new Restaurant_category(restaurant_categoryData);

    // save the new restaurant_category model to the database
    restaurant_categoryModel.save(function saveRestaurant_category(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a restaurant_category data
        exports.get({_id: data._id}, function (err, restaurant_category){
            if(err) return callback(err);
            // callback the restaurant_category data if the restaurant_category exists or send empity object if it doesn't
            callback(null, restaurant_category || {});
        });

    });
};

/**
 * DELETE A RESTAURANT CATEGORY
 * 
 * @desc deletes a restaurant_category info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting restaurant_category completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Restaurant_category DAL] Deleting restaurant_category: ', query);

    Restaurant_category
        .findOne(query)     // find the restaurant_category from the query
        .populate(population)   // populate with a Restaurant_category_profile model link
        .exec(function deleteRestaurant_category(err, restaurant_category){   // executes the query
            if(err) return callback(err);
            
            // if the restaurant_category is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!restaurant_category) return callback(null, {});

            // if the restaurant_category exist, try removing it from the database
            restaurant_category.remove(function removeRestaurant_category(err){
                if(err) return callback(err);

                // return the restaurant_category to the callback
                callback(null, restaurant_category);
            });
        });
};

/**
 * GET A RESTAURANT CATEGORY
 * 
 * @desc fetch a restaurant_category info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting restaurant_category info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Restaurant_category DAL] Geting a restaurant_category: ' + query);

    Restaurant_category
        .findOne(query)     // find the restaurant_category profile from the query
        .populate(population)   // populate with a Restaurant_category_profile model link
        .exec(function getRestaurant_category(err, restaurant_category){
            if(err) return callback(err);
            
            // return the restaurant_category to the callback function. return empity object if the restaurant_category doesn't exist in the database
            callback(null, restaurant_category || {});
        });
};

/**
 * UPDATE A RESTAURANT CATEGORY
 * 
 * @desc update a restaurant_category info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateRestaurant_category Updated fields of the restaurant_category
 * @param {Function} callback a callback function after updating a restaurant_category info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Restaurant_category DAL] Updating a restaurant_category: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Restaurant_category
        .findOneAndUpdate(query, updates) // find the restaurant_category from the query and updates them with new updates
        .populate(population)   // populate with a Restaurant_category_profile model link
        .exec(function updateRestaurant_category(err, restaurant_category){
            if(err) return callback(err);
            
            // return the updated restaurant_category to the callback function and send an empity object if the restaurant_category doesn't exist anymore
            callback(null, restaurant_category || {});
        });
};

/**
 * GET A COLLECTION OF RESTAURANT CATEGORYS
 * 
 * @desc fetch a collection of restaurant_categorys from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching restaurant_categorys info from the database
 * 
 */
exports.getCollection = function getACollectionOfRestaurant_categorys(query, callback) {
    debug('[Restaurant_category DAL] fetching a collection of restaurant_categorys', query);

    Restaurant_category
    .find(query)
    .populate(population)
    .exec(function getRestaurant_categorysCollection(err, restaurant_categorys){
        if(err) return callback(err);
        
        // return restaurant_categorys to the callback function
        callback(null, restaurant_categorys || {});
    });
};
