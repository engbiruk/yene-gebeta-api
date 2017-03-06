/**
 * Access Layer for Menu Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:menu-dal');
var moment			= require('moment');

// LOAD MODELS
var Menu			= require('../models/menu');

// LOAD POPULATED AND RETURN FIELDS
var population = [{
    path: 'Menu_category'
},
{
    path: 'Image'
},
{
    path: 'place'
}];

/**
 * CREATE A NEW MENU
 * 
 * @desc creates a new menu and save it to the database
 * @param {Object} menuData Data for the menu to creates
 * @param {Function} callback a callback function after saving menu completes
 * 
 */
exports.create = function create(menuData, callback) {
    debug('[Menu DAL] Creating a new menu...');

    // create an object from the passed menu data
    var menuModel = new Menu(menuData);

    // save the new menu model to the database
    menuModel.save(function saveMenu(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a menu data
        exports.get({_id: data._id}, function (err, menu){
            if(err) return callback(err);
            // callback the menu data if the menu exists or send empity object if it doesn't
            callback(null, menu || {});
        });

    });
};

/**
 * DELETE A MENU
 * 
 * @desc deletes a menu info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting menu completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Menu DAL] Deleting menu: ', query);

    Menu
        .findOne(query)     // find the menu from the query
        .populate(population)   // populate with a Menu_profile model link
        .exec(function deleteMenu(err, menu){   // executes the query
            if(err) return callback(err);
            
            // if the menu is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!menu) return callback(null, {});

            // if the menu exist, try removing it from the database
            menu.remove(function removeMenu(err){
                if(err) return callback(err);

                // return the menu to the callback
                callback(null, menu);
            });
        });
};

/**
 * GET A MENU
 * 
 * @desc fetch a menu info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting menu info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Menu DAL] Geting a menu: ' + query);

    Menu
        .findOne(query)     // find the menu profile from the query
        .populate(population)   // populate with a Menu_profile model link
        .exec(function getMenu(err, menu){
            if(err) return callback(err);
            
            // return the menu to the callback function. return empity object if the menu doesn't exist in the database
            callback(null, menu || {});
        });
};

/**
 * UPDATE A MENU
 * 
 * @desc update a menu info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateMenu Updated fields of the menu
 * @param {Function} callback a callback function after updating a menu info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Menu DAL] Updating a menu: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Menu
        .findOneAndUpdate(query, updates) // find the menu from the query and updates them with new updates
        .populate(population)   // populate with a Menu_profile model link
        .exec(function updateMenu(err, menu){
            if(err) return callback(err);
            
            // return the updated menu to the callback function and send an empity object if the menu doesn't exist anymore
            callback(null, menu || {});
        });
};

/**
 * GET A COLLECTION OF MENUS
 * 
 * @desc fetch a collection of menus from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching menus info from the database
 * 
 */
exports.getCollection = function getACollectionOfMenus(query, callback) {
    debug('[Menu DAL] fetching a collection of menus', query);

    Menu
    .find(query)
    .populate(population)
    .exec(function getMenusCollection(err, menus){
        if(err) return callback(err);
        
        // return menus to the callback function
        callback(null, menus || {});
    });
};
