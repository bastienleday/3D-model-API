const debug = require("debug")("3db: controllers");


/**
 * @description - handler controller
 * @param {function} controller - controller
 * @returns {function} - return controller inside a try catch
 * @throws {error} - throw an error
 */

const handlerController = (controller) => {
	return async (req, res, next) => {
		try {
			await controller(req, res, next);
		} catch (err) {
			debug("handler controller error", err);
			next(err);
		}
	};
};

/**
 * @description - export handlerController
 */
module.exports = handlerController;
