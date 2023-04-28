const express = require('express');
const handlerController = require('../controllers/handlerController');
const likesController = require('../controllers/likesController');
const tockenCheck = require('../utils/user/tokenCheck');
const errorHandler = require('../utils/errorControl/errorHandler');

const router = express.Router();


/**
 * @description - route for add or remove a like for a model
 * @method - POST
 * @param {string} "/add/:id" - path for add or remove a like for a model
 * @param {function} tockenCheck - middleware for check the token
 * @param {function} handlerController - middleware for handle the controller
 * @param {function} likesController.create - controller for add or remove a like for a model
 * @returns {object} - return an object with the like created or removed, return new like count
 */
router.post('/add/:id', tockenCheck, handlerController(likesController.create.bind(likesController)));

/**
 * @description - route for get the like count for a model
 * @method - GET
 * @param {string} "/getCount/:id" - path for get the like count for a model
 * @param {function} handlerController - middleware for handle the controller
 * @param {function} likesController.getCount - controller for get the like count for a model
 * @returns {object} - return an object with the like count
 */
router.get('/getCount/:id', handlerController(likesController.getCount.bind(likesController)));


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