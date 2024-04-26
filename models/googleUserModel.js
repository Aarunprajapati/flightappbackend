import mongoose from "mongoose";
import jwt from "jsonwebtoken"
const googleSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      image:{
        type: String,
        default:""
      }
    },
    { timestamps: true },
  );

  googleSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_GOOGLETOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_GOOGLETOKEN_EXPIRY
        }
    )
}
const googleUser = mongoose.model("googleUsers", googleSchema)
export default googleUser;