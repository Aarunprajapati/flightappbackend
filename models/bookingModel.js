import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flight",
        required: true
    },
    code: {
        dial_code: {
            type: String,
            required: true
        }
    },
    phone:{
        type:String,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },    
    Nationality:{
        type:String,
        required:true,
    },
    
    email:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
},{
    timestamps:true
})


const BookingModel = mongoose.model("booking", bookingSchema)
export default BookingModel;