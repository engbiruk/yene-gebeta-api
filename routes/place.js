// LOAD MODULE DEPENDECIES
var express = require('express');

// LOAD CONTROLLERS
var place = require('../controllers/place');
var auth = require('../controllers/auth');
var authorize = require('../lib/authorize');
//var authenticate = require('./lib/authenticate');

// CREATE A ROUTER
var router = express.Router();

/**
 * @api {post} /places Create Place
 * @apiDescription Create a place
 * @apiGroup Place
 * @apiName Create Place
 * @apiVersion 1.0.0
 *
 *
 * @apiParam {String} name Name of the Place
 * @apiParam {String} email Email
 * @apiParam {String} phone_number Mobile Phone Number 
 * @apiParam {String} [other_name] Other(Nick) Name of the Place
 * @apiParam {String} [best_serves] Best Serves
 * @apiParam {String} [overview] Description about the place
 * @apiParam {String} [line1] Line #1 Phone Number 
 * @apiParam {String} [line2] Line #2 Phone Number 
 * @apiParam {Number=1,2,3,4,5} [popularity_level=0] Popularity Level
 * @apiParam {Object} [location] Location
 * @apiParam {String} [location.latitude=0] Latitude Location
 * @apiParam {String} [location.longitude=0] Longitude Location
 * @apiParam {Object} [social] Social
 * @apiParam {String} [social.facebook] Facebook
 * @apiParam {String} [social.instagram] Instagram
 * @apiParam {String} [social.twitter] Twitter
 * @apiParam {String} [social.youtube] YouTube
 * @apiParam {Object} [manager_info] Manager's Info
 * @apiParam {String} [manager_info.name='Owner'] Manager's name
 * @apiParam {String} [manager_info.phone_number=phone_number] Manager's Phone Number
 * @apiParam {Object} [owner_info] Owner's Info
 * @apiParam {String} [owner_info.name='Owner'] Owner's name
 * @apiParam {String} [owner_info.phone_number=phone_number] Owner's Phone Number
 * @apiParam {Object} [price_range] Price Range
 * @apiParam {String} [price_range.min=0] Minimum Price Range
 * @apiParam {String} [price_range.max=0] Maximum Price Range
 * @apiParam {Boolean} [can_reserve=false] Does this place accept a reservation? 
 * @apiParam {String} [city='Addis Ababa'] City
 * @apiParam {String} [country='Ethiopia'] Country
 * @apiParam {Object} [place_feature] Place Feature Id
 * @apiParam {Object} [place_category] Place Category Id
 * @apiParam {Object} [place_cuisine] Place Cuisine Id
 * @apiExample Request Example:
 * {
 *     "name": "Mary ZONE",
 *     "other_name": "Mary ZONE",
 *     "best_serves": "cakes",
 *     "overview": "MaryZone restaurant is located infront of National Musium, Addis Ababa. We serve best ethioian Dishes.",
 *     "phone_number": "+251911234567",
 *     "line1": "+251111234535",
 *     "line2": "",
 *     "email": "info@.fivezoneaddis.com",
 *     "popularity_level": 5,
 *     "location": {
 *          "latitude": 9.002,
 *          "longitude": 38.02
 *     },
 *     "social": {
 *          "facebook": "http://www.facebook.com/5zonerestaurant",
 *          "instagram": "http://www.instagram.com/5zonerestaurant",
 *          "twitter": "http://www.twitter.com/5zonerestaurant",
 *          "youtube": "http://www.youtube.com/5zonerestaurant"
 *     },
 *     "manager_info": {
 *          "name": "Owner",
 *          "phone_number": "+251911234567"
 *     },
 *     "owner_info": {
 *          "name": "Anonymous",
 *          "phone_number": "+251911232323"
 *     },
 *     "price_range": {
 *          "max": "10's",
 *          "min": "100's"
 *     },
 *     "can_reserve": true,
 *     "city": "Addis Ababa",
 *     "country": ""
 *     "place_feature": ["78ca30a46435260783a7c8df","18ca30a46435260783a7c8da"],
 *     "place_category": ["98ca30a46435260783a7c8df","17ca30a46435260783a7c8da", "a3ca30a46435260783a7c8de"],
 *     "place_cuisine": ["38ca30a46435260783a7c8dc","18ca30a46435260783a7c8d3"]
 * }
 * 
 * 
 * @apiSuccess {String} _id User Id
 * @apiSuccess {String} name Name of the Place
 * @apiSuccess {String} other_name Other(Nick) Name of the Place
 * @apiSuccess {String} best_serves Best Serves
 * @apiSuccess {String} overview Description about the place
 * @apiSuccess {String} phone_number Mobile Phone Number 
 * @apiSuccess {String} line1 Line #1 Phone Number 
 * @apiSuccess {String} line2 Line #2 Phone Number 
 * @apiSuccess {String} email Email
 * @apiSuccess {Number} popularity_level Popularity Level
 * @apiSuccess {Number} rate Rate
 *
 * @apiSuccess {Object[]} review List of Reviews
 * @apiSuccess {String} review.title Review Title
 * @apiSuccess {String} review.description Review Description
 * @apiSuccess {String} review.rate Review Rate
 *
 * @apiSuccess {Object[]} menu List of Menus
 * @apiSuccess {String} menu.title Menu Title
 * @apiSuccess {String} menu.ingredient Menu Ingredient
 * @apiSuccess {String} menu.description Menu Description
 * @apiSuccess {Number} menu.price Menu Price
 *
 * @apiSuccess {Object[]} reservation List of Reservations
 * @apiSuccess {String} reservation.number_of_guests Number of Guests
 * @apiSuccess {String} reservation.reservation_date Reservation Date
 * @apiSuccess {String} reservation.reservation_time Reservation Time
 * @apiSuccess {String} reservation.note Reservation Special Request Note
 *
 * @apiSuccess {Object[]} image Images related to the place
 *
 * @apiSuccess {Object[]} place_feature List of Place's Features
 * @apiSuccess {String} place_feature.name Feature Name
 * @apiSuccess {String} place_feature.description Feature Description
 *
 * @apiSuccess {Object[]} place_category List of Place's Category
 * @apiSuccess {String} place_category.name Category Name
 * @apiSuccess {String} place_category.description Category Description
 *
 * @apiSuccess {Object[]} place_cuisine List of Place's Cuisine
 * @apiSuccess {String} place_cuisine.name Cuisine Name
 * @apiSuccess {String} place_cuisine.description Cuisine Description
 *
 * @apiSuccess {Object} location Location
 * @apiSuccess {String} location.latitude Latitude Location
 * @apiSuccess {String} location.longitude Longitude Location
 *
 * @apiSuccess {Object} social Social Links
 * @apiSuccess {String} social.facebook Facebook
 * @apiSuccess {String} social.instagram Instagram
 * @apiSuccess {String} social.twitter Twitter
 * @apiSuccess {String} social.youtube YouTube
 *
 * @apiSuccess {Object} manager_info Manager's Info
 * @apiSuccess {String} manager_info.name Manager's name
 * @apiSuccess {String} manager_info.phone_number Manager's Phone Number
 *
 * @apiSuccess {Object} owner_info Owner's Info
 * @apiSuccess {String} owner_info.name Owner's name
 * @apiSuccess {String} owner_info.phone_number Owner's Phone Number
 *
 * @apiSuccess {Object} price_range Price Range
 * @apiSuccess {String} price_range.min Minimum Price Range
 * @apiSuccess {String} price_range.max Maximum Price Range
 *
 * @apiSuccess {String} can_reserve Does this place accept a reservation?
 * @apiSuccess {String} city City
 * @apiSuccess {String} country Country
 *
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *    "_id": "58ca30a46435260783a7c8df",
 *    "name": "Mary ZONE",
 *    "other_name": "Mary ZONE",
 *    "best_serves": "cakes",
 *    "overview": "MaryZone restaurant is located infront of National Musium, Addis Ababa. We serve best ethioian Dishes.",
 *    "phone_number": "+251911234567",
 *    "line1": "+251111234535",
 *    "line2": "",
 *    "email": "info@fivezoneaddis.com",
 *    "popularity_level": 5,
 *    "rate": 0,
 *    "review": [],
 *    "menu": [],
 *    "reservation": [],
 *    "branch": [],
 *    "image": [],
 *    "place_feature": [],
 *    "place_category": [],
 *    "place_cuisine": [],
 *    "location": {
 *      "latitude": 9.002,
 *      "longitude": 38.02
 *    },
 *    "social": {
 *      "facebook": "http://www.facebook.com/5zonerestaurant",
 *      "instagram": "http://www.instagram.com/5zonerestaurant",
 *      "twitter": "http://www.twitter.com/5zonerestaurant",
 *      "youtube": "http://www.youtube.com/5zonerestaurant"
 *    },
 *    "manager_info": {
 *      "name": "Owner",
 *      "phone_number": "+251911234567"
 *    },
 *    "owner_info": {
 *      "name": "Anonymous",
 *      "phone_number": "+251911232323"
 *    },
 *    "price_range": {
 *      "max": "10's",
 *      "min": "100's"
 *    },
 *    "can_reserve": true,
 *    "city": "Addis Ababa",
 *    "country": ""
 *  }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * {
 *      "error": true,
 *      "message": "You need to be logged in to logout!, Use a correct token"
 * }
 * 
 */
// POST /places
router.post('/', place.createPlace);

// DELETE /places/:placeId
router.delete('/:placeId', place.noop);

// PUT /places/:placeId
router.put('/:placeId', place.noop);

/**
 * @api {get} /places/all Get Places
 * @apiDescription Get all Places
 * @apiGroup Place
 * @apiName Get All Places
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {String} _id User Id
 * @apiSuccess {String} name Name of the Place
 * @apiSuccess {String} other_name Other(Nick) Name of the Place
 * @apiSuccess {String} best_serves Best Serves
 * @apiSuccess {String} overview Description about the place
 * @apiSuccess {String} phone_number Mobile Phone Number 
 * @apiSuccess {String} line1 Line #1 Phone Number 
 * @apiSuccess {String} line2 Line #2 Phone Number 
 * @apiSuccess {String} email Email
 * @apiSuccess {Number} popularity_level Popularity Level
 * @apiSuccess {Number} rate Rate
 *
 * @apiSuccess {Object[]} review List of Reviews
 * @apiSuccess {String} review.title Review Title
 * @apiSuccess {String} review.description Review Description
 * @apiSuccess {String} review.rate Review Rate
 *
 * @apiSuccess {Object[]} menu List of Menus
 * @apiSuccess {String} menu.title Menu Title
 * @apiSuccess {String} menu.ingredient Menu Ingredient
 * @apiSuccess {String} menu.description Menu Description
 * @apiSuccess {Number} menu.price Menu Price
 *
 * @apiSuccess {Object[]} reservation List of Reservations
 * @apiSuccess {String} reservation.number_of_guests Number of Guests
 * @apiSuccess {String} reservation.reservation_date Reservation Date
 * @apiSuccess {String} reservation.reservation_time Reservation Time
 * @apiSuccess {String} reservation.note Reservation Special Request Note
 *
 * @apiSuccess {Object[]} image Images related to the place
 *
 * @apiSuccess {Object[]} place_feature List of Place's Features
 * @apiSuccess {String} place_feature.name Feature Name
 * @apiSuccess {String} place_feature.description Feature Description
 *
 * @apiSuccess {Object[]} place_category List of Place's Category
 * @apiSuccess {String} place_category.name Category Name
 * @apiSuccess {String} place_category.description Category Description
 *
 * @apiSuccess {Object[]} place_cuisine List of Place's Cuisine
 * @apiSuccess {String} place_cuisine.name Cuisine Name
 * @apiSuccess {String} place_cuisine.description Cuisine Description
 *
 * @apiSuccess {Object} location Location
 * @apiSuccess {String} location.latitude Latitude Location
 * @apiSuccess {String} location.longitude Longitude Location
 *
 * @apiSuccess {Object} logo Place's Logo
 * @apiSuccess {String} logo._id Logo Id
 * @apiSuccess {String} logo.title Logo title
 * @apiSuccess {String} logo.description Logo Description
 * @apiSuccess {String} logo.path Logo's URL
 *
 * @apiSuccess {Object} social Social Links
 * @apiSuccess {String} social.facebook Facebook
 * @apiSuccess {String} social.instagram Instagram
 * @apiSuccess {String} social.twitter Twitter
 * @apiSuccess {String} social.youtube YouTube
 *
 * @apiSuccess {Object} manager_info Manager's Info
 * @apiSuccess {String} manager_info.name Manager's name
 * @apiSuccess {String} manager_info.phone_number Manager's Phone Number
 *
 * @apiSuccess {Object} owner_info Owner's Info
 * @apiSuccess {String} owner_info.name Owner's name
 * @apiSuccess {String} owner_info.phone_number Owner's Phone Number
 *
 * @apiSuccess {Object} price_range Price Range
 * @apiSuccess {String} price_range.min Minimum Price Range
 * @apiSuccess {String} price_range.max Maximum Price Range
 *
 * @apiSuccess {String} can_reserve Does this place accept a reservation?
 * @apiSuccess {String} city City
 * @apiSuccess {String} country Country
 *
 * @apiSuccessExample {json} Success-Response Example: 
 * HTTP/1.1 200 OK
 * [
 *     {
 *        "_id": "58ca30a46435260783a7c8df",
 *        "name": "Mary ZONE",
 *        "other_name": "Mary ZONE",
 *        "best_serves": "cakes",
 *        "overview": "MaryZone restaurant is located infront of National Musium, Addis Ababa. We serve best ethioian Dishes.",
 *        "phone_number": "+251911234567",
 *        "line1": "+251111234535",
 *        "line2": "",
 *        "email": "info@fivezoneaddis.com",
 *        "popularity_level": 5,
 *        "rate": 0,
 *        "review": [],
 *        "menu": [],
 *        "reservation": [],
 *        "branch": [],
 *        "image": [],
 *        "place_feature": [],
 *        "place_category": [],
 *        "place_cuisine": [],
 *        "location": {
 *          "latitude": 9.002,
 *          "longitude": 38.02
 *        },
 *        "social": {
 *          "facebook": "http://www.facebook.com/5zonerestaurant",
 *          "instagram": "http://www.instagram.com/5zonerestaurant",
 *          "twitter": "http://www.twitter.com/5zonerestaurant",
 *          "youtube": "http://www.youtube.com/5zonerestaurant"
 *        },
 *        "manager_info": {
 *          "name": "Owner",
 *          "phone_number": "+251911234567"
 *        },
 *        "owner_info": {
 *          "name": "Anonymous",
 *          "phone_number": "+251911232323"
 *        },
 *        "price_range": {
 *          "max": "10's",
 *          "min": "100's"
 *        },
 *        "can_reserve": true,
 *        "city": "Addis Ababa",
 *        "country": ""
 *      },
 *      {
 *        "_id": "58bdb8204e72552d1449ee93",
 *        "name": "5 Zone",
 *        "other_name": "5 Zone",
 *        "best_serves": "cakes",
 *        "overview": "5 Zone restaurant is located infront of National Musium, Addis Ababa. We serve best ethioian Dishes.",
 *        "logo": {
 *          "_id": "58c10c935399454667d22eb1",
 *          "title": "5 Zone-logo",
 *          "description": "5 Zone- logo",
 *          "path": "/placesLogo/ce36d6160d6a39e09098ccfa4abcd039.png",
 *          "place": "58bdb8204e72552d1449ee93"
 *        },
 *        "review": [],
 *        "menu": [],
 *        "reservation": [],
 *        "branch": [],
 *        "image": [],
 *        "place_cuisine": [],
 *        "place_category": [],
 *        "place_feature": [],
 *        "rate": 0,
 *        "popularity_level": 0,
 *        "can_reserve": false,
 *        "city": "Addis Ababa",
 *        "country": "Ethiopia"
 *      }
 * ]
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * {
 *      "error": true,
 *      "message": "You need to be logged in to logout!, Use a correct token"
 * }
 *
 */
// GET /places/all
router.get('/all', place.getAllPlaces);

/**
 * @api {get} /places/:placeId Get Single Place
 * @apiDescription Get a single Place 
 * @apiGroup Place
 * @apiName Get Place
 * @apiVersion 1.0.0
 * 
 * 
 * @apiSuccess {String} _id User Id
 * @apiSuccess {String} name Name of the Place
 * @apiSuccess {String} other_name Other(Nick) Name of the Place
 * @apiSuccess {String} best_serves Best Serves
 * @apiSuccess {String} overview Description about the place
 * @apiSuccess {String} phone_number Mobile Phone Number 
 * @apiSuccess {String} line1 Line #1 Phone Number 
 * @apiSuccess {String} line2 Line #2 Phone Number 
 * @apiSuccess {String} email Email
 * @apiSuccess {Number} popularity_level Popularity Level
 * @apiSuccess {Number} rate Rate
 *
 * @apiSuccess {Object[]} review List of Reviews
 * @apiSuccess {String} review.title Review Title
 * @apiSuccess {String} review.description Review Description
 * @apiSuccess {String} review.rate Review Rate
 *
 * @apiSuccess {Object[]} menu List of Menus
 * @apiSuccess {String} menu.title Menu Title
 * @apiSuccess {String} menu.ingredient Menu Ingredient
 * @apiSuccess {String} menu.description Menu Description
 * @apiSuccess {Number} menu.price Menu Price
 *
 * @apiSuccess {Object[]} reservation List of Reservations
 * @apiSuccess {String} reservation.number_of_guests Number of Guests
 * @apiSuccess {String} reservation.reservation_date Reservation Date
 * @apiSuccess {String} reservation.reservation_time Reservation Time
 * @apiSuccess {String} reservation.note Reservation Special Request Note
 *
 * @apiSuccess {Object[]} image Images related to the place
 *
 * @apiSuccess {Object[]} place_feature List of Place's Features
 * @apiSuccess {String} place_feature.name Feature Name
 * @apiSuccess {String} place_feature.description Feature Description
 *
 * @apiSuccess {Object[]} place_category List of Place's Category
 * @apiSuccess {String} place_category.name Category Name
 * @apiSuccess {String} place_category.description Category Description
 *
 * @apiSuccess {Object[]} place_cuisine List of Place's Cuisine
 * @apiSuccess {String} place_cuisine.name Cuisine Name
 * @apiSuccess {String} place_cuisine.description Cuisine Description
 *
 * @apiSuccess {Object} location Location
 * @apiSuccess {String} location.latitude Latitude Location
 * @apiSuccess {String} location.longitude Longitude Location
 *
 * @apiSuccess {Object} logo Place's Logo
 * @apiSuccess {String} logo._id Logo Id
 * @apiSuccess {String} logo.title Logo title
 * @apiSuccess {String} logo.description Logo Description
 * @apiSuccess {String} logo.path Logo's URL
 *
 * @apiSuccess {Object} social Social Links
 * @apiSuccess {String} social.facebook Facebook
 * @apiSuccess {String} social.instagram Instagram
 * @apiSuccess {String} social.twitter Twitter
 * @apiSuccess {String} social.youtube YouTube
 *
 * @apiSuccess {Object} manager_info Manager's Info
 * @apiSuccess {String} manager_info.name Manager's name
 * @apiSuccess {String} manager_info.phone_number Manager's Phone Number
 *
 * @apiSuccess {Object} owner_info Owner's Info
 * @apiSuccess {String} owner_info.name Owner's name
 * @apiSuccess {String} owner_info.phone_number Owner's Phone Number
 *
 * @apiSuccess {Object} price_range Price Range
 * @apiSuccess {String} price_range.min Minimum Price Range
 * @apiSuccess {String} price_range.max Maximum Price Range
 *
 * @apiSuccess {String} can_reserve Does this place accept a reservation?
 * @apiSuccess {String} city City
 * @apiSuccess {String} country Country
 *
 * @apiSuccessExample {json} Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *    "_id": "58ca30a46435260783a7c8df",
 *    "name": "Mary ZONE",
 *    "other_name": "Mary ZONE",
 *    "best_serves": "cakes",
 *    "overview": "MaryZone restaurant is located infront of National Musium, Addis Ababa. We serve best ethioian Dishes.",
 *    "phone_number": "+251911234567",
 *    "line1": "+251111234535",
 *    "line2": "",
 *    "email": "info@fivezoneaddis.com",
 *    "popularity_level": 5,
 *    "rate": 0,
 *    "review": [],
 *    "menu": [],
 *    "reservation": [],
 *    "branch": [],
 *    "image": [],
 *    "place_feature": [],
 *    "place_category": [],
 *    "place_cuisine": [],
 *    "location": {
 *      "latitude": 9.002,
 *      "longitude": 38.02
 *    },
 *    "social": {
 *      "facebook": "http://www.facebook.com/5zonerestaurant",
 *      "instagram": "http://www.instagram.com/5zonerestaurant",
 *      "twitter": "http://www.twitter.com/5zonerestaurant",
 *      "youtube": "http://www.youtube.com/5zonerestaurant"
 *    },
 *    "manager_info": {
 *      "name": "Owner",
 *      "phone_number": "+251911234567"
 *    },
 *    "owner_info": {
 *      "name": "Anonymous",
 *      "phone_number": "+251911232323"
 *    },
 *    "price_range": {
 *      "max": "10's",
 *      "min": "100's"
 *    },
 *    "can_reserve": true,
 *    "city": "Addis Ababa",
 *    "country": ""
 *  }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * {
 *      "error": true,
 *      "message": "You need to be logged in to logout!, Use a correct token"
 * }
 * 
 */
// GET /places/:placeId
router.get('/:placeId', place.getPlace);

module.exports = router;