const envConfig = {
    MONGODB_URI: String(process.env.MONGODB_URI),
    MONGODB_DBNAME: String(process.env.MONGODB_DBNAME),
    JWT_SECRET: String(process.env.JWT_SECRET),
    BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT),
};

export default envConfig;
