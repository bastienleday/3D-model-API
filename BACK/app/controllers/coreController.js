
const debug = require("debug")("3db: CoreControllers");
const updateUser = require("../utils/user/updateUser");


/**
 * @description - controller for core, basic CRUD class, all other controllers will inherit from this class
 * @class - CoreController
 * @param {object} dataMapper - dataMapper for the controller
 * @returns {object} - return an instance of CoreController
 */
class CoreController {
  static dataMapper;


  /**
   * @description - method for get all 
   * @method - getAll
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next - next middleware
   * @returns {object} - return an object with all data
   */
  async getAll(req, res, next) {



    const data = req.body;
    const response = await this.constructor.dataMapper.getAll(data);


    if (response) {
      res.status(200).json(response);
    }
  }

  /**
   * @description - method for get one
   * @method - getOne
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next - next middleware
   * @returns {object} - return an object with one data
   */
  async getOne(req, res, next) {

    const id = req.params.id;

    const response = await this.constructor.dataMapper.getOne(id);
    debug("getOne OK", response);
    if (response instanceof Error) {
      return next(response);
    }

    if (response) {
      res.status(200).json(response);
    }
  }

  /**
   * @description - method for create
   * @method - create
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next - next middleware
   * @returns {object} - return an object with the data created
   */
  async create(req, res, next) {

    debug("create OK");


    const response = await this.constructor.dataMapper.create(req.body);
    if (response) {
      res.status(201).json(response);
    }
  }

  /**
   * @description - method for update
   * @method - update
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next - next middleware
   * @param {function} updateUser - function for update user, import from utils see utils/user/updateUser.js
   * @returns {object} - return an object with the data updated
   */
  async update(req, res, next) {

    let data = req.body;
  

    if (req.files.picture) {
      const picture = req.files.picture[0].buffer;
      data = { ...req.body, picture };
    }

    const response = await updateUser(req, res, next, data);

    if (response instanceof Error) {
      return next(response);
    }

    if (response) {
      res.status(200).json(response);
    }
  }

  /**
   * @description - method for delete
   * @method - delete
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next - next middleware
   * @returns {object} - return an object with the data deleted
   */
  async delete(req, res, next) {
    const response = await this.constructor.dataMapper.delete(req.params.id);

    if (response instanceof Error) {
      return next(response);
    }

    if (response) {
      res.status(200).json(response);
    }
  }
}

/**
 * @description - export CoreController
 */
module.exports = CoreController;
