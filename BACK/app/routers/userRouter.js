/**
 * @module userRouter
 * @description - router for user
 * @requires express
 * @requires userController
 * @requires handlerController
 * @requires validator
 * @requires schema
 * @requires errorHandler
 * @requires upload
 */

const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController.js");


const handlerController = require("../controllers/handlerController");
const validator = require("../utils/validation/middlewareValidationUser");
const schema = require("../utils/validation/schema");
const errorHandler = require("../utils/errorControl/errorHandler");
const multer = require("multer");
const bufferStorage = require("../utils/multer/bufferStorage");
const upload = require ("../utils/multer/multerConfig")();





/**
 * @description - middleware for check the token
 * @method - tokenCheck
 * @param {object} req - request
 * @param {object} res - response
 * @param {function} next - next middleware
 * @returns {function} - next middleware
 */
const tokenCheck = require("../utils/user/tokenCheck");

/**
 * @description - route for add a user
 * @method - POST
 * @param {string} "/add" - path for add a user
 * @param {function} upload.fields - multer config for upload files
 * @param {function} validator - middleware for validate the body
 * @param {function} handlerController - middleware for handle the controller
 * @param {function} userController.create - controller for create a user
 * @returns {object} - return an object with the user created
 */
router.post(
  "/add",
  upload.fields([
    { name: "picture" },
  ]),
  validator(schema.user_create),


  handlerController(userController.create.bind(userController))
);

/**
 * @description - route for signin a user
 * @method - POST
 * @param {string} "/signin" - path for signin a user
 * @param {function} validator - middleware for validate the body
 * @param {function} handlerController - middleware for handle the controller
 * @param {function} userController.signin - controller for signin a user
 * @returns {object} - return an object with the user signin {token, user_id, pseudo}
 */
router.post("/signin", userController.signin.bind(userController));

/**
 * @description - route for logout a user
 * @method - POST
 * @param {string} "/logout" - path for logout a user
 * @param {function} tokenCheck - middleware for check the token
 * @param {function} handlerController - middleware for handle the controller
 * @param {function} userController.logout - controller for logout a user
 * @returns {object} - return an object with the user logout {message}
 */
router.post("/logout", tokenCheck, userController.logout.bind(userController));


/**
 * @description - route for get one user
 * @method - GET
 * @param {string} "/getOne/:id" - path for get one user
 * @param {function} tokenCheck - middleware for check the token
 * @param {function} handlerController - middleware for handle the controller
 * @param {function} userController.getOne - controller for get one user
 * @returns {object} - return an object with the user getted
 */
router.get(
  "/getOne/:id",
  tokenCheck,
  userController.getOne.bind(userController)
);


/**
 * @description - route for get all users
 * @method - GET
 * @param {string} "/getAll" - path for get all users
 * @param {function} tokenCheck - middleware for check the token
 * @param {function} handlerController - middleware for handle the controller
 * @param {function} userController.getAll - controller for get all users
 * @returns {object} - return an object with the users getted
 */
router.get("/getAll", tokenCheck, userController.getAll.bind(userController));


/**
 * @description - route for update a user
 * @method - PATCH
 * @param {string} "/update/:id" - path for update a user
 * @param {function} tokenCheck - middleware for check the token
 * @param {function} upload.fields - multer config for upload files
 * @param {function} validator - middleware for validate the body
 * @param {function} handlerController - middleware for handle the controller
 * @param {function} userController.update - controller for update a user
 * @returns {object} - return an object with the user updated
 */
router.patch(
  "/update/:id",
  tokenCheck,

  upload.fields([
    { name: "pseudo" },
    { name: "email" },
    { name: "firstname" },
    { name: "lastname" },
    { name: "picture" },
  ]),
  validator(schema.user_update),
  userController.update.bind(userController)
);

/**
 * @description - route for delete a user
 * @method - DELETE
 * @param {string} "/delete/:id" - path for delete a user
 * @param {function} tokenCheck - middleware for check the token
 * @param {function} handlerController - middleware for handle the controller
 * @param {function} userController.delete - controller for delete a user
 * @returns {object} - return an object with the user deleted
 */
router.delete(
  "/delete/:id",
  tokenCheck,
  userController.delete.bind(userController)
);

/**
 * @description - use the errorHandler middleware
 * @param {function} errorHandler - middleware for handle the errors, see utils/errorControl/errorHandler.js
 * @returns {object} - return an object with the error
 */
router.use(errorHandler);


/**
 * @description - export the router
 */
module.exports = router;







