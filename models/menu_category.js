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

var Menu_categorySchema = new Schema({
   
   title: { type: String },
   descripton: { type: String },

   // basic fields
   date_created: { type: Date },
   last_modified: { type: Date }

   
});

// PRE SAVE HOOK
Menu_categorySchema.pre('save', function preSaveHook(next){
    debug('[Menu_category Model] Pre-save Hook...')
    
    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
Menu_categorySchema.pre('update', function preUpdateHook(next){
    debug('[Menu_category Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

// OMIT RETURNING FIELDS
Menu_categorySchema.methods.omitFields = function omitFields(fields, callback){

    if(!fields || !Array.isArray(fields)){
        throw new Error("'Field' parameter should be Array");
    }

    // convers model to json
    var _menu_category = this.toJSON();
    
    // add the default ommited fields 
    fields.push(['password', '__v', 'last_modified', 'date_created', 'role', 'realm', 'last_login']);
    
    // filter the fields
    _menu_category = _.omit(_menu_category, fields);
    
    callback(null, _menu_category);
}

module.exports = mongoose.model('Menu_category', Menu_categorySchema);