// LOAD MODULE DEPENDECIES
var express = require('express');

// LOAD CONTROLLERS
var user = require('../controllers/user');
var auth = require('../controllers/auth');
var authorize = require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();

/**
 * @apiDefine user500Error
 *
 * @apiError somethingWrong Error Occured
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": true,
 *       "message": "Something Went Wrong!"
 *     }
 */

/**
 * @api {post} /users/signup User Signup
 * @apiDescription User Signup 
 * @apiGroup User
 * @apiName User Signup
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} email  Email Address
 * @apiParam {String} password   Password
 * @apiParam {String} first_name   First Name
 * @apiParam {String} last_name   Last Name
 * @apiParam {String} [date_of_birth]   Date of Birth
 * @apiParam {String} [phone_number]    Phone Number
 * @apiParam {String} [gender]   Gender
 * @apiParam {String} [about]   About
 * @apiParam {String} [city] City  
 * @apiParam {String} [country] Country  
 * @apiParam {String} user_type   User Type  - [normal, client, staff, admin]
 * @apiExample Request Example:
 * {
 *      "email": "johndoe@email.com",
 *      "password": "p@ssw0rd4J0hn_D0e",
 *      "first_name": "John",
 *      "last_name": "Doe",
 *      "date_of_birth": "1991-11-20",
 *      "phone_number": "0934470466",
 *      "gender": "M",
 *      "about":"About me is here...",
 *      "user_type": "normal"
 * }
 * 
 * @apiSuccess  {String}    _id Unique User ID
 * @apiSuccess  {String}    username   User Name
 * @apiSuccess  {String}    role    User Role
 * @apiSuccess  {String}    realm    User Realm
 * @apiSuccess  {String}    last_modified   Last Modified Date
 * @apiSuccess  {String}    date_created    Date Created
 * @apiSuccess  {String}    user_profile   User Profile Id
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *      "_id": "654654fgh564jgh5465s4fg",
 *      "username": "jane@gmail.com",
 *      "role": "normal",
 *      "realm": "user",
 *      "user_profile": "54654gh65j4g6f4h654jghj"
 * }
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * {
 *      "error": true,
 *      "message": "Error In Signup"
 * }
 * 
 */
// POST /users/signup
router.post('/signup', user.createUser);

/**
 * @api {post} /users/login User Login
 * @apiDescription User Login 
 * @apiGroup User
 * @apiName User Login
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} username  Username (Email Address)
 * @apiParam {String} password   Password
 * @apiExample Request Example:
 * {
 *      "username": "johndoe@email.com",
 *      "password": "p@ssw0rd4J0hn_D0e"
 * }
 * 
 * @apiSuccess  {String}    token String
 * @apiSuccess  {Object}    user   User Description
 * @apiSuccess  {String}    user._id    User Id
 * @apiSuccess  {String}    user.username   Username
 * @apiSuccess  {Object}    user.user_profile   User Profile
 * @apiSuccess  {String}    user.user_profile._id   User Profile Id
 * @apiSuccess  {String}    user.user_profile.first_name    First Name
 * @apiSuccess  {String}    user.user_profile.last_name    Last Name
 * @apiSuccess  {String}    user.user_profile.email    Email
 * @apiSuccess  {String}    user.user_profile.gender    Gender
 * @apiSuccess  {String}    user.user_profile.about    About the user
 * @apiSuccess  {String}    user.user_profile.city    City
 * @apiSuccess  {String}    user.user_profile.date_of_birth    Date of Birth
 * @apiSuccess  {String}    user.user_profile.phone_number    Phone Number
 * @apiSuccess  {String}    user.user_profile.country    Country
 * @apiSuccess  {String}    user.status    Status
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *  "token": "mG3nb7DDC3kFNQ==",
 *  "user": {
 *      "_id": "58b446c44edbf8ddaefdcb92",
 *      "username": "sosina@gmail.com",
 *      "user_profile": {
 *        "_id": "58b446d14edbf8ddaefdcb93",
 *        "user": "58b446c44edbf8ddaefdcb92",
 *        "first_name": "Sosina",
 *        "last_name": "Tilahun",
 *        "email": "sosina@gmail.com",
 *        "gender": "M",
 *        "about": "This is Biruk as a normal user.",
 *        "city": "Addis Ababa",
 *        "date_of_birth": "1991-11-20T00:00:00.000Z",
 *        "phone_number": "+251934470466",
 *        "country": "Ethiopia"
 *      },
 *      "status": "active"
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * {
 *      "error": true,
 *      "message": "Wrong Credentials!"
 * }
 * 
 */
// POST /users/login
router.post('/login', auth.login);


/**
 * @api {post} /users/logout User Logout
 * @apiDescription User Logout 
 * @apiGroup User
 * @apiName User Logout
 * @apiVersion 1.0.0
 * 
 * 
 * @apiSuccess  {String}    message Message
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *      "message": "User Successfuly logged out!"
 * }
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
// POST /users/logout
router.post('/logout', auth.logout);

/**
 * @api {post} /users/change_password/:userId Change Password
 * @apiDescription Change a user Password 
 * @apiGroup User
 * @apiName User Change Password
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} old_password  Old Password
 * @apiParam {String} new_password  New Password
 * @apiExample Request Example:
 * {
 *      "old_password": "previP@ssw0rd",
 *      "new_password": "NeWp@ssw0rd4J0hn_D0e"
 * }
 * 
 * @apiSuccess  {String}    message Message
 * 
 * @apiSuccessExample Success-Response Example:
 * HTTP/1.1 200 OK
 * {
 *  "message": "Password Successfuly Changed!",
 * }
 *
 * 
 * @apiError {Boolean} error Indicate Error
 * @apiError {String} message   Message
 * @apiErrorExample Error-Response Example:
 * {
 *      "error": true,
 *      "message": "Something Wrong!"
 * }
 * 
 */
// POST /users/change_password
router.post('/change_password/:userId', user.change_password);


// GET /users/all
router.get('/all', user.getAllUsers);

/**
 * @api {get} /users/:userId Get Single User
 * @apiDescription Get a single User 
 * @apiGroup User
 * @apiName Get User
 * @apiVersion 1.0.0
 * 
 * 
 * @apiSuccess  {String} _id User Id
 * @apiSuccess  {String} username Username
 * @apiSuccess  {Object} user_profile User Profile Description
 * @apiSuccess  {String} user_profile._id User Profile Id
 * @apiSuccess  {String} user_profile.first_name First Name
 * @apiSuccess  {String} user_profile.last_name Last Name
 * @apiSuccess  {String} user_profile.email Email
 * @apiSuccess  {String} user_profile.gender Gender
 * @apiSuccess  {String} user_profile.about About
 * @apiSuccess  {String} user_profile.city City
 * @apiSuccess  {String} user_profile.date_of_birth Date of Birth
 * @apiSuccess  {String} user_profile.phone_number Phone Number
 * @apiSuccess  {String} user_profile.country Country
 * @apiSuccess  {String} status User Status
 * 
 * @apiSuccessExample Success-Response Example: 
 * HTTP/1.1 200 OK
 * {
 *   "_id": "58b78f707976f71f0e3170c0",
 *   "username": "engbiruk@gmail.com",
 *   "user_profile": {
 *     "_id": "58b78f707976f71f0e3170c1",
 *     "first_name": "Biruk",
 *     "last_name": "Tilahun",
 *     "email": "engbiruk@gmail.com",
 *     "gender": "M",
 *     "about": "This is Biruk as a normal user.",
 *     "city": "Addis Ababa",
 *     "date_of_birth": "1991-11-20T00:00:00.000Z",
 *     "phone_number": "+251934470466",
 *     "country": "Ethiopia"
 *   },
 *   "status": "active"
 * }
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
// GET /users/:userId
router.get('/:userId', user.getUser);

// PUT /users/:userId
router.put('/:userId', user.noop);

// DELETE /users/:userId
router.delete('/:userId', user.noop);

module.exports = router;