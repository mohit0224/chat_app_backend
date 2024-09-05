import rateLimit from "express-rate-limit";

const limiter = (max = 5) =>
    rateLimit({
        windowMs: 10 * 1000,
        max,
        statusCode: 429,
        message: "Too many requests, please try again later.",
        headers: true,
        handler: (req, res, next, options) => {
            res.status(options.statusCode).json({
                success: false,
                message: options.message,
            });
        },
    });

export default limiter;
