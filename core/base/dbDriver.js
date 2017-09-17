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
        return this.constructor.name;
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
     * Return the database configuration
     * 
     * @memberof DbDriver
     */
    getConfig(name) {
        return this._config[name];
    }

    /**
     * Handles connection's closing proccess
     * 
     * @memberof DbDriver
     */
    async close() {

    }
}