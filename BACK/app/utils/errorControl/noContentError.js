
/**
 * @description Error class for no content
 * @class NoContent
 * @extends Error
 * @param {string} message - message for error
 * @returns {object} - instance of NoContent
 */
class NoContent extends Error {
	constructor(message) {
		super(message);
		this.name = "NoContent";
		this.message = "no content";
		this.statusCode = 200;
	}
}

/**
 * @description - export NoContent
 */
module.exports = NoContent;
