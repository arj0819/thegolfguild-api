const jwt = require('jsonwebtoken');

module.exports = (apiRequest, apiResponse, next) => {
    try {
        const token = apiRequest.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_KEY,
        )
        apiRequest.userData = decoded
        next();
    } catch (error) {
        return apiResponse.status(401).json({
            message: 'You are not authorized to access this endpoint.'
        })
    }
};