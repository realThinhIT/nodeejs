var routes          = require('../config/routes'),
    globalConfig    = require('../config/global'),
    log             = require('../modules/plog')(globalConfig.LOG_ENABLE, globalConfig.LOG_MODE);

module.exports = function (app) {
    routes.forEach(function (group) {
        group.endPoints.forEach(function (point) {
            group.group = (group.group === '/') ? '' : group.group;
            var endPoint        = group.group + point.path;
            var method          = point.verb;
            var callbackMethod  = point.callback;
            var func = require('../controllers/' + point.controller)[callbackMethod];

            // throw an exception if the callback function is illegal
            if (typeof(func) !== 'function') {
                var message = 'route: callback function \'' + callbackMethod + '\' (' + typeof(func) + ') is not available at ' + endPoint;

                log.throwException(message);
            }

            var callbackFunction = function (req, res, next) {
                func(req, res);

                next();
            };

            log.put('setup endpoint: ' + method.toUpperCase() + ' ' + endPoint + ' -> ' + point.controller + '/' + callbackMethod);

            app.use(endPoint, callbackFunction);
        });
    });
};
