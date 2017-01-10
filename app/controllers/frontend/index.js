// ######################################################
// CONTROLLER: index
// ######################################################

let controller      = {};

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'index';
controller.middlewares = [];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.homepage = (req, res, pres, middleware) => {
    return pres.render('index', {
        layout: false,
        appName: Nodee.config.global.APP_NAME
    });
};

// ################################

export default controller;
