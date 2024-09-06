import { isProduction } from "../app.js";
import envConfig from "../config/env.config.js";
import asyncHandler from "../utils/asynchandler.utils.js";
import { apiResponse } from "../utils/httpresponse.utils.js";

const cookieOptions = (time) => {
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: "Strict",
        maxAge: time,
        domain: envConfig.FRONTEND_URI,
    };
};

export const createAccount = asyncHandler(async (req, res) => {
    res.cookie("token", "mohit-dheer", cookieOptions(5 * 60 * 1000))
        .status(200)
        .json(new apiResponse(200, "user created"));
});

export const getUser = asyncHandler(async (req, res) => {
    const token = req.user;
    const data = {
        username: token,
        pass: "dfnvbsdnvb76sdf9v76sd8f7",
    };
    res.status(200).json(new apiResponse(200, "get user", data));
});
