// LOAD MONDULE DEPENDECIES
var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');
var debug = require('debug')('yene-gebeta-api:reservation-model');

// LOAD CONFIG
var config = require('../config');

// DECLARE VARIABLES
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var ReservationSchema = new Schema({

    number_of_guests: {
        type: Number
    },
    reservation_date: {
        type: Date
    },
    reservation_time: {
        type: String
    },
    note: {
        type: String
    },

    // basic fields
    date_created: {
        type: Date
    },
    last_modified: {
        type: Date
    },

    // references
    user_profile: {
        type: ObjectId,
        ref: 'User_profile'
    },
    place: {
        type: ObjectId,
        ref: 'Place'
    }
});

// PRE SAVE HOOK
ReservationSchema.pre('save', function preSaveHook(next) {
    debug('[Reservation Model] Pre-save Hook...')

    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
ReservationSchema.pre('update', function preUpdateHook(next) {
    debug('[Reservation Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

// OMIT RETURNING FIELDS
ReservationSchema.methods.omitFields = function omitFields(fields, callback) {

    if (!fields || !Array.isArray(fields)) {
        throw new Error("'Field' parameter should be Array");
    }

    // convers model to json
    var _reservation = this.toJSON();

    // add the default ommited fields 
    fields.push(['password', '__v', 'last_modified', 'date_created', 'role', 'realm', 'last_login']);

    // filter the fields
    _reservation = _.omit(_reservation, fields);

    callback(null, _reservation);
}

module.exports = mongoose.model('Reservation', ReservationSchema);