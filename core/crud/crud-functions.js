// ######################################################
// CORE: CRUD MODULES FOR MODELS
// ######################################################

var cb          = global.app.cb;
var self;

var crud = function (m, c, d) {
    self = this;

    self.model = m;
    self.db    = d;
    self.core  = new c(m, d);

    return self;
};

crud.prototype.populate = function (data, callback) {
    self.model.data = data || {};

    return self.core.populate(function (newData) {
        self.model.data = newData;

        cb(callback)(self.model.data);
    });
};

crud.prototype.create = function (callback) {
    return self.model.transform(function () {
        return self.core.insert(callback);
    });
};

crud.prototype.read = function (conditions, callback, limit, offset) {
    return self.core.find(conditions, function (err, data) {
        self.model.data = data;
        cb(callback)(err, self.model.data);
    }, {offset: offset || 0, limit: limit || 1});
};

crud.prototype.update = function (callback, update, conditions, multiple) {
    return self.model.transform(function () {
        return self.core.update(conditions || null, update || null, callback, multiple || false);
    });
};

crud.prototype.delete = function (conditions, callback, multiple) {
    return self.core.delete(conditions || null, callback, multiple || false);
};

module.exports = crud;
