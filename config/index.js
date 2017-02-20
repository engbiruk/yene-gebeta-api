
var HTTP_PORT = process.env.HTTP_PORT || 8000;

module.exports = {
    // HTTP PORT
    HTTP_PORT: HTTP_PORT,

    // MONGODB URL
    MONGODB_URL: 'mongodb://localhost/yene-gebeta',

    // SALT LENGTH
    SALT_LENGTH: 17,

    // TOKEN LENGTH
    TOKEN_LENGTH: 10,

    // AUTHENTICATION REALM
    REALM: 'Bearer'
};