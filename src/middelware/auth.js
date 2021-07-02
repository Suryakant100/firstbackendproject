const jwt = require('jsonwebtoken');
// const cookies_parser = require("cookie-parser");

const Register = require("../model/scema");


const auth = async(req,res,next)=>{

    try {
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token , process.env.SECRET_KEY);
        console.log(verifyuser);

        const user = await Register.findOne({_id:verifyuser._id});
        // console.log(user);
          
        req.user=user;
        req.token=token;

        next();
    } catch (error) {
        res.status(401).send(error);
    }
  
}

module.exports = auth;