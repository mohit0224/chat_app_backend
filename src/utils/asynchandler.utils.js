const asyncHandler = (func) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next))
            .then(() => {
                if (!res.headersSent) {
                    next();
                }
            })
            .catch((err) => {
                if (!res.headersSent) {
                    next(err);
                }
            });
    };
};

export default asyncHandler;
