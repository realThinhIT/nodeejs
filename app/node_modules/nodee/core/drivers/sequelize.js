// ######################################################
// CORE: DATABASE DRIVER: SEQUELIZE
// ######################################################

import { PLog, PCallback } from '../modules/nodee';
import { DbDriver } from '../';
import Sequelize from 'sequelize';
import bluebird from 'bluebird';

export default class SequelizeDriver extends DbDriver {
  get driver() {
    Sequelize.Promise = bluebird;
    return Sequelize;
  }

  async connect() {
    let connection;
    try {
      const sequelizeInstance = new (this.driver)({
        database: this.config('dbName'),
        username: this.config('user'),
        password: this.config('pass'),
        ...this.driverConfig()
      });
      this.setConnection(sequelizeInstance);
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
