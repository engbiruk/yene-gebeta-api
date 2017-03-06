// LOAD MODULE DEPENDECIES
var events			= require('events');
var crypto			= require('crypto');
var debug			= require('debug')('yene-gebeta-api:branch-controller');
var moment			= require('moment');

// LOAD CONFIG
var config			= require('../config');

// LOAD DAL'S
var branch			= require('../dal/branch');

// EXPORT NOOP
exports.noop = function noop(req, res, next){
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

exports.login = function login(req, res, next) {
    debug('[Branch Controller] Login user');

    var workflow = new event.EventEmitter();

    workflow.on('validateData', function validateData(){
        
    });
}





