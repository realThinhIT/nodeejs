// GLOBAL CONFIGURATIONS

export default {
    // server environment
    APP_NAME:       'ThinhIT\'s Nodee API/ Web App Starter Pack',
    SERVER_PORT:    91,

    // debugging
    LOG_ENABLE:     true,
    LOG_REQUEST:    true,
    LOG_CLEAR_CONSOLE_ON_STARTUP:   true,

    // auto import models
    // so that you can call it by Nodee.model[Model]?
    autoImportModels: true,

    // api security
    API_KEY:        'TvGpPbCwebLVA0YeswemQgYPCRKno8XaTUCaTuFz',     // recommended to change this for every app

    // login tokens
    LOGIN_TOKEN_LENGTH:                     60,             // length of login token (characters)
    LOGIN_TOKEN_EXPIRED_SHORT:              5,              // expiration time in days (not remembering)
    LOGIN_TOKEN_EXPIRED_LONG:               30,             // expiration time in days (remembering)
};
