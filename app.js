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


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);
// app.use((req, res, next) => {
//   const allowedOrigin = process.env.FRONTEND_URL; // Use FRONTEND_URL from the environment
//   if (allowedOrigin) {
//     res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
//   } else {
//     console.warn("FRONTEND_URL is not set in the environment variables!");
//   }
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });


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