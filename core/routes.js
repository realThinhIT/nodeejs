// ######################################################
// CORE: ROUTES CONFIGURES
// ######################################################
/*eslint no-unused-vars: ["error", { "args": "none" }]*/

import Nodee from '../app/Nodee';
import routes from '../app/config/routes';
import async from 'async';
const log = Nodee.module.plog;

let validationProcess = (req, res, func, callback) => {
    let response = Nodee.module.presponse;
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
            middleware = require(__DIR_APP + 'middlewares/' + mid).default;
        } catch (e) {
            validationPass = false;

            log.putException('[middleware] error: ' + midName + ' doesn\'t exist', e);

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
            let groupType       = group.type;
            let method          = point.verb;
            let callbackMethod  = point.callback;
            let pointType       = point.type;
            let renderMethod    = (pointType) ? pointType : groupType;
            let func            = require(__DIR_APP + 'controllers/' + point.controller).default;

            // throw an exception if the callback function is illegal
            if (typeof(func[callbackMethod]) !== 'function') {
                let message = '[route] callback function \'' + callbackMethod + '\' (' + typeof(func[callbackMethod]) + ') is not available at ' + endPoint;

                log.putException(message);
            }

            if (!(func.middlewares instanceof Array)) {
                log.put('[middleware] warning: ' + callbackMethod + '.middlewares is not available', false);
            }

            let callbackFunction = (req, res, next) => {
                let response = Nodee.module.presponse;

                // set default headers
                let renderMethodConfig = Nodee.config.renderMethod[renderMethod];
                if (renderMethodConfig) {
                    if (renderMethodConfig.DEFAULT_TYPE !== null) {
                        res.type(renderMethodConfig.DEFAULT_TYPE);
                    }
                    
                    if (renderMethodConfig.DEFAULT_HEADERS !== null) {
                        for (const key of Object.keys(renderMethodConfig.DEFAULT_HEADERS)) {
                            res.set(key, renderMethodConfig.DEFAULT_HEADERS[key]);
                        }

                        validationProcess(req, res, func, (validationPass, middlewares) => {
                            renderMethodConfig.SETUP_FUNCTION(app, () => {
                                try {
                                    if (validationPass === true) func[callbackMethod](req, [res, response.to(res, next)], middlewares);
                                } catch (e) {
                                    log.putException('[route] route refuse to finish, threw an exception', e);
                                }
                            });
                        });
                    }
                } else {
                    renderMethod = 'unf';
                    log.put('[route] endpoint/ group type ' + renderMethod + ' is invalid', false);
                    next();
                }
            };

            log.put('[route] ' + renderMethod + ' endpoint: ' + method.toUpperCase() + ' ' + endPoint);

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
