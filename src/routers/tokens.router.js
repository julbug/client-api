const express = require("express");
const router = express.Router();

const {verifyRefreshJWT, createAccessJWT} = require("../helpers/jwt.helper");
const {getUserByEmail} = require("../model/user/User.model");

//return refresh jwt
router.get("/", async (req, res, next) => {
    const {authorization} = req.headers;

    //1. make sure the token is valid
    const decoded = await verifyRefreshJWT(authorization);
    if(decoded.email){
        //2. check if the jwt is existing in the database
        const userProf = await getUserByEmail(decoded.email);

        if(userProf._id){
            res.status(403).json({ message: userProf });
            let tokenExp = userProf.refreshJWT.addedAt;
            const dBrefreshToken = userProf.refreshJWT.token;
            
            tokenExp = tokenExp.setDate(
                token.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
                );

                //3. check if it is not expired
                const today = new Date();
                if(dBrefreshToken !== authorization && tokenExp < today){
                    //expired
                    return res.status(403).json({ message: "Forbidden" });
                } 
                const accessJWT = await createAccessJWT(
                    decoded.email,
                    userProf._id.toString()
                    );

                return res.json({status: "success", accessJWT});
        }
    }
    
    res.status(403).json({ message: "Forbidden" });
});

module.exports = router;