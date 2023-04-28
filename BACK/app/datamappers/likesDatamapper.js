const coreDatamapper = require("./coreDatamapper");
const debug = require("debug")("3db: datamapper");
const pool = require("../utils/clientConnect");
const notFoundError = require("../utils/errorControl/notFoundError");


/**
 * @class likesDatamapper
 * @extends coreDatamapper
 * @personnalisedMethods create, getCount (this methods don't heritate from coreDatamapper)
 * @description Datamapper for likes
 * @param {string} tableName - Name of the table in the database
 * @returns {object} - instance of likesDatamapper
 */
class likesDatamapper extends coreDatamapper {
    static tableName = "model_has_like";
    constructor() {
        super();
    }

    /**
     * @method create
     * @description Create or removed a like, check if the user has already liked the model, if he has already liked the model we remove the like, if he has not liked the model we create the like
     * @param {object} id - id of the model and id of the user
     * @returns {object} - liked or unlike and new likes count
     */
    async create(id) {
        debug([Object.values(id)])
        /**
         * we need to check if the model exist
         * if the model does not exist we need to return an error
         * if the model exist we need to continue
         */
        const modelIdCheck = `SELECT * FROM model WHERE id = $1`;
        const modelIdCheckResponse = await pool.query(modelIdCheck, [Object.values(id)[0]]);
       

        if(modelIdCheckResponse.rowCount === 0) {
            return new notFoundError("model not found");
        }


       /**
        * we check if the user has already liked the post
        */
        const checkLike =  `SELECT * FROM ${this.constructor.tableName} WHERE model_id = $1 AND user_id = $2`;
        const responseCheckLike = await pool.query(checkLike, Object.values(id));
        debug(responseCheckLike.rows)

        /**
         * if the user has already liked the post we need to delete the like
         */
        if(responseCheckLike.rowCount > 0) {
            //he has already liked the post
            //we need to delete the like
            const deleteLikeQuery = `DELETE FROM ${this.constructor.tableName} WHERE model_id = $1 AND user_id = $2`
            const deleteLike = await pool.query(deleteLikeQuery, Object.values(id));
            
             const newLikeCountAfterDelete = `SELECT COUNT(*) FROM ${this.constructor.tableName} WHERE model_id = $1`;
             const deleteNewLikeCount = await pool.query(newLikeCountAfterDelete, [Object.values(id)[0]]);

            return {total_likes: deleteNewLikeCount.rows[0], status: "unliked"};

        }

        
        /**
         * if the user has not liked the post we need to create the like
         */
        
                const newLikeQuery = ` INSERT INTO ${this.constructor.tableName} (model_id, user_id) VALUES ($1, $2)`;
                const response = await pool.query(newLikeQuery, Object.values(id));
        
        
                const newLikeCountQuery = `SELECT COUNT(*) FROM ${this.constructor.tableName} WHERE model_id = $1 `;
                const newLikeCount = await pool.query(newLikeCountQuery, [Object.values(id)[0]]);
        
                debug("newLikeCount", newLikeCount.rows[0])
        
                if(response.rowCount === 0) {
                    return new notFoundError("not found");
                }
        
                return {total_likes: newLikeCount.rows[0], status: "liked"};
            }


            /**
             * @method getCount
             * @description Get the number of likes of a model
             * @param {object} id - id of the model
             * @returns {object} - number of likes
             */
            async getCount(id) {
                debug(id)

                //checkModelId

                const modelIdCheck = `SELECT * FROM "model" WHERE id = $1`;
                const modelIdCheckResponse = await pool.query(modelIdCheck, [Object.values(id)[0]]);
            

                if(modelIdCheckResponse.rowCount === 0) {
                    return new notFoundError("model not found");
                }

                const likeCount = `SELECT COUNT(*) FROM ${this.constructor.tableName} WHERE model_id = $1`;
                const likeCountResponse = await pool.query(likeCount, [Object.values(id)[0]]);

                return likeCountResponse.rows;
            }
        }
        
        module.exports = new likesDatamapper();
      
