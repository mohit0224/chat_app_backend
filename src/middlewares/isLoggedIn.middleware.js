import { apiResponse } from "../utils/httpresponse.utils.js";

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
        return res
            .status(400)
            .json(new apiResponse(400, "Invalid token or token not found"));
    }
};

export default isLoggedIn;
