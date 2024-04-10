import userModel from "../models/userModel.js";
import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";
import { getKeyFromCookie } from "../utils/helpers.js";

export const VerifyJwt = async (req, res, next) => {
  console.log(req.route, req.pathname, req.originalUrl,req.headers.cookie,' cookies')
  console.log(req.cookies,req.signedCookies,' cookies2 ')
  console.log(req.header('cookie'),req.header("authorization"),req.header("Authorization"),' headers ')
  try {
    // req.cookies?.accessToken
    //
    console.log('::', "token1")
    const token = req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log('::',token, "token")
    // res.json({msg:'ok'})
    if (!token && token === "undefined") {
      throw new ApiError(404, "Invalid token");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (!decodedToken) {
      throw new ApiError(404, "Token Verify Failed")
    }
    const user = await userModel.findById(decodedToken._id).select("-password")
    console.log(user, "middleware")
    if (!user) {
      throw new ApiError(404, "User Not Found")
    }

    req.user = user
    next()
  } catch (error) {
    return{
      error: "unauthorization user"
    }
  }
};

