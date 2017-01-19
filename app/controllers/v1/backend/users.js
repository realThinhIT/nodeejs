// ######################################################
// CONTROLLER: users
// ######################################################

let controller      = {};
const User          = Nodee.model.User;
const mge           = Nodee.module.pmongooserr;
const obj           = Nodee.module.pobject;
import md5          from 'md5';

// ################################
// MODIFY THIS!
// ################################

controller.name     = 'users';
controller.middlewares = [
    'api-key', 'auth/require-admin-login', 'pagination'
];

// ################################
// CUSTOM FUNCTIONS
// ################################

controller.readAll = (req, res, pres, middleware) => {
    // insert controller logic here

    User.count(middleware.pagination.search(['username']), (err, count) => {
        User.find(middleware.pagination.search(['username']), null, middleware.pagination.select, (err, data) => {
            return pres.success(data, 'users retrieved successfully', null, null, {
                totalItems: count
            });
        });
    });
};

controller.readOne = (req, res, pres, middleware) => {
    User.find({ userId: req.params.id }, (err, data) => {
        if (err) {
            return pres.fail('this user does not exist');
        }

        return pres.success(data, 'user retrieved successfully');
    });
};

controller.update = (req, res, pres, middleware) => {
    let updateValues = obj.selectKeys(req.body, [
        "username",
        "password"
    ]);

    if (updateValues.password != null) {
        updateValues.password = md5(updateValues.password);
    }

    User.findOneAndUpdate({ userId: req.params.id }, {
        Nodeeset: updateValues
    }, { new: true }, (err, data) => {
        if (err || data.length === 0) {
            return pres.fail('cannot update this user');
        }

        return pres.success(data, 'user updated successfully');
    });
};

controller.create = (req, res, pres, middleware) => {
    User.count({ username: req.body.username }, (err, count) => {
        if (count > 0) {
            return pres.fail('username is duplicated!', Nodee.param.error.http.BAD_REQUEST, Nodee.param.detail.user.DUPLICATED_USERNAME);
        }
    });

    let user = new User(req.body);

    user.save((err, data) => {
        if (err) {
            return pres.fail('cannot create new user', Nodee.param.error.http.INTERNAL_SERVER_ERROR, null, mge(err));
        }

        return pres.success(data, 'user created successfully');
    });
};

controller.delete = (req, res, pres, middleware) => {
    User.remove({ userId: req.params.id }, function (err) {
        if (err) {
            return pres.fail('cannot delete this user', Nodee.param.error.http.INTERNAL_SERVER_ERROR);
        }

        return pres.success(null, 'user deleted successfully');
    });
};

// ################################

export default controller;