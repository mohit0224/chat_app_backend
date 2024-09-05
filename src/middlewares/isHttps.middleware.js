import { isProduction } from "../app.js";

const isHttps = (req, res, next) => {
    if (isProduction) {
        console.log("🚀 ~ isHttps ~ isProduction:", isProduction);

        if (req.secure) {
            console.log("🚀 ~ isHttps ~ req.secure:", req.secure);
            return next();
        }
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
    return next();
};

export default isHttps;
