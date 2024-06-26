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
      
    },
    phoneNumber: {
      type: String,
     
    },
    gender: {
      type: String,
    
    },
    profilePic: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: false
    },
    deletionDate: {
      type: Date,
      default: null
    }
  },
  { timestamps: true },
);

userSchema.methods.generateAccessToken = async function () {
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