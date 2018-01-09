// ######################################################
// CORE: DATABASE DRIVER: MYSQL
// ######################################################

import { PLog, PCallback } from '../modules/nodee';
import { DbDriver } from '../';
import mysql from 'mysql';
import bluebird from 'bluebird';

export default class MySQL extends DbDriver {
  get driver() {
    mysql.Promise = bluebird;
    return mysql;
  }

  async connect() {
    try {
      let connection;
      if (this.getDriverConfig('connectionMode') === 'connection') {
        connection = await this.driver.createConnection({
          host: this.config('host'),
          user: this.config('user'),
          password: this.config('pass'),
          database: this.config('dbName')
        });
        connection.connect();
      } else if (this.getDriverConfig('connectionMode') === 'pool') {
        connection = await this.driver.createPool({
          connectionLimit: this.getDriverConfig('connectionLimit'),
          host: this.config('host'),
          user: this.config('user'),
          password: this.config('pass'),
          database: this.config('dbName')
        });
        connection = await connection.getConnection();
      } else {
        throw new Error(`Connection Mode specified is invalid! Only accepts 'pool' or 'connection'.`);
      }

      this._connection = connection;
    } catch (e) {
      throw e;
    }

    return this._connection;
  }

  async close() {
    try {
      await this._connection.end();
    } catch (e) {
      throw e;
    }
  }
}
