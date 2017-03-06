// LOAD MONDULE DEPENDECIES
var mongoose		= require('mongoose');
var moment			= require('moment');
var bcrypt			= require('bcrypt');
var debug			= require('debug')('yene-gebeta-api:image-model');

// LOAD CONFIG
var config			= require('../config');

// DECLARE VARIABLES
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
   
   title: { type: String },
   description: { type: String },
   path: { type: String },

   // basic fields
   date_created: { type: Date },
   last_modified: { type: Date },

   // reference
   menu: { type: ObjectId, ref:'Menu' },
   place: { type: ObjectId, ref:'Place' },
   user_profile: { type: ObjectId, ref:'User_profile' },
   review: { type: ObjectId, ref:'Review' }
});

// PRE SAVE HOOK
ImageSchema.pre('save', function preSaveHook(next){
    debug('[Image Model] Pre-save Hook...')
    
    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
ImageSchema.pre('update', function preUpdateHook(next){
    debug('[Image Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;
    
});

// OMIT RETURNING FIELDS
ImageSchema.methods.omitFields = function omitFields(fields, callback){

    if(!fields || !Array.isArray(fields)){
        throw new Error("'Field' parameter should be Array");
    }

    // convers model to json
    var _image = this.toJSON();
    
    // add the default ommited fields 
    fields.push(['password', '__v', 'last_modified', 'date_created', 'role', 'realm', 'last_login']);
    
    // filter the fields
    _image = _.omit(_image, fields);
    
    callback(null, _image);
}

module.exports = mongoose.model('Image', ImageSchema);