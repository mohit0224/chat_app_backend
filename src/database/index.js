import mongoose from "mongoose";
import envConfig from "../config/env.config.js";

const dbConnect = async () => {
    try {
        const { connection } = await mongoose.connect(envConfig.MONGODB_URI, {
            dbName: envConfig.MONGODB_DBNAME,
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
        });

        if (connection.readyState === 1) {
            console.log("Database is connected to server");
        }

        // Event listeners to monitor the connection status
        connection.on("disconnected", () => {
            console.error("MongoDB disconnected! Attempting to reconnect...");
        });

        connection.on("reconnected", () => {
            console.log("MongoDB reconnected successfully");
        });

        connection.on("error", (err) => {
            console.error("MongoDB error:", err);
        });
    } catch (err) {
        throw new Error(err.message);
    }
};

export default dbConnect;
