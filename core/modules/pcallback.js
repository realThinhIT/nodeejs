export default callback => {
    callback = (typeof(callback) !== 'function') ? (a, b, c, d, e, f, g) => {} : callback;

    return callback;
};
