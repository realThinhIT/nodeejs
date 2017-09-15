// ######################################################
// CORE: DATABASE CONNECTOR
// ######################################################

import { DatabaseConfig } from '../config';
import mongoDb from 'mongoose';
import { PLog, PCallback } from './modules/nodee';
import bluebird from 'bluebird';
mongoDb.Promise = bluebird;

let connection = {};
connection._database = null;

// MongoDb
let loginInfo = (DatabaseConfig.user !== '') ? DatabaseConfig.user : '';
loginInfo += (DatabaseConfig.pass !== '') ? ':' + DatabaseConfig.user : '';
loginInfo += (loginInfo !== '') ? '@' : '';

const mongoUrl = 'mongodb://' + loginInfo + DatabaseConfig.host + ':' + DatabaseConfig.port + '/' + DatabaseConfig.dbName;

connection.init = callback => {
    PLog.put('[db] connecting to the database: ' + mongoUrl);

    if (DatabaseConfig.enable == true) {
        mongoDb.connect(mongoUrl, (err, db) => {
            if (err) {
                PLog.throwException(err);
            }

            PLog.put('[db] successfully connected to the database: ' + mongoUrl);

            connection._database = db;

            PCallback(callback)(err, db);
        });
    } else {
        PLog.put('[db] database is not enabled');
        connection._database = null;

        PCallback(callback)(null, null);
    }
};

connection.getConnection = () => {
    if (connection._database === null || connection._database === undefined) {
        PLog.put('[db] reconnect to the database...');

        connection.init();
    }

    return connection._database;
};

connection.close = () => {
    PLog.put('[db] closing current database...');
    return connection._database.close();
};

export default connection;
