const helmetConfig = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'", process.env.FRONTEND_URI],
            scriptSrc: ["'self'", process.env.FRONTEND_URI],
            styleSrc: ["'self'", process.env.FRONTEND_URI],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", process.env.FRONTEND_URI],
            connectSrc: ["'self'", process.env.FRONTEND_URI],
            frameSrc: ["'self'"],
            objectSrc: ["'none'"],
        },
    },
    frameguard: {
        action: "deny",
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    referrerPolicy: {
        policy: "strict-origin-when-cross-origin",
    },
    hidePoweredBy: true,
    noSniff: true,
    ieNoOpen: true,
    xssFilter: true,
};

export default helmetConfig;
