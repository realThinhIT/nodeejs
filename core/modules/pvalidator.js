module.exports = {
    email: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    length: function (string, min, max) {
        var check = false;

        if (min) {
            if (string.length >= min) {
                check = true;
            } else {
                return false;
            }
        }

        if (max) {
            if (string.length <= max) {
                check = true;
            } else {
                return false;
            }

            return check;
        }
    }
};
