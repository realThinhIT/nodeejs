// ######################################################
// CORE: ROUTES CONFIGURES
// ######################################################

import {RouteConfig, RenderEngineConfig} from '../config';
import _async from 'async';
import {PLog, PCallback, PResponse} from '../modules/nodee';

let validationProcess = (req, res, func, callback) => {
    let middlewares = {};
    let validationPass = true;

    // set and execute the middlewares
    _async.each(func.middlewares, (mid, callback) => {
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

            PLog.putException('[middleware] error: ' + midName + ' doesn\'t exist', e);

            return (new PResponse(res)).fail('middleware named ' + midName + ' is not available');
        }

        middleware.beforeAction(req, (new PResponse(res)),
            (isValidated, data, code, detailCode) => {
                if (!isValidated || isValidated === null || isValidated === undefined) {
                    validationPass = false;

                    // PLog.put('[middleware] failed to execute middleware ' + mid + ' at ' + endPoint + ': ' + data , false);
                    return new PResponse(res).fail('the app failed in executing middleware ' + midName + ( (typeof(data) === 'string') ? ': ' + data : '' ), code || 500, detailCode);
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
    RouteConfig.forEach(group => {
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

                PLog.putException(message);
            }

            if (!(func.middlewares instanceof Array)) {
                PLog.put('[middleware] warning: ' + callbackMethod + '.middlewares is not available', false);
            }

            let callbackFunction = (req, res, next) => {
                // set default headers
                let renderMethodConfig = RenderEngineConfig[renderMethod];
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
                                    if (validationPass === true) func[callbackMethod](req, [res, (new PResponse(res, next))], middlewares);
                                } catch (e) {
                                    PLog.putException('[route] route refuse to finish, threw an exception', e);
                                }
                            });
                        });
                    }
                } else {
                    renderMethod = 'unf';
                    PLog.put('[route] endpoint/ group type ' + renderMethod + ' is invalid', false);
                    next();
                }
            };

            PLog.put('[route] ' + renderMethod + ' endpoint: ' + method.toUpperCase() + ' ' + endPoint);

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