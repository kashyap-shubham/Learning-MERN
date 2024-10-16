const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({
            message: "Authorization token missing or malformed"
        });
    }

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return res.status(401).json({
    //         message: "Authorization token missing or malformed"
    //     });
    // }

    // const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'
    const token = authHeader;
    
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user ID to the request for further use
        req.userId = decodedToken.id;
        req.email = decodedToken.email;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expired, please login again"
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token, please provide a valid token"
            });
        }

        console.error('Token verification error:', error);
        return res.status(500).json({
            message: "Internal server error during authentication"
        });
    }
}

module.exports = { auth };