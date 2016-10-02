module.exports = {
    populate: function (array, defaultValues) {
        for (var prop in defaultValues) {
            if (prop in array) continue;

            array[prop] = defaultValues[prop];
        }

        return array;
    }
};
