import mongoose  from "mongoose";

const connectDB = async ()=>{
    try{
        const MONGODB_URL=process.env.MONGODB_URL;
        if(!MONGODB_URL){
            throw new Error("MONGODB_URL is not defined in environment variables");
        }
        await mongoose.connect(MONGODB_URL);
        console.log("mongoDB connected");
    }catch(error){
        console.log("mongoDB connection failed");
        console.log("error");
    }

};

export default connectDB;
//lashan1190720689_db_user