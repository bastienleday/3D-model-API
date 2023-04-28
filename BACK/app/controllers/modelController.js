const coreController = require("./coreController");
const modelDatamapper = require("../datamappers/modelDatamapper");
const debug = require("debug")("3db: modelController");
const path = require("path");
const fs = require("fs");
const badInputError = require("../utils/errorControl/badInputError");
const sendModelToBuffer = require("../utils/model/sendModelToBuffer");
const sendPictureToBuffer = require("../utils/model/sendPictureToBuffer");
const deleteFile = require("../utils/model/deleteModel");
const NotFoundError = require("../utils/errorControl/notFoundError");


/**
 * @class modelController
 * @extends coreController
 * @personnalisedMethods - getAll, getGlb, getData, create, update, delete (this methods don't herit from coreController)
 * @description - this class is the controller for the model
 * @param {object} dataMapper - dataMapper for model
 * @returns {object} - return an instance of modelController
 */
class modelController extends coreController {
	static dataMapper = modelDatamapper;
	dataMapper = modelDatamapper;


	/**
	 * @description - method for get all models
	 * @method - getAll
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @returns {object} - return an object with all models
	 */
	async getAll(req, res, next) {
		
		//ici test d'une condition pour savoir si on a un paramètre dans la requête req.query
		debug(req.query);
		let response;
		if (
			req.query.hasOwnProperty("category") || 
			req.query.hasOwnProperty("pseudo")
		) {
			response = await this.dataMapper.getAllModelsByCategory(req.query); 
		} else {
			debug("no query");
			response = await this.dataMapper.getAllModels();
		}

		if (response instanceof Error) {
			throw response;
		}

		debug("reponse", response)

		const allModels = []; //tableau qui va contenir tous les modèles
		for (const element of response) { //boucle sur tous les modèles
			const picture = await sendPictureToBuffer(element.picture); //envoi de l'image en buffer
			
			const model = { //création d'un objet qui va contenir les données du modèle
				id: element.id, 
				name: element.name,
				category: element.category,
				pseudo: element.pseudo, 
				like: element.likes,
				picture, 
			};
			allModels.push(model); //ajout du modèle dans le tableau
		}

		res.status(200).json(allModels); //envoi du tableau
	}

	/**
	 * @description - method for get one model glb data
	 * @method - getGlb
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @param {fs} - file system of node js is used for read, write and send file
	 * @returns {object} - return an object with getting model glb data
	 */
	async getGlb(req, res, next) {

		

		const response = await this.dataMapper.getOneModel(req.params.id);

		if (response instanceof Error) {
			return next(response);
		}

		const glb = fs.readFileSync(response.data);

		//   const buffer = await sendModelToBuffer(response.data);

		const object = {
			data: glb,
		};

		res.setHeader("Content-Type", "model/gltf+binary"); // si on veut envoyer un fichier glb il faut mettre model/gltf+binary dans le header

		fs.writeFileSync("test.glb", object.data); // on écrit le fichier glb dans le dossier BACK (pour le moment) pour pouvoir l'envoyer ensuite avec sendFile (il faut un chemin absolu) 
		res.sendFile("test.glb", { root: __dirname + "/../../" });
	}

	/**
	 * @description - method for get one model data
	 * @method - getData
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @returns {object} - return an object with getting model data
	 */
	async getData(req, res, next) {
		const id = req.params.id;

		const response = await this.dataMapper.getOneModel(id);

		if (response instanceof Error) {
			return next(response);
		}

		res.status(200).json(response);
	}

	/**
	 * @description - method for add model
	 * @method - create
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @returns {object} - return an object with the model created
	 */
	async create(req, res, next) {
		// debug("modelController");
		// debug("userid", req.decoded.id)

		// debug(req.files);
		debug(req.body)

		// GET PATH OF THE MODEL AND THE PICTURE
		const pathModel = req.files.data[0].path;
		const pathPicture = req.files.picture[0].path;

		// GET THE EXTENSION OF THE MODEL
		req.body.format = req.files.data[0].mimetype;

		// GET THE SIZE OF THE MODEL
		req.body.size = req.files.data[0].size;

		// ADD THE PATH OF THE MODEL AND THE PICTURE TO THE BODY
		req.body.data = pathModel;
		req.body.picture = pathPicture;

		req.body = {...req.body, user_id: req.decoded.id}

		const response = await this.dataMapper.create(req.body);

		res.status(201).json(response);
	}

	/**
	 * @description - method for update model
	 * @method - update
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @returns {object} - return an object with the model updated
	 */
	async update(req, res, next) {
		const response = await this.dataMapper.update(req.params.id, req.body);

		res.status(200).json(response);
	}

	/**
	 * @description - method for delete model
	 * @method - delete
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @returns {object} - return an object with the model deleted
	 */
	async delete(req, res, next) {
		debug("delete");

		const findPath = await this.dataMapper.getAll({ id: req.params.id });
		
		const modelPath = findPath[0].data;
		
		const picturePath = findPath[0].picture;
		debug(picturePath)

		deleteFile(modelPath);
		deleteFile(picturePath);

		const response = await this.dataMapper.delete(req.params.id);
		debug("response", response);

		res.status(204).json(response);
	}

	/**
	 * @description - method for get limited models
	 * @method - getLimited
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware	
	 * @returns {object} - return an object with the limited models
	 */
	async getLimited(req, res, next) {
		const response = await this.dataMapper.getLimited(req.query);
		debug("response", response);

		const allModels = [];
		for (const element of response) {
			const picture = await sendPictureToBuffer(element.picture);
			
			const model = {
				id: element.id,
				name: element.name,
				category: element.category,
				pseudo: element.pseudo,
				like: element.likes,
				picture,
			};
			allModels.push(model);
		}

		if (response instanceof Error) {
			return next(response);
		}

		res.status(200).json(allModels);

	}
}

/**
 * @description - export an instance of modelController
 */
module.exports = new modelController();
