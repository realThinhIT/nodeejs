export default class BaseController {
    /**
     * Creates an instance of BaseController.
     * 
     * @param {any} req 
     * @param {any} [res, pres] 
     * @memberof BaseController
     */
    constructor(req, [res, pres], action) {
        this.req = req;
        this.res = res;
        this.send = pres;
        this.action = action;
    }

    /**
     * Set middlewares data after executing validation
     * 
     * @param {any} [middlewares={}] 
     * @memberof BaseController
     */
    setMiddlewareData(middlewares = {}) {
        this.middleware = middlewares;
    }

    /**
     * An array of middlewares to execute
     * 
     * @returns {array}
     * @memberof BaseController
     */
    middlewares(action = 'index') {
        return [];
    }

    /**
     * Returns the name of the controller
     * 
     * @returns 
     * @memberof BaseController
     */
    controllerName() {
        return this.constructor.name;
    }

    // controller actions
    /**
     * This function will be execute before route
     * 
     * @param {any} functionName 
     * @memberof BaseController
     */
    async beforeController(action = '') {

    }

    /**
     * This function will be execute after route
     * 
     * @param {any} functionName 
     * @memberof BaseController
     */
    async afterController(action = '') {

    }
}