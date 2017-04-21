// ######################################################
// CONTROLLER: index
// ######################################################

let controller      = {};
import {GlobalConfig} from '../../config';

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'index';
controller.middlewares = [];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.homepage = (req, [res, pres], middleware) => {
    return pres.render('index', {
        layout: false,
        appName: GlobalConfig.APP_NAME
    });
};

// ################################

export default controller;
