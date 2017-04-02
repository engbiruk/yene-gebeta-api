// LOAD MODULE DEPENDECIES
var express = require('express');

// LOAD CONTROLLERS
var menu = require('../controllers/menu');
var auth = require('../controllers/auth');
var authorize = require('../lib/authorize');
//var authenticate = require('../lib/authenticate');

// CREATE A ROUTER
var router = express.Router();

/**
 * @api {get} /menus/all Get All Menus
 * @apiDescription Get All Menus
 * @apiGroup Menu
 * @apiName Menu Get All
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} menu List of Menu_categories
 * @apiSuccess  {String} menu._id Id
 * @apiSuccess  {String} menu.title Name of Menu
 * @apiSuccess  {String} menu.ingredient Ingredient
 * @apiSuccess  {String} menu.description Description
 * @apiSuccess  {Number} menu.price Price
 * @apiSuccess  {Boolean} menu.isAvailable is Menu available now?
 * @apiSuccess  {Object} menu.place Place details
 * @apiSuccess  {String} menu.menu_category Menu Category
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "_id": "58dc067d3be3ec7e6ba72eff",
 *	 "title": "Pasta with tomato sauce",
 *	 "ingredient": "Pasta, tomato",
 *	 "description": "Italian Pasta with tomato sauce",
 *	 "price": "35.00",
 *	 "isAvailable": true,
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "menu_category": "58dc067d3be3ec7e6ba72eff"
 *  },
 *  {
 *   "_id": "58dc067d3be3ec7e6ba72efe",
 *	 "title": "Pasta ",
 *	 "ingredient": "Pasta, tomato",
 *	 "description": "Italian Pasta with tomato sauce",
 *	 "price": "35.00",
 *	 "isAvailable": true,
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "menu_category": "58dc067d3be3ec7e6ba72eff"
 *  }
 * 
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
router.get('/all', menu.getAllMenus);

/**
 * @api {delete} /menus/:menuId Delete Menu 
 * @apiDescription Delete Menu 
 * @apiGroup Menu
 * @apiName Menu Delete
 * @apiVersion 1.0.0
 *  
 * @apiSuccess {String} data.ingredient Ingredient 
 * @apiSuccess {String} data.description Description 
 * @apiSuccess {Number} data.price Price 
 * @apiSuccess {Boolean} data.isAvailable is Menu available now ?
 * @apiSuccess {Object} data.place Place details 
 * @apiSuccess {String} data.menu_category Menu 
 *
 * @apiSuccessExample Success - Response Example:
 * HTTP / 1.1 200 OK 
 * {
 *   "message": "Menu is successfuly Deleted!",
 *   "data":
 *       {
 *           "_id": "58dc067d3be3ec7e6ba72eff",
 *           "title": "Pasta with tomato sauce",
 *           "ingredient": "Pasta, tomato",
 *           "description": "Italian Pasta with tomato sauce",
 *           "price": "35.00",
 *           "isAvailable": true,
 *           "place": "58bdb8204e72552d1449ee93",
 *           "menu": "58dc067d3be3ec7e6ba72eff" 
 *       } 
 *
 * } 
 *
 *
 * @apiError { Boolean } error Indicate Error
 * @apiError { String } message Message
 * @apiErrorExample Error - Response Example:
 * HTTP / 1.1 400 Bad Request 
 * {
 *   "error": true,
 *   "message": "NO Menu has been registered to delete!" 
 * } 
 */

// DELETE /menus/:menuId
router.delete('/:menuId', menu.deleteMenu);

/**
 * @api {get} /menus/:menuId Get Menu 
 * @apiDescription Get Menu 
 * @apiGroup Menu
 * @apiName Menu Get
 * @apiVersion 1.0.0
 *
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} title Name of Menu
 * @apiSuccess  {String} ingredient Ingredient
 * @apiSuccess  {String} description Description
 * @apiSuccess  {Number} price Price
 * @apiSuccess  {Boolean} isAvailable is Menu available now?
 * @apiSuccess  {Object} place Place details
 * @apiSuccess  {String} menu_category Menu Category
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *   "_id": "58dc067d3be3ec7e6ba72eff",
 *	 "title": "Pasta with tomato sauce",
 *	 "ingredient": "Pasta, tomato",
 *	 "description": "Italian Pasta with tomato sauce",
 *	 "price": "35.00",
 *	 "isAvailable": true,
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "menu_category": "58dc067d3be3ec7e6ba72eff"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Menu has been registered with this ID!"
 * }
 * 
 */
// GET /menus/:menuId
router.get('/:menuId', menu.getMenu);

/**
 * @api {put} /menus/:menuId Update Menu
 * @apiDescription Update Menu 
 * @apiGroup Menu
 * @apiName Menu Update
 * @apiVersion 1.0.0
 * 
 * @apiParam  {String} title Name of Menu
 * @apiParam  {String} menu_category Menu Category
 * @apiParam  {String} [ingredient] Ingredient
 * @apiParam  {String} [description] Description
 * @apiParam  {Number} [price] Price
 * @apiParam  {Boolean} [isAvailable] is Menu available now?
 *
 * @apiExample Request Example:
 * {
 *	 "title": "Pasta with tomato sauce",
 *	 "ingredient": "Pasta, tomato",
 *	 "description": "Italian Pasta with tomato sauce",
 *	 "price": "37.00",
 *	 "isAvailable": true,
 *	 "menu_category": "58dc067d3be3ec7e6ba72eff"
 * }
 * 
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} title Name of Menu
 * @apiSuccess  {String} ingredient Ingredient
 * @apiSuccess  {String} description Description
 * @apiSuccess  {Number} price Price
 * @apiSuccess  {Boolean} isAvailable is Menu available now?
 * @apiSuccess  {Object} place Place details
 * @apiSuccess  {String} menu_category Menu Category
 *
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *   "_id": "58dc067d3be3ec7e6ba72eff",
 *	 "title": "Pasta with tomato sauce",
 *	 "ingredient": "Pasta, tomato",
 *	 "description": "Italian Pasta with tomato sauce",
 *	 "price": "37.00",
 *	 "isAvailable": false,
 *	 "menu": "58dc067d3be3ec7e6ba72eff"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "NO Menu has been registered with this ID! to update."
 * }
 * 
 */
// PUT /menus/:menuId
router.put('/:menuId', menu.updateMenu);

/**
 * @api {post} /menus Create Menu 
 * @apiDescription Create Menu 
 * @apiGroup Menu
 * @apiName Menu Create
 * @apiVersion 1.0.0
 *
 * @apiParam  {String} _id Id
 * @apiParam  {String} title Name of Menu
 * @apiParam  {String} menu_category Menu Category
 * @apiParam  {Object} place Place details
 * @apiParam  {String} [ingredient] Ingredient
 * @apiParam  {String} [description] Description
 * @apiParam  {Number} [price] Price
 * @apiParam  {Boolean} [isAvailable] is Menu available now?
 *
 * @apiExample Request Example:
 * {
 *	 "title": "Pasta with tomato sauce",
 *	 "ingredient": "Pasta, tomato",
 *	 "description": "Italian Pasta with tomato sauce",
 *	 "price": "35.00",
 *	 "isAvailable": true,
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "menu": "58dc067d3be3ec7e6ba72eff"
 * }
 * 
 * @apiSuccess  {String} _id Id
 * @apiSuccess  {String} title Name of Menu
 * @apiSuccess  {String} ingredient Ingredient
 * @apiSuccess  {String} description Description
 * @apiSuccess  {Number} price Price
 * @apiSuccess  {Boolean} isAvailable is Menu available now?
 * @apiSuccess  {Object} place Place details
 * @apiSuccess  {String} menu_category Menu Category
 *
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "_id": "58dc067d3be3ec7e6ba72eff",
 *	 "title": "Pasta with tomato sauce",
 *	 "ingredient": "Pasta, tomato",
 *	 "description": "Italian Pasta with tomato sauce",
 *	 "price": "35.00",
 *	 "isAvailable": true,
 *	 "place": "58bdb8204e72552d1449ee93",
 *	 "menu": "58dc067d3be3ec7e6ba72eff"
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * HTTP/1.1 400 Bad Request
 * {
 *      "error": true,
 *      "message": "The Menu already registered with the same title!"
 * }
 * 
 * 
 */
// POST /menus
router.post('/', menu.createMenu);

module.exports = router;