export default callback => {
  callback = (typeof(callback) !== 'function') ? (...args) => {} : callback;

  return callback;
};
