// Load Module Dependecies
var request			= require('supertest'); // for making http requests
var mocha			= require('mocha');// for structuring
var chai			= require('chai'); // for assering and testing

var app			= require('../app');

var expect = chai.expect;

// USER API TEST
describe('User Endpoint', function () {
    var _user = {
        property: 'value'
    };
    var _userId = '58b78f707976f71f0e3170c0',
        _token  = 'lpP7D2oUGZs=';

    /**
     * TEST: GET USER 
     */
    describe('#User get /users/:userId', function() {
    it('should get a user from db', function(done){
        request(app)
            .get('/users/'+ _userId)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer '+_token)
            .send({})
            .expect(200)
            .end(function (err, res){
                if(err) done(err);
                
                // Assertion test on request body
                expect(res.body._id).to.be.a('string');
                done();
            });
        });
    })
});