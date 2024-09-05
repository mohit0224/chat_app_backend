import { apiError } from "../utils/httpresponse.utils.js";

const isLoggedIn = (req, res, next) => {
    const { token } = req.cookies;

    if (token) {
        // const checkToken = verifyToken(token);

        // if (checkToken) {
        //     req.user = checkToken;
        //     next();
        // }
        req.user = token;
        next();
    } else {
        res.status(err.status).json({
            message: err.message,
            status: err.status,
            success: err.success,
        });
    }
};

export default isLoggedIn;
