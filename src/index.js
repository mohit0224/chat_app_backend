import mongoose from "mongoose";
import server, { isProduction } from "./app.js";
import dbConnect from "./database/index.js";
const PORT = process.env.PORT || 8000;

// dbConnect()
//     .then(() => {})
//     .catch((err) => {
//         console.error("Error connecting to the database:", err);
//         process.exit(1);
//     });

server.listen(PORT, () => {
    const message = isProduction
        ? `Server listening on ${PORT}`
        : `Server listening on http://localhost:${PORT}`;

    console.log(message);
});

// Handle SIGTERM signal for graceful shutdown
// process.on("SIGTERM", () => {
//     console.log("SIGTERM signal received: closing HTTP server");
//     server.close(() => {
//         console.log("HTTP server closed");
//         mongoose.connection.close();
//         console.log("MongoDb connection closed.");
//         process.exit(0);
//     });
// });

// Handle SIGINT (e.g., for local development)
// process.on("SIGINT", () => {
//     console.log("\nSIGINT signal received: closing HTTP server");
//     server.close(() => {
//         console.log("HTTP server closed");
//         mongoose.connection.close();
//         console.log("MongoDb connection closed.");
//         process.exit(0);
//     });
// });


