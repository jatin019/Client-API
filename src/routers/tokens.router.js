const express = require("express");
const router = express.Router();
const {verifyRefreshJWT, createAccessJWT} = require("../helpers/jwt.helper");
const {getUserByEmail} = require("../model/user/User.model");


//return refresh jwt
router.get("/", async(req, res, next) => {
    const {authorization} = req.headers

    //TODO
    // 1. make sure the token is valid
    const decoded = await verifyRefreshJWT(authorization)
    if(decoded.email){
        // 2. check if the jwt is exist in database 
        const userProfile = await getUserByEmail(decoded.email)

        if(userProfile._id){
         
            let tokenExp = userProfile.refreshJWT.addedAt
            const dBrefreshToken = userProfile.refreshJWT.token;

            tokenExp = tokenExp.setDate(tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY)
            
            const today = new Date();

            if(dBrefreshToken !== authorization && tokenExp < today){
                return res.status(403).json({message: "Forbidden"});

                
            }
                // 3. check if it is not expired
                const accessJWT = await createAccessJWT(decoded.email, userProfile._id.toString())

                return res.json({status:"success",accessJWT})

        }

        //delete old token from redis db

        

    }
    // 2. check if the jwt is exist in database 

    res.status(403).json({message: "Forbidden"})
   
});

module.exports = router;
