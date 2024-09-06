import { isProduction } from "../app.js";

const isHttps = (req, res, next) => {
    if (
        req.headers["x-forwarded-proto"] !== "https" &&
        req.hostname !== "localhost"
    ) {
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    next();
};

export default isHttps;
