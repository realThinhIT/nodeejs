export default class DbDriver {
  /**
   * Creates an instance of DbDriver
   * 
   * @param {any} config 
   * @memberof DbDriver
   */
  constructor(config) {
    this._config = config;
    this._driver = this.driver;
    this._connection = undefined;
  }

  /**
   * Returns an instance of the driver module (mongoose, mysql..)
   * This is user-defined!
   * 
   * @returns [a driver]
   * @memberof DbDriver
   */
  get driver() {
    return {};
  }

  /**
   * Returns name of the driver
   * 
   * @returns 
   * @memberof DbDriver
   */
  get driverName() {
    return this.constructor.name.toLowerCase();
  }

  /**
   * Establishes a connection to the database using existing driver
   * 
   * @memberof DbDriver
   */
  async connect() {
    return this._connection;
  }

  /**
   * Sets connection
   */
  async setConnection(con = null) {
    this._connection = con;
  }

  /**
   * Returns the existing connection
   * 
   * @returns 
   * @memberof DbDriver
   */
  async getConnection() {
    try {
      if (!this._connection) {
        await this.connect();
      }
    } catch (e) {
      throw e;
    }

    return this._connection;
  }

  /**
   * Return the using driver
   * 
   * @returns 
   * @memberof DbDriver
   */
  get driver() {
    return this._driver;
  }

  /**
   * Returns the database configuration
   * 
   * @param {string} name 
   * @memberof DbDriver
   */
  config(name) {
    if (!this._config['common']) {
      return null;
    }

    if (name) {
      return this._config['common'][name];
    } else {
      return this._config['common'];
    }
  }

  /**
   * Returns the per-driver configurations
   * 
   * @param {string} name 
   * @memberof DbDriver
   */
  driverConfig(name) {
    if (
      !this._config['drivers'] || (name && !this._config['drivers'][this.driverName][name])
    ) {
      return null;
    }

    if (name) {
      return this._config['drivers'][this.driverName][name];
    } else {
      return this._config['drivers'][this.driverName];
    }
  }

  /**
   * Handles connection's closing proccess
   * 
   * @memberof DbDriver
   */
  async close() {

  }
}