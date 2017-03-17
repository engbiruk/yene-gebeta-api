"use strict"
// LOAD MODULE DEPENDENCIES
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var debug = require('debug')('yene-gebeta-api:app');
var validator = require('express-validator');
var unless = require('express-unless');
var bafMiddleware = require('before-and-after');
var partialResponse = require('express-partial-response');
var lodash = require('lodash');
// var multer              = require('multer');
// var upload              = multer({ dest: '../placesLogo/' });

// LOAD APP CONFIGRATION
var config = require('./config');

// LOAD VARIABLES
var router = require('./routes');
var authenticate = require('./lib/authenticate');

// MONGODB CONFIGURATION

// connect to mongodb
mongoose.connect(config.MONGODB_URL);

// listen to mongodb connection success
mongoose.connection.on('connected', function mongodbConnectionListener() {
    debug('[APP] Mongodb Connected Successfuly!');
});

// listen to mongodb connection failure
mongoose.connection.on('error', function mongodbConnectionListener() {
    debug('[APP] Mongodb Connection Failed!');

    // try reconnecting...
    mongoose.connect(config.MONGODB_URL);
});

// INIT APP
var app = express();

// MIDDLEWARES
var _static = express.static('public');
_static.unless = unless;

app.use(_static.unless({method: 'GET'}));
// set authentication middleware
app.use(authenticate().unless({ 
    // paths that are authentication is waved
    path: ['/users/login', '/users/signup', '/users/all1'
        // Place    
        // ,'/users/:userId'
    ]
}));

// set body parser middleware
app.use(bodyparser.json());

// static files


// partial response middleware
app.use(partialResponse());

// set validator middleware
app.use(validator());

// set BEFORE AND AFTER middleware
//app.use(bafMiddleware); 

// SET ROUTER
router(app);

// LISTEN TO HTTP PORT
app.listen(config.HTTP_PORT, function connectionListner() {
    debug('API server running on port %s', config.HTTP_PORT);
});

// MAKE THE APP MODULE 
module.exports = app;