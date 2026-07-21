// responseFormatter.js - Standardizes all API responses
const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const errorResponse = (res, statusCode = 500, message = 'An error occurred', error = null) => {
    const response = {
        success: false,
        message
    };
    if (process.env.NODE_ENV === 'development' && error) {
        response.error = error;
    }
    return res.status(statusCode).json(response);
};

module.exports = { successResponse, errorResponse };
