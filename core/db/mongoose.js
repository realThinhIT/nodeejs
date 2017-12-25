// ######################################################
// CORE: DATABASE DRIVER: MONGOOSE
// ######################################################

import { PLog, PCallback } from '../modules/nodee';
import { DbDriver } from '../';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

export default class Mongoose extends DbDriver {
  driver() {
    mongoose.Promise = bluebird;
    return mongoose;
  }

  async connect() {
    let loginInfo = (this.getConfig('user') !== '') ? this.getConfig('user') : '';
    loginInfo += (this.getConfig('pass') !== '') ? ':' + this.getConfig('user') : '';
    loginInfo += (loginInfo !== '') ? '@' : '';
    const mongoUrl =
      'mongodb://' 
      + loginInfo 
      + this.getConfig('host') 
      + ':' 
      + this.getConfig('port') 
      + '/' 
      + this.getConfig('dbName');

    let connection;
    try {
      connection = await this.getDriver().connect(mongoUrl, { useMongoClient: true });
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
