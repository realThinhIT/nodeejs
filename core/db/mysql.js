// ######################################################
// CORE: DATABASE DRIVER: MYSQL
// ######################################################

import { PLog, PCallback } from '../modules/nodee';
import { DbDriver } from '../';
import mysql from 'mysql';
import bluebird from 'bluebird';

export default class MySQL extends DbDriver {
    driver() {
        mysql.Promise = bluebird;
        return mysql;
    }

    async connect() {
        let connection;
        try {
          if (this.getDriverConfig('connectionMode') === 'connection') {
            connection = await this.getDriver().createConnection({
              host: this.getConfig('host'),
              user: this.getConfig('user'),
              password: this.getConfig('pass'),
              database: this.getConfig('dbName')
            });
            connection.connect();
          } else if (this.getDriverConfig('connectionMode') === 'pool') {
            connection = await this.getDriver().createPool({
              connectionLimit: this.getDriverConfig('connectionLimit'),
              host: this.getConfig('host'),
              user: this.getConfig('user'),
              password: this.getConfig('pass'),
              database: this.getConfig('dbName')
            });
            connection = await connection.getConnection();
          }
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
            await this.connection.end();
        } catch (e) {
            throw e;
        }
    }
}
