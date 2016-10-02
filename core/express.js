// set the server up
var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    globalConfig    = require('../config/global'),
    apiConfig       = require('../config/api-config'),
    log             = require('../modules/plog')(globalConfig.LOG_ENABLE, globalConfig.LOG_MODE);

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// server default headers
app.use(function (req, res, next) {
    res.type(apiConfig.DEFAULT_TYPE);

    Object.keys(apiConfig.DEFAULT_HEADERS).forEach(function (key) {
        res.set(key, apiConfig.DEFAULT_HEADERS[key]);
    });

    next();
});

// json customizations
app.set('json spaces', apiConfig.JSON_SPACES);

// configure Routes
require('./routes')(app);

// start the server
app.listen(globalConfig.SERVER_PORT || 8080, function (err) {
    log.put('server listening on port ' + globalConfig.SERVER_PORT || 8080 + '.');
});
