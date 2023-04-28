// here we defined a function for update pseudo or email
// pseudo and email are unique so we need to check if the new pseudo or email is not already used and we need to check user password before update email for sécurity reason

//in controller side we check in the rq.body and then we have req.body.pseudo or req.body.email we go in this function
// we defined a method for picture update, when we update picture we delete old picture and we add new picture

const userDatamapper = require("../../datamappers/userDatamapper");
const badInputError = require("../errorControl/badInputError");
const debug = require("debug")("3db: updateUser");
const oldPictureDelete = require("../user/oldPictureDelete");


/**
 * @description - function for update user
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next middleware
 * @param {object} body - body of the request
 * @returns {object} - return an object with the user updated
 */
const updateUser = async (req, res, next, body) => {
  const { pseudo, email } = body;


  if (email) {
    const emailCheck = await userDatamapper.getAll({ email });
    if (emailCheck.length > 0) {
      oldPictureDelete(req.files.picture[0].path)
      const err = new badInputError("Email already exist");
      return next(err);
    }
  }

  if (pseudo) {
     debug(pseudo)
    const pseudoCheck = await userDatamapper.getAll({ pseudo });

    if (pseudoCheck.length > 0) {
      oldPictureDelete(req.files.picture[0].path)
      const err = new badInputError("Pseudo already exist");
      return next(err);
    }
  }

  
  //if we receve a picture we delete old picture and we add new picture in uploads/avatar ans we update picture url in database
  //this part is in case we stock path in picture user data
 if(req.files.picture) {
  body.picture = req.files.picture[0].path

 }

  const response = await userDatamapper.update(req.params.id, body);

  //this part is in case we stock path in picture user data
oldPictureDelete(response[1])
 

  return response[0];
};

/**
 * @description - function for update user
 */
module.exports = updateUser;
