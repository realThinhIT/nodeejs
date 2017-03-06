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

controller.homepage = (req, res, middleware) => {
    return res.render('index', {
        layout: false,
        appName: Nodee.config.global.APP_NAME
    });
};

// ################################

export default controller;
