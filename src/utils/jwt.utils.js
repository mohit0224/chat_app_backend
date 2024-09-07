import jwt from "jsonwebtoken";
import envConfig from "../config/env.config.js";
import { apiError } from "./httpresponse.utils.js";

const verifyToken = (token) => {
    try {
        return jwt.verify(token, envConfig.JWT_SECRET);
    } catch (err) {
        throw new apiError(
            400,
            `Something went wrong, while verifying token. :: ${err.message}`
        );
    }
};

export default verifyToken;
