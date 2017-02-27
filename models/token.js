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

var TokenSchema = new Schema({
    
    value: { type: String },
    revoked: { type: Boolean, default: true },
    expires: { type: Date },
    
    // basic fields
   date_created: { type: Date },
   last_modified: { type: Date },

   // references
   user: { type: Schema.Types.ObjectId, ref: 'User' }
});

// PRE SAVE HOOK
TokenSchema.pre('save', true, function preSaveHook(next, done) {
    debug('[Token Model] Pre-save Hook...')

    let model = this;

    var now = moment().toISOString();

    // set date_created and last_modified values to current time
    model.date_created = now;
    model.last_modified = now;

    done();
    // call the next middleware
    next();
});

// PRE UPDATE HOOK
TokenSchema.pre('update', true, function preUpdateHook(next, done) {
    debug('[Token Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;
    done();

    next();

});

module.exports = mongoose.model('Token', TokenSchema);