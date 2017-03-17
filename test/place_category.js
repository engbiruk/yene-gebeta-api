// Load Module Dependecies
var request			= require('supertest'); // for making http requests
var mocha			= require('mocha');// for structuring
var chai			= require('chai'); // for assering and testing

var app			= require('../app');

var expect = chai.expect;

// PLACE_CATEGORY API TEST
describe('Place_category Endpoint', function () {
    var _place_category = {
        name: 'Kitfo House',
        description: 'Kitfo Serving Tranditional House'
    };
    var _place_categoryId = '58ca573de97a204df57ff494',
        _token  = 'vm7xf3mylwk=';

    /**
     * TEST: GET PLACE_CATEGORY 
     */
    
    /*describe('#Place_category get /place_categories/:place_categoryId', function() {
    it('should get a place_category from db', function(done){
        request(app)
            .get('/place_categorys/'+ _place_categoryId)
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
    });*/

    /**
     * TEST CREATE PLACE_CATEGORY
     * 
     */
    describe('#place_category post /place_categories', function() {
        it('should create a new place_category', function(done){
        request(app)
            .post('/place_categories')
            .set('Content-Type', 'application/json')
            .send(_place_category)
            .expect(201)
            .end(function (err, res){
                if(err) return done(err);
                // Assertion test on request body
                expect(res.body._id).to.be.a('string');
                
                done();
            });
        });
    });
});