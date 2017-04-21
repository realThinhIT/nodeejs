// ######################################################
// CONTROLLER: register
// ######################################################

let controller = {};
import {PMongooserr} from '../../../modules/nodee';

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'register';
controller.middlewares = [
    'api-key'
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.index = (req, [res, pres], middleware) => {
    // insert controller logic here

    pres.success(null, 'all functioning properly');
};

// ################################

export default controller;
