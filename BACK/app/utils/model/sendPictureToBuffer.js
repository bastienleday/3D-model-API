const fs = require("fs");
const NotFoundError = require("../errorControl/notFoundError");
const badInputError = require("../errorControl/badInputError");
const debug = require("debug")("3db: sendPictureToBuffer");

const sendPicture = (path) => {
	const filePath = path;

	return new Promise((resolve, reject) => {
		fs.readFile(filePath, async (err, data) => { //lecture du fichier
			if (err) {
				return new NotFoundError("Picture not found");
			}

			const buffer = Buffer.from(data, "base64"); //conversion du fichier en buffer
			debug(buffer);

			resolve(buffer); //renvoi du buffer
		});
	});
};

module.exports = sendPicture;
