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

var MenuSchema = new Schema({
   
   title: { type: String },
   ingredient: { type: String },
   description: { type: String },
   price: { type: Number },

   // basic fields
   date_created: { type: Date },
   last_modified: { type: Date },

   // references
   menu_category: { type: ObjectId, ref:'Menu_category' },
   image: [{ type: ObjectId, ref:'Image' }],
   restaurant: { type: ObjectId, ref:'Restaurant' }
});

// PRE SAVE HOOK
MenuSchema.pre('save', function preSaveHook(next){
    debug('[Menu Model] Pre-save Hook...')
    
    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
MenuSchema.pre('update', function preUpdateHook(next){
    debug('[Menu Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

module.exports = mongoose.model('Menu', MenuSchema);