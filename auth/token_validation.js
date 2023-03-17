const jwt = require('jsonwebtoken');
require("dotenv").config();
module.exports = {
    checkToken: (req,res,next) => {
        let token = req.get("authorization");
        if(token){
            token = token.slice(7)
            jwt.verify(token, process.env.ACCESS_KEY,(err, decoded) => {
                if(err){
                    res.json({
                        success : 0,
                        message: "Invalid token"
                    });
                }
                else{
                    console.log(decoded)
                    next();
                }
            })
        }else{
            res.json({
                success: 0,
                message: "access denied! Unauthorized user!"
            })
        }
    }
}