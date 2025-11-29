const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization');

    // Check if no token
    if (!token) {
        return res.status(401).json({ status: false, message: 'No token, authorization denied' });
    }

    // Verify token (Bearer <token>)
    try {
        const bearer = token.split(' ');
        const tokenVal = bearer[1];
        const decoded = jwt.verify(tokenVal, process.env.JWT_SECRET || 'secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ status: false, message: 'Token is not valid' });
    }
};