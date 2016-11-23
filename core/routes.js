// ######################################################
// CORE: ROUTES CONFIGURES
// ######################################################

import routes   from '../config/routes';
import async    from 'async';
const log       = global.app.log;

let validationProcess = (req, res, func, callback) => {
    let response = global.app.presponse;
    let middlewares = {};
    let validationPass = true;

    // set and execute the middlewares
    async.each(func.middlewares, (mid, callback) => {
        let middleware = null;

        let midName = mid.replace(/\//g, '.');

        // if the validation is not pass somewhere,
        // useful for a controller that has multiple middlewares
        if (validationPass === false) {
            return false;
        }

        // execute the middlewares then get the callback
        try {
            middleware = require('../app/middlewares/' + mid).default;
        } catch (e) {
            validationPass = false;

            log.put('[middleware] error: ' + midName + ' doesn\'t exist', false);
            return response.to(res).fail('middleware named ' + midName + ' is not available');
        }

        middleware.beforeAction(req, response.to(res),
            (isValidated, data, code, detailCode) => {
                if (!isValidated || isValidated === null || isValidated === undefined) {
                    validationPass = false;

                    // log.put('[middleware] failed to execute middleware ' + mid + ' at ' + endPoint + ': ' + data , false);
                    return response.to(res).fail('the app failed in executing middleware ' + midName + ( (typeof(data) === 'string') ? ': ' + data : '' ), code || 500, detailCode);
                } else {
                    middlewares[midName] = data;

                    callback(null);
                }
            }
        );
    },
    err => {
        callback(validationPass, middlewares);
    });
};

export default app => {
    routes.forEach(group => {
        group.endPoints.forEach(point => {
            group.group = (group.group === '/') ? '' : group.group;
            let endPoint        = group.group + point.path;
            let method          = point.verb;
            let callbackMethod  = point.callback;
            let func = require('../app/controllers/' + point.controller).default;

            // throw an exception if the callback function is illegal
            if (typeof(func[callbackMethod]) !== 'function') {
                let message = '[route] callback function \'' + callbackMethod + '\' (' + typeof(func[callbackMethod]) + ') is not available at ' + endPoint;

                log.throwException(message);
            }

            if (!(func.middlewares instanceof Array)) {
                log.put('[middleware] warning: ' + callbackMethod + '.middlewares is not available', false);
            }

            let callbackFunction = (req, res, next) => {
                let response = global.app.presponse;

                validationProcess(req, res, func, (validationPass, middlewares) => {
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
