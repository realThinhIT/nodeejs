// ######################################################
// CONTROLLER: register
// ######################################################

let controller      = {};
const mge           = Nodee.module.mongooserr;

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
