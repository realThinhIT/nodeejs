var populate    = require('../modules/populate').populate,
    cb          = require('../modules/pcallback');

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

    if (typeof(d._model.data) === 'object') {
        d._model.data = populate(d._model.data, d._model.defaultValues);
    } else if (d._model.data.isArray()) {
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
        if (typeof(d._model.data) === 'object') {
            if (d._model.validate(d._model.data)) {
                d._query = d._db.collection(d._model.collection).insertOne(d._model.data);
            }
        } else if (d._model.data.isArray()) {
            var pushes = [];

            d._model.data.forEach(function (value, key) {
                if (d._model.validate(value)) {
                    pushes.push(value);
                }
            });

            d._query = d._db.collection(d._model.collection).insertMany(pushes);
        } else {

        }

        callback(d._query, undefined);
    } catch (err) {
        callback(d._query, err);
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

        callback(d._query, undefined);
    } catch (err) {
        callback(d._query, err);
    }

    return d._model;
};

// delete
crud.delete = function (conditions, callback, multiple) {
    callback = cb(callback);

    try {
        if (typeof(conditions) === 'object') {
            if (multiple === false) {
                d._query = d._db.collection(d._model.collection).deleteOne(conditions);
            } else {
                d._query = d._db.collection(d._model.collection).deleteMany(conditions);
            }
        }

        callback(d._query, undefined);
    } catch (err) {
        callback(d._query, err);
    }

    return d._model;
};

module.exports = crud;
