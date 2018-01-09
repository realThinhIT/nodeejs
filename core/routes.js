// ######################################################
// CORE: ROUTES CONFIGURES
// ######################################################

import { RouteConfig, RenderEngineConfig } from '../config';
import _async from 'async';
import { PLog, PCallback, PResponse } from './modules/nodee';
import Exception from './base/exception';

let validationProcess = async (req, res, _middlewares) => {
  let allMiddlewares = {};

  for (let middlewarePath of _middlewares) {
    const midName = middlewarePath.replace(/\//g, '.');

    // check if middleware defined availble
    let middleware;
    try {
      middleware = require(__DIR_APP + 'middlewares/' + middlewarePath).default;
    } catch (e) {
      throw new Exception(`middleware named ${midName} is not available`);
    }

    // execute middleware, push executed to previous
    try {
      const thisMiddleware = await middleware(req, new PResponse(res), allMiddlewares);
      allMiddlewares[midName] = thisMiddleware;
    } catch (e) {
      throw new Exception(`middleware ${midName} could not complete: ${e.message}`);
    }
  }

  return allMiddlewares;
}

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
        
        return PLog.putException(`[route] an error occurred while creating a new controller ${point.controller} instance at ${endPoint}`, e);
      } finally {
        // throw an exception if the callback function is illegal
        if (typeof(controllerClass) !== 'function') {
          return PLog.put(`[route] controller ${point.controller} (${typeof(controllerClass)}) is not available at ${endPoint}`, false);
        }
      }

      // this will be executed when a route is entered
      const callbackFunction = async (req, res, next) => {
        // create new instance of controller
        const _controller = new controllerClass(req, [res, next], callbackMethod);

        if (typeof(_controller[callbackMethod]) !== 'function') {
          return PLog.put(`[route] callback function ${callbackMethod} (${typeof(_controller[callbackMethod])}) is not available at ${endPoint}`, false);
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
          }

          // execute middlewares and route controller
          let middlewares;
          try {
            middlewares = await validationProcess(req, res, _controller.middlewares(callbackMethod));
          } catch (e) {
            let message = `[middleware] middleware at ${endPoint} could not finish: ${e.message}`;

            PLog.putException(message, e);
            return (new PResponse(res)).fail(message);
          }

          await renderMethodConfig.SETUP_FUNCTION(app);
          try {
            await _controller.setMiddlewareData(middlewares);
            await _controller.beforeController(callbackMethod);
            await _controller[callbackMethod]();
            await _controller.afterController(callbackMethod);
          } catch (e) {
            let message = `[route] route ${endPoint} refuse to finish, threw an exception: ${e.message}`;

            PLog.putException(message, e);
            return (new PResponse(res)).fail(message, e.code, e.detailCode);
          }
        } else {
          renderMethod = 'unf';
          PLog.put(`[route] endpoint/ group type ${renderMethod} is invalid`, false);
          next();
        }
      };

      PLog.put(`[route] ${renderMethod} endpoint: ${method.toUpperCase()} ${endPoint}`);

      // set up express routes
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
        PLog.putException(`[route] invalid http verb '${method.toUpperCase()}' at ${endPoint}`);
      }
    });
  });
};
