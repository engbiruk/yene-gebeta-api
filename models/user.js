// LOAD MONDULE DEPENDECIES
var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');
var debug = require('debug')('yene-gebeta-api:user-model');
var _ = require('underscore');

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
    user_profile: { type: ObjectId, ref: 'User_profile' }
});

// PRE SAVE HOOK
UserSchema.pre('save', true, function preSaveHook(next, done) {
    debug('[User Model] Pre-save Hook...')

    let model = this;

    // generate a salt
    bcrypt.genSalt(config.SALT_LENGTH, function generateSalt(err, SALT) {
        if (err) return done(err);
        // generate hash for a password using salt
        bcrypt.hash(model.password, SALT, function hashPassword(err, HASH) {
            if (err) return done(err);

            // create a current timestamp
            var now = moment().toISOString();

            // set date_created and last_modified values to current time
            model.date_created = now;
            model.last_modified = now;
            // modify password with a new hashed password
            model.password = HASH;
            done();
        });
    });

    // call the next middleware
    next();
});

// PRE UPDATE HOOK
// UserSchema.pre('update', true, function preUpdateHook(next, done) {
//     debug('[User Model] Pre-update Hook...');

//     let model = this;

//     // generate a salt
//     bcrypt.genSalt(config.SALT_LENGTH, function generateSalt(err, SALT) {
//         if (err) return done(err);
//         // generate hash for a password using salt
//         bcrypt.hash(model.password, SALT, function hashPassword(err, HASH) {
//             if (err) return done(err);

//             // create a current timestamp
//             var now = moment().toISOString();

//             // set last_modified value to current time
//             model.last_modified = now;
//             // modify password with a new hashed password
//             model.password = HASH;
//             done();
//         });
//     });

//     // call the next middleware
//     next();
// });

// Find one and update 
UserSchema.pre('findOneAndUpdate', true, function preUpdateHook(next, done) {
    debug('[User Model] Pre-findOneAndUpdate Hook...');

    var self = this;
    var model = self.getUpdate();
    //console.log(model.password);
    // generate a salt
    bcrypt.genSalt(config.SALT_LENGTH, function generateSalt(err, SALT) {
        if (err) return done(err);
        // generate hash for a password using salt
        //console.log(UserSchema, ", ", model, ", ", this.password, " ============  ");
        bcrypt.hash(model.password, SALT, function hashPassword(err, HASH) {
            if (err) return done(err);

            // create a current timestamp
            var now = moment().toISOString();

            // // set last_modified value to current time
            // model.last_modified = now;
            // // modify password with a new hashed password
            // model.password = HASH;
            // console.log(model);
            // done();
        });
    });

    // call the next middleware
    next();
});


// COMPARE PASSWORDS METHOD
UserSchema.methods.checkPassword = function checkPassword(password, callback) {

    // Compare two passwords
    bcrypt.compare(password, this.password, function done(err, res) {
        if (err) return callback(err);

        callback(null, res);
    });
};

// OMIT RETURNING FIELDS
UserSchema.methods.omitFields = function omitFields(fields, callback) {

    if (!fields || !Array.isArray(fields)) {
        throw new Error("'Field' parameter should be Array");
    }

    // convers model to json
    var _user = this.toJSON();

    // add the default ommited fields 
    fields.push(['password', '__v', 'last_modified', 'date_created', 'role', 'realm', 'last_login']);

    // filter the fields
    _user = _.omit(_user, fields);

    callback(null, _user);
}

module.exports = mongoose.model('User', UserSchema);