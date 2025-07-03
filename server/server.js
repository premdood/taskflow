import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import notFoundMiddleware from "./src//middleware/not-found-middleware.js";
import { FRONTEND_URL, NODE_ENV, SERVER } from "./src/config/config.js";
import connectDB from "./src/db/connect.js";
import errorHandlerMiddleware from "./src/middleware/error-handler-middleware.js";
import mainRouter from "./src/routes/index-route.js";

const app = express();

app.use(
  cors({
    origin: NODE_ENV === "development" ? true : FRONTEND_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", mainRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    app.listen(SERVER.PORT, () => {
      console.log(`server is listening on port ${SERVER.PORT}...`);
    });
    await connectDB();
    console.log("Connected to DB...");
  } catch (error) {
    console.log("Unable to connect to DB...");
    console.error(error);
  }
};

start();
