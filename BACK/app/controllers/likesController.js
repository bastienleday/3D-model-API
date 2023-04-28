const coreController = require("./coreController");
const debug = require("debug")("3db: Likes");
const likesDatamapper = require("../datamappers/likesDatamapper");


/**
 * @description - controller for likes
 * @class - LikesController
 * @extends - coreController
 * @personallisedMethods - create, getCount
 * @param {object} dataMapper - dataMapper for likes
 * @returns {object} - return an instance of LikesController
 */
class LikesController extends coreController {
    static dataMapper = likesDatamapper;
    
    constructor() {
        super();
    }

    /**
     * @description - method for create or removed a like
     * @method - create
     * @param {object} req - request
     * @param {object} res - response
     * @param {function} next - next middleware
     * @returns {object} - return an object with the like created or removed and new likes count
     */
    async create(req, res, next) {
        
        
        /**
         * we send model_id from body and user_id from decoded token to dataMapper
         */
        const response = await this.constructor.dataMapper.create({model_id: req.params.id, user_id : req.decoded.id});
       debug("response", response)

        if (response instanceof Error) {
            return next(response);
        }

        if (response) {
            res.status(201).json(response);
        }

       
      
    

       
    }


    /**
     * @description - method for get likes count for one model
     * @method - getCount
     * @param {object} req - request
     * @param {object} res - response
     * @param {function} next - next middleware
     * @returns {object} - return an object with the likes count for one model
     */
    async getCount(req, res, next) {
        

        const response = await this.constructor.dataMapper.getCount({model_id: req.params.id});

        if (response instanceof Error) {
            return next(response);
        }

        if (response) {
            res.status(200).json(response);
        }

    }
}

/**
 * @description - export an instance of LikesController
 */
module.exports = new LikesController();