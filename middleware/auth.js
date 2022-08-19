const jwt = require("jsonwebtoken");


function verify(req,res,next){
    try{
        let token = req.header("token")
        if(!token){
            return res.json({status:"failure",message:"token not recived"})
        }
        const decode = jwt.verify(token,process.env.JWTKEY);
        
         next();
        // return res.json({status:"success",message:"token value","result":decode})
        
    }catch(err){
        return res.json({"err":err.message})
    }
}

module.exports = verify