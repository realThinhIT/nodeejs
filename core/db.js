var globalConfig    = require('../config/global'),
    db              = require('../config/database'),
    mongoDb         = require('mongodb').MongoClient,
    log             = require('../modules/plog')(globalConfig.LOG_ENABLE, globalConfig.LOG_MODE);

var connection = {};
var _database;

// MongoDb
if (db.TYPE === 'mongodb') {
    var loginInfo = (db.CONNECTION.user !== '') ? db.CONNECTION.user : '';
    loginInfo += (db.CONNECTION.pass !== '') ? ':' + db.CONNECTION.user : '';
    loginInfo += (loginInfo !== '') ? '@' : '';

    var mongoUrl = 'mongodb://' + loginInfo + db.CONNECTION.host + ':' + db.CONNECTION.port + '/' + db.CONNECTION.dbName;

    connection.init = function (callback) {
        log.put('connecting to the database: ' + mongoUrl);

        mongoDb.connect(mongoUrl, function (err, db) {
            if (err) {
                log.throwException(err);
            }

            log.put('successfully connect to the database: ' + mongoUrl);

            _database = db;

            if (callback !== undefined) {
                callback(err, db);
            }
        });
    };

    connection.getConnection = function () {
        if (_database === null || _database === undefined) {
            log.put('reconnect to the database...');

            connection.init();
        }

        return _database;
    };

    connection.close = function () {
        return _database.close();
    };
}

module.exports = connection;