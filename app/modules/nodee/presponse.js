import cb from './pcallback';
import _ from 'lodash';

export default class PResponse {
    constructor(res, next) {
        this._res = res;
        this._next = cb(next);
        this._sent = false;
    }

    success(data, message, statusCode, detailCode, additionalData) {
        this.send(1, data, message, statusCode || 200, detailCode, additionalData);
    }

    fail(message, statusCode, detailCode, data, additionalData) {
        this.send(0, data, message, statusCode || 500, detailCode, additionalData);
    }

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

        if (this._sent === false) {
            this._res.status(parseInt(statusCode)).json(json);
            this._res.end();

            this._sent = true;
        }

        this._next();
    }

    render(view, locals, ...otherArgs) {
        if (this._sent === false) {
            this._res.render(view, locals, ...otherArgs);

            this._sent = true;
        } else {
            this._next();
        }
    }

    set(key, value) {
        return this._res.set(key, value);
    }

    redirect(...args) {
        return this._res.redirect(...args);
    }
};
