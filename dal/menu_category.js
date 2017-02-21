/**
 * Access Layer for Menu_category Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:menu_category-dal');
var moment			= require('moment');

// LOAD MODELS
var Menu_category			= require('../models/menu_category');

// LOAD POPULATED AND RETURN FIELDS
var population = [];

/**
 * CREATE A NEW MENU CATEGORY
 * 
 * @desc creates a new menu_category and save it to the database
 * @param {Object} menu_categoryData Data for the menu_category to creates
 * @param {Function} callback a callback function after saving menu_category completes
 * 
 */
exports.create = function create(menu_categoryData, callback) {
    debug('[Menu_category DAL] Creating a new menu_category...');

    // create an object from the passed menu_category data
    var menu_categoryModel = new Menu_category(menu_categoryData);

    // save the new menu_category model to the database
    menu_categoryModel.save(function saveMenu_category(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a menu_category data
        exports.get({_id: data._id}, function (err, menu_category){
            if(err) return callback(err);
            // callback the menu_category data if the menu_category exists or send empity object if it doesn't
            callback(null, menu_category || {});
        });

    });
};

/**
 * DELETE A MENU CATEGORY
 * 
 * @desc deletes a menu_category info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting menu_category completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Menu_category DAL] Deleting menu_category: ', query);

    Menu_category
        .findOne(query)     // find the menu_category from the query
        .populate(population)   // populate with a Menu_category_profile model link
        .exec(function deleteMenu_category(err, menu_category){   // executes the query
            if(err) return callback(err);
            
            // if the menu_category is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!menu_category) return callback(null, {});

            // if the menu_category exist, try removing it from the database
            menu_category.remove(function removeMenu_category(err){
                if(err) return callback(err);

                // return the menu_category to the callback
                callback(null, menu_category);
            });
        });
};

/**
 * GET A MENU CATEGORY
 * 
 * @desc fetch a menu_category info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting menu_category info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Menu_category DAL] Geting a menu_category: ' + query);

    Menu_category
        .findOne(query)     // find the menu_category profile from the query
        .populate(population)   // populate with a Menu_category_profile model link
        .exec(function getMenu_category(err, menu_category){
            if(err) return callback(err);
            
            // return the menu_category to the callback function. return empity object if the menu_category doesn't exist in the database
            callback(null, menu_category || {});
        });
};

/**
 * UPDATE A MENU CATEGORY
 * 
 * @desc update a menu_category info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateMenu_category Updated fields of the menu_category
 * @param {Function} callback a callback function after updating a menu_category info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Menu_category DAL] Updating a menu_category: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Menu_category
        .findOneAndUpdate(query, updates) // find the menu_category from the query and updates them with new updates
        .populate(population)   // populate with a Menu_category_profile model link
        .exec(function updateMenu_category(err, menu_category){
            if(err) return callback(err);
            
            // return the updated menu_category to the callback function and send an empity object if the menu_category doesn't exist anymore
            callback(null, menu_category || {});
        });
};

/**
 * GET A COLLECTION OF MENU CATEGORYS
 * 
 * @desc fetch a collection of menu_categorys from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching menu_categorys info from the database
 * 
 */
exports.getCollection = function getACollectionOfMenu_categorys(query, callback) {
    debug('[Menu_category DAL] fetching a collection of menu_categorys', query);

    Menu_category
    .find(query)
    .populate(population)
    .exec(function getMenu_categorysCollection(err, menu_categorys){
        if(err) return callback(err);
        
        // return menu_categorys to the callback function
        callback(null, menu_categorys || {});
    });
};
