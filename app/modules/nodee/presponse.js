import cb from './pcallback';
import _ from 'lodash';
let _res;
let _next;
let _sent;

export default {
    to(res, next) {
        _res = res;
        _next = cb(next);
        _sent = false;

        return this;
    },

    success(data, message, statusCode, detailCode, additionalData) {
        this.send(1, data, message, statusCode || 200, detailCode, additionalData);
    },

    fail(message, statusCode, detailCode, data, additionalData) {
        this.send(0, data, message, statusCode || 500, detailCode, additionalData);
    },

    send(success, data, message, statusCode, detailCode, additionalData) {
        data = data || {};
        message = message || '';
        statusCode = statusCode || 500;
        additionalData = additionalData || {};

        let json = {
            status:     parseInt(success),
            code:       parseInt(statusCode),
        };

        if (detailCode !== null && detailCode !== undefined) {
            json.detailCode = detailCode;
        }

        if (message.length > 0) {
            json.message = message;
        }

        if (additionalData.length > 0 || Object.keys(additionalData).length > 0) {
            json.additionalData = additionalData;
        }

        if (!_.isEmpty(data)) {
            json.data = data;
        }

        if (_sent === false) {
            _res.status(parseInt(statusCode)).json(json);
            _res.end();

            _sent = true;
        }

        _next();
    },

    render(view, locals, ...otherArgs) {
        if (_sent === false) {
            _res.render(view, locals, ...otherArgs);

            _sent = true;
        } else {
            _next();
        }
    },

    set(key, value) {
        return _res.set(key, value);
    }
};
