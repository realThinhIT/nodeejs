// ######################################################
// CORE: DATABASE CONNECTOR
// ######################################################

import { DatabaseConfig } from '../../config';
import { PLog } from '../modules/nodee';

let driver, database, connection;

export default async () => {
    return new Promise(async (resolve, reject) => {
        if (DatabaseConfig.enable === true) {
            try {
                driver = require('./' + DatabaseConfig.driver).default;
                database = new driver(DatabaseConfig);
            } catch (e) {
                PLog.putException('[db] selected driver \'' + DatabaseConfig.driver + '\' could not be loaded', e);
                reject(e);
            }

            try {
                PLog.put('[db] connecting to database using driver \'' + database.driverName() + '\'');
                connection = await database.connect();
                PLog.put('[db] successfully connected to the database');

                resolve(connection);
            } catch (e) {
                PLog.putException('[db] couldn\'t connect to the database, please check your configurations', e);
                reject(e);
            }
        } else {
            PLog.put('[db] the using of database is disabled');
        }
    });
};