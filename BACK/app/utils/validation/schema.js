const Joi = require("joi");

/**
 * @description - Joi schema
 * @constant {object} schema
 * @property {object} user_create - schema for create a user
 * @property {object} user_update - schema for update a user
 * @property {object} model_create - schema for create a model
 * @property {object} model_update - schema for update a model
 * @returns {object} - return an object with the schema
 */
const schema = {
	user_create: Joi.object({
		pseudo: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
		firstname: Joi.string().required(),
		lastname: Joi.string().required(),
		picture: Joi.binary(),
	}).options({ convert: true }),

	user_update: Joi.object({
		pseudo: Joi.string().optional(),
		email: Joi.string().email().optional(),
		firstname: Joi.string().optional(),
		lastname: Joi.string().optional(),
		picture: Joi.binary(),
	}).options({ convert: true }),

	//TODO: TAG : STRING OR ARRAY ?
	model_create: Joi.object({
		/*pathModel: Joi.string().required(),*/
		name: Joi.string().required(),
		/*size: Joi.number(),*/
		/*format: Joi.string(),*/
		download: Joi.boolean().required(),
		description: Joi.string().required(),
		/*picture: Joi.string(),*/
		tag: Joi.string().required(),
		user_id: Joi.number(),
		category_id: Joi.string()
	}).options({ convert: true }),

	model_update: Joi.object({
		/*data: Joi.string(),*/
		/*size: Joi.number(),*/
		/*format: Joi.string(),*/
		// name: Joi.string(),
		download: Joi.boolean(),
		description: Joi.string(),
		/*picture: Joi.string(),*/
		tag: Joi.string(),
		// user_id: Joi.number(),
	}).options({ convert: true }),
};

/**
 * @description - export the schema
 */
module.exports = schema;
