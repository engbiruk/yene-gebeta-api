// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var place_feature			= require('../controllers/place_feature');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

/**
 * @api {get} /place_features/all Get All Place Features
 * @apiDescription Get All Place Features
 * @apiGroup Place_feature
 * @apiName Place_feature Get All
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} place_feature List of Place_features
 * @apiSuccess  {String} place_feature._id Id
 * @apiSuccess  {String} place_feature.name Name of Place Feature
 * @apiSuccess  {String} place_feature.description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * [
 *  {
 *      "_id": "58ca57baf43c1b4e5ca9164c",
 *	    "name": "Free WiFi",
 *	    "description": "Free WiFi is available"
 *  },
 *  {
 *      "_id": "68ca57bafa9e4b4e5ca91642",
 *      "name": "Children Playground",
 *      "description": "Wide children playground is available with may toys"
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
 *      "message": "NO Place_features Found!"
 * }
 * 
 */
// GET /place_features/all
router.get('/all', place_feature.getAllPlaceFeatures);

/**
 * @api {delete} /place_features/:place_featureId Delete Place Feature
 * @apiDescription Delete Place Feature
 * @apiGroup Place_feature
 * @apiName Place_feature Delete
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} message Message
 * @apiSuccess {Object} place_feature List of Place_features
 * @apiSuccess {String} place_feature._id Id
 * @apiSuccess {String} place_feature.name Name of Place Feature
 * @apiSuccess {String} place_feature.description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "message": "Place_feature is successfuly Deleted!",
 *  "data":
 *      {
 *          "_id": "58ca57baf43c1b4e5ca9164c",
 *          "name": "Shiro House",
 *          "description": "Special Shiro Serving Place"
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
 *      "message": "NO Place_feature has been registered to delete!"
 * }
 * 
 */

// DELETE /place_features/:place_featureId
router.delete('/:place_featureId', place_feature.deletePlaceFeature);

/**
 * @api {get} /place_features/:place_featureId Get Place Feature
 * @apiDescription Get Place Feature
 * @apiGroup Place_feature
 * @apiName Place_feature Get
 * @apiVersion 1.0.0
 *
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} name Name of Place Feature
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *	 "name": "Free WiFi",
 *	 "description": "Free WiFi is available"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Place_feature has been registered with this ID!"
 * }
 * 
 */
// GET /place_features/:place_featureId
router.get('/:place_featureId', place_feature.getPlaceFeature);

/**
 * @api {put} /place_features/:place_featureId Update Place Feature
 * @apiDescription Update Place Feature
 * @apiGroup Place_feature
 * @apiName Place_feature Update
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} description  Description
 * @apiExample Request Example:
 * {
 *	 "description": "Free Wifi with 10Mbps"
 * }
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} name Name of Place Feature
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *   "_id": "58ca57baf43c1b4e5ca9164c",
 *	 "name": "Free WiFi",
 *	 "description": "Free WiFi is available"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Place_feature has been registered with this ID! to update."
 * }
 * 
 */
// PUT /place_features/:place_featureId
router.put('/:place_featureId', place_feature.updatePlaceFeature);

/**
 * @api {post} /place_features Create Place Feature
 * @apiDescription Create Place Feature
 * @apiGroup Place_feature
 * @apiName Place_feature Create
 * @apiVersion 1.0.0
 *
 * @apiParam {String} name  Place_feature Name
 * @apiParam {String} description  Description
 * @apiExample Request Example:
 * {
 *	 "name": "Free WiFi",
 *	 "description": "Free WiFi is available"
 * }
 * 
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} name Name of Place Feature
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *	 "name": "Free WiFi",
 *	 "description": "Free WiFi is available"
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

// POST /place_features
router.post('/', place_feature.createPlaceFeature);

module.exports = router;