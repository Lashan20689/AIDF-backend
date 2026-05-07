import express from 'express';
import "dotenv/config";
import hotelsRouter from './api/hotel';
import connectDB from './infrastructure/db';

import bookingsRouter from './api/booking';
import cors from "cors";
import globalErrorHandlingMiddleware from './api/middlewares/global-error-handling-middleware';
import { clerkMiddleware } from '@clerk/express';
import paymentsRouter from "./api/payment";
import { handleWebhook } from "./application/payment";
import bodyParser from "body-parser";



//set up the server

//create express instance
const app = express();

app.use(clerkMiddleware());
app.post(
    "/api/stripe/webhook",
    bodyParser.raw({ type: "application/json" }),
    handleWebhook
);
//Middleware parse Json request to body
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));
//connect to database
connectDB();


//set a pre middleware for a example 
/*app.use((req,res,next)=>{
    console.log("Hello world");
    next();
});*/


//import the routes
app.use("/api/hotels", hotelsRouter);

app.use("/api/booking", bookingsRouter);
app.use("/api/payments", paymentsRouter);

//define in last error handling middleware
app.use(globalErrorHandlingMiddleware);


//define thebport to run server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));





