import mongoose from "mongoose";
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      dob: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
       
      },
      profilePic: {
        type: String,
        default: "",
      },
    },
    { timestamps: true },
  );

userSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const userModel = mongoose.model("user", userSchema)
export default userModel;