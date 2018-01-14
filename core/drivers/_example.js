// ######################################################
// CORE: DATABASE DRIVER: ExampleDriver
// ######################################################

import { PLog, PCallback } from '../modules/nodee';
import { DbDriver } from '../';
import ExampleDriver from 'ExampleDriver';
import bluebird from 'bluebird';

export default class ExampleDriver extends DbDriver {
  get driver() {
    ExampleDriver.Promise = bluebird;
    return ExampleDriver;
  }

  async connect() {
    let connection;
    try {
      await this.setConnection(await this.driver.connect({}));
    } catch (e) {
      throw e;
    }

    return this.getConnection();
  }

  async close() {
    try {
      await this.getConnection().close();
    } catch (e) {
      throw e;
    }
  }
}
