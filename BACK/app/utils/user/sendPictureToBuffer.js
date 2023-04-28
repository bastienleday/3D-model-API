//we defined a function for read picture from path and send it to buffer or base 64
const fs = require("fs");
const NotFoundError = require("../errorControl/notFoundError");
const debug = require("debug")("3db: sendPictureToBuffer");


/**
 * @description - send picture to buffer
 * @param {string} path - path of the picture in the server
 * @returns {object} - picture in buffer
 */
const sendPicture = (path) => {

  debug(path)
    const filePath = path;
 

  

    return new Promise((resolve, reject) => {
      fs.readFile(filePath, async (err, data) => {
        if (err) {
          reject(err);
        }
        const picture = data;
        
        const buffer = Buffer.from(picture, "base64");
     

        resolve(buffer);
      });
    });
  };

  /**
   * @description - export sendPicture
   */
module.exports = sendPicture;
      
    

        
  
     

