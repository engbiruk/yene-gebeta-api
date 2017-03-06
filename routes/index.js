// LOAD MODULE DEPENDENCIES
var express			= require('express');

// LOAD INDIVIDUAL ROUTES
var branchRouter			        = require('./branch');
var destinationRouter			    = require('./destination');
var imageRouter			            = require('./image');
var menu_categoryRouter			    = require('./menu_category');
var menuRouter			            = require('./menu');
var reservationRouter			    = require('./reservation');
var place_categoryRouter	        = require('./place_category');
var placeRouter			            = require('./place');
var reviewRouter			        = require('./review');
var userRouter			            = require('./user');

// EXPORT ROUTER AS A MODULE
module.exports = function initRouter(app){

    // Branchs Endpoint
    app.use('/branches', branchRouter);
    // Destinations Endpoint
    app.use('/destination', destinationRouter);
    // Images Endpoint
    app.use('/images', imageRouter);
    // Menu Categories Endpoint
    app.use('/menu_categories', menu_categoryRouter);
    // Menus Endpoint
    app.use('/menus', menuRouter);
    // Reservations Endpoint
    app.use('/reservations', reservationRouter);
    // Restaurant Categories Endpoint
    app.use('/place_categories', place_categoryRouter);
    // Restaurants Endpoint
    app.use('/places', placeRouter);
    // Reviews Endpoint
    app.use('/reviews', reviewRouter);
    // Users Endpoint
    app.use('/users', userRouter);

}