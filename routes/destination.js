// LOAD MODULE DEPENDECIES
var express = require('express');

// LOAD CONTROLLERS
var destination = require('../controllers/destination');
var auth = require('../controllers/auth');
var authorize = require('../lib/authorize');
//var authenticate = require('./lib/authenticate');

// CREATE A ROUTER
var router = express.Router();

/**
 * @api {get} /destinations/all Get All Destination
 * @apiDescription Get Destination
 * @apiGroup Destination
 * @apiName Destination Get All
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} destination List of Destinations
 * @apiSuccess  {String} destination._id Id
 * @apiSuccess  {String} destination.title Title of Destination
 * @apiSuccess  {String} destination.description Description
 * @apiSuccess  {Object[]} destination.location_range Location Ranges
 * @apiSuccess  {String} destination.location_range.lat Location Range Latitude
 * @apiSuccess  {String} destination.location_range.lng Location Range Longtiude
 * @apiSuccess  {Object[]} destination.place Places found on this destination
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * [
 *   {
 *       "_id": "58d6aebdbe57ca4eca639f6e",
 *       "title": "5 kilo",
 *       "description": "5kilo is a road between 4kilo and 6kilo, in Addis Ababa",
 *       "place": [{
 *           "_id": "58bdc011d47e1138eeefbca5",
 *           "last_modified": "2017-03-06T20:01:21.802Z",
 *           "date_created": "2017-03-06T20:01:21.802Z",
 *           "name": "5 Zone",
 *           "other_name": "5 Zone",
 *           "best_serves": "cakes",
 *           "overview": "5 Zone restaurant is located infront of National Musium, Addis Ababa. We serve best ethioian Dishes.",
 *           "feature": [],
 *           "__v": 0,
 *           "review": [],
 *           "menu": [],
 *           "reservation": [],
 *           "branch": [],
 *           "image": [],
 *           "place_cuisine": [],
 *           "place_category": [],
 *           "place_feature": [],
 *           "rate": 0,
 *           "popularity_level": 0,
 *           "can_reserve": false,
 *           "city": "Addis Ababa",
 *           "country": "Ethiopia"
 *       }
 *       ],
 *       "location_range": [
 *
 *           "lng": 9.523453,
 *           "lat": 39.90123,
 *           "_id": "58d6b15ccee04b527b757bd1"
 *       },
 *
 *           "lng": 9.523453,
 *           "lat": 38.10123,
 *           "_id": "58d6b15ccee04b527b757bd0"
 *       },
 *
 *           "lng": 9.323453,
 *           "lat": 38.50123,
 *           "_id": "58d6b15ccee04b527b757bcf"
 *       }
 *       ]
 *   }
 *  ]
 *  
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 404 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Destinations Found!"
 * }
 * 
 */
// GET /destinations/all
router.get('/all', destination.getAllDestinations);

/**
 * @api {post} /destinations Create Destination
 * @apiDescription Create Destination
 * @apiGroup Destination
 * @apiName Destination Create
 * @apiVersion 1.0.0
 *
 * @apiParam {Object} destination Destination
 * @apiParam  {String} destination._id Id
 * @apiParam  {String} destination.title Title of Destination
 * @apiParam  {String} destination.description Description
 * @apiParam  {Object[]} destination.location_range Location Ranges
 * @apiParam  {String} destination.location_range.lat Location Range Latitude
 * @apiParam  {String} destination.location_range.lng Location Range Longtiude
 * @apiExample Request Example:
 * {
 * 	  "title": "5 kilo",
 *    "description": "5kilo is a road between 4kilo and 6kilo, in Addis Ababa",
 *    "location_range": [
 *    	{
 *        "lat": "38.80123",
 *        "lng": "9.523453"
 *     },
 *     {
 *        "lat": "38.10123",
 *        "lng": "9.523453"
 *     },
 *     {
 *        "lat": "38.50123",
 *        "lng": "9.323453"
 *     }
 *    ]
 * }
 * 
 * @apiSuccess {Object} destination  Destination
 * @apiSuccess  {String} destination._id Id
 * @apiSuccess  {String} destination.title Title of Destination
 * @apiSuccess  {String} destination.description Description
 * @apiSuccess  {Object[]} destination.location_range Location Ranges
 * @apiSuccess  {String} destination.location_range.lat Location Range Latitude
 * @apiSuccess  {String} destination.location_range.lng Location Range Longtiude
 * @apiSuccess  {Object[]} destination.place Places found on this destination
 *
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 *   {
 *       "_id": "58d6aebdbe57ca4eca639f6e",
 *       "title": "5 kilo",
 *       "description": "5kilo is a road between 4kilo and 6kilo, in Addis Ababa",
 *       "place": [{
 *           "_id": "58bdc011d47e1138eeefbca5",
 *           "last_modified": "2017-03-06T20:01:21.802Z",
 *           "date_created": "2017-03-06T20:01:21.802Z",
 *           "name": "5 Zone",
 *           "other_name": "5 Zone",
 *           "best_serves": "cakes",
 *           "overview": "5 Zone restaurant is located infront of National Musium, Addis Ababa. We serve best ethioian Dishes.",
 *           "feature": [],
 *           "__v": 0,
 *           "review": [],
 *           "menu": [],
 *           "reservation": [],
 *           "branch": [],
 *           "image": [],
 *           "place_cuisine": [],
 *           "place_category": [],
 *           "place_feature": [],
 *           "rate": 0,
 *           "popularity_level": 0,
 *           "can_reserve": false,
 *           "city": "Addis Ababa",
 *           "country": "Ethiopia"
 *       }
 *       ],
 *       "location_range": [
 *
 *           "lng": 9.523453,
 *           "lat": 39.90123,
 *           "_id": "58d6b15ccee04b527b757bd1"
 *       },
 *
 *           "lng": 9.523453,
 *           "lat": 38.10123,
 *           "_id": "58d6b15ccee04b527b757bd0"
 *       },
 *
 *           "lng": 9.323453,
 *           "lat": 38.50123,
 *           "_id": "58d6b15ccee04b527b757bcf"
 *       }
 *       ]
 *   }
 * 
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "The destination already registered with the same title!"
 * }
 * 
 * 
 */
// POST /destinations
router.post('/', destination.createDestination);

/**
 * @api {delete} /destinations/:destinationId Delete Destination
 * @apiDescription Delete Destination
 * @apiGroup Destination
 * @apiName Destination Delete
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {String} message Message
 * @apiSuccess {Object} data Destination Details
 * @apiSuccess  {String} destination._id Id
 * @apiSuccess  {String} destination.title Title of Destination
 * @apiSuccess  {String} destination.description Description
 * @apiSuccess  {Object[]} destination.location_range Location Ranges
 * @apiSuccess  {String} destination.location_range.lat Location Range Latitude
 * @apiSuccess  {String} destination.location_range.lng Location Range Longtiude
 * @apiSuccess  {Object[]} destination.place Places found on this destination
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * [
 *   "message": "Destination is successfuly Deleted!"
 *   "data": {
 *       "_id": "58d6aebdbe57ca4eca639f6e",
 *       "title": "5 kilo",
 *       "description": "5kilo is a road between 4kilo and 6kilo, in Addis Ababa",
 *       "place": [{
 *           "_id": "58bdc011d47e1138eeefbca5",
 *           "last_modified": "2017-03-06T20:01:21.802Z",
 *           "date_created": "2017-03-06T20:01:21.802Z",
 *           "name": "5 Zone",
 *           "other_name": "5 Zone",
 *           "best_serves": "cakes",
 *           "overview": "5 Zone restaurant is located infront of National Musium, Addis Ababa. We serve best ethioian Dishes.",
 *           "feature": [],
 *           "__v": 0,
 *           "review": [],
 *           "menu": [],
 *           "reservation": [],
 *           "branch": [],
 *           "image": [],
 *           "place_cuisine": [],
 *           "place_category": [],
 *           "place_feature": [],
 *           "rate": 0,
 *           "popularity_level": 0,
 *           "can_reserve": false,
 *           "city": "Addis Ababa",
 *           "country": "Ethiopia"
 *       }
 *       ],
 *       "location_range": [
 *
 *           "lng": 9.523453,
 *           "lat": 39.90123,
 *           "_id": "58d6b15ccee04b527b757bd1"
 *       },
 *
 *           "lng": 9.523453,
 *           "lat": 38.10123,
 *           "_id": "58d6b15ccee04b527b757bd0"
 *       },
 *
 *           "lng": 9.323453,
 *           "lat": 38.50123,
 *           "_id": "58d6b15ccee04b527b757bcf"
 *       }
 *       ]
 *   }
 *  ]
 *  
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 *   {
 *       "error": true,
 *       "message": "NO Destination has been registered to delete!"
 *   }
 * 
 */
// DELETE /destinations/:destinationId
router.delete('/:destinationId', destination.deleteDestination);

/**
 * @api {get} /destinations/:destinationId Get Destination
 * @apiDescription Get Destination
 * @apiGroup Destination
 * @apiName Destination Get
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object} destination  Destination
 * @apiSuccess  {String} destination._id Id
 * @apiSuccess  {String} destination.title Title of Destination
 * @apiSuccess  {String} destination.description Description
 * @apiSuccess  {Object[]} destination.location_range Location Ranges
 * @apiSuccess  {String} destination.location_range.lat Location Range Latitude
 * @apiSuccess  {String} destination.location_range.lng Location Range Longtiude
 * @apiSuccess  {Object[]} destination.place Places found on this destination
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 *   {
 *       "_id": "58d6aebdbe57ca4eca639f6e",
 *       "title": "5 kilo",
 *       "description": "5kilo is a road between 4kilo and 6kilo, in Addis Ababa",
 *       "place": [{
 *           "_id": "58bdc011d47e1138eeefbca5",
 *           "last_modified": "2017-03-06T20:01:21.802Z",
 *           "date_created": "2017-03-06T20:01:21.802Z",
 *           "name": "5 Zone",
 *           "other_name": "5 Zone",
 *           "best_serves": "cakes",
 *           "overview": "5 Zone restaurant is located infront of National Musium, Addis Ababa. We serve best ethioian Dishes.",
 *           "feature": [],
 *           "__v": 0,
 *           "review": [],
 *           "menu": [],
 *           "reservation": [],
 *           "branch": [],
 *           "image": [],
 *           "place_cuisine": [],
 *           "place_category": [],
 *           "place_feature": [],
 *           "rate": 0,
 *           "popularity_level": 0,
 *           "can_reserve": false,
 *           "city": "Addis Ababa",
 *           "country": "Ethiopia"
 *       }
 *       ],
 *       "location_range": [
 *
 *           "lng": 9.523453,
 *           "lat": 39.90123,
 *           "_id": "58d6b15ccee04b527b757bd1"
 *       },
 *
 *           "lng": 9.523453,
 *           "lat": 38.10123,
 *           "_id": "58d6b15ccee04b527b757bd0"
 *       },
 *
 *           "lng": 9.323453,
 *           "lat": 38.50123,
 *           "_id": "58d6b15ccee04b527b757bcf"
 *       }
 *       ]
 *   }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 404 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Destinations Found!"
 * }
 * 
 */
// GET /destinations/:destinationId
router.get('/:destinationId', destination.getDestination);

/**
 * @api {put} /destinations/:destinationsId Update Destination
 * @apiDescription Update Destination
 * @apiGroup Destination
 * @apiName Destination Update
 * @apiVersion 1.0.0
 * 
 * @apiParam {Object} destination Destination
 * @apiParam  {String} destination._id Id
 * @apiParam  {String} destination.title Title of Destination
 * @apiParam  {String} destination.description Description
 * @apiParam  {Object[]} destination.location_range Location Ranges
 * @apiParam  {String} destination.location_range.lat Location Range Latitude
 * @apiParam  {String} destination.location_range.lng Location Range Longtiude
 * @apiParam  {String} destination.place Place
 * @apiExample Request Example:
 * {
 * 	  "title": "5 kilo",
 *    "description": "5kilo is a road between 4kilo and 6kilo, in Addis Ababa",
 *    "place" : "58bdc011d47e1138eeefbca5",
 *    "location_range": [
 *    	{
 *        "lat": "38.80123",
 *        "lng": "9.523453"
 *     },
 *     {
 *        "lat": "38.10123",
 *        "lng": "9.523453"
 *     },
 *     {
 *        "lat": "38.50123",
 *        "lng": "9.323453"
 *     }
 *    ]
 * }
 * 
 * @apiSuccess {Object} destination  Destination
 * @apiSuccess  {String} destination._id Id
 * @apiSuccess  {String} destination.title Title of Destination
 * @apiSuccess  {String} destination.description Description
 * @apiSuccess  {Object[]} destination.location_range Location Ranges
 * @apiSuccess  {String} destination.location_range.lat Location Range Latitude
 * @apiSuccess  {String} destination.location_range.lng Location Range Longtiude
 * @apiSuccess  {Object[]} destination.place Places found on this destination
 *
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 *   {
 *       "_id": "58d6aebdbe57ca4eca639f6e",
 *       "title": "5 kilo",
 *       "description": "5kilo is a road between 4kilo and 6kilo, in Addis Ababa",
 *       "place": [{
 *           "_id": "58bdc011d47e1138eeefbca5",
 *           "last_modified": "2017-03-06T20:01:21.802Z",
 *           "date_created": "2017-03-06T20:01:21.802Z",
 *           "name": "5 Zone",
 *           "other_name": "5 Zone",
 *           "best_serves": "cakes",
 *           "overview": "5 Zone restaurant is located infront of National Musium, Addis Ababa. We serve best ethioian Dishes.",
 *           "feature": [],
 *           "__v": 0,
 *           "review": [],
 *           "menu": [],
 *           "reservation": [],
 *           "branch": [],
 *           "image": [],
 *           "place_cuisine": [],
 *           "place_category": [],
 *           "place_feature": [],
 *           "rate": 0,
 *           "popularity_level": 0,
 *           "can_reserve": false,
 *           "city": "Addis Ababa",
 *           "country": "Ethiopia"
 *       }
 *       ],
 *       "location_range": [
 *
 *           "lng": 9.523453,
 *           "lat": 39.90123,
 *           "_id": "58d6b15ccee04b527b757bd1"
 *       },
 *
 *           "lng": 9.523453,
 *           "lat": 38.10123,
 *           "_id": "58d6b15ccee04b527b757bd0"
 *       },
 *
 *           "lng": 9.323453,
 *           "lat": 38.50123,
 *           "_id": "58d6b15ccee04b527b757bcf"
 *       }
 *       ]
 *   }
 * 
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "The destination already registered with the same title!"
 * }
 * 
 * 
 */
// PUT /destinations/:destinationId
router.put('/:destinationId', destination.updateDestination);

module.exports = router;