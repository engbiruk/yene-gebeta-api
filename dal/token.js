/**
 * Access Layer for Token Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:token-dal');
var moment			= require('moment');

// LOAD MODELS
var Token			= require('../models/token');

// LOAD POPULATED AND RETURN FIELDS
var population = [{
    path: 'user'
}];

/**
 * CREATE A NEW TOKEN
 * 
 * @desc creates a new token and save it to the database
 * @param {Object} tokenData Data for the token to creates
 * @param {Function} callback a callback function after saving token completes
 * 
 */
exports.create = function create(tokenData, callback) {
    debug('[Token DAL] Creating a new token...');

    // create an object from the passed token data
    var tokenModel = new Token(tokenData);

    // save the new token model to the database
    tokenModel.save(function saveToken(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a token data
        exports.get({_id: data._id}, function (err, token){
            if(err) return callback(err);
            // callback the token data if the token exists or send empity object if it doesn't
            callback(null, token || {});
        });

    });
};

/**
 * DELETE A TOKEN
 * 
 * @desc deletes a token info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting token completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Token DAL] Deleting token: ', query);

    Token
        .findOne(query)     // find the token from the query
        .populate(population)   // populate with a Token_profile model link
        .exec(function deleteToken(err, token){   // executes the query
            if(err) return callback(err);
            
            // if the token is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!token) return callback(null, {});

            // if the token exist, try removing it from the database
            token.remove(function removeToken(err){
                if(err) return callback(err);

                // return the token to the callback
                callback(null, token);
            });
        });
};

/**
 * GET A TOKEN
 * 
 * @desc fetch a token info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting token info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Token DAL] Geting a token: ' + query);

    Token
        .findOne(query)     // find the token profile from the query
        .populate(population)   // populate with a Token_profile model link
        .exec(function getToken(err, token){
            if(err) return callback(err);
            
            // return the token to the callback function. return empity object if the token doesn't exist in the database
            callback(null, token || {});
        });
};

/**
 * UPDATE A TOKEN
 * 
 * @desc update a token info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateToken Updated fields of the token
 * @param {Function} callback a callback function after updating a token info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Token DAL] Updating a token: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Token
        .findOneAndUpdate(query, updates) // find the token from the query and updates them with new updates
        .populate(population)   // populate with a Token_profile model link
        .exec(function updateToken(err, token){
            if(err) return callback(err);
            
            // return the updated token to the callback function and send an empity object if the token doesn't exist anymore
            callback(null, token || {});
        });
};

/**
 * GET A COLLECTION OF TOKENS
 * 
 * @desc fetch a collection of tokens from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching tokens info from the database
 * 
 */
exports.getCollection = function getACollectionOfTokens(query, callback) {
    debug('[Token DAL] fetching a collection of tokens', query);

    Token
    .find(query)
    .populate(population)
    .exec(function getTokensCollection(err, tokens){
        if(err) return callback(err);
        
        // return tokens to the callback function
        callback(null, tokens || {});
    });
};
