// ######################################################
// CORE: DATABASE DRIVER: MONGOOSE
// ######################################################

import { PLog, PCallback } from '../modules/nodee';
import { DbDriver } from '../';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

export default class Mongoose extends DbDriver {
  get driver() {
    mongoose.Promise = bluebird;
    return mongoose;
  }

  async connect() {
    let loginInfo = (this.config('user') !== '') ? this.config('user') : '';
    loginInfo += (this.config('pass') !== '') ? ':' + this.config('user') : '';
    loginInfo += (loginInfo !== '') ? '@' : '';
    const mongoUrl = `mongodb://${loginInfo}${this.config('host')}${this.config('port')}/${this.config('dbName')}`;

    try {
      this._connection = await this.driver.connect(mongoUrl, { useMongoClient: true });
    } catch (e) {
      throw e;
    }

    return this._connection;
  }

  async close() {
    try {
      await this._connection.close();
    } catch (e) {
      throw e;
    }
  }
}
