// ######################################################
// CONTROLLER: index
// ######################################################

import Nodee from 'nodee';
const { GlobalConfig } = Nodee.Config;

export default class IndexController extends Nodee.Core.Controller {
  async homepage() {
    return this.send.render('index', {
      layout: false,
      appName: GlobalConfig.APP_NAME
    });
  }
}