// LOAD MODULE DEPENDECIES
var async			= require('async');


// EXPORT AUTHORIZATION
module.exports = function authorize(types){

    return function middleware(req, res, next) {
        
        // extract the user from the request object passed from the authentication middleware 
        var user = req._user;
        // if the user do NOT exists or set show an error message for tht user
        if(!user) {
            res.status(401); // Unauthorized
            res.json({
                message: 'You are not allowed at all, Please go home or do something'
            })
        }

        // check if the user exists on the allowed types
        var isOk = false;
        
        types.forEach(function iterator(type){
            if(user.role === type || user.realm === type) isOk = true; 

            // when the user do not exist from the types list show message to requester 
            if(!isOk){
                res.status(401); // Unauthorized
                res.json({
                    message: 'You are not allowed to complete this action'
                });
                // return to the user
                return;
            } else { // if the user exist despatch to the next middleware
                return next();
            }

        });

    }
};