import { isProduction } from "../app.js";
import { apiResponse } from "../utils/httpresponse.utils.js";

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
        return res.status(400).json(new apiResponse(400, err.message));
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
        return res.status(400).json(new apiResponse(400, err.message));
    }
};
