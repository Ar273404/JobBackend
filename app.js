import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { db } from "./database/db.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

dotenv.config({ path: "./config/config.env" });

// Define a route for '/'
app.get("/", (req, res) => {
  res.send("Server is Running!"); // Respond with a simple message
});

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL, // Frontend URL from environment
        "http://localhost:3000", // Localhost during development
      ];

      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true, // Allow credentials (cookies)
  })
);

// Middleware Setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File Upload Middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp", // Temporary file directory
  })
);

// Routers
app.use("/user", userRouter);
app.use("/application", applicationRouter);
app.use("/job", jobRouter);

// Database Connection
db();

// Error Middleware (always at the end)
app.use(errorMiddleware);

export default app;
