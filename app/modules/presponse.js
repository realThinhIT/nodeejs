var _res;

module.exports = {
    to: function (res) {
        _res = res;
    },

    success: function (data, message, statusCode) {
        this.send(1, data, message, statusCode || 200);
    },

    fail: function (message, statusCode, data) {
        this.send(0, data, message, statusCode || 500);
    },

    send: function (success, data, message, statusCode) {
        data = data || {};
        message = message || '';
        statusCode = statusCode || 500;

        var json = {
            status:     parseInt(success),
            code:       parseInt(statusCode),
        };

        if (data.length > 0) {
            json.data = data;
        }

        if (message.length > 0) {
            json.message = message;
        }

        _res.status(parseInt(statusCode)).json(json);
    }
};
