

/**
 * @description - Error class for token error
 * @class TokenError
 * @extends Error
 * @param {string} message - message for error
 * @returns {object} - instance of TokenError
 */
class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = "TokenError";
    this.statusCode = 401;
    this.message = message;
  }
}

/**
 * @description - export TokenError
 */
module.exports = TokenError;
