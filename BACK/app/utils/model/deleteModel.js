const fs = require("fs");
const debug = require("debug")("3db: oldPictureDelete");

const deleteFile = (path) => {

		fs.unlink(path, (err) => {
				if (err) {
						debug(err);
				}
				debug("old picture deleted");
		})

}


module.exports = deleteFile;
