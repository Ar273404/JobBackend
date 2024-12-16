import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js'
import jobRouter from './routes/jobRouter.js'
import applicationRouter from './routes/applicationRouter.js'
import { db } from './database/db.js';
import { errorMiddleware } from './middlewares/error.js';


const app = express();

dotenv.config({path:'./config/config.env'});



// Define a route for '/'
app.get('/', (req, res) => {
  res.send('Server is Running!'); // Respond with a simple message
});


// app.use(
//   cors({
//     origin: [process.env.FRONTED_URL, "http://localhost:3000"],
//     methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
//     credentials: true,
//   })
// );
app.use((req, res, next) => {
  const allowedOrigins = ["https://jobfrontend-qng1.onrender.com"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, DELETE, PUT, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  if (req.method === "OPTIONS") {
    res.status(204).end(); // Handle preflight request
    return;
  }

  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/temp",
}));

app.use("/user",userRouter);
app.use("/application",applicationRouter);
app.use("/job",jobRouter);

//database
db();

//error middleware in last
app.use(errorMiddleware);

export default app;