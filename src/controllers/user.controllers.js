import { isProduction } from "../app.js";
import { apiError, apiResponse } from "../utils/httpresponse.utils.js";

const cookieOptions = (time) => {
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: "Strict",
        maxAge: time,
    };
};

export const createAccount = async (req, res) => {
    try {
        res.cookie("token", "mohit-dheer", cookieOptions(5 * 60 * 1000))
            .status(200)
            .json(new apiResponse(200, "user created"));
    } catch (err) {
        res.status(err.status).json({
            message: err.message,
            status: err.status,
            success: err.success,
            errors: err.errors,
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const token = req.user;
        const data = {
            username: token,
            pass: "dfnvbsdnvb76sdf9v76sd8f7",
        };
        res.status(200).json(new apiResponse(200, "get user", data));
    } catch (err) {
        res.status(err.status).json({
            message: err.message,
            status: err.status,
            success: err.success,
            errors: err.errors,
        });
    }
};
