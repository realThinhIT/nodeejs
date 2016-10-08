var populate    = require('../modules/populate').populate,
    cb          = global.app.cb;
var self;

// set the model for the crud
var crud = function (model, db) {
    self = this;

    self._model = model;
    self._db = db;
    self._query = null;

    return self;
};

// load the array
crud.prototype.populate = function (callback) {
    callback = cb(callback);

    if (typeof(self._model.data) === 'object' && !(self._model.data instanceof Array)) {
        self._model.data = populate(self._model.data, self._model.defaultValues);
    } else if (self._model.data instanceof Array) {
        var pushes = [];

        self._model.data.forEach(function (value, key) {
            pushes.push(populate(value, self._model.defaultValues));
        });

        self._model.data = pushes;
    } else {

    }

    callback(self._model.data);
    return self._model;
};

// insert one or many
crud.prototype.insert = function (callback) {
    callback = cb(callback);
    var rows = [];

    try {
        if (typeof(self._model.data) === 'object' && !(self._model.data instanceof Array)) {
            if (self._model.validate(self._model.data)) {
                self._query = self._db.collection(self._model.collection).insertOne(self._model.data);

                rows = self._model.data;
            }
        } else if (self._model.data instanceof Array) {
            var pushes = [];

            self._model.data.forEach(function (value, key) {
                if (self._model.validate(value)) {
                    pushes.push(value);
                }
            });

            self._query = self._db.collection(self._model.collection).insertMany(pushes);

            rows = pushes;
        } else {

        }

        callback(undefined, rows, self._query);
    } catch (err) {
        callback(err, rows, self._query);
    }

    return self._model;
};

// read
crud.prototype.find = function (conditions, callback, limitation) {
    callback = cb(callback);
    conditions = conditions || {};
    limitation.offset = (limitation.offset === undefined) ? 0 : limitation.offset;
    limitation.limit  = (limitation.limit === undefined) ? 1 : limitation.limit;

    try {
        self._query = self._db.collection(self._model.collection).find(conditions).limit(limitation.limit).skip(limitation.offset);

        self._query.toArray(function (err, results) {
            callback(undefined, results, self._query);
        });
    } catch (err) {
        callback(err, [], self._query);
    }

    return self._model;
};

// update
crud.prototype.update = function (conditions, update, callback, multiple) {
    callback = cb(callback);

    if (!conditions || conditions === null || conditions === undefined) {
        conditions = self._model.data;
    }

    try {
        if (typeof(conditions) === 'object') {
            if (multiple === false) {
                self._query = self._db.collection(self._model.collection).updateOne(conditions, {$set: update});
            } else {
                self._query = self._db.collection(self._model.collection).updateMany(conditions, {$set: update});
            }
        }

        callback(undefined, self._query);
    } catch (err) {
        callback(err, self._query);
    }

    return self._model;
};

// delete
crud.prototype.delete = function (conditions, callback, multiple) {
    callback = cb(callback);

    try {
        if (conditions !== undefined && conditions !== null) {
            conditions = conditions;
        } else {
            conditions = self._model.data;
        }

        if (typeof(conditions) === 'object' && !(conditions instanceof Array)) {
            if (multiple === false) {
                self._query = self._db.collection(self._model.collection).deleteOne(conditions);
            } else {
                self._query = self._db.collection(self._model.collection).deleteMany(conditions);
            }
        } else if (conditions instanceof Array) {
            conditions.forEach(function (condition) {
                if (multiple === false) {
                    self._query = self._db.collection(self._model.collection).deleteOne(condition);
                } else {
                    self._query = self._db.collection(self._model.collection).deleteMany(condition);
                }
            });
        }

        callback(undefined, self._query);
    } catch (err) {
        callback(err, self._query);
    }

    return self._model;
};

module.exports = crud;
