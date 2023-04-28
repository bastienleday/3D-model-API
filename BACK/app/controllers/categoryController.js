const coreController = require("./coreController");
const categoryDatamapper = require("../datamappers/categoryDatamapper");
const debug = require("debug")("3db: categoryController");


/**
 * @description - controller for category
 * @class - categoryController
 * @extends - coreController
 * @personallisedMethods - getAll (this method don't heritate from coreController)
 * @param {object} dataMapper - dataMapper for category
 * @returns {object} - return an instance of categoryController
 */
class userController extends coreController {
		static  dataMapper = categoryDatamapper;


		constructor() {
				debug("categoryController");
			super();
		}


/**
 * @description - method for get all categories
 * @method - getAll
 * @param {object} req - request
 * @param {object} res - response
 * @param {function} next - next middleware
 * @returns {object} - return an object with all categories
 */
async getAll (req, res, next){

	const response = await categoryDatamapper.getAll()

	if(response instanceof Error){
		next(response)
	}

	res.status(200).json(response);

}

	

}


/**
 * @description - export an instance of userController
 */
module.exports = new userController();
