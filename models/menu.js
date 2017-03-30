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

var MenuSchema = new Schema({

    title: { type: String },
    ingredient: { type: String },
    description: { type: String },
    price: { type: Number },

    // basic fields
    date_created: { type: Date },
    last_modified: { type: Date },

    // references
    menu_category: { type: ObjectId, ref: 'Menu_category' },
    image: [{ type: ObjectId, ref: 'Image' }],
    place: { type: ObjectId, ref: 'Place' }
});

// PRE SAVE HOOK
MenuSchema.pre('save', function preSaveHook(next) {
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
MenuSchema.pre('update', function preUpdateHook(next) {
    debug('[Menu Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

// OMIT RETURNING FIELDS
MenuSchema.methods.omitFields = function omitFields(fields, callback) {

    if (!fields || !Array.isArray(fields)) {
        throw new Error("'Field' parameter should be Array");
    }

    // convers model to json
    var _menu = this.toJSON();

    // add the default ommited fields 
    fields.push(['password', '__v', 'last_modified', 'date_created', 'role', 'realm', 'last_login']);

    // filter the fields
    _menu = _.omit(_menu, fields);

    callback(null, _menu);
}

module.exports = mongoose.model('Menu', MenuSchema);