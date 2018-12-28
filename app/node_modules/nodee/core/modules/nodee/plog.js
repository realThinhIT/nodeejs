export default (enable) => {
  let logMode;

  enable = (enable === undefined || enable === null) ? true : enable;

  // common functions
  let getTime = () => {
    let d = new Date();
    let dateLog = d.getDate() + '/' + (d.getMonth() + 1) + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

    return dateLog;
  };

  // if the module is not enable
  if (enable !== true && enable !== 1) {
    logMode = 0;
    console.log('[' + getTime() + '] info: Logging is not enabled for this application.');
  }  else {
    logMode = 1;
  }

  // put the log to the console
  if (logMode === 1) {
    return {
      put(log, type) {
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

      clear() {
        console.log('\x1Bc');
      },

      endl() {
        console.log('\n');
      },

      throwException(message, err) {
        message = message || 'The program threw an exception. Process stopped.';

        this.put(message, false);

        if (err !== undefined && err !== null) {
          this.put(err.stack, false);
        }

        process.exit(500);
      },

      putException(message, err) {
        message = message || 'The program put an exception. Process continues.';

        this.put(message, false);

        if (err !== undefined && err !== null) {
          this.put(err.stack, false);
        }
      }
    };
  }

  // if none was specified
  else {
    return {
      put(log, type) {},
      clear() {},
      endl() {},
      throwException(message, err) {},
      putException(message, err) {}
    };
  }
};
