// LOAD MODULE DEPENDENCIES
var events      = require('events');
var moment      = require('moment');
var debug       = require('debug')('yene-gebeta-api:place-controller');

// LOAD CONFIG
var config      = require('../config');

// LOAD MODEL'S DAL
var PlaceDal    = require('../dal/place');

// EXPORT NOOP
exports.noop = function noop(req, res, next){
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

/**
 * GET A PLACE
 * 
 * @params {Object} req Request
 * @params {Object} res Response
 * @params {Object} next Next Middleware Dispatcher
 * 
 * @return {Object} place A Place as Json Object
 */
exports.getPlace = function getPlace(req, res, next) {
    debug('Get a Place...');

    // fetch Place id
    var PlaceId = req.params.PlaceId;

    // fetch a Place
    PlaceDal.get({_id: PlaceId}, function getAPlace(err, Place){
        if(err) return next(err);
        
        // if the Place doesnot exist, return that to the Place
        if(!Place._id){
            res.status(404).json({message: 'Place does not exist!'});
            return;
        } 
        
        // remove unwanted fields from populated Place_profile field in the Place
        Place.place_feature.omitFields(['place'], function (err, _Place_profile){
            if(err) return next(err);
            // remove the unwanted fields from the Place
            Place.omitFields([], function (err, _Place){
                if(err) return next(err);
                // replace the Place_profile of the Place with the removed Place_profile
                _Place.Place_profile = _Place_profile;
                // return the Place to the requester
                res.status(200).json(_Place || {});
            });
        });
        
    });
}

/**
 * CREATE A PLACE
 * @params {Object} req Request
 * @params {Object} res Response
 * @params {Object} next Next Middleware Dispatcher
 * 
 * @return {Object} place A Place as Json Object
 * 
 *  1. Validate the place data
 *  2. Check if the place already exist(name + phone_number)
 *  3. Create a Place
 *  4. Send a Response back
 */
exports.createPlace = function createPlace(req, res, next) {
    debug('Create place');

    // create a workflow event
    var workflow = new events.EventEmitter();
    var body = req.body;

    // [Workflow] 1. Validate the place data 
    workflow.on('validatePlace', function validatePlace() {
        debug('[Workflow: validatePlace] validating place...');

        // check for validation
        req
            .checkBody('name', 'Name Invalid!')
            .notEmpty().withMessage('Place\'s Name shouldn\'t be empty!');
        req
            .checkBody('city', 'City Invalid!')
            .notEmpty().withMessage('Place\'s City shouldn\'t be empty!');
        req
            .checkBody('email', 'Email Invalid!')
            .isEmail().withMessage('Email field has to be a correct email!');
        req
            .checkBody('can_reserve', 'Can Reserve Invalid!')
            .isIn([true,false]).withMessage('Can Reserve should be true/false!');
        
        // check for validation errors
        var validationErrors = req.validationErrors();

        // if there is a validation error, return a bad request
        if (validationErrors) {
            res.status(400); // Bad Request
            res.json(validationErrors);
            // return to the place
            return;
        } else {
            // if no errors pass to the next workflow (saving the place)
            workflow.emit('checkIfPlaceExist');
        }

    });

    // [Workflow] 2. Check if the place already exist
    workflow.on('checkIfPlaceExist', function checkPlaceExist(){
        debug('[Workflow: checkIfPlaceExist] check if the place exists...');

        // Check if the place already exists in the database (checking the placename from the submitted email)
        PlaceDal.get({email: body.email, name: body.name}, function getPlace(err, place){
            if(err) return next(err);
            
            // if place exist response back
            if(place._id) {
                res.status(400); // Bad Request
                res.json({
                    message: 'The place is already registered!'
                });
            } else {
                // since the place doesnot exist, go to the next workflow (creating the place)
                workflow.emit('createPlace');
            }
        });
    });

    // [Workflow] 3. Create place
    workflow.on('createPlace', function createPlace() {
        debug('[Workflow: createPlace] creating place...');

        // Create a place from the data
        PlaceDal.create({
            name: body.name,
            other_name: body.name || '',
            best_serves: body.best_serves || '',
            overview: body.overview || '',
            country: body.country || '',
            city: body.city || '',
            phone_number: body.phone_number || '',
            line1: body.line1 || '',
            line2: body.line2 || '',
            webiste: body.webiste || '',
            email: body.email || '',
            can_reserve: body.can_reserve || false,
            price_range: body.price_range || {max: '0.0', min:'0.0'},
            popularity_level: body.popularity_level || 0,
            rate: body.rate || 0,
            owner_info: body.owner_info || {name: 'Owner', phone_number: body.phone_number},
            manager_info: body.manager_info || {name: 'Owner', phone_number: body.phone_number},
            social: body.social || {},
            location: body.location || {lat:0,lng:0},
            logo: body.logo || {},
            destination: body.destination || {}
        }, function callback(err, place) {
            if (err) return next(err);

            // if no errors pass to the next workflow (saving the place_profile)
            workflow.emit('respond', place);

        });
    });

    // [Workflow] 4. Send response back
    workflow.on('respond', function respond(place) {
        debug('[Workflow: respond] respond to the request...');

        // remove unwanted fields
        place.omitFields([], function(err, _place){
            if(err) return next(err);
            // send back a respond
            res.status(201); // Created
            res.json(_place); // send the place
        });
        
    });

    // [Workflow] Emit to a Validation workflow
    workflow.emit('validatePlace');
};