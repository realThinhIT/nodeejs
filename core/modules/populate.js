module.exports = module = {
    populate: function (array, defaultValues) {
        // populate
        for (var prop in defaultValues) {
            if (typeof(array[prop]) === 'object') {
                array[prop] = module.populate(array[prop], defaultValues[prop]);
                continue;
            }

            if (prop in array) continue;

            array[prop] = defaultValues[prop];
        }

        array = module.deleteUnused(array, defaultValues);

        return array;
    },

    deleteUnused: function (array, defaultValues) {
        // delete unused keys
        for (var prop in array) {
            if (typeof(array[prop]) === 'object') {
                array[prop] = module.deleteUnused(array[prop], defaultValues[prop]);
                continue;
            }

            if (!(prop in defaultValues)) {
                delete array[prop];
                continue;
            }
        }

        return array;
    }
};
