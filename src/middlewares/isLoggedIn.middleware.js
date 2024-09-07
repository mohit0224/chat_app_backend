import { apiError } from "../utils/httpresponse.utils.js";
import verifyToken from "../utils/jwt.utils.js";

const isLoggedIn = (req, res, next) => {
    const { token } = req.cookies;

    if (token) {
        const checkToken = verifyToken(token);

        if (checkToken) {
            req.user = checkToken;
            next();
        }
    } else {
        throw new apiError(400, "Invalid token or token not found");
    }
};

export default isLoggedIn;
