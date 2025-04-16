const jwt = require("jsonwebtoken");
const JWT_SECRET = 'abhiroop'

const generateToken = (res, userId) => {
    console.log("Generating token with secret");
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "15d"
    });
    console.log("Token Generated:",token);
    return token;
};

module.exports = generateToken;
