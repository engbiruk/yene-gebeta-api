// LOAD MONDULE DEPENDECIES
var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');
var debug = require('debug')('yene-gebeta');

// LOAD CONFIG
var config = require('../config');

// DECLARE VARIABLES
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var RestaturantSchema = new Schema({
    
    name: { type: String },
    otherName: { type: String },
    best_serves: { type: String },
    overview: { type: String },
    country: { type: String, default: 'Ethiopia' },
    city: { type: String, default: 'Addis Ababa' },
    phone_number: { type: String },
    line1: { type: String },
    line2: { type: String },
    website: { type: String },
    email: { type: String },
    price_range: {
        max: { type: Number },
        min: { type: Number }
    },
    popularity_level: { type: Number },
    rate: { type: Number },

    owner_info: {
        name: { type: String },
        phone_number: { type: String }
    },
    manager_info: {
        name: { type: String },
        phone_number: { type: String }
    },
    social: {
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        youtube: { type: String }
    },
    
    location: {
        latitude: { type: Number },
        longitude: { type: Number }
    },

    // basic fields
   date_created: { type: Date },
   last_modified: { type: Date },

   // reference
    category: { type: ObjectId, ref: 'Restaurant_category' },
    image: [{ type: ObjectId, ref: 'Image' }],
    branch: [{ type: ObjectId, ref:'Branch' }],
    reservation: [{ type: ObjectId, ref:'Reservation' }],
    opening_hours: { type: ObjectId, ref:'Opening_hours' },
    menu: [{ type: ObjectId, ref:'Menu' }],
    review: [{ type: ObjectId, ref:'Review' }]

});

// PRE SAVE HOOK
RestaturantSchema.pre('save', function preSaveHook(next) {
    debug('[Restaturant Model] Pre-save Hook...')

    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
RestaturantSchema.pre('update', function preUpdateHook(next) {
    debug('[Restaturant Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

module.exports = mongoose.model('Restaturant', RestaturantSchema);