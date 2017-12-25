export default class DbDriver {
    /**
     * Creates an instance of DbDriver
     * 
     * @param {any} config 
     * @memberof DbDriver
     */
    constructor(config) {
        this._config = config;
        this._driver = this.driver();
        this._connection = undefined;
    }

    /**
     * Returns an instance of the driver module (mongoose, mysql..)
     * This is user-defined!
     * 
     * @returns [a driver]
     * @memberof DbDriver
     */
    driver() {
        return {};
    }

    /**
     * Returns name of the driver
     * 
     * @returns 
     * @memberof DbDriver
     */
    driverName() {
        return this.constructor.name.toLowerCase();
    }

    /**
     * Establishes a connection to the database using existing driver
     * 
     * @memberof DbDriver
     */
    async connect() {

    }

    /**
     * Returns the existing connection
     * 
     * @returns 
     * @memberof DbDriver
     */
    getConnection() {
        return this._connection;
    }

    /**
     * Return the using driver
     * 
     * @returns 
     * @memberof DbDriver
     */
    getDriver() {
        return this._driver;
    }

    /**
     * Returns the database configuration
     * 
     * @param {string} name 
     * @memberof DbDriver
     */
    getConfig(name) {
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
    getDriverConfig(name) {
        if (name) {
            return this._config['drivers'][this.driverName()][name];
        } else {
            return this._config['drivers'][this.driverName()];
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