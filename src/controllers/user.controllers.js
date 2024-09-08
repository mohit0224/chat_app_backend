import { isProduction } from "../app.js";
import User from "../models/user.models.js";
import { loginSchema, regesterSchema } from "../schema/user.schema.js";
import asyncHandler from "../utils/asynchandler.utils.js";
import { apiResponse, apiError } from "../utils/httpresponse.utils.js";

const cookieOptions = (cookieExpiry) => {
    return {
        maxAge: cookieExpiry,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Strict",
        path: "/",
    };
};

export const createAccount = asyncHandler(async (req, res) => {
    const { error } = regesterSchema.validate(req.body);
    if (error) {
        throw new apiError(400, error.details[0].message);
    }

    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new apiError(400, "User with this email already exists.");
    }

    const newUser = new User({ email, username, password });
    const createdUser = await newUser.save();

    res.status(201).json(new apiResponse(201, "user created", createdUser));
});

export const loginAccount = asyncHandler(async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        throw new apiError(400, error.details[0].message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new apiError(400, "Invalid credentials !!");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new apiError(400, "Invalid credentials !!");
    }

    const token = user.getSignedJwtToken();

    res.cookie("token", token, cookieOptions(30 * 24 * 60 * 60 * 1000))
        .status(200)
        .json(new apiResponse(200, "LoggedIn successfully !!", token));
});

export const getUser = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const user = await User.findById(id).select("-password");
    if (!user) {
        throw new apiError(404, "User not found");
    }

    res.status(200).json(new apiResponse(200, "Get loggedIn user !!", user));
});

export const logoutAccount = asyncHandler(async (req, res) => {
    res.clearCookie("token")
        .status(200)
        .json(new apiResponse(200, "Logout successfully !!"));
});

export const getAllUser = asyncHandler(async (req, res) => {
    const allUsers = await User.find({
        _id: { $ne: req.user.id },
    }).select("-password");

    if (!allUsers.length) {
        throw new apiError(404, "No users found.");
    }

    res.status(200).json(
        new apiResponse(200, "Users retrieved successfully", allUsers)
    );
});
