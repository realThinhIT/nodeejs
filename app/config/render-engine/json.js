// API CONFIGURATIONS
// this is common configurations for API system

export default {
    // api default headers
    DEFAULT_TYPE:       'application/json',
    DEFAULT_HEADERS:    {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, HEAD',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Api-Key'
    },

    // json customizations
    JSON_SPACES:        4,          // recommend '0' for production

    SETUP_FUNCTION: function (app, next) {
        app.set('json spaces', this.JSON_SPACES);
        next();
    }
};
