import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
    hotelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hotel',
        required:true,
    },
    userId:{
        type: String,
        // ref:'User', here we not ref user because we get user id from clerk session and we dont have user schema in our database
        required:true,
    },
    checkIn:{
        type:Date,
        required:true,
    },
    checkOut:{
        type:Date,
        required:true,
    },
    roomNumber:{
        type:Number,
        required:true,
    },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING",
      },
      paymentMethod: {
        type: String,
        enum: ["CARD", "BANK_TRANSFER"],
        default: "CARD",
      },

});

const Booking =mongoose.model("Booking",bookingSchema);
export default Booking;