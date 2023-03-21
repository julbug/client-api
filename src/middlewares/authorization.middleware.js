const {verifyAccessJWT} = require("../helpers/jwt.helper");
const {getJWT, deleteJWT} = require("../helpers/redis.helper");


const userAuthorization = async (req, res, next) => {
    const {authorization} = req.headers;
    console.log(authorization);

    //1. verify if JWT is valid
    const decoded = await verifyAccessJWT(authorization);

    if(decoded.email){

         //2. check if JWT exists in redis
         const userId = await getJWT(authorization);

         if(!userId){
          //If response isn't valid, Forbidden message
            res.status(403).json({message: "Forbidden"});
         }

         req.userId = userId;
         
         //if valid, next
         return next();
    }

    deleteJWT(authorization);
    return res.status(403).json({message: "Forbidden"});
    
};

module.exports = {
    userAuthorization,
};