const fs = require("fs");
const NotFoundError = require("../errorControl/notFoundError");
const debug = require("debug")("3db: sendModelToBuffer");



const sendModel = (path) => {
		const filePath = path;

		return new Promise((resolve, reject) => {
				fs.readFile(filePath, async (err, data) => {
						if (err) {
								reject(new NotFoundError("Model not found"));
						}

						

						resolve(data);
				});
		});
};


module.exports = sendModel;
