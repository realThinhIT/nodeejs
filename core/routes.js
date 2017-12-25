// ######################################################
// CORE: ROUTES CONFIGURES
// ######################################################

import { RouteConfig, RenderEngineConfig } from '../config';
import _async from 'async';
import { PLog, PCallback, PResponse } from './modules/nodee';

let validationProcess = (req, res, _middlewares, callback) => {
  let middlewares = {};
  let validationPass = true;

  // set and execute the middlewares
  _async.each(_middlewares, async (mid, callback) => {
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

    await middleware(req, (new PResponse(res)),
      (isValidated, data, code, detailCode) => {
        if (!isValidated || isValidated === null || isValidated === undefined) {
          validationPass = false;

          // PLog.put('[middleware] failed to execute middleware ' + mid + ' at ' + endPoint + ': ' + data , false);
          return new PResponse(res).fail(
            'the app failed in executing middleware ' + midName + ( (typeof(data) === 'string') ? ': ' + data : '' ), 
            code || 500, 
            detailCode
          );
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

      // process controller data 
      let controllerPoint = point.controller.split('@');
      point.controller = controllerPoint[0];
      callbackMethod = controllerPoint[1] ? controllerPoint[1] : 'index';

      let controllerClass;
      
      try {
        controllerClass = require(__DIR_APP + 'controllers/' + point.controller).default;
      } catch (e) {
        controllerClass = undefined;
        
        return PLog.putException('[route] an error occurred while creating a new controller \'' + point.controller + '\' instance at ' + endPoint, e);
      }

      // throw an exception if the callback function is illegal
      if (typeof(controllerClass) !== 'function') {
        let message = '[route] controller \'' + point.controller + '\' (' + typeof(controllerClass) + ') is not available at ' + endPoint;

        return PLog.putException(message);
      }

      let callbackFunction = (req, res, next) => {
        // create new instance of controller
        const _controller = new controllerClass(req, [res, next], callbackMethod);

        if (typeof(_controller[callbackMethod]) !== 'function') {
          let message = '[route] callback function \'' + callbackMethod + '\' (' + typeof(_controller[callbackMethod]) + ') is not available at ' + endPoint;
  
          return PLog.putException(message);
        }

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

            validationProcess(req, res, _controller.middlewares(callbackMethod), 
              (validationPass, middlewares) => {
                renderMethodConfig.SETUP_FUNCTION(app, async () => {
                  try {
                    if (validationPass === true) {
                      await _controller.setMiddlewareData(middlewares);
                      await _controller.beforeController(callbackMethod);
                      await _controller[callbackMethod]();
                      await _controller.afterController(callbackMethod);
                    }
                  } catch (e) {
                    return PLog.putException('[route] route refuse to finish, threw an exception', e);
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
      } else {
        PLog.putException('[route] invalid http verb \'' + method.toUpperCase() + '\' at ' + endPoint);
      }
    });
  });
};
