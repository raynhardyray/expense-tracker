export const errorHandler = (err, req, res, next) => {
    console.error('Error Path:', req.path);
    console.error('Message:', err.message);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        error: err.message || 'Server Error',
        stack: err.stack,
    });
};