/**
 * Access Layer for Reservation Data
 */

// LOAD MODULE DEPEDENCIES
var debug			= require('debug')('yene-gebeta-api:reservation-dal');
var moment			= require('moment');

// LOAD MODELS
var Reservation			= require('../models/reservation');

// LOAD POPULATED AND RETURN FIELDS
var population = [{
    path: 'User_profile'
},
{
    path: 'place'
}];

/**
 * CREATE A NEW RESERVATION
 * 
 * @desc creates a new reservation and save it to the database
 * @param {Object} reservationData Data for the reservation to creates
 * @param {Function} callback a callback function after saving reservation completes
 * 
 */
exports.create = function create(reservationData, callback) {
    debug('[Reservation DAL] Creating a new reservation...');

    // create an object from the passed reservation data
    var reservationModel = new Reservation(reservationData);

    // save the new reservation model to the database
    reservationModel.save(function saveReservation(err, data){
        if(err) return callback(err);
        
        // check if the comming data is indeed a reservation data
        exports.get({_id: data._id}, function (err, reservation){
            if(err) return callback(err);
            // callback the reservation data if the reservation exists or send empity object if it doesn't
            callback(null, reservation || {});
        });

    });
};

/**
 * DELETE A RESERVATION
 * 
 * @desc deletes a reservation info from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after deleting reservation completes
 * 
 */
exports.delete = function remove(query, callback) {
    debug('[Reservation DAL] Deleting reservation: ', query);

    Reservation
        .findOne(query)     // find the reservation from the query
        .populate(population)   // populate with a Reservation_profile model link
        .exec(function deleteReservation(err, reservation){   // executes the query
            if(err) return callback(err);
            
            // if the reservation is not set sed a callback empity object (the object is predeleted or doesn't exist)
            if(!reservation) return callback(null, {});

            // if the reservation exist, try removing it from the database
            reservation.remove(function removeReservation(err){
                if(err) return callback(err);

                // return the reservation to the callback
                callback(null, reservation);
            });
        });
};

/**
 * GET A RESERVATION
 * 
 * @desc fetch a reservation info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after geting reservation info from the database
 * 
 */
exports.get = function get(query, callback) {
    debug('[Reservation DAL] Geting a reservation: ' + query);

    Reservation
        .findOne(query)     // find the reservation profile from the query
        .populate(population)   // populate with a Reservation_profile model link
        .exec(function getReservation(err, reservation){
            if(err) return callback(err);
            
            // return the reservation to the callback function. return empity object if the reservation doesn't exist in the database
            callback(null, reservation || {});
        });
};

/**
 * UPDATE A RESERVATION
 * 
 * @desc update a reservation info from the database using a query object passed
 * @param {Object} query Query Object
 * @param {Object} updateReservation Updated fields of the reservation
 * @param {Function} callback a callback function after updating a reservation info from the database
 * 
 */
exports.update = function update(query, updates, callback) {
    debug('[Reservation DAL] Updating a reservation: ', query);

    // set update's set value 
    updates.$set = updates.$set || {};

    Reservation
        .findOneAndUpdate(query, updates) // find the reservation from the query and updates them with new updates
        .populate(population)   // populate with a Reservation_profile model link
        .exec(function updateReservation(err, reservation){
            if(err) return callback(err);
            
            // return the updated reservation to the callback function and send an empity object if the reservation doesn't exist anymore
            callback(null, reservation || {});
        });
};

/**
 * GET A COLLECTION OF RESERVATIONS
 * 
 * @desc fetch a collection of reservations from the database
 * @param {Object} query Query Object
 * @param {Function} callback a callback function after fetching reservations info from the database
 * 
 */
exports.getCollection = function getACollectionOfReservations(query, callback) {
    debug('[Reservation DAL] fetching a collection of reservations', query);

    Reservation
    .find(query)
    .populate(population)
    .exec(function getReservationsCollection(err, reservations){
        if(err) return callback(err);
        
        // return reservations to the callback function
        callback(null, reservations || {});
    });
};
