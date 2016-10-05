// ######################################################
// CORE: CRUD MODULES FOR MODELS
// ######################################################

var cb          = global.app.cb;

var crud = {};
crud.model = null;
crud.db    = null;
crud.core  = null;

crud.set = function (c, m, d) {
    crud.model = m;
    crud.db    = d;
    crud.core  = c;

    return crud;
};

crud.create = function (callback) {
    return crud.model.transform(function () {
        return crud.core.set(crud.model, crud.db).insert(callback);
    });
};

crud.read = function (conditions, callback, limit, offset) {
    return crud.core.set(crud.model, crud.db).find(conditions, function (err, data) {
        crud.model.data = data;
        cb(callback)(err, crud.model.data);
    }, {offset: offset || 0, limit: limit || 1});
};

crud.update = function (conditions, callback, multiple) {
    return crud.core.set(crud.model, crud.db).update(conditions || null, callback, multiple || false);
};

crud.delete = function (conditions, callback, multiple) {
    return crud.core.set(crud.model, crud.db).delete(conditions || null, callback, multiple || false);
};

module.exports = crud;
