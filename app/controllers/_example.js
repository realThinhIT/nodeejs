// ######################################################
// CONTROLLER: register
// ######################################################

import Nodee from '../nodee';
const { PMongooserr, PObject } = Nodee.Utils;

// ################################
// MODIFY THIS!
// ################################

export default class ExampleController extends Nodee.Core.Controller {
    middlewares() {
        return [];
    }

    async index() {
        this.send.success(null, 'all functioning properly');
    }
}