// ######################################################
// CONTROLLER: register
// ######################################################

import Nodee from '../nodee';
const { PMongooserr, PObject } = Nodee.Utils;

export default class ExampleController extends Nodee.Core.Controller {
  middlewares() {
    return [];
  }

  async index() {
    return this.send.success(null, 'all functioning properly');
  }
}