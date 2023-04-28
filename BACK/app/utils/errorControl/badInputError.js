
/**
 * @description Error class for bad input
 * @class badInputError
 * @extends Error
 * @param {string} message - message for error
 * @returns {object} - instance of badInputError
 */
class badInputError extends Error {

    constructor(message) {
        super(message);
        this.name = 'badInputError'
        this.message = message;
        this.statusCode = 400;
    }

}

/**
 * @description - export badInputError
 */
module.exports = badInputError;
