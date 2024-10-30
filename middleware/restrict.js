const jwt = require('jsonwebtoken');
let {JWT_SECRET_KEY}   = process.env;

module.exports = async(req,res,next ) => {
    const {authorization} = req.headers;
    if(!authorization || !authorization.startsWith('Bearer ')){
        return res.status(401).json({
            status: false,
            message: "Unauthorized",
            data: null
        });
    }
    const token = authorization.split(' ')[1];
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({
                status: false,
                message: "Unauthorized",
                err: err.message,
                data: null
            });
        }
        req.user = decoded;
        next();
    });
}