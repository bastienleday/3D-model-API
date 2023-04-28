// function for user signin
const badInputError = require("../errorControl/badInputError");
const userDatamapper = require("../../datamappers/userDatamapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const debug = require("debug")("3db: signin");



/**
 * @description - function for user signin, take data in req.body 
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next middleware
 * @param {object} body - body of the request
 * @returns {object} - return an object with the user and a token
 */
const signin = async (req, res, next) => {
  //we get email and password from req.body

  const { email, password } = req.body;

  //we check if the user exist

  const userCheck = await userDatamapper.getAll({ email });

  debug(userCheck);

  //if the user doesn't exist we return an error
  if (userCheck.length === 0) {
    const err = new badInputError("User doesn't exist");
    return next(err);
  }

  //if user exist we check if the password is correct
  const user = userCheck[0];
  const passwordCheck = await bcrypt.compare(password, user.password);

  //if the password is incorrect we return an error
  if (!passwordCheck) {
    const err = new badInputError("Password is incorrect");
    return next(err);
  }
  //stock user data in req.user
  req.user = user;
  console.log(req.user);

  //if the password is correct we return the user and a cookie with token
  //token generation
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  debug(token)
  //generate and send cookie containing token
  res
    // .cookie("jwt", token, { httpOnly: true, maxAge: 3600000 })
    .status(200)
    .json({token, userId: user.id, pseudo: user.pseudo});
};

/**
 * @description - export the function
 */
module.exports = signin;
