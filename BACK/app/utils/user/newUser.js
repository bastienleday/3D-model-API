// here we defenied the function that will be used to create a new user
const userDatamapper = require("../../datamappers/userDatamapper");
const debug = require("debug")("3db: newUser");
const badInputError = require("../errorControl/badInputError");
const bcrypt = require("bcrypt");
const sendMail = require("../notifications/nodemailer");
const oldPictureDelete = require("./oldPictureDelete");


/**
 * @description - function for create a new user
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next middleware
 * @param {object} body - body of the request
 * @returns {object} - return an object with the user created
 */
const add = async (req, res, next, body) => {
	debug("newUser OK");
	debug("data passée dans le newUser", body);
	debug(body.picture);

	debug(userDatamapper.getAll());
	//req.body is the body of the request
	const { pseudo, email, password, firstname, lastname, picture } = body;

	//we check if the user already exist (use email or pseudo)
	const Check = await userDatamapper.getAll({ email, pseudo });
	debug("response", Check);

	//if the user avatar is default avatar we redefiene the picture path
	let path = body.picture;

	debug("path", path);

	// if the user exist we send an error
	if (Check.length > 0) {
		//if user already exist we delete the picture path uploaded in the server
		body.picture === "uploads/avatar/default.jpg"
			? oldPictureDelete(path)
			: oldPictureDelete(req.files.picture[0].path);

		//if the user already exist we return an error
		const err = new badInputError("User already exist");
		next(err);
	}
	// if the user doesn't exist we create it
	// we hash the password

	const hashPassword = await bcrypt.hash(password, 10);

	const user = await userDatamapper.create({
		pseudo,
		email,
		password: hashPassword,
		firstname,
		lastname,
		picture,
	});

	const newUser = {
		pseudo: user.pseudo,
		email: user.email,
		firstname: user.firstname,
		lastname: user.lastname,
		picture: user.picture,
	};

	debug(email);
	sendMail(
		`${email}`,
		"nouvelle notification",
		"FELICITATION !! Vous êtes inscrit !"
	);
	return newUser;
};

/**
 * @description - export the function add
 */
module.exports = add;
