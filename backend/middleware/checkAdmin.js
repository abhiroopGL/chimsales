const admin = (req, res, next) => {
    // Check if the user has admin role
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed to the next middleware or route handler
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied. Admins only."
        }); // User is not admin, send forbidden response
    }
}

module.exports = { admin };