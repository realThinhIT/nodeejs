// API CONFIGURATIONS
// this is common configurations for API system

module.exports = {
    // api default headers
    DEFAULT_TYPE:       'application/json',
    DEFAULT_HEADERS:    {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    },

    // json customizations
    JSON_SPACES:        4,          // recommend '0' for production

    // api security
    API_KEY:        'TvGpPbCwebLVA0YeswemQgYPCRKno8XaTUCaTuFz',     // recommended to change this for every app

    // login tokens
    LOGIN_TOKEN_LENGTH:                     60,             // length of login token (characters)
    LOGIN_TOKEN_EXPIRED_SHORT:              5,              // expiration time in days (not remembering)
    LOGIN_TOKEN_EXPIRED_LONG:               30,             // expiration time in days (remembering)
};
