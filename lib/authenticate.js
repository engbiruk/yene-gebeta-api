// LOAD MODULE DEPENDENCIES
var xtend			= require('xtend');
var unless			= require('express-unless');
var moment			= require('moment');

// LOAD CONFIG
var config			= require('../config');

// LOAD DAL'S
var TokenDal			= require('../dal/token');
var UserDal			= require('../dal/user');

// EXPORT AUTHENTICATION
module.exports = function authenticate(opts){
    var defaults = {
        open_endpoints: [],
        set_auth: true
    };
    // copy opts to defaults
    defaults = xtend(defaults, opts);

    var middleware = function middleware(req, res, next){
        // pass authentication middleware if the defaut_set auth is not set 
        if(!defaults.set_auth) next();

        else {
            // check for authentication header
            var auth = req.get("Authorization");

            // check if authentication header is NOT set from the request and notify user to set it
            if(!auth) {
                res.status(403); // Forbidden
                res.json({
                    message: 'Please set Autherization Header'
                });
                // return back to the requester
                return;
            } else { // the Authorization Header is set
                // split up the Autherization header to two sides
                var token = auth.trim().split(' ');
                
                // check if the realm is incorrect, and send notify the user
                if(token[0] !== config.REALM) {
                    res.status(403); // Forbidden
                    res.json({
                        message: "Authorization Realm should be " + config.REALM
                    });
                    // return back to the requester
                    return;
                } else { // if the token realm is correct, now check for token
                    TokenDal.get({value: token[1]}, function callback(err, _token){
                        if(err) return next(err);
                        // if the token do exist in the db, notify user
                        if(!_token._id){
                            res.status(403); // Forbidden
                            res.json({
                                message: 'Authentication Token is Not Recognized!'
                            });
                            // return back to the requester
                            return;
                        } else { // when the token exists on the database
                            var now = moment().toISOString();
                            // check if the token is revoked or expired
                            if(_token.revoked || moment(_token.expires).isBefore(now)){
                                // return an error for the requester
                                res.status(403); // Forbidden
                                res.json({
                                    message: 'Your token is revoked or expired!, Try logging in.'
                                });
                                return;
                            }
                            // attach the user to the request(req) object to send it to Authorization middleware
                            req._user = _token.user;
                            // dispatch the next middleware 
                            next();
                        }
                    })
                }
            };
        };
    };

    // inject unless module to authenticate middleware
    middleware.unless = unless;

    // return the modified middleware
    return middleware;
    
}