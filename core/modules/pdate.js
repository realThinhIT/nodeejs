export default {
    unixTime() {
        return Math.round((new Date()).getTime() / 1000);
    },

    addDays(date, days) {
        if (!date || !(date instanceof Date)) {
            date = new Date();
        }

        return (new Date(date.getTime() + (parseInt(days) * 24 * 60 * 60 * 1000)));
    },

    addMonths(date, month) {
        if (!date || !(date instanceof Date)) {
            date = new Date();
        }

        return (new Date(new Date(date).setMonth(date.getMonth() + parseInt(month))));
    }
};
