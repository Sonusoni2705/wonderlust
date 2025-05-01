class expressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        // console.error(this.stack);
    }
}

module.exports = expressError;