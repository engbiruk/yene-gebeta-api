/**
 * Access Layer for Image Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:image-dal');
var moment			= require('moment');

// LOAD MODELS
var Image			= require('../models/image');

// LOAD POPULATED AND RETURN FIELDS
var population = [
// {
//     path: 'menu'
// },
{
    path: 'place'
}
// ,
// {
//     path: 'user_profile'
// },
// {
//     path: 'review'
// }
];

/**
 * CREATE A NEW IMAGE
 * 
 * @desc creates a new image and save it to the database
 * @param {Object} imageData Data for the image to creates
 * @param {Function} callback a callback function after saving image completes
 * 
 */
exports.create = function create(imageData, callback) {
    debug('[Image DAL] Creating a new image...');

    // create an object from the passed image data
    var imageModel = new Image(imageData);

    // save the new image model to the database
    imageModel.save(function saveImage(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a image data
        exports.get({_id: data._id}, function (err, image){
            if(err) return callback(err);
            // callback the image data if the image exists or send empity object if it doesn't
            callback(null, image || {});
        });

    });
};

/**
 * DELETE A IMAGE
 * 
 * @desc deletes a image info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting image completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Image DAL] Deleting image: ', query);

    Image
        .findOne(query)     // find the image from the query
        .populate(population)   // populate with a Image_profile model link
        .exec(function deleteImage(err, image){   // executes the query
            if(err) return callback(err);
            
            // if the image is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!image) return callback(null, {});

            // if the image exist, try removing it from the database
            image.remove(function removeImage(err){
                if(err) return callback(err);

                // return the image to the callback
                callback(null, image);
            });
        });
};

/**
 * GET A IMAGE
 * 
 * @desc fetch a image info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting image info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Image DAL] Geting a image: ' + query);

    Image
        .findOne(query)     // find the image profile from the query
        .populate(population)   // populate with a Image_profile model link
        .exec(function getImage(err, image){
            if(err) return callback(err);
            
            // return the image to the callback function. return empity object if the image doesn't exist in the database
            callback(null, image || {});
        });
};

/**
 * UPDATE A IMAGE
 * 
 * @desc update a image info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateImage Updated fields of the image
 * @param {Function} callback a callback function after updating a image info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Image DAL] Updating a image: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Image
        .findOneAndUpdate(query, updates) // find the image from the query and updates them with new updates
        .populate(population)   // populate with a Image_profile model link
        .exec(function updateImage(err, image){
            if(err) return callback(err);
            
            // return the updated image to the callback function and send an empity object if the image doesn't exist anymore
            callback(null, image || {});
        });
};

/**
 * GET A COLLECTION OF IMAGES
 * 
 * @desc fetch a collection of images from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching images info from the database
 * 
 */
exports.getCollection = function getACollectionOfImages(query, callback) {
    debug('[Image DAL] fetching a collection of images', query);

    Image
    .find(query)
    .populate(population)
    .exec(function getImagesCollection(err, images){
        if(err) return callback(err);
        
        // return images to the callback function
        callback(null, images || {});
    });
};
