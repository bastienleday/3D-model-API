const express = require("express");

const categoryController = require("../controllers/categoryController.js");
const handlerController = require("../controllers/handlerController");
const errorHandler = require("../utils/errorControl/errorHandler");


const router = express.Router();

/**
 * @description - route for get all categories
 * @method - GET
 * @param {string} "/" - path for get all categories
 * @param {function} handlerController - middleware for handle the controller
 * @param {function} categoryController.getAll - controller for get all categories
 * @returns {object} - return an object with all categories
 */
router.get("/", handlerController(categoryController.getAll.bind(categoryController)));

/**
 * @description - route for get a category
 * @method - GET
 * @param {string} "/:id" - path for get a category
 * @param {function} handlerController - middleware for handle the controller
 * @param {function} categoryController.getOne - controller for get a category
 * @returns {object} - return an object with the category
 */
router.get("/:id", handlerController(categoryController.getOne.bind(categoryController)));


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
