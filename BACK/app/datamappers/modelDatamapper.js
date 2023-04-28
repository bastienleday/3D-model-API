const CoreDataMapper = require("./coreDatamapper");
const pool = require("../utils/clientConnect");
const debug = require("debug")("3db: modelDatamapper");
const NotFoundError = require("../utils/errorControl/notFoundError");
const NoContentError = require("../utils/errorControl/noContentError");


/**
 * @class ModelDatamapper
 * @extends CoreDatamapper
 * @personnalisedMethods getOne, getAllModels, getAllModelsByCategory, create, delete (this methods don't heritate from CoreDatamapper)
 * @description Datamapper for model
 * @param {string} tableName - Name of the table in the database
 * @returns {object} - instance of ModelDatamapper
 */
class modelDatamapper extends CoreDataMapper {
	static tableName = "model";

	constructor() {
		super();
	}

	/**
	 * @method getOne
	 * @description Get one model by id
	 * @param {number} id - id of the model
	 * @returns {object} - model
	 */
	async getOneModel(id) {
		const query = 
	  `SELECT "model"."id", "model"."name", "model"."data", "model"."format", "model"."size", "model"."download", "model"."description",
	  "model"."tag", "user"."pseudo", "category"."name" AS "category"
	  FROM "model"
	  LEFT JOIN "model_has_category" ON "model_has_category"."model_id" = "model"."id"
	  LEFT JOIN "category" ON "category"."id" = "model_has_category"."category_id"
	  LEFT JOIN "user" ON "user"."id" = "model"."user_id"
	  LEFT JOIN "comment" ON "comment"."model_id" = "model"."id"
	  WHERE "model"."id" = $1
	  GROUP BY "model"."id", "user"."pseudo", "category"`



		const response = await pool.query(query, [id]);



		if (response.rowCount === 0) {
			return new NoContentError("no model found");
		}

		return response.rows[0];
	}


	/**
	 * @method getAllModels
	 * @description Get all models
	 * @returns {object} - models
	 */
	async getAllModels() {
		
		const query = `SELECT "model"."id", "model"."picture", "model"."name", "category"."name" AS "category", "user"."pseudo", COUNT("model_has_like"."model_id") AS "likes"
  FROM "model"
  LEFT JOIN "user" ON "model"."user_id" = "user"."id"
  LEFT JOIN "model_has_like" ON "model_has_like"."model_id" = "model"."id"
  LEFT JOIN "model_has_category" ON "model_has_category"."model_id" = "model"."id"
  LEFT JOIN "category" ON "model_has_category"."category_id" = "category"."id"
  GROUP BY "model"."id", "user"."pseudo", "category"`;

		const response = await pool.query(query);

		if (response.rowCount === 0) {
			return new NoContentError();
		}

		return response.rows;
	}

	/**
	 * @method getAllModelsByCategory
	 * @description Get all models by category or by pseudo of user using query params
	 * @param {object} para - parameters
	 * @returns {object} - models
	 */
	async getAllModelsByCategory(para) {
		let query = `SELECT "model"."id", "model"."picture", "model"."name", "category"."name" AS "category", "user"."pseudo", COUNT("model_has_like"."model_id") AS "likes"
		FROM "model"
		LEFT JOIN "user" ON "model"."user_id" = "user"."id"
		LEFT JOIN "model_has_like" ON "model_has_like"."model_id" = "model"."id"
		LEFT JOIN "model_has_category" ON "model_has_category"."model_id" = "model"."id"
		LEFT JOIN "category" ON "category"."id" = "model_has_category"."category_id"`;

		if (Object.keys(para).includes("category")) { // si on a un paramètre category dans l'objet para 
			query += ` WHERE "category"."name" = $1`; //	on ajoute une clause where à la requête
		} else if (Object.keys(para).includes("pseudo")) { // si on a un paramètre pseudo dans l'objet para
			query += ` WHERE "user"."pseudo" = $1`; // on ajoute une clause where à la requête
		}



		query += ` GROUP BY "model"."id", "user"."pseudo", "category"`;

	

		const response = await pool.query(query, Object.values(para));
		

		if (response.rowCount === 0) {
			return new NoContentError();
		}

		return response.rows;
	}

	/**
	 * @method create
	 * @description add a model in model realtion and add model_id and category_id in model_has_category relation
	 * @param {object} data - data of the model
	 * @returns {object} - model added
	 */
	async create(data){
		
		const { category_id, ...rest } = data
		data = rest
		
		
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
		const insertModelId = response.rows[0].id
		

		//we need  query for join model to category in model_has_category table in bdd
		//we need to use category_id and model_id was returning
		const values = [
			insertModelId,
			category_id
		]
if(category_id){
		const modelHasCategory = `INSERT INTO "model_has_category" (model_id, category_id) VALUES ($1, $2)`
		const modelCategoryquery = await pool.query(modelHasCategory, values)
}

		return response.rows[0];
	}

	/**
	 * @method delete
	 * @description delete a model in model relation and delete model_id and category_id in model_has_category relation
	 * @param {number} id - id of the model
	 * @returns {object} - model deleted
	 */
	async delete(id){
		//id check
		const checkQuery = `SELECT * FROM "${this.constructor.tableName}" WHERE "id" = $1`;
		const idcheck = await pool.query(checkQuery, [id]);

		if (idcheck.rowCount === 0) {
			return new NotFoundError("user not found");
		}

		//delete all column in model_has_category where model_id appear
		const categoryModel = `DELETE FROM "model_has_category" WHERE "model_id" = $1`
		const categoryModelDelete = await pool.query(categoryModel, [id]);

		const query = `DELETE FROM "${this.constructor.tableName}" WHERE "id" = $1 RETURNING * `;
		const response = await pool.query(query, [id]);

		return response.rows[0];
	}

	/**
	 * @method getLimited
	 * @description Get 10 last models
	 * @returns {object} - models
	 */
	async getLimited () {
		const query = `SELECT "model"."id", "model"."picture", "model"."name", "category"."name" AS "category", "user"."pseudo", COUNT("model_has_like"."model_id") AS "likes"
		FROM "model"
		LEFT JOIN "user" ON "model"."user_id" = "user"."id"
		LEFT JOIN "model_has_like" ON "model_has_like"."model_id" = "model"."id"
		LEFT JOIN "model_has_category" ON "model_has_category"."model_id" = "model"."id"
		LEFT JOIN "category" ON "model_has_category"."category_id" = "category"."id"
		GROUP BY "model"."id", "user"."pseudo", "category"
		ORDER BY "model"."updated_at" DESC LIMIT 10;`
		const response = await pool.query(query)

		if (response.rowCount === 0) {
			return new NoContentError();
		}

		return response.rows;
	}

	}



	

/**
 * @description export an instance of modelDatamapper
 */
module.exports = new modelDatamapper();
