/**
 * Access Layer for Branch Data
 */

// LOAD MODULE DEPEDENCIES
var debug = require('debug')('yene-gebeta-api:branch-dal');
var moment = require('moment');

// LOAD MODELS
var Branch = require('../models/branch');

// LOAD POPULATED AND RETURN FIELDS
var population = [{
    path: 'Restaurant'
}];

/**
 * CREATE A NEW BRANCH
 * 
 * @desc creates a new branch and save it to the database
 * @param {Object} branchData Data for the branch to creates
 * @param {Function} callback a callback function after saving branch completes
 * 
 */
exports.create = function create(branchData, callback) {
    debug('[Branch DAL] Creating a new branch...');

    // create an object from the passed branch data
    var branchModel = new Branch(branchData);

    // save the new branch model to the database
    branchModel.save(function saveBranch(err, data) {
        if (err) return callback(err);

        // check if the comming data is indeed a branch data
        exports.get({ _id: data._id }, function (err, branch) {
            if (err) return callback(err);
            // callback the branch data if the branch exists or send empity object if it doesn't
            callback(null, branch || {});
        });

    });
};

/**
 * DELETE A BRANCH
 * 
 * @desc deletes a branch info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting branch completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Branch DAL] Deleting branch: ', query);

    Branch
        .findOne(query)     // find the branch from the query
        .populate(population)   // populate with a Branch_profile model link
        .exec(function deleteBranch(err, branch) {   // executes the query
            if (err) return callback(err);

            // if the branch is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if (!branch) return callback(null, {});

            // if the branch exist, try removing it from the database
            branch.remove(function removeBranch(err) {
                if (err) return callback(err);

                // return the branch to the callback
                callback(null, branch);
            });
        });
};

/**
 * GET A BRANCH
 * 
 * @desc fetch a branch info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting branch info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Branch DAL] Geting a branch: ' + query);

    Branch
        .findOne(query)     // find the branch profile from the query
        .populate(population)   // populate with a Branch_profile model link
        .exec(function getBranch(err, branch) {
            if (err) return callback(err);

            // return the branch to the callback function. return empity object if the branch doesn't exist in the database
            callback(null, branch || {});
        });
};

/**
 * UPDATE A BRANCH
 * 
 * @desc update a branch info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateBranch Updated fields of the branch
 * @param {Function} callback a callback function after updating a branch info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Branch DAL] Updating a branch: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Branch
        .findOneAndUpdate(query, updates) // find the branch from the query and updates them with new updates
        .populate(population)   // populate with a Branch_profile model link
        .exec(function updateBranch(err, branch) {
            if (err) return callback(err);

            // return the updated branch to the callback function and send an empity object if the branch doesn't exist anymore
            callback(null, branch || {});
        });
};

/**
 * GET A COLLECTION OF BRANCHS
 * 
 * @desc fetch a collection of branchs from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching branchs info from the database
 * 
 */

exports.getCollection = function getACollectionOfBranchs(query, callback) {
    debug('[Branch DAL] fetching a collection of branchs', query);

    Branch
        .find(query)
        .populate(population)
        .exec(function getBranchsCollection(err, branchs) {
            if (err) return callback(err);

            // return branchs to the callback function
            callback(null, branchs || {});
        });
};
