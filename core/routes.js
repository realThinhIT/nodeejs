// ######################################################
// CORE: ROUTES CONFIGURES
// ######################################################

var routes          = require('../config/routes'),
    log             = global.app.log;

var validationProcess = function (req, res, func, callback) {
    var response = global.app.presponse;
    var middlewares = {};
    var validationPass = true;

    // set and execute the middlewares
    func.middlewares.forEach(function (mid) {
        // if the validation is not pass somewhere,
        // useful for a controller that has multiple middlewares
        if (validationPass === false) {
            return;
        }

        // execute the middlewares then get the callback
        middlewares[mid] = require('../app/middlewares/' + mid);
        middlewares[mid].beforeAction(req, response.to(res),
            function (isValidated, data, code, detailCode) {
                if (!isValidated || isValidated === null || isValidated === undefined) {
                    // log.put('[middleware] failed to execute middleware ' + mid + ' at ' + endPoint + ': ' + data , false);
                    response.to(res).fail('the app failed in executing middleware ' + mid + ( (typeof(data) === 'string') ? ': ' + data : '' ), code || 500, detailCode);

                    validationPass = false;
                    return;
                } else {
                    middlewares[mid] = data;
                }
            }
        );
    });

    callback(validationPass, middlewares);
};

module.exports = function (app) {
    routes.forEach(function (group) {
        group.endPoints.forEach(function (point) {
            group.group = (group.group === '/') ? '' : group.group;
            var endPoint        = group.group + point.path;
            var method          = point.verb;
            var callbackMethod  = point.callback;
            var func = require('../app/controllers/' + point.controller);

            // throw an exception if the callback function is illegal
            if (typeof(func[callbackMethod]) !== 'function') {
                var message = '[route] callback function \'' + callbackMethod + '\' (' + typeof(func[callbackMethod]) + ') is not available at ' + endPoint;

                log.throwException(message);
            }

            if (!(func.middlewares instanceof Array)) {
                log.put('[middleware] warning: ' + callbackMethod + '.middlewares is not available', false);
            }

            var callbackFunction = function (req, res, next) {
                var response = global.app.presponse;

                validationProcess(req, res, func, function (validationPass, middlewares) {
                    if (validationPass === true) func[callbackMethod](req, response.to(res, next), middlewares);
                });

                // next();
            };

            log.put('[route] setup endpoint: ' + method.toUpperCase() + ' ' + endPoint);

            // app.use(endPoint, callbackFunction);

            if (method === 'post') {
                app.post(endPoint, callbackFunction);
            } else if (method === 'get') {
                app.get(endPoint, callbackFunction);
            } else if (method === 'put') {
                app.put(endPoint, callbackFunction);
            } else if (method === 'delete') {
                app.delete(endPoint, callbackFunction);
            } else if (method === 'all') {
                app.all(endPoint, callbackFunction);
            }
        });
    });
};
