// LOAD MODULE DEPENDENCIES
var express			= require('express');

// LOAD INDIVIDUAL ROUTES
var branchRouter			        = require('./branch');
var menu_categoryRouter			    = require('./menu_category');
var menuRouter			            = require('./menu');
var reservationRouter			    = require('./reservation');
var restaurant_categoryRouter	    = require('./restaurant_category');
var restaurantRouter			    = require('./restaurant');
var reviewRouter			        = require('./review');
var userRouter			            = require('./user');

// EXPORT ROUTER AS A MODULE
module.express = function initRouter(app){

    // Branchs Endpoint
    app.use('/branches', branchRouter);
    // Menu Categories Endpoint
    app.use('/menu_categories', menu_categoryRouter);
    // Menus Endpoint
    app.use('/menus', menuRouter);
    // Reservations Endpoint
    app.use('/reservations', reservationRouter);
    // Restaurant Categories Endpoint
    app.use('/restaurant_categories', restaurant_categoryRouter);
    // Restaurants Endpoint
    app.use('/restaurants', restaurantRouter);
    // Reviews Endpoint
    app.use('/reviews', reviewRouter);
    // Users Endpoint
    app.use('/users', userRouter);

}