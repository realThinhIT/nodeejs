// ######################################################
// CORE: DATABASE CONNECTOR
// ######################################################

var db              = require('../config/database'),
    mongoDb         = require('mongoose'),
    log             = global.app.log;

    mongoDb.Promise = require('bluebird');

var connection = {};
connection._database = null;

// MongoDb
var loginInfo = (db.user !== '') ? db.user : '';
loginInfo += (db.pass !== '') ? ':' + db.user : '';
loginInfo += (loginInfo !== '') ? '@' : '';

var mongoUrl = 'mongodb://' + loginInfo + db.host + ':' + db.port + '/' + db.dbName;

connection.init = function (callback) {
    log.put('[db] connecting to the database: ' + mongoUrl);

    mongoDb.connect(mongoUrl, function (err, db) {
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

connection.getConnection = function () {
    if (connection._database === null || connection._database === undefined) {
        log.put('[db] reconnect to the database...');

        connection.init();
    }

    return connection._database;
};

connection.close = function () {
    log.put('[db] closing current database...');
    return _database.close();
};

module.exports = connection;
