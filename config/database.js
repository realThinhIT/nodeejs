// DATABASE CONFIGURATIONS
// this is configurations to work with MongoDB engine

export default {
    enable: true, // enable database using in this project
    driver: 'mongoose',

    // connection settings
    common: {
        host: 'localhost',
        port: '27017',
        dbName: 'test',
        user: '',
        pass: ''
    },

    // per-driver configurations
    drivers: {
        mongoose: {},
        mysql: {
            connectionMode: 'pool',     // 'connection' or 'pool'
            connectionLimit: 10,        // for pooling only 
        }
    }
};
