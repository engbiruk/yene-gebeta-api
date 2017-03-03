// LOAD MONDULE DEPENDECIES
var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');
var debug = require('debug')('yene-gebeta-api:User_profile-model');
var _			= require('underscore');

// LOAD CONFIG
var config = require('../config');

// DECLARE VARIABLES
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var User_profileSchema = new Schema({
    
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    date_of_birth: { type: Date },
    city: { type: String, defaul: 'Addis Ababa' },
    country: { type: String, default: 'Ethiopia' },
    phone_number: { type: String },
    gender: { type: String },
    about: { type: String },

    // basic fields
   date_created: { type: Date },
   last_modified: { type: Date },

   // references
    picture: { type: ObjectId, ref: 'Image' },
    user: { type: ObjectId, ref:'User' }
});

// PRE SAVE HOOK
User_profileSchema.pre('save', function preSaveHook(next) {
    debug('[User_profile Model] Pre-save Hook...')

    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
User_profileSchema.pre('update', function preUpdateHook(next) {
    debug('[User_profile Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

// OMIT RETURNING FIELDS
User_profileSchema.methods.omitFields = function omitFields(fields, callback){

    if(!fields || !Array.isArray(fields)){
        throw new Error("'Field' parameter should be Array");
    }

    // convers model to json
    var _user_profile = this.toJSON();
    
    // add the default ommited fields 
    fields.push(['password', '__v', 'last_modified', 'date_created']);
    
    // filter the fields
    _user_profile = _.omit(_user_profile, fields);
    
    callback(null, _user_profile);
}
module.exports = mongoose.model('User_profile', User_profileSchema);