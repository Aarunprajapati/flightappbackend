import mongoose from 'mongoose';
import { type } from 'os';

const bookingSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flight",
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    fare: {
        type: String,
        required: true
    },
    code: {
        dial_code: {
            type: String,
            required: true
        }
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    members: [{
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        },
        Gender:{
            type: String,
            required: true
        },
        Nationality:{
            type: String,
            required: true
        },
}],
}, {
    timestamps: true
});



const BookingModel = mongoose.model("booking", bookingSchema);
export default BookingModel;
