// LOAD MONDULE DEPENDECIES
var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');
var debug = require('debug')('yene-gebeta-api:place_cuisine-model');

// LOAD CONFIG
var config = require('../config');

// DECLARE VARIABLES
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var Place_cuisineSchema = new Schema({

    name: {
        type: String
    },
    description: {
        type: String
    },

    // basic fields
    date_created: {
        type: Date
    },
    last_modified: {
        type: Date
    }

});

// PRE SAVE HOOK
Place_cuisineSchema.pre('save', function preSaveHook(next) {
    debug('[Place_cuisine Model] Pre-save Hook...')

    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
Place_cuisineSchema.pre('update', function preUpdateHook(next) {
    debug('[Place_cuisine Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

// OMIT RETURNING FIELDS
Place_cuisineSchema.methods.omitFields = function omitFields(fields, callback) {

    if (!fields || !Array.isArray(fields)) {
        throw new Error("'Field' parameter should be Array");
    }

    // convers model to json
    var _place_cuisine = this.toJSON();

    // add the default ommited fields 
    fields.push(['password', '__v', 'last_modified', 'date_created', 'role', 'realm', 'last_login']);

    // filter the fields
    _place_cuisine = _.omit(_place_cuisine, fields);

    callback(null, _place_cuisine);
}

module.exports = mongoose.model('Place_cuisine', Place_cuisineSchema);