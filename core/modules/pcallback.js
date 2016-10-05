module.exports = function (callback) {
    callback = (typeof(callback) !== 'function') ? function(a, b, c, d, e, f, g) {} : callback;

    return callback;
};
