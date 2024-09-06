import { apiError } from "../utils/httpresponse.utils.js";

const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof apiError) {
        res.status(err.status).json({
            message: err.message,
            status: err.status,
            success: err.success,
            errors: err.errors,
        });
    } else {
        res.status(500).json({
            message: err.message,
            status: 500,
            success: false,
            errors: [],
        });
    }
};

export default globalErrorHandler;
