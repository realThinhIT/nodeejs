var populate    = require('../modules/populate').populate;

var d       = {};
d._model    = null;
d._data     = null;
d._db       = null;

var crud = {};

crud.set = function (model, db) {
    d._model = model;
    d._db = db;

    return crud;
};

crud.populate = function (callback) {
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

    if (typeof(callback) === 'function') callback(d._model.data);
    return d._model.data;
};

crud.insert = function (callback) {
    try {
        if (typeof(d._model.data) === 'object') {
            if (d._model.validate(d._model.data)) {
                d._db.collection(d._model.collection).insertOne(d._model.data);
            }
        } else if (d._model.data.isArray()) {
            var pushes = [];

            d._model.data.forEach(function (value, key) {
                if (_model.validate(value)) {
                    pushes.push(value);
                }
            });

            d._db.collection(d._model.collection).insertMany(pushes);
        } else {

        }

        if (typeof(callback) === 'function') callback(undefined);
    } catch (err) {
        if (typeof(callback) === 'function') callback(err);
    }
};

module.exports = crud;
