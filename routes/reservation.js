// LOAD MODULE DEPENDECIES
var express = require('express');

// LOAD CONTROLLERS
var reservation = require('../controllers/reservation');
var auth = require('../controllers/auth');
var authorize = require('../lib/authorize');
//var authenticate = require('../lib/authenticate');

// CREATE A ROUTER
var router = express.Router();

/**
 * @api {get} /reservations/all Get All Reservations
 * @apiDescription Get All Reservations
 * @apiGroup Reservation
 * @apiName Reservation Get All
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} _id Id
 * @apiSuccess {Number} number_of_guests  Number of Guests
 * @apiSuccess {String} reservation_date  Reservation Date
 * @apiSuccess {String} reservation_time  Reservation Time
 * @apiSuccess {String} note  Note or Special requests
 * @apiSuccess {Object} place  Place of Reservation
 * @apiSuccess {Object} user  User Profile
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * [
 *  {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *	 "number_of_guests": 4,
 *	 "reservation_date": "22/03/2017",
 *	 "reservation_time": "22:17",
 *	 "note": "",
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "user_profile": "58d6ac4c7eaf1c4a3811dd2c"
 *  }
 *
 * ]
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 404 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Reservations Found!"
 * }
 * 
 */
// GET /reservation/all
router.get('/all', reservation.getAllReservations);

/**
 * @api {delete} /reservations/:reservationId Delete Reservation
 * @apiDescription Delete Reservation
 * @apiGroup Reservation
 * @apiName Reservation Delete
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} _id Id
 * @apiSuccess {Number} number_of_guests  Number of Guests
 * @apiSuccess {String} reservation_date  Reservation Date
 * @apiSuccess {String} reservation_time  Reservation Time
 * @apiSuccess {String} note  Note or Special requests
 * @apiSuccess {Object} place  Place of Reservation
 * @apiSuccess {Object} user_profile  User Profile
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *	 "number_of_guests": 4,
 *	 "reservation_date": "22/03/2017",
 *	 "reservation_time": "22:17",
 *	 "note": "",
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "user_profile": "58d6ac4c7eaf1c4a3811dd2c"
 * }
 *
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Reservation has been registered to delete!"
 * }
 * 
 */

// DELETE /reservation/:reservationId
router.delete('/:reservationId', reservation.deleteReservation);

/**
 * @api {get} /reservations/:reservationId Get Reservation
 * @apiDescription Get Reservation
 * @apiGroup Reservation
 * @apiName Reservation Get
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} _id Id
 * @apiSuccess {Number} number_of_guests  Number of Guests
 * @apiSuccess {String} reservation_date  Reservation Date
 * @apiSuccess {String} reservation_time  Reservation Time
 * @apiSuccess {String} note  Note or Special requests
 * @apiSuccess {Object} place  Place of Reservation
 * @apiSuccess {Object} user_profile  User Profile
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *	 "number_of_guests": 4,
 *	 "reservation_date": "22/03/2017",
 *	 "reservation_time": "22:17",
 *	 "note": "",
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "user_profile": "58d6ac4c7eaf1c4a3811dd2c"
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Reservation has been registered with this ID!"
 * }
 * 
 */
// GET /reservation/:reservationId
router.get('/:reservationId', reservation.getReservation);

/**
 * @api {put} /reservations/:reservationId Update Reservation
 * @apiDescription Update Reservation
 * @apiGroup Reservation
 * @apiName Reservation Update
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} number_of_guests  Number of Guests
 * @apiParam {String} reservation_date  Reservation Date
 * @apiParam {String} reservation_time  Reservation Time
 * @apiParam {String} [note]  Note or Special requests
 * 
 * @apiExample Request Example:
 * {
 *	 "number_of_guests": 4,
 *	 "reservation_date": "22/03/2017",
 *	 "reservation_time": "22:17",
 *	 "note": ""
 * }
 * 
 * @apiSuccess {String} _id Id
 * @apiSuccess {Number} number_of_guests  Number of Guests
 * @apiSuccess {String} reservation_date  Reservation Date
 * @apiSuccess {String} reservation_time  Reservation Time
 * @apiSuccess {String} note  Note or Special requests
 * @apiSuccess {Object} place  Place of Reservation
 * @apiSuccess {Object} user_profile  User Profile
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *   "_id": "58ca57baf43c1b4e5ca9164c",
 *	 "number_of_guests": 4,
 *	 "reservation_date": "22/03/2017",
 *	 "reservation_time": "22:17",
 *	 "note": "",
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "user_profile": "58d6ac4c7eaf1c4a3811dd2c"
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Reservation has been registered with this ID! to update."
 * }
 * 
 */
// PUT /reservation/:reservationId
router.put('/:reservationId', reservation.updateReservation);

/**
 * @api {post} /reservations Create Reservation
 * @apiDescription Create Reservation
 * @apiGroup Reservation
 * @apiName Reservation Create
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} number_of_guests  Number of Guests
 * @apiParam {String} reservation_date  Reservation Date
 * @apiParam {String} reservation_time  Reservation Time
 * @apiParam {String} [note]  Note or Special requests
 * @apiParam {String} place  Place of Reservation
 * @apiParam {String} user  User Id
 * 
 * @apiExample Request Example:
 * {
 *	 "number_of_guests": 4,
 *	 "reservation_date": "22/03/2017",
 *	 "reservation_time": "22:17",
 *	 "note": "",
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "user": "58d6ac4c7eaf1c4a3811dd2c"
 * }
 * 
 * @apiSuccess {String} _id Id
 * @apiSuccess {Number} number_of_guests  Number of Guests
 * @apiSuccess {String} reservation_date  Reservation Date
 * @apiSuccess {String} reservation_time  Reservation Time
 * @apiSuccess {String} note  Note or Special requests
 * @apiSuccess {Object} place  Place of Reservation
 * @apiSuccess {Object} user_profile  User Profile
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *	 "number_of_guests": 4,
 *	 "reservation_date": "22/03/2017",
 *	 "reservation_time": "22:17",
 *	 "note": "",
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "user_profile": "58d6ac4c7eaf1c4a3811dd2c"
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "The Place feature already registered with the same name!"
 * }
 * 
 * 
 */
// POST /reservation
router.post('/', reservation.createReservation);

module.exports = router;