// ######################################################
// CORE: DATABASE DRIVER: ExampleDriver
// ######################################################

import { PLog, PCallback } from '../modules/nodee';
import { DbDriver } from '../';
import ExampleDriver from 'ExampleDriver';
import bluebird from 'bluebird';

export default class ExampleDriver extends DbDriver {
  driver() {
    ExampleDriver.Promise = bluebird;
    return ExampleDriver;
  }

  async connect() {
    let connection;
    try {
      connection = await this.getDriver().connect({});
    } catch (e) {
      throw e;
    }

    this.connection = connection;
    return connection;
  }

  async getConnection() {
    try {
      if (!this.getConnection()) {
        await this.connect();
      }
    } catch (e) {
      throw e;
    }
  
    return this.connect();
  }

  async close() {
    try {
      await this.connection.close();
    } catch (e) {
      throw e;
    }
  }
}
