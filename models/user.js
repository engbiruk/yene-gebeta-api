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

var UserSchema = new Schema({
    username: { type: String },
    password: { type: String },
    realm: { type: String, default: 'user' },
    role: { type: String },
    status: { type: String, default: 'active' },
    last_login: { type: Date },

    // basic fields
   date_created: { type: Date },
   last_modified: { type: Date },

   // reference
    user_profile: { type: ObjectId, ref:'User_profile' }
});

// PRE SAVE HOOK
UserSchema.pre('save', function preSaveHook(next) {
    debug('[User Model] Pre-save Hook...')

    let model = this;

    // generate a salt
    bcrypt.genSalt(config.SALT_LENGTH, function generateSalt(err, SALT) {
        if (err) return next(err);
        // generate hash for a password using salt
        bcrypt.hash(model.password, SALT, function hashPassword(err, HASH) {
            if (err) return next(err);

            // create a current timestamp
            var now = moment().toISOString();

            // set date_created and last_modified values to current time
            model.date_created = now;
            model.last_modified = now;
            // modify password with a new hashed password
            model.password = HASH;
        });
    });

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
UserSchema.pre('update', function preUpdateHook(next) {
    debug('[User Model] Pre-update Hook...')

    let model = this;
    var now = moment().toISOString();

    // update the last_modified value current date
    model.last_modified = now;

});

// COMPARE PASSWORDS METHOD
UserSchema.method.checkPassword = function checkPassword(password, callback) {
    // Compare two passwords
    bcrypt.compare(password, this.password, function done(err, res) {
        if(err) return callback(err);

        callback(null, res);
    });
};

module.exports = mongoose.model('User', UserSchema);