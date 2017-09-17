export default class DbDriver {
    /**
     * Creates an instance of DbDriver
     * 
     * @param {any} config 
     * @memberof DbDriver
     */
    constructor(config) {
        this.config = config;
        this.driver = this.driver();
        this.connection = undefined;
    }

    /**
     * Returns an instance of the driver module (mongoose, mysql..)
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
        return this.connection;
    }

    /**
     * Handles connection's closing proccess
     * 
     * @memberof DbDriver
     */
    async close() {

    }
}