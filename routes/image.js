// LOAD MODULE DEPENDECIES
var express		= require('express');
var multer      = require('multer');
var upload      = multer({ 
                    dest: './placesLogo/', 
                    inMemory:true,
                    fileFilter: function (req, file, callback){
                        // var fileTypes = /jpgg|jpg|png/;
                        // var mimeType  = fileTypes.test(file.mimeType);
                        // var extName   = fileTypes.test(file.originalname.split('.')[1].toLowerCase());
                        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
                            return callback(new Error("Only image files(jpg|jpeg|png) are Allowed!"));
                        }
                        callback(null, true);
                    }
                 });
                    //.array('image', 5);
                    //.single('image');
 
// LOAD CONTROLLERS
var image	= require('../controllers/image');
var auth			= require('../controllers/auth');
var authorize		= require('../lib/authorize');
//var authenticate = require('./lib/authenticate');

// CREATE A ROUTER
var router = express.Router();

// POST /images
router.post('/:imageId', image.noop);

// DELETE /images/:imageId
router.delete('/:imageId', image.noop);

// GET /images/:imageId
router.get('/:imageId', image.noop);

// PUT /images/:imageId
router.put('/:imageId', image.noop);

// GET /images/all
router.get('/all', image.noop);

// POST /images/places/logo/:placeId
router.post('/places/logo/:placeId', image.uploadPlaceLogo);


module.exports = router;