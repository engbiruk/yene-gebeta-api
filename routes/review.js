// LOAD MODULE DEPENDECIES
var express = require('express');

// LOAD CONTROLLERS
var review = require('../controllers/review');
var auth = require('../controllers/auth');
var authorize = require('../lib/authorize');
var authenticate = require('../lib/authenticate');

// CREATE A ROUTER
var router = express.Router();

/**
 * @api {get} /reviews/all Get All Reviews
 * @apiDescription Get All Reviews
 * @apiGroup Review
 * @apiName Review Get All
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} review List of Reviews
 * @apiSuccess {String} _id Id
 * @apiSuccess {Number} rate Rate
 * @apiSuccess {String} title  Review Title
 * @apiSuccess {String} description  Description
 * @apiSuccess {Object} user User Detail
 * @apiSuccess {Object} place Place Detail
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * [
 *  {
 *       "rate": 4.5,
 *  	 "title": "Very Cool Place",
 *  	 "description": "I love the place",
 *  	 "place": "58bdb8204e72552d1449ee93",
 *  	 "user": "58d6ac4c7eaf1c4a3811dd2c"
 *  }
 * ]
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 404 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Reviews Found!"
 * }
 * 
 */
// GET /reviews/all
router.get('/all', review.getAllReviews);

/**
 * @api {get} /reviews/place/:placeId Get Review with in a place
 * @apiDescription Get Review with in a place
 * @apiGroup Review
 * @apiName Review Get based on place
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} _id Id
 * @apiSuccess {Number} number_of_guests  Number of Guests
 * @apiSuccess {String} review_date  Review Date
 * @apiSuccess {String} review_time  Review Time
 * @apiSuccess {String} note  Note or Special requests
 * @apiSuccess {Object} place  Place of Review
 * @apiSuccess {Object} user_profile  User Profile
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *	 "number_of_guests": 4,
 *	 "review_date": "22/03/2017",
 *	 "review_time": "22:17",
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
 *      "message": "NO Review has been registered with this ID!"
 * }
 * 
 */
// GET /review/place/:placeId
router.get('/place/:placeId', review.getReviewWithPlace);

/**
 * @api {post} /reviews Create Review
 * @apiDescription Create Review
 * @apiGroup Review
 * @apiName Review Create
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} rate Rate
 * @apiParam {String} [title]  Review Title
 * @apiParam {String} [description]  Description
 * @apiParam {String} place Place Id
 *
 * @apiExample Request Example:
 * {
 *   "rate": 4.5,
 *	 "title": "Very Cool Place",
 *	 "description": "I love the place",
 *	 "place": "58bdb8204e72552d1449ee93"
 * }
 * 
 * @apiSuccess {String} _id Id
 * @apiSuccess {Number} rate Rate
 * @apiSuccess {String} title  Review Title
 * @apiSuccess {String} description  Description
 * @apiSuccess {Object} user User Detail
 * @apiSuccess {Object} place Place Detail
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *   "rate": 4.5,
 *	 "title": "Very Cool Place",
 *	 "description": "I love the place",
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "user": "58d6ac4c7eaf1c4a3811dd2c"
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "The Review already registered with the same name!"
 * }
 * 
 * 
 */
// POST /reviews
router.post('/', authenticate(), review.createReview);

/**
 * @api {delete} /reviews/:reviewId Delete Review
 * @apiDescription Delete Review
 * @apiGroup Review
 * @apiName Review Delete
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {String} _id Id
 * @apiSuccess {Number} rate Rate
 * @apiSuccess {String} title  Review Title
 * @apiSuccess {String} description  Description
 * @apiSuccess {Object} user User Detail
 * @apiSuccess {Object} place Place Detail
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "message": "Review is successfuly Deleted!",
 *  "data":
 *      {
 *           "rate": 4.5,
 *      	 "title": "Very Cool Place",
 *      	 "description": "I love the place",
 *      	 "place": "58bdb8204e72552d1449ee93",
 *      	 "user": "58d6ac4c7eaf1c4a3811dd2c"
 *      }
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Review has been registered to delete!"
 * }
 * 
 */

// DELETE /reviews/:reviewId
router.delete('/:reviewId', authenticate(), review.deleteReview);

/**
 * @api {get} /reviews/:reviewId Get Review
 * @apiDescription Get Review
 * @apiGroup Review
 * @apiName Review Get
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} _id Id
 * @apiSuccess {Number} rate Rate
 * @apiSuccess {String} title  Review Title
 * @apiSuccess {String} description  Description
 * @apiSuccess {Object} user User Detail
 * @apiSuccess {Object} place Place Detail
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 *  {
 *       "rate": 4.5,
 *  	 "title": "Very Cool Place",
 *  	 "description": "I love the place",
 *  	 "place": "58bdb8204e72552d1449ee93",
 *  	 "user": "58d6ac4c7eaf1c4a3811dd2c"
 *  }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 404 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Reviews Found!"
 * }
 * 
 */
// GET /reviews/:reviewId
router.get('/:reviewId', authenticate(), review.getReview);

/**
 * @api {put} /reviews/:reviewId Update Review
 * @apiDescription Update Review
 * @apiGroup Review
 * @apiName Review Update
 * @apiVersion 1.0.0
 * 
 * @apiParam {Number} rate Rate
 * @apiParam {String} [title]  Review Title
 * @apiParam {String} [description]  Description
 *
 * @apiExample Request Example:
 * {
 *   "rate": 4.5,
 *	 "title": "Very Cool Place",
 *	 "description": "I love the place",
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "user": "58d6ac4c7eaf1c4a3811dd2c"
 * }
 *
 *
 * @apiSuccess {String} _id Id
 * @apiSuccess {Number} rate Rate
 * @apiSuccess {String} [title]  Review Title
 * @apiSuccess {String} [description]  Description
 * @apiSuccess {Object} user User Detail
 * @apiSuccess {Object} place Place Detail
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *   "rate": 4.5,
 *	 "title": "Very Cool Place",
 *	 "description": "I love the place",
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "user": "58d6ac4c7eaf1c4a3811dd2c"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Review has been registered with this ID! to update."
 * }
 * 
 */
// PUT /reviews/:reviewId
router.put('/:reviewId', authenticate(), review.updateReview);

module.exports = router;