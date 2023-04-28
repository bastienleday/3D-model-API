const { v4: uuidv4 } = require("uuid");
const multer = require("multer");


/**
 * @description - multer config for upload files, create a unique name for the file and save it in the folder uploads/avatar
 * @method - multer
 * @param {object} storage - multer storage config
 * @param {object} limits - multer limits config
 * @param {object} fileFilter - multer fileFilter config
 * @throws {error} - throw an error if the file is not a jpeg or png
 * @returns {object} - return an object with the multer config
 */
const multerConfig = function () {

    //multer storage config
    const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, 'uploads/avatar');
      },
      filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + uuidv4(); // we add a unique suffix to the file name with uuidv4
        cb(null, uniqueSuffix + '-' + file.originalname); // we add the unique suffix to the file name
      }
    });
    return multer({ 
        storage: storage ,
        limits: { fileSize: 1024 * 1024 * 5 },
        fileFilter: 
        function(req, file, cb) {
            if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            return cb(new Error('Only jpeg and png are allowed!'), false);

        }
        cb(null, true);
    }

});
    
    
    }
    
    /**
     * @description - export multerConfig
     */
    module.exports = multerConfig;
    




