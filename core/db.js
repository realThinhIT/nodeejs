// ######################################################
// CORE: DATABASE CONNECTOR
// ######################################################

import $            from './$';
import db           from '../config/database';
import mongoDb      from 'mongoose';

const log           = $.module.plog;
import bluebird     from 'bluebird';
mongoDb.Promise     = bluebird;

let connection = {};
connection._database = null;

// MongoDb
let loginInfo = (db.user !== '') ? db.user : '';
loginInfo += (db.pass !== '') ? ':' + db.user : '';
loginInfo += (loginInfo !== '') ? '@' : '';

const mongoUrl = 'mongodb://' + loginInfo + db.host + ':' + db.port + '/' + db.dbName;

connection.init = callback => {
    log.put('[db] connecting to the database: ' + mongoUrl);

    mongoDb.connect(mongoUrl, (err, db) => {
        if (err) {
            log.throwException(err);
        }

        log.put('[db] successfully connect to the database: ' + mongoUrl);

        connection._database = db;

        if (typeof(callback) === 'function') {
            callback(err, db);
        }
    });
};

connection.getConnection = () => {
    if (connection._database === null || connection._database === undefined) {
        log.put('[db] reconnect to the database...');

        connection.init();
    }

    return connection._database;
};

connection.close = () => {
    log.put('[db] closing current database...');
    return _database.close();
};

export default connection;
