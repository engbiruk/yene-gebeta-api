// LOAD MODULE DEPENDENCIES
var events      = require('events');
var moment      = require('moment');
var debug       = require('debug')('yene-gebeta-api:user_profile-controller');

// LOAD MODEL'S DAL

// EXPORT NOOP
exports.noop = function noop(req, res, next){
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};