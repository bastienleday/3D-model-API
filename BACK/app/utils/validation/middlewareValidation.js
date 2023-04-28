const badInputError = require("../errorControl/badInputError");
const debug = require("debug")("3db: validation");

/**
 * @description - validation middleware
 * @param {object} schema - schema
 * @returns {function} - return a function
 */
function validation(schema) {

	return async (req, res, next) => {

		
		let data = req.body;

		
         debug("info", req.files)
         if(req.files && req.files.picture && req.files.picture.length !== {}) {
			debug("je suis la")
	
		picture = req.files.picture[0].path;
		// debug(pathModel)
		data = { ...req.body, picture};
		debug(data)}

	
		 data = req.body;

		
		try {
			
			const value = await schema.validateAsync(data);

			next();
		} catch (error) {
			const err = new badInputError(error.message);
			next(err);
		}
	};

}

/**
 * @description - export validation
 */
module.exports = validation;
