// LOAD MONDULE DEPENDECIES
var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');
var debug = require('debug')('yene-gebeta-api:place-model');

// LOAD CONFIG
var config = require('../config');

// DECLARE VARIABLES
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({

    name: { type: String },
    other_name: { type: String },
    best_serves: { type: String },
    overview: { type: String },
    country: { type: String, default: 'Ethiopia' },
    city: { type: String, default: 'Addis Ababa' },
    phone_number: { type: String },
    line1: { type: String },
    line2: { type: String },
    website: { type: String },
    email: { type: String },
    can_reserve: {type: Boolean, default:false},
    price_range: {
        max: { type: String},
        min: { type: String }
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
    logo: {type: ObjectId, ref: 'Image'},
    destination: {type: ObjectId, ref: 'Destination'}, 
    feature: [{type:ObjectId, ref: 'Place_feature'}],
    category: { type: ObjectId, ref: 'Place_category' },
    image: [{ type: ObjectId, ref: 'Image' }],
    branch: [{ type: ObjectId, ref: 'Branch' }],
    reservation: [{ type: ObjectId, ref: 'Reservation' }],
    opening_hours: { type: ObjectId, ref: 'Opening_hours' },
    menu: [{ type: ObjectId, ref: 'Menu' }],
    review: [{ type: ObjectId, ref: 'Review' }]

});

// PRE SAVE HOOK
PlaceSchema.pre('save', function preSaveHook(next) {
    debug('[Place Model] Pre-save Hook...')

    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
PlaceSchema.pre('update', function preUpdateHook(next) {
    debug('[Place Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

// OMIT RETURNING FIELDS
PlaceSchema.methods.omitFields = function omitFields(fields, callback){

    if(!fields || !Array.isArray(fields)){
        throw new Error("'Field' parameter should be Array");
    }

    // convers model to json
    var _place = this.toJSON();
    
    // add the default ommited fields 
    fields.push(['__v', 'last_modified', 'date_created']);
    
    // filter the fields
    _place = _.omit(_place, fields);
    
    callback(null, _place);
}

module.exports = mongoose.model('Place', PlaceSchema);