// LOAD MODULE DEPENDECIES
var express			= require('express');

// LOAD CONTROLLERS
var user			= require('../controllers/user');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');

// CREATE A ROUTER
var router = express.Router();
/**
 * @api {post} /user/signup User Signup
 * @apiDescription User Signup 
 * @apiGroup User
 * @apiName User Signup
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} email  Email Address
 * @apiParam {String} password   Password
 * @apiParam {String} first_name   First Name
 * @apiParam {String} last_name   Last Name
 * @apiParam {String} user_type   User Type  - [normal, client, staff, admin]
 * @apiExample Request Example:
 * {
 *      "username": "johndoe@email.com",
 *      "password": "p@ssw0rd4J0hn_D0e",
 *      "first_name": "John",
 *      "last_name": "Doe",
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
 * {
 *      "_id": "654654fgh564jgh5465s4fg",
 *      "username": "jane@gmail.com",
 *      "role": "normal",
 *      "realm": "user",
 *      "date_created": "2017-02-19T08:57:10.559Z",
 *      "last_modified": "2017-02-19T08:57:10.559Z",
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

// POST /users/login
router.post('/login', auth.login);

// POST /users/logout
router.post('/logout', auth.logout);

// GET /users/all
router.get('/all',  user.getAllUsers);

// GET /users/:userId
router.get('/:userId', user.noop);

// PUT /users/:userId
router.put('/:userId', user.noop);

// DELETE /users/:userId
router.delete('/:userId', user.noop);

module.exports = router;