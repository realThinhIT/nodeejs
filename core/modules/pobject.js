module.exports = {
    deleteKeys: function (obj, deletes) {
        deletes = deletes || [];

        deletes.forEach(function (value) {
            let level = obj;

            let parts = value.split('.');

            for (let i = 0; i < parts.length - 1; i++) {
                level = level[parts[i]];
            }

            level[parts[parts.length - 1]] = undefined;
        });
    }
};
