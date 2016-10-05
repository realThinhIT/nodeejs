module.exports = function(enable, mode) {
    var logMode;

    enable  = (enable === undefined || enable === null) ? true : enable;
    mode    = (mode === undefined || mode === null) ? 'console' : mode;

    // user specified
    if (mode === 'file') {
        logMode = 1;
    } else if (mode === 'console') {
        logMode = 0;
    }

    // common functions
    var getTime = function() {
        var d = new Date();
        var dateLog = d.getDate() + '/' + d.getMonth() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

        return dateLog;
    };

    // if the module is not enable
    if (enable !== true && enable !== 1) {
        logMode = 2;
        // console.log('[' + getTime() + '] info: Logging is not enabled for this application.');
    }  else {
        // console.log('[' + getTime() + '] info: Logging is enabled. Tracing mode: ' + mode + '.');
    }

    // put the log to the console
    if (logMode === 0) {
        return {
            put: function (log, type) {
                if (
                    (type !== true && type !== false && type !== 1 && type !== 0) ||
                    (type === null || type === undefined)
                    ) {
                        type = 1;
                }

                // 1 or true: success -> info
                // 0 or false: failed -> error
                if (type === true || type === 1) {
                    type = 'info';
                } else {
                    type = 'error';
                }

                console.log('[' + getTime() + '] ' + type + ': ' + log);
            },

            clear: function() {
                console.log('\033[2J');
            },

            endl: function() {
                console.log('\n');
            },

            throwException: function (message, err) {
                message = message || 'The program threw an exception. Process stopped.';

                this.put(message, false);

                if (err !== undefined && err !== null) {
                    this.put(err.stack, false);
                }

                process.exit(500);
            },

            putException: function (message, err) {
                message = message || 'The program put an exception. Process continues.';

                this.put(message, false);

                if (err !== undefined && err !== null) {
                    this.put(err.stack, false);
                }
            }
        };
    }

    // put the log to file
    else if (logMode === 1) {

    }

    // if none was specified
    else {
        console.log('[' + getTime() + '] error: ' + 'No plogging method was specified.');

        return {
            put: function (log, type) {},
            clear: function() {},
            endl: function() {},
            throwException: function (message, err) {},
            putException: function (message, err) {}
        };
    }
};
