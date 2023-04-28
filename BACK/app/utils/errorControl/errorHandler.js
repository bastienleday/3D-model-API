const debug = require("debug")("3db: errorHandler");

/**
 * @description - error handler, catch all errors and return a json with the error informations
 * @param {object} err - error
 * @param {object} req - request
 * @param {object} res - response
 * @param {function} next - next middleware
 * @returns {object} - return an object with the error
 */
const errorHandler = (err, req, res, next) => {
	if (err.statusCode) {
		const error = {
			statusCode: err.statusCode,
			message: err.message,
			stack: process.env.NODE_ENV === "production" ? null : err.stack,
		};
		debug(error.message);
		res.status(error.statusCode).json(error.message);
	} else {
		res.status(500).json({
			message: "Internal Server Error",
			stack: process.env.NODE_ENV === "production" ? null : err.stack,
		});
	}
};

/**
 * @description - export errorHandler
 */
module.exports = errorHandler;
