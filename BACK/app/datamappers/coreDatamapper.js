const pool = require("../utils/clientConnect");
const notFoundError = require("../utils/errorControl/notFoundError");
const debug = require("debug")("3db: datamapper");


/**
 * @class CoreDatamapper
 * @description coreDatamapper, base class for all other datamappers who extends it
 * @param {string} tableName - Name of the table in the database
 * @returns {object} - instance of CoreDatamapper
 */
class CoreDatamapper {
	static tableName;

	/**
	 * @method getAll
	 * @description Get all data from a table
	 * @param {object} data - data to filter
	 * @returns {object} - data
	 */
	async getAll(data) {
		debug("ok");
		debug("data", data);
		if (data === undefined || Object.keys(data).length === 0) {
			const firstQuery = `SELECT * FROM "${this.constructor.tableName}"`;
			const response = await pool.query(firstQuery);

			return response.rows;
		} else {
			let query = `SELECT * FROM "${this.constructor.tableName}" WHERE "${
				Object.keys(data)[0]
			}" = $1${
				Object.keys(data)[1]
					? ` 
            OR "pseudo" = $2`
					: ""
			}`;
			debug("query", query);
			// testing conditonals clauses in query

			const response = await pool.query(query, Object.values(data));

			return response.rows;
		}
	}

	/**
	 * @method getOne
	 * @description Get one data from a table by id
	 * @param {number} id - id of the data
	 * @returns {object} - data
	 */
	async getOne(id) {
		const query = `SELECT * FROM "${this.constructor.tableName}" WHERE "id" = $1`;
		const response = await pool.query(query, [id]);

		if (response.rowCount === 0) {
			return new notFoundError("not found");
		}

		return response.rows[0];
	}

	/**
	 * @method create
	 * @description Create one data in a table
	 * @param {object} data - data to create
	 * @returns {object} - data
	 */
	async create(data) {
		debug(data);
		const keys = [];
		const params = [];

		Object.keys(data).forEach((key, index) => {
			keys.push(`"${key}"`);
			params.push(`$${index + 1}`);
		});

		const query = `

            INSERT INTO "${this.constructor.tableName}" (${keys.join(", ")})
            VALUES (${params.join(", ")})
            RETURNING *;`;

		const response = await pool.query(query, Object.values(data));

		return response.rows[0];
	}

	

	/**
	 * @method update
	 * @description Update one data in a table
	 * @param {number} id - id of the data
	 * @param {object} data - data to update
	 * @returns {object} - data
	 */
	async update(id, data) {
		debug(data);
		debug(id);
		//id check
		const checkQuery = `SELECT * FROM "${this.constructor.tableName}" WHERE "id" = $1`;
		const idcheck = await pool.query(checkQuery, [id]);
		debug(checkQuery);

		if (idcheck.rowCount === 0) {
			return new notFoundError("user not found");
		}

		const newValues = [];

		Object.keys(data).forEach((key, index) => {
			newValues.push(`${key} = $${index + 1}`);
		});

		const query = `UPDATE "${this.constructor.tableName}" SET ${newValues.join(
			", "
		)} WHERE id = $${newValues.length + 1} RETURNING *`;
		const response = await pool.query(query, [...Object.values(data), id]);
		debug("response update", response.rows);

		//we return response.rows[0] and idcheck.rows[0].picture for the update of the picture and
		//delete old picture path in the file system for save space

		return [response.rows[0], idcheck.rows[0].picture];
	}

	/**
	 * @method delete
	 * @description Delete one data in a table
	 * @param {number} id - id of the data
	 * @returns {object} - data
	 */
	async delete(id) {
		//id check
		const checkQuery = `SELECT * FROM "${this.constructor.tableName}" WHERE "id" = $1`;
		const idcheck = await pool.query(checkQuery, [id]);

		if (idcheck.rowCount === 0) {
			return new notFoundError("user not found");
		}

		const query = `DELETE FROM "${this.constructor.tableName}" WHERE "id" = $1 RETURNING * `;
		const response = await pool.query(query, [id]);

		return response.rows[0];
	}
}


/**
 * @exports CoreDatamapper
 */
module.exports = CoreDatamapper;
