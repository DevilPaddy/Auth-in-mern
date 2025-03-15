const jwt = require('jsonwebtoken');

const verifyToken = async(req , res, next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(400).json({message: "Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(400).json({message: "Unauthorized...invalid token or token expired"});
        }

        req.userId = decoded.userId;
        next();
    }
    catch(err){
        console.log("error in verifyToken...",err);
        return res.status(400).json({message: "something went wrong..."});
    }
}

module.exports = verifyToken;