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

var Opening_hourSchema = new Schema({
   
   monday: {
       open: { type: Number }, close: { type: Number }
   },
   tuesday: {
       open: { type: Number }, close: { type: Number }
   },
   wednesday: {
       open: { type: Number }, close: { type: Number }
   },
   thursday: {
       open: { type: Number }, close: { type: Number }
   },
   friday: {
       open: { type: Number }, close: { type: Number }
   },
   saturday: {
       open: { type: Number }, close: { type: Number }
   },
   sunday: {
       open: { type: Number }, close: { type: Number }
   },

   // basic fields
   date_created: { type: Date },
   last_modified: { type: Date },

   // references
   restaurant: { type: ObjectId, ref:'Restaurant' }

});

// PRE SAVE HOOK
Opening_hourSchema.pre('save', function preSaveHook(next){
    debug('[Opening_hour Model] Pre-save Hook...')
    
    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
Opening_hourSchema.pre('update', function preUpdateHook(next){
    debug('[Opening_hour Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

module.exports = mongoose.model('Opening_hour', Opening_hourSchema);