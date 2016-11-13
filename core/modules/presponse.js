var cb = require('./pcallback.js');
var _res;
var _next;
var _sent;

module.exports = {
    to: function (res, next) {
        _res = res;
        _next = cb(next);
        _sent = false;

        return this;
    },

    success: function (data, message, statusCode, detailCode) {
        this.send(1, data, message, statusCode || 200, detailCode);
    },

    fail: function (message, statusCode, detailCode, data) {
        this.send(0, data, message, statusCode || 500, detailCode);
    },

    send: function (success, data, message, statusCode, detailCode) {
        data = data || {};
        message = message || '';
        statusCode = statusCode || 500;

        var json = {
            status:     parseInt(success),
            code:       parseInt(statusCode),
        };

        if (detailCode !== null && detailCode !== undefined) {
            json.detailCode = detailCode;
        }

        if (message.length > 0) {
            json.message = message;
        }

        if (data.length > 0 || Object.keys(data).length > 0) {
            json.data = data;
        }

        if (_sent === false) {
            _res.status(parseInt(statusCode)).json(json);
            _res.end();

            _sent = true;
            // global.app.log.put('[warning] response was sent. a response was cancelled.', false);
        }

        _next();
    },

    set: function (key, value) {
        return _res.set(key, value);
    }
};
