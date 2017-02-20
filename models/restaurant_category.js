// LOAD MONDULE DEPENDECIES
var mongoose		= require('mongoose');
var moment			= require('moment');
var bcrypt			= require('bcrypt');
var debug			= require('debug')('yene-gebeta');

// LOAD CONFIG
var config			= require('../config');

// DECLARE VARIABLES
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var Restaurant_categorySchema = new Schema({
   
   name: { type: String },
   description: { type: String },
   
   // basic fields
   date_created: { type: Date },
   last_modified: { type: Date },

});

// PRE SAVE HOOK
Restaurant_categorySchema.pre('save', function preSaveHook(next){
    debug('[Restaurant_category Model] Pre-save Hook...')
    
    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
Restaurant_categorySchema.pre('update', function preUpdateHook(next){
    debug('[Restaurant_category Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

module.exports = mongoose.model('Restaurant_category', Restaurant_categorySchema);