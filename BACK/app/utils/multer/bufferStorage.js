//function for storage and write buffer on disk 
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
const debug = require("debug")("3db: bufferStorage");
const bufferStorage = function (req, res, next) {
    debug("bufferStorage OK");

    debug(req.files.picture[0].buffer);
    

}

module.exports = bufferStorage;