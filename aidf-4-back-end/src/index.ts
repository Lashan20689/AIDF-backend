import express from 'express';
import hotelsRouter from './api/hotel';
import connectDB from './infrastructure/db';
import "dotenv/config";
import bookingsRouter from './api/booking';
import cors from "cors";
import globalErrorHandlingMiddleware from './api/middlewares/global-error-handling-middleware';
import { clerkMiddleware } from '@clerk/express';



//set up the server

//create express instance
const app = express();

app.use(clerkMiddleware());
//Middleware parse Json request to body
app.use(express.json());
app.use(cors());
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

//define in last error handling middleware
app.use(globalErrorHandlingMiddleware);


//define thebport to run server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));





