import { apiError, apiResponse } from "../utils/httpresponse.utils.js";

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
        throw new apiError(400, "Invalid");

        // return res.status(400).json({
        //     message: "Invalid",
        //     success: false,
        // });
    }
};

export default isLoggedIn;
