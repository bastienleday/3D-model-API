
const debug = require("debug")("3db: tokenCheck");
const tokenError = require("../errorControl/tokenError");
const jwt = require("jsonwebtoken");
const modelDatamapper = require("../../datamappers/modelDatamapper");
const isTokenExpired = require('./isTokenExpired');


/**
 * @description - middleware for check if the user is connected
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next middleware
 * @returns {object} - return an object with the error or pass to next middleware
 */
const tokenCheck = async (req, res, next) => {
 debug("tokenCheck OK");
 const authHeader = req.headers.authorization;

 if(!authHeader) {
    const err = new tokenError("you need to be connected");
    return next(err);
  }

  const token = authHeader.split(" ")[1]; // si on utilise le bearer token dans le header de la requete on split pour recuperer le token seulement et pas le bearer qui est dans le header
 

 /**
  * @description - regex for check if the user is trying to update or delete a user, for this road wee need to check if the decode token user id is the same as the model.user_id or user.id
  * @type {RegExp}
  */
  const updateRouteUserPattern = /^\/api\/user\/update\/\d+$/;
  const deleteRouteUserPattern = /^\/api\/user\/delete\/\d+$/;
  const updateRouteModelPattern = /^\/api\/model\/\d+$/;
  const deleteRouteModelPattern = /^\/api\/model\/\d+$/;

//use this for jwt send with cookie
  // const token = req.cookies.jwt;

 

  const decoded = jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){ // on verifie le token avec la clef secrete
    if(err){
      const err = new tokenError("invalid or expired token");
    return next(err);

    }
    return decoded
  })
  
  
  
  
  req.decoded = decoded // on ajoute le decoded token a la requete pour pouvoir l'utiliser dans les routes

  
    /**
     * we check if the user is trying to update or delete a user
     */
    if (
      updateRouteUserPattern.test(req.originalUrl) || // on verifie si l'url de la requete correspond a la route pour update ou delete un user
      deleteRouteUserPattern.test(req.originalUrl) // on verifie si l'url de la requete correspond a la route pour update ou delete un user
     
    ) {
  
  
      //we compare the token.id with the user id in the url
  
      if (Number(req.params.id) !== decoded.id) { // on verifie si l'id du user dans l'url est le meme que l'id du user dans le token
  
        const err = new tokenError("you can't update or delete this");
        return next(err);
      }
    }
  
  /**
   * we check if the user is trying to update or delete a model
   */
    if (
      
      updateRouteModelPattern.test(req.originalUrl) ||
      deleteRouteModelPattern.test(req.originalUrl)
    ) {
      
     //we nedd to check if the user id of model is the same as the token id
      const model = await modelDatamapper.getOne(req.params.id); // on recupere le model avec l'id de l'url
      debug("model", model.id); // on affiche l'id du model
      debug("decoded", decoded.id) // on affiche l'id du token
  
  
      
      if (model.user_id !== decoded.id) {
       
        const err = new tokenError("you can't update or delete this");
        return next(err);
      }
    }
  
  
    next();
  };
  

  /**
   * @description - export the middleware tokenCheck
   */
  module.exports = tokenCheck;
  
    
    
 

 

