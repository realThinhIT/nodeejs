export default {
    email(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    length(string = '', min = 3, max = 16) {
        let check = false;

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
