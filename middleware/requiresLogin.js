const jwt = require("jsonwebtoken");
const User = require('../models/user');

const requiresLogin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message: "Not authorized"});
    } else {
        const token = authHeader.split(' ')[1];
        jwt.verify(token,process.env.JWT, (err, payload) => {
            if(err){
                return res.status(401).json({message: "Authorization error!"});
            }
            const {_id} = payload;
            User.findById(_id)
                .then(user => {
                    user.password = null;
                    req.user = user;
                    next();
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error: err});
                })
        });
    }
}

module.exports = requiresLogin;