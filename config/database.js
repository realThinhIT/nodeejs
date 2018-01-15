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
    },
    sequelize: {
      dialect: 'mysql',
      operatorsAliases: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      // storage: 'path/to/db.sqlite'
    },
  }
};
