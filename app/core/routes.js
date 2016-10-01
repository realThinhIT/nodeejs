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

            var callbackFunction = function (req, res, next) {
                var func = require('../controllers/' + point.controller)[callbackMethod];

                if (typeof(func) === 'function') {
                    func(req, res);
                } else {
                    var message = 'route: callback function \'' + callbackMethod + '\' is not available at ' + endPoint;

                    log.put(message);
                    res.json({
                        status: 0,
                        message: message
                    });
                }

                next();
            };

            log.put('setup endpoint: ' + method.toUpperCase() + ' ' + endPoint + ' -> ' + point.controller + '/' + callbackMethod);

            app.use(endPoint, callbackFunction);
        });
    });
};
