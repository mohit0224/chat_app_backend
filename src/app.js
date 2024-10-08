import "dotenv/config.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import socketConfig from "./config/socket.config.js";
import morgan from "morgan";
import { morganFnc, morganFormat } from "./config/morgan.config.js";
import helmet from "helmet";
import helmetConfig from "./config/helmet.config.js";
import cors from "cors";
import corsConfig from "./config/cors.config.js";
import cookieParser from "cookie-parser";
import compression from "compression";
import isHttps from "./middlewares/isHttps.middleware.js";
import healthRouter from "./routes/health.routes.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.middleware.js";
import socketProvider from "./provider/socketProvider.provider.js";

const app = express();
const server = createServer(app);
export const io = new Server(server, socketConfig);
export const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);
app.use(isHttps);
app.use(cors(corsConfig));
app.use(helmet(helmetConfig));
app.use(morgan(morganFormat, morganFnc));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(compression());

socketProvider(io);

app.get("/", (req, res) => res.send("Hello world !!"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/health-check", healthRouter);
app.use("/api/v1/messages", messageRouter);

app.use(globalErrorHandler);

export default server;
