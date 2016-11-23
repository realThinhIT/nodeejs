export default err => {
        let errorFields = [];
        let messages = {};

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
    };
