// ######################################################
// CORE: DATABASE DRIVER: MONGOOSE
// ######################################################

import { PLog, PCallback } from '../modules/nodee';
import { DbDriver } from '../';
import mongoDb from 'mongoose';
import bluebird from 'bluebird';
mongoDb.Promise = bluebird;

export default class Mongoose extends DbDriver {
    connectionString() {
        let loginInfo = (this.config.user !== '') ? this.config.user : '';
        loginInfo += (this.config.pass !== '') ? ':' + this.config.user : '';
        loginInfo += (loginInfo !== '') ? '@' : '';

        const mongoUrl = 'mongodb://' + loginInfo + this.config.host + ':' + this.config.port + '/' + this.config.dbName;

        return mongoUrl;
    }

    async connect() {
        let connection;
        try {
            connection = await mongoDb.connect(this.connectionString(), { useMongoClient: true });
        } catch (e) {
            throw e;
        }

        this.connection = connection;
        return connection;
    }

    async getConnection() {
        try {
            if (!this.connection) {
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
