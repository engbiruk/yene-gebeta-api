// LOAD MONDULE DEPENDECIES
var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');
var debug = require('debug')('yene-gebeta-api:destination-model');
var _ = require('underscore');
// LOAD CONFIG
var config = require('../config');

// DECLARE VARIABLES
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var DestinationSchema = new Schema({

    title: { type: String },
    description: { type: String },
    location_range: [{
        lat: { type: Number },
        lng: { type: Number }
    }],
    // basic fields
    date_created: { type: Date },
    last_modified: { type: Date },

    // reference
    place: [{ type: ObjectId, ref: 'Place' }]
});

// PRE SAVE HOOK
DestinationSchema.pre('save', function preSaveHook(next) {
    debug('[Destination Model] Pre-save Hook...')

    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
DestinationSchema.pre('update', function preUpdateHook(next) {
    debug('[Destination Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

// OMIT RETURNING FIELDS
DestinationSchema.methods.omitFields = function omitFields(fields, callback) {

    if (!fields || !Array.isArray(fields)) {
        throw new Error("'Field' parameter should be Array");
    }

    // convers model to json
    var _destination = this.toJSON();

    // add the default ommited fields 
    fields.push(['__v', 'last_modified', 'date_created']);

    // filter the fields
    _destination = _.omit(_destination, fields);

    callback(null, _destination);
}

module.exports = mongoose.model('Destination', DestinationSchema);