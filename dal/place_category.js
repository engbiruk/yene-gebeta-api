/**
 * Access Layer for Place_category Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:place_category-dal');
var moment			= require('moment');

// LOAD MODELS
var Place_category			= require('../models/place_category');

// LOAD POPULATED AND RETURN FIELDS
var population = [];

/**
 * CREATE A NEW RESTAURANT CATEGORY
 * 
 * @desc creates a new place_category and save it to the database
 * @param {Object} place_categoryData Data for the place_category to creates
 * @param {Function} callback a callback function after saving place_category completes
 * 
 */
exports.create = function create(place_categoryData, callback) {
    debug('[Place_category DAL] Creating a new place_category...');

    // create an object from the passed place_category data
    var place_categoryModel = new Place_category(place_categoryData);

    // save the new place_category model to the database
    place_categoryModel.save(function savePlace_category(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a place_category data
        exports.get({_id: data._id}, function (err, place_category){
            if(err) return callback(err);
            // callback the place_category data if the place_category exists or send empity object if it doesn't
            callback(null, place_category || {});
        });

    });
};

/**
 * DELETE A RESTAURANT CATEGORY
 * 
 * @desc deletes a place_category info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting place_category completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Place_category DAL] Deleting place_category: ', query);

    Place_category
        .findOne(query)     // find the place_category from the query
        .populate(population)   // populate with a Place_category_profile model link
        .exec(function deletePlace_category(err, place_category){   // executes the query
            if(err) return callback(err);
            
            // if the place_category is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!place_category) return callback(null, {});

            // if the place_category exist, try removing it from the database
            place_category.remove(function removePlace_category(err){
                if(err) return callback(err);

                // return the place_category to the callback
                callback(null, place_category);
            });
        });
};

/**
 * GET A RESTAURANT CATEGORY
 * 
 * @desc fetch a place_category info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting place_category info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Place_category DAL] Geting a place_category: ' + query);

    Place_category
        .findOne(query)     // find the place_category profile from the query
        .populate(population)   // populate with a Place_category_profile model link
        .exec(function getPlace_category(err, place_category){
            if(err) return callback(err);
            
            // return the place_category to the callback function. return empity object if the place_category doesn't exist in the database
            callback(null, place_category || {});
        });
};

/**
 * UPDATE A RESTAURANT CATEGORY
 * 
 * @desc update a place_category info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updatePlace_category Updated fields of the place_category
 * @param {Function} callback a callback function after updating a place_category info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Place_category DAL] Updating a place_category: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Place_category
        .findOneAndUpdate(query, updates) // find the place_category from the query and updates them with new updates
        .populate(population)   // populate with a Place_category_profile model link
        .exec(function updatePlace_category(err, place_category){
            if(err) return callback(err);
            
            // return the updated place_category to the callback function and send an empity object if the place_category doesn't exist anymore
            callback(null, place_category || {});
        });
};

/**
 * GET A COLLECTION OF RESTAURANT CATEGORYS
 * 
 * @desc fetch a collection of place_categorys from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching place_categorys info from the database
 * 
 */
exports.getCollection = function getACollectionOfPlace_categorys(query, callback) {
    debug('[Place_category DAL] fetching a collection of place_categorys', query);

    Place_category
    .find(query)
    .populate(population)
    .exec(function getPlace_categorysCollection(err, place_categorys){
        if(err) return callback(err);
        
        // return place_categorys to the callback function
        callback(null, place_categorys || {});
    });
};
