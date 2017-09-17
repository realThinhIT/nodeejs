export default class DbDriver {
    constructor(config) {
        this.config = config;
        this.connection = undefined;
    }

    driverName() {
        return this.constructor.name;
    }

    connectionString() {
        return '';
    }

    async connect() {

    }

    async getConnection() {
        return this.connection;
    }

    async close() {

    }
}