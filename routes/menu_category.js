// LOAD MODULE DEPENDECIES
var express = require('express');

// LOAD CONTROLLERS
var menu_category = require('../controllers/menu_category');
var auth = require('../controllers/auth');
var authorize = require('../lib/authorize');
//var authenticate = require('./lib/authenticate');

// CREATE A ROUTER
var router = express.Router();

/**
 * @api {get} /menu_categories/all Get All Menu Categories
 * @apiDescription Get All Menu Categories
 * @apiGroup Menu_category
 * @apiName Menu_category Get All
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} menu_category List of Menu_categories
 * @apiSuccess  {String} menu_category._id Id
 * @apiSuccess  {String} menu_category.title Name of Menu Category
 * @apiSuccess  {String} menu_category.description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * [
 *  {
 *      "_id": "58dc067d3be3ec7e6ba72eff",
 *      "title": "Pasta",
 *      "description": "Italian Pasta"
 *  },
 *  {
 *      "_id": "58dc07497b4a3b800d8b1192",
 *      "title": "Rice",
 *      "description": "Rice"
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
 *      "message": "NO Menu_categories Found!"
 * }
 * 
 */
// GET /menu_categories/all
router.get('/all', menu_category.getAllPlaceCategories);

/**
 * @api {delete} /menu_categories/:menu_categoryId Delete Menu Category
 * @apiDescription Delete Menu Category
 * @apiGroup Menu_category
 * @apiName Menu_category Delete
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {String} message Message
 * @apiSuccess {Object} Menu_category List of Menu_category
 * @apiSuccess {String} Menu_category._id Id
 * @apiSuccess {String} Menu_category.title Title of Menu Feature
 * @apiSuccess {String} Menu_category.description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "message": "Menu_category is successfuly Deleted!",
 *  "data":
 *      {
 *          "_id": "58dc067d3be3ec7e6ba72eff",
 *          "title": "Pasta",
 *          "description": "Italian Pasta"
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
 *      "message": "NO Menu_category has been registered to delete!"
 * }
 * 
 */


// DELETE /menu_categoryes/:menu_categoryId
router.delete('/:menu_categoryId', menu_category.deleteMenu_category);

/**
 * @api {get} /menu_categories/:menu_categoryId Get Menu Category
 * @apiDescription Get Menu Category
 * @apiGroup Menu_category
 * @apiName Menu_category Get
 * @apiVersion 1.0.0
 *
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} title Name of Menu Category
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58dc067d3be3ec7e6ba72eff",
 *  "title": "Pasta",
 *  "description": "Italian Pasta"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Menu_category has been registered with this ID!"
 * }
 * 
 */
// GET /menu_categoryes/:menu_categoryId
router.get('/:menu_categoryId', menu_category.getMenu_category);

/**
 * @api {put} /menu_categories/:menu_categoryId Update Menu Category
 * @apiDescription Update Menu Category
 * @apiGroup Menu_category
 * @apiName Menu_category Update
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} description  Description
 * @apiExample Request Example:
 * {
 *	 "description": "Ethiopian Pasta"
 * }
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} title Name of Menu Category
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58dc067d3be3ec7e6ba72eff",
 *  "title": "Pasta",
 *  "description": "Ethiopian Pasta"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Menu_category has been registered with this ID! to update."
 * }
 * 
 */
// PUT /menu_categoryes/:menu_categoryId
router.put('/:menu_categoryId', menu_category.updateMenu_category);

/**
 * @api {post} /menu_categories Create Menu Category
 * @apiDescription Create Menu Category
 * @apiGroup Menu_category
 * @apiName Menu_category Create
 * @apiVersion 1.0.0
 *
 * @apiParam {String} title  Menu_category Name
 * @apiParam {String} description  Description
 * @apiExample Request Example:
 * {
 *	 "title": "Pasta",
 *	 "description": "Italian Pasta"
 * }
 * 
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} title Name of Menu Category
 * @apiSuccess  {String} description Description
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58dc067d3be3ec7e6ba72eff",
 *  "title": "Italian Pasta",
 *  "description": "Italian Pasta"
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "The Menu category already registered with the same title!"
 * }
 * 
 * 
 */
// POST /menu_categories
router.post('/', menu_category.createMenu_category);

module.exports = router;