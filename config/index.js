
var HTTP_PORT = process.env.HTTP_PORT || 8000;

module.exports = {
    // HTTP PORT
    HTTP_PORT: HTTP_PORT,

    // MONGODB URL
    MONGODB_URL: 'mongodb://localhost/yene-gebeta',

    // SALT LENGTH
    SALT_LENGTH: 3,

    // TOKEN LENGTH
    TOKEN_LENGTH: 8,

    // AUTHENTICATION REALM
    REALM: 'Bearer',

    // USER TYPES
    USER_TYPES: [
        'normal', 'client', 'staff', 'admin'
    ],

    // STATIC FILES PATH
    STATIC_FILES: './public',

    // LOGO FILES STORAGE PATH
    LOGO_PATH: '/placesLogo/'
}; 