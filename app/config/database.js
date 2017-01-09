// DATABASE CONFIGURATIONS
// this is configurations to work with MongoDB engine

export default {
    // connection settings
    host:   'localhost',
    port:   '27017',
    dbName: 'test',
    user:   '',
    pass:   '',

    // auto import databases
    // so that you can call it by Nodee.model[Model]?
    autoImportModels: true
};
