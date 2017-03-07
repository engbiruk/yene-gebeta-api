// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:place-controller');

// LOAD CONFIG
var config = require('../config');

// LOAD MODEL'S DAL
var PlaceDal = require('../dal/place');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
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
    var PlaceId = req.params.placeId;

    // fetch a Place
    PlaceDal.get({ _id: PlaceId }, function getAPlace(err, Place) {
        if (err) return next(err);

        // if the Place doesnot exist, return that to the Place
        if (!Place._id) {
            res.status(404).json({ message: 'Place does not exist!' });
            return;
        }

        // remove unwanted fields from populated Place_profile field in the Place
        Place.omitFields([], function (err, _Place) {
            if (err) return next(err);

            // return the Place to the requester
            res.status(200).json(_Place || {});
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
            .isIn([true, false]).withMessage('Can Reserve should be true/false!');

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
    workflow.on('checkIfPlaceExist', function checkPlaceExist() {
        debug('[Workflow: checkIfPlaceExist] check if the place exists...');

        // Check if the place already exists in the database (checking the placename from the submitted email)
        PlaceDal.get({ email: body.email, name: body.name }, function getPlace(err, place) {
            if (err) return next(err);

            // if place exist response back
            if (place._id) {
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
            other_name: body.name ? body.name : '',
            best_serves: body.best_serves ? body.best_serves : '',
            overview: body.overview ? body.overview : '',
            country: body.country ? body.country : '',
            city: body.city ? body.city : '',
            phone_number: body.phone_number ? body.phone_number : '',
            line1: body.line1 ? body.line1 : '',
            line2: body.line2 ? body.line2 : '',
            webiste: body.webiste ? body.webiste : '',
            email: body.email ? body.email : '',
            can_reserve: body.can_reserve ? body.can_reserve : false,
            price_range: body.price_range ? body.price_range : { max: '0.0', min: '0.0' },
            popularity_level: body.popularity_level ? body.popularity_level : 0,
            rate: body.rate ? body.rate : 0,
            owner_info: body.owner_info ? body.owner_info : { name: 'Owner', phone_number: body.phone_number },
            manager_info: body.manager_info ? body.manager_info : { name: 'Owner', phone_number: body.phone_number },
            social: body.social ? body.social : {},
            location: body.location ? body.location : { lat: 0, lng: 0 },
            //logo: body.logo?body.logo: '',
            //destination: body.destination ?body.destination:{}
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
        place.omitFields([], function (err, _place) {
            if (err) return next(err);
            // send back a respond
            res.status(201); // Created
            res.json(_place); // send the place
        });

    });

    // [Workflow] Emit to a Validation workflow
    workflow.emit('validatePlace');
};

/**
 * GET ALL PLACES
 * 
 * @params {Object} req Request
 * @params {Object} res Response
 * @params {Object} next Next Middleware Dispatcher
 * 
 * @return {Object} places ALL Places as Json Object
 */
exports.getAllPlaces = function getAllPlaces(req, res, next) {
    debug('Get all Places...');

    // fetch a Place
    PlaceDal.getCollection({}, function getAllPlaces(err, Places) {
        if (err) return next(err);

        // if the Place doesnot exist, return that to the Place
        if (!Array.isArray(Places)) {
            res.status(404).json({ message: 'No Places Found!' });
            return;
        }
        var _places = Array();
        Places.forEach(function (place) {
            // remove unwanted fields from populated Place_profile field in the Place
            place.omitFields([], function (err, _Place) {
                if (err) return next(err);

                // return the Place to the requester
                _places.push(_Place);
            });
        });
        res.status(200).json(_places || {});

    });
}