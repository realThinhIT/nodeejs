class Exception extends Error {
    constructor(message, code) {
        super();

        if (message instanceof Error) {
            this.message = message.message;
        } else {
            this.message = message; 
        }

        this.code = code ? code : '_err';
        this.stack = (new Error()).stack;
        this.name = this.constructor.name;
    }
}