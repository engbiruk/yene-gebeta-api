// LOAD MODULE DEPENDECIES
var express = require('express');

// LOAD CONTROLLERS
var place_cuisine = require('../controllers/place_cuisine');
var auth = require('../controllers/auth');
var authorize = require('../lib/authorize');
//var authenticate = require('./lib/authenticate');

// CREATE A ROUTER
var router = express.Router();


/**
 * @api {get} /place_cuisines/all Get All Place Cuisines
 * @apiDescription Get All Place Cuisines
 * @apiGroup Place_cuisine
 * @apiName Place_cuisine Get All
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} place_cuisine List of Place_cuisines
 * @apiSuccess  {String} place_cuisine._id Id
 * @apiSuccess  {String} place_cuisine.name Name of Place Cuisine
 * @apiSuccess  {String} place_cuisine.description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * [
 *  {
 *      "_id": "58ca57baf43c1b4e5ca9164c",
 *	    "name": "Italian Cuisine",
 *	    "description": "Italian's Cultural Cuisine & Restaurant"
 *  },
 *  {
 *      "_id": "68ca57bafa9e4b4e5ca91642",
 *	    "name": "Gurage Cuisine",
 *	    "description": "Gurage's Cultural Cuisine & Restaurant"
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
 *      "message": "NO Place_cuisines Found!"
 * }
 * 
 */
// GET /place_cuisines/all
router.get('/all', place_cuisine.getAllPlaceCuisines);

/**
 * @api {delete} /place_cuisines/:place_cuisineId Delete Place Cuisine
 * @apiDescription Delete Place Cuisine
 * @apiGroup Place_cuisine
 * @apiName Place_cuisine Delete
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {String} message Message
 * @apiSuccess {Object} Place_cuisine List of Place_cuisine
 * @apiSuccess {String} Place_cuisine._id Id
 * @apiSuccess {String} Place_cuisine.name Name of Place Feature
 * @apiSuccess {String} Place_cuisine.description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "message": "Place_cuisine is successfuly Deleted!",
 *  "data":
 *      {
 *          "_id": "58ca57baf43c1b4e5ca9164c",
 *          "name": "Italian Cuisine",
 *          "description": "Italian Cultural Cuisine & Restaurant"
 *      }
 *
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Place_cuisine has been registered to delete!"
 * }
 * 
 */

// DELETE /place_cuisines/:place_cuisineId
router.delete('/:place_cuisineId', place_cuisine.deletePlaceCuisine);

/**
 * @api {get} /place_cuisines/:place_cuisineId Get Place Cuisine
 * @apiDescription Get Place Cuisine
 * @apiGroup Place_cuisine
 * @apiName Place_cuisine Get
 * @apiVersion 1.0.0
 *
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} name Name of Place Cuisine
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *   "_id": "58ca57baf43c1b4e5ca9164c",
 *	 "name": "Italian Cuisine",
 *	 "description": "Italian Cultural Cuisine & Restaurant"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Place_cuisine has been registered with this ID!"
 * }
 * 
 */
// GET /place_cuisines/:place_cuisineId
router.get('/:place_cuisineId', place_cuisine.getPlaceCuisine);

/**
 * @api {put} /place_cuisines/:place_cuisineId Update Place Cuisine
 * @apiDescription Update Place Cuisine
 * @apiGroup Place_cuisine
 * @apiName Place_cuisine Update
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} [description]  Description
 * @apiExample Request Example:
 * {
 *	 "description": "Italian Cuisine and Restaurant"
 * }
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} name Name of Place Cuisine
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *   "_id": "58ca57baf43c1b4e5ca9164c",
 *   "name": "Italian Cuisine",
 *   "description": "Italian Cultural Cuisine & Restaurant"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Place_cuisine has been registered with this ID! to update."
 * }
 * 
 */
// PUT /place_cuisines/:place_cuisineId
router.put('/:place_cuisineId', place_cuisine.updatePlaceCuisine);

/**
 * @api {post} /place_cuisines Create Place Cuisine
 * @apiDescription Create Place Cuisine
 * @apiGroup Place_cuisine
 * @apiName Place_cuisine Create
 * @apiVersion 1.0.0
 *
 * @apiParam {String} name  Place_cuisine Name
 * @apiParam {String} [description]  Description
 * @apiExample Request Example:
 * {
 *	 "name": "Italian Cuisine",
 *	 "description": "Italian's Cultural Cuisine & Restaurant"
 * }
 * 
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} name Name of Place Cuisine
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *   "_id": "58ca57baf43c1b4e5ca9164c",
 *	 "name": "Italian Cuisine",
 *	 "description": "Italian's Cultural Cuisine & Restaurant"
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "The Place Cuisine already registered with the same name!"
 * }
 * 
 * 
 */

// POST /place_cuisines
router.post('/', place_cuisine.createPlaceCuisine);

module.exports = router;