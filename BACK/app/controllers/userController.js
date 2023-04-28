
const coreController = require("./coreController");
const userDatamapper = require("../datamappers/userDatamapper");
const add = require("../utils/user/newUser");
const debug = require("debug")("3db: userController");
const signin = require("../utils/user/signin");
sendPictureToBuffer = require("../utils/user/sendPictureToBuffer");
const oldPictureDelete = require("../utils/user/oldPictureDelete");

const nodemailer = require("nodemailer");

/**
 * @description - controller for user
 * @class - userController
 * @extends - coreController
 * @personallisedMethods - create, signin, logout, getAll, getOne, delete (this method don't heritate from coreController)
 * @param {object} dataMapper - dataMapper for user
 * @returns {object} - return an instance of userController
 */
class userController extends coreController {
	static dataMapper = userDatamapper;
	
	constructor() {
		super();
	}
	

	/**
	 * @description - method for create a user
	 * @method - create
	 * @param {function} newUser - function for create a user, require with const "add", see utils/user/newUser.js
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @returns {object} - return an object with the user created
	 */
	async create(req, res, next) {
		debug(req.files.picture);

		let picture = "uploads/avatar/default.jpg";

		if (req.files && req.files.picture) {
			picture = req.files.picture[0].path;
		}

		const userData = { ...req.body, picture };

		debug("userdata", userData);
		const addedUser = await add(req, res, next, userData);
		//we send mail to client forconfirm subscription

		res.status(200).json(addedUser);
	}

	/**
	 * @description - method for signin a user
	 * @method - signin
	 * @param {function} signin - function for signin a user, require with const "signin", see utils/user/signin.js
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @returns {object} - return an object with the user who signin
	 */
	async signin(req, res, next) {
		const connectUser = await signin(req, res, next, req.body);
	}

	/**
	 * @description - method for logout a user, unused with jwt, but used if we use jwt in cookie
	 * @method - logout
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @returns {object} - return an message for logout
	 */
	async logout(req, res, next) {
		//destroy cookie
		res.clearCookie("jwt", { httpOnly: true }).status(200).json("logout OK");
	}

	/**
	 * @description - method for get all user
	 * @method - getAll
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @returns {object} - return an object with all user
	 */
	async getAll (req, res, next) {
		
		const response = await this.constructor.dataMapper.getAll();
	//for all user return we send picture to buffer so we nedd to use a loop for do that

	const allUser = [];

	for(const element of response) {
		const buffer = await sendPictureToBuffer(element.picture);
		const user = {
			id : element.id,
			pseudo : element.pseudo,
			email : element.email,
			firstname: element.firstname,
			lastname: element.lastname,
			created_at: element.created_at,
			picture: buffer,
		};
		allUser.push(user);
	}

	if (response) {
		res.status(200).json(allUser);
	}
}
	
	/**
	 * @description - method for get one user
	 * @method - getOne
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @returns {object} - return an object with getting user	
	 */
	async getOne(req, res, next) {
		const id = req.params.id;

		const response = await this.constructor.dataMapper.getOne(id);
		

		if (response instanceof Error) {
			return next(response);
		}
		
		const userBuffer = await sendPictureToBuffer(response.user[0].picture);

		//we nedd to send picture buffer for all model of this user so we use a loop for do that
		const allModel = [];

		for(const element of response.model){
			const modelBuffer = await sendPictureToBuffer(element.picture);
			const model = {
				id : element.id,
				name : element.name,
				description : element.description,
				format: element.format,
				tag: element.tag,
				created_at: element.created_at,
				likes: element.nombre_de_like,
				comments: element.Commentaires,
				picture: modelBuffer,
			};
			allModel.push(model);
		}
		
		if (response) {
			const userProfil = {
				pseudo: response.user[0].pseudo,
				email: response.user[0].email,
				firstname: response.user[0].firstname,
				lastname: response.user[0].lastname,
				picture : userBuffer,
			}
			
				const completeUser = { userProfil, allModel };
				res.status(200).json(completeUser);
			}
		}

	/**
	 * @description - method for delete a user
	 * @method - delete
	 * @param {object} req - request
	 * @param {object} res - response
	 * @param {function} next - next middleware
	 * @returns {object} - return an object with the user deleted
	 */
	async delete(req, res, next) {
		const response = await this.constructor.dataMapper.delete(req.params.id);
		debug("response", response);
	
		//now we delete the picture
		oldPictureDelete(response.picture);
	
		if (response instanceof Error) {
			return next(response);
		}
	
		const deleteUser = {
			message: "User deleted",
			response,
		};
	
		if (response) {
			res.status(200).json(deleteUser);
		}
	}
	}
	
	/**
	 * @description - export an instance of userController
	 */
	module.exports = new userController();

		



		

		


