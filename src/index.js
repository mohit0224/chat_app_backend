import mongoose from "mongoose";
import server, { isProduction } from "./app.js";
import dbConnect from "./database/index.js";
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    const message = isProduction
        ? `Server listening on ${PORT}`
        : `Server listening on http://localhost:${PORT}`;

    console.log(message);
});

// dbConnect()
//     .then(() => {})
//     .catch((err) => {
//         console.error("Error connecting to the database:", err);
//         process.exit(1);
//     });


