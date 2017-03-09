// LOAD MODULE DEPENDENCIES
var events = require('events');
var moment = require('moment');
var debug = require('debug')('yene-gebeta-api:image-controller');
var multer = require('multer');
var fs = require('fs');

// LOAD CONFIG
var config = require('../config');

// LOAD MODEL'S DAL
var ImageDal = require('../dal/image');
var PlaceDal = require('../dal/place');

// EXPORT NOOP
exports.noop = function noop(req, res, next) {
    res.json({
        message: "TO BE IMPLEMENTED"
    })
};

/*var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./placesLogo/");
    },
    filename: function(req, file, cb) {
        var re = /(?:\.([^]+))?$/;
        var ext = re.exec(file.originalname);
        if(!ext){
            cb(new Error("The extenstion (jpg|jpeg|png) of the file must be set!"));
            return;
        }
        console.log(req.file);
        cb(null, file.filename+'.'+ext);
    }
});*/
var upload = multer({
    dest: config.STATIC_FILES + config.LOGO_PATH, inMemory: true, //storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Only image files (jpg|jpeg|png) are Allowed!"));
        };
        if (file.fieldname !== 'logo') {
            return cb(new Error("Field name should be 'logo', not '" + file.fieldname + "'"));
        }

        cb(null, true);
    }
}).single('logo'); 
exports.uploadPlaceLogo = function uploadPlaceLogo(req, res, next) {

    upload(req, res, function (err) {
        // first handle the errors during upload
        if (err) {
            res.status(400).json({ message: err.message });
            return;
        }

        var file = req.file;

        // get the extension of the file name
        var re = /(?:\.([^]+))?$/;
        var ext = file.originalname.substr(file.originalname.lastIndexOf('.')+1);//re.exec(file.originalname);
        console.log(ext);
        
        if (!ext) {
            cb(new Error("The extenstion (jpg|jpeg|png) of the file must be set!"));
            return;
        }
        // rename the file name
        file.path = config.STATIC_FILES + config.LOGO_PATH + file.filename + '.' + ext;
        file.relativePath = config.LOGO_PATH + file.filename + '.' + ext;
        
        fs.rename(config.STATIC_FILES + config.LOGO_PATH + file.filename, file.path, function (err) {
            if (err) return cb(err);

            // check of the place exist with that id
            PlaceDal.get({ _id: req.params.placeId }, function getPlace(err, place) {
                if (err) return next(err);

                if (!place._id) {
                    fs.unlink(file.path, function (){});
                    res.status(404).json({ message: "No place found with the id: " + req.params.placeId });
                }
                console.log("==== = = = = = ", file.path);
                // create an image
                ImageDal.create({
                    title: req.body.title ? req.body.title : place.name + "-logo",
                    description: req.body.description ? req.body.description : place.name + "- logo",
                    path: file.relativePath,
                    place: place._id
                }, function (err, image) {
                    if (err) return next(err);

                    // Modify place
                    PlaceDal.update({ _id: place._id }, { $set: { logo: image._id } }, function (err, _place) {
                        if (err) return next(err);

                        res.status(201).json({
                            message: "Logo Successfuly Uploaded!"
                        });
                    })
                });

            });



        });


    });

}