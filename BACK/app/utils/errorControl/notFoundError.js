
/**
 * @description - NotFoundError class for not found
 * @class NotFoundError
 * @extends Error
 * @param {string} message - message for error
 * @returns {object} - instance of NotFoundError
 */
class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = "NotFoundError";
		this.message = message;
		this.statusCode = 404;
	}
}

/**
 * @description - export NotFoundError
 */
module.exports = NotFoundError;
