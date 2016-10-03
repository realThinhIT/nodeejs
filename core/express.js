// set the server up
var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    apiConfig       = require('../config/api-config');

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
app.listen(global.globalConfig.SERVER_PORT || 8080, function (err) {
    log.put('server listening on port ' + global.globalConfig.SERVER_PORT || 8080 + '.');
});
