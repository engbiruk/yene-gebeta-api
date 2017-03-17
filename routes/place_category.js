// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var place_category			= require('../controllers/place_category');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

/**
 * @api {get} /place_categories/all Get All Place Categories
 * @apiDescription Get All Place Categories
 * @apiGroup Place_category
 * @apiName Place_category Get All
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} place_category List of Place_categories
 * @apiSuccess  {String} place_category._id Id
 * @apiSuccess  {String} place_category.name Name of Place Category
 * @apiSuccess  {String} place_category.description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * [
 *  {
 *      "_id": "58ca57baf43c1b4e5ca9164c",
 *      "name": "Shiro House",
 *      "description": "Special Shiro Serving Place"
 *  },
 *  {
 *      "_id": "68ca57bafa9e4b4e5ca91642",
 *      "name": "Kitfo House",
 *      "description": "Kitfo and Tranditional Foods Serving Place"
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
 *      "message": "NO Place_categories Found!"
 * }
 * 
 */
// GET /place_categories/all
router.get('/all', place_category.getAllPlaceCategories);

/**
 * @api {delete} /place_categories/:place_categoryId Delete Place Category
 * @apiDescription Delete Place Category
 * @apiGroup Place_category
 * @apiName Place_category Delete
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {String} message Message
 * @apiSuccess {Object} Place_category List of Place_category
 * @apiSuccess {String} Place_category._id Id
 * @apiSuccess {String} Place_category.name Name of Place Feature
 * @apiSuccess {String} Place_category.description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "message": "Place_category is successfuly Deleted!",
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
 *      "message": "NO Place_category has been registered to delete!"
 * }
 * 
 */

// DELETE /place_categories/:place_categoryId
router.delete('/:place_categoryId', place_category.deletePlaceCategory);

/**
 * @api {get} /place_categories/:place_categoryId Get Place Category
 * @apiDescription Get Place Category
 * @apiGroup Place_category
 * @apiName Place_category Get
 * @apiVersion 1.0.0
 *
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} name Name of Place Category
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *  "name": "Shiro House",
 *  "description": "Special Shiro Serving Place"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Place_category has been registered with this ID!"
 * }
 * 
 */
// GET /place_categories/:place_categoryId
router.get('/:place_categoryId', place_category.getPlaceCategory);

/**
 * @api {put} /place_categories/:place_categoryId Update Place Category
 * @apiDescription Update Place Category
 * @apiGroup Place_category
 * @apiName Place_category Update
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} description  Description
 * @apiExample Request Example:
 * {
 *	 "description": "Special Shiro Serving Place"
 * }
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} name Name of Place Category
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *  "name": "Shiro House",
 *  "description": "Special Shiro Serving Place"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Place_category has been registered with this ID! to update."
 * }
 * 
 */
// PUT /place_categories/:place_categoryId
router.put('/:place_categoryId', place_category.updatePlaceCategory);

/**
 * @api {post} /place_categories Create Place Category
 * @apiDescription Create Place Category
 * @apiGroup Place_category
 * @apiName Place_category Create
 * @apiVersion 1.0.0
 *
 * @apiParam {String} name  Place_category Name
 * @apiParam {String} description  Description
 * @apiExample Request Example:
 * {
 *	 "name": "Shiro House",
 *	 "description": "Special Shiro Serving Place"
 * }
 * 
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} name Name of Place Category
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58ca57baf43c1b4e5ca9164c",
 *  "name": "Shiro House",
 *  "description": "Special Shiro Serving Place"
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "The Place category already registered with the same name!"
 * }
 * 
 * 
 */

// POST /place_categories
router.post('/', place_category.createPlaceCategory);

module.exports = router;