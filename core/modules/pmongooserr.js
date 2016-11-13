module.exports = function (err) {
        var errorFields = [];
        var messages = {};

        var errs = Object.keys(err.errors);
        errs = errs.reverse();

        errs.forEach(function (key) {
            errorFields.push(key);
            messages[key] = err.errors[key].message;
        });

        return {
            fields: errorFields,
            messages: messages
        };
    };
