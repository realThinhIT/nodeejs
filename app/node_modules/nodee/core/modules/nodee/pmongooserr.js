const obj = require('./pobject').default;

export default err => {
    let errorFields = [];
    let messages = {};

    if (err.errors != undefined) {
      let errs = Object.keys(err.errors);
      errs = errs.reverse();

      errs.forEach(key => {
        errorFields.push(key);
        messages[key] = err.errors[key].message;
      });

      return {
        fields: errorFields,
        messages
      };
    } else {
      return obj.selectKeys(err, ['code', 'errmsg']);
    }
  };
