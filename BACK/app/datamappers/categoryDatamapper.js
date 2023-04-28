const CoreDataMapper = require("./coreDatamapper");
const pool = require("../utils/clientConnect");


/**
 * @description Datamapper for category
 * @class CategoryDatamapper
 * @extends CoreDatamapper
 * @personnalisedMethods getAll (this methods don't heritate from CoreDatamapper)
 * @param {string} tableName - Name of the table in the database
 * @returns {object} - instance of CategoryDatamapper
 */
class CategoryDatamapper extends CoreDataMapper {
		static tableName = "category";

	constructor () {
		super();
	}

	/**
	 * @description - method for get all categories
	 * @method - getAll
	 * @returns {object} - return an object with all categories
	 */
	async getAll () {
	const query = `SELECT * FROM ${this.constructor.tableName}`
	const response = await pool.query(query)

	return response.rows
}



}


/**
 * @description - export an instance of CategoryDatamapper
 */
module.exports = new CategoryDatamapper();
