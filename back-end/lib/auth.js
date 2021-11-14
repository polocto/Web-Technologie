
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const config = require("./config");


module.exports = async (req,res, next)=>{
    const token = req.headers.authorization;
    console.log(token);
    try {
        if(!token)return res.status(403).send("Access denied");
        const header = JSON.parse(
            Buffer.from(
                token
                .split('.')[0], 'base64'
                ).toString('utf-8'));
        const {publicKey, rsaPublicKey} = await jwksClient({
            jwksUri: config.jwks_uri
        }).getSigningKey(header.kid);
    
        const key = publicKey || rsaPublicKey;
    
        const payload = jwt.verify(token,key);
        req.user = payload;
        console.log("Token Valide");
        next();
  
    } catch (error) {
        console.log("hello");
        res.status(400).send("Invalid Token");
    }
  }