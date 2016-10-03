var routes          = require('../config/routes');

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

                global.log.throwException(message);
            }

            var callbackFunction = function (req, res, next) {
                var response = require('../modules/presponse');

                func(req, response.to(res));

                next();
            };

            log.put('setup endpoint: ' + method.toUpperCase() + ' ' + endPoint);

            // app.use(endPoint, callbackFunction);

            if (method === 'post') {
                app.post(endPoint, callbackFunction);
            } else if (method === 'get') {
                app.get(endPoint, callbackFunction);
            }
        });
    });
};
