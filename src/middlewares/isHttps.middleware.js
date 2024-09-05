import { isProduction } from "../app.js";

const isHttps = (req, res, next) => {
    console.log(isProduction);

    if (isProduction) {
        if (req.secure) {
            return next();
        }
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
};

export default isHttps;
