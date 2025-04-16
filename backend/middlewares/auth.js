const jwt = require("jsonwebtoken");

const checkForAuthentication = async (req, res, next) => {
    console.log("Token is:",token);
    if (!token)
        return next();
    try {
        const decoded = jwt.verify(token, "abhiroop");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorised user!",
        });
    }
};

module.exports = { checkForAuthentication };