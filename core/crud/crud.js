var populate    = require('../modules/populate').populate,
    cb          = global.app.cb;

var d       = {};
d._model    = null;
d._data     = null;
d._db       = null;
d._query    = null;

var crud = {};

// set the model for the crud
crud.set = function (model, db) {
    d._model = model;
    d._db = db;
    d._query = null;

    return crud;
};

// load the array
crud.populate = function (callback) {
    callback = cb(callback);

    if (typeof(d._model.data) === 'object' && !(d._model.data instanceof Array)) {
        d._model.data = populate(d._model.data, d._model.defaultValues);
    } else if (d._model.data instanceof Array) {
        var pushes = [];

        d._model.data.forEach(function (value, key) {
            pushes.push(populate(value, d._model.defaultValues));
        });

        d._model.data = pushes;
    } else {

    }

    callback(d._model.data);
    return d._model;
};

// insert one or many
crud.insert = function (callback) {
    callback = cb(callback);

    try {
        if (typeof(d._model.data) === 'object' && !(d._model.data instanceof Array)) {
            if (d._model.validate(d._model.data)) {
                d._query = d._db.collection(d._model.collection).insertOne(d._model.data);
            }
        } else if (d._model.data instanceof Array) {
            var pushes = [];

            d._model.data.forEach(function (value, key) {
                if (d._model.validate(value)) {
                    pushes.push(value);
                }
            });

            d._query = d._db.collection(d._model.collection).insertMany(pushes);
        } else {

        }

        callback(undefined, d._query);
    } catch (err) {
        callback(err, d._query);
    }

    return d._model;
};

// read
crud.find = function (conditions, callback, limitation) {
    callback = cb(callback);
    conditions = conditions || {};
    limitation.offset = (limitation.offset === undefined) ? 0 : limitation.offset;
    limitation.limit  = (limitation.limit === undefined) ? 1 : limitation.limit;

    try {
        d._query = d._db.collection(d._model.collection).find(conditions).limit(limitation.limit).skip(limitation.offset);

        d._query.toArray(function (err, results) {
            callback(undefined, results, d._query);
        });
    } catch (err) {
        callback(err, [], d._query);
    }

    return d._model;
};

// update
crud.update = function (conditions, callback, multiple) {
    callback = cb(callback);

    try {
        if (typeof(conditions) === 'object') {
            if (multiple === false) {
                d._query = d._db.collection(d._model.collection).updateOne(conditions, {$set: d._model.data});
            } else {
                d._query = d._db.collection(d._model.collection).updateMany(conditions, {$set: d._model.data});
            }
        }

        callback(undefined, d._query);
    } catch (err) {
        callback(err, d._query);
    }

    return d._model;
};

// delete
crud.delete = function (conditions, callback, multiple) {
    callback = cb(callback);

    try {
        if (conditions !== undefined && conditions !== null) {
            conditions = conditions;
        } else {
            conditions = d._model.data;
        }

        if (typeof(conditions) === 'object' && !(conditions instanceof Array)) {
            if (multiple === false) {
                d._query = d._db.collection(d._model.collection).deleteOne(conditions);
            } else {
                d._query = d._db.collection(d._model.collection).deleteMany(conditions);
            }
        } else if (conditions instanceof Array) {
            conditions.forEach(function (condition) {
                if (multiple === false) {
                    d._query = d._db.collection(d._model.collection).deleteOne(condition);
                } else {
                    d._query = d._db.collection(d._model.collection).deleteMany(condition);
                }
            });
        }

        callback(undefined, d._query);
    } catch (err) {
        callback(err, d._query);
    }

    return d._model;
};

module.exports = crud;
