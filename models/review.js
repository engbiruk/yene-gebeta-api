// LOAD MONDULE DEPENDECIES
var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');
var debug = require('debug')('yene-gebeta');
var _ = require('underscore');
// LOAD CONFIG
var config = require('../config');

// DECLARE VARIABLES
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({

    title: { type: String },
    description: { type: String },
    rate: { type: Number },

    // basic fields
    date_created: { type: Date },
    last_modified: { type: Date },

    // references
    user_profile: { type: ObjectId, ref: 'User_profile' },
    image: [{ type: ObjectId, ref: 'Image' }],
    place: { type: ObjectId, ref: 'Place' }
});

// PRE SAVE HOOK
ReviewSchema.pre('save', function preSaveHook(next) {
    debug('[Review Model] Pre-save Hook...')

    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
ReviewSchema.pre('update', function preUpdateHook(next) {
    debug('[Review Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

// OMIT RETURNING FIELDS
ReviewSchema.methods.omitFields = function omitFields(fields, callback) {

    if (!fields || !Array.isArray(fields)) {
        throw new Error("'Field' parameter should be Array");
    }

    // convers model to json
    var _review = this.toJSON();

    // add the default ommited fields 
    fields.push(['password', '__v', 'last_modified', 'date_created', 'role', 'realm', 'last_login']);

    // filter the fields
    _review = _.omit(_review, fields);

    callback(null, _review);
}

module.exports = mongoose.model('Review', ReviewSchema);