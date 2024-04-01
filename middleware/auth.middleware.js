import userModel from "../models/userModel.js";
import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken"
export const VerifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      if(!token){
        throw new ApiError(404, "Invalid token")
      }
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    if(!decodedToken){
        throw new ApiError(404, "Token Verify Failed")
    }
    const user = await userModel.findById(decodedToken._id).select("-password")

    if(!user){
        throw new ApiError(404, "User Not Found")
    }

    req.user = user
    next()
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while accesstoken in middlware",
    );
  }
};
