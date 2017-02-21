/**
 * Access Layer for Review Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:review-dal');
var moment			= require('moment');

// LOAD MODELS
var Review			= require('../models/review');

// LOAD POPULATED AND RETURN FIELDS
var population = [{
    path: 'User_profile'
},
{
    path: 'Image'
},
{
    path: 'Restaurant'
}];

/**
 * CREATE A NEW REVIEW
 * 
 * @desc creates a new review and save it to the database
 * @param {Object} reviewData Data for the review to creates
 * @param {Function} callback a callback function after saving review completes
 * 
 */
exports.create = function create(reviewData, callback) {
    debug('[Review DAL] Creating a new review...');

    // create an object from the passed review data
    var reviewModel = new Review(reviewData);

    // save the new review model to the database
    reviewModel.save(function saveReview(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a review data
        exports.get({_id: data._id}, function (err, review){
            if(err) return callback(err);
            // callback the review data if the review exists or send empity object if it doesn't
            callback(null, review || {});
        });

    });
};

/**
 * DELETE A REVIEW
 * 
 * @desc deletes a review info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting review completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Review DAL] Deleting review: ', query);

    Review
        .findOne(query)     // find the review from the query
        .populate(population)   // populate with a Review_profile model link
        .exec(function deleteReview(err, review){   // executes the query
            if(err) return callback(err);
            
            // if the review is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!review) return callback(null, {});

            // if the review exist, try removing it from the database
            review.remove(function removeReview(err){
                if(err) return callback(err);

                // return the review to the callback
                callback(null, review);
            });
        });
};

/**
 * GET A REVIEW
 * 
 * @desc fetch a review info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting review info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Review DAL] Geting a review: ' + query);

    Review
        .findOne(query)     // find the review profile from the query
        .populate(population)   // populate with a Review_profile model link
        .exec(function getReview(err, review){
            if(err) return callback(err);
            
            // return the review to the callback function. return empity object if the review doesn't exist in the database
            callback(null, review || {});
        });
};

/**
 * UPDATE A REVIEW
 * 
 * @desc update a review info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateReview Updated fields of the review
 * @param {Function} callback a callback function after updating a review info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Review DAL] Updating a review: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Review
        .findOneAndUpdate(query, updates) // find the review from the query and updates them with new updates
        .populate(population)   // populate with a Review_profile model link
        .exec(function updateReview(err, review){
            if(err) return callback(err);
            
            // return the updated review to the callback function and send an empity object if the review doesn't exist anymore
            callback(null, review || {});
        });
};

/**
 * GET A COLLECTION OF REVIEWS
 * 
 * @desc fetch a collection of reviews from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching reviews info from the database
 * 
 */
exports.getCollection = function getACollectionOfReviews(query, callback) {
    debug('[Review DAL] fetching a collection of reviews', query);

    Review
    .find(query)
    .populate(population)
    .exec(function getReviewsCollection(err, reviews){
        if(err) return callback(err);
        
        // return reviews to the callback function
        callback(null, reviews || {});
    });
};
