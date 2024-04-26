import userModel from "../models/userModel.js";
import googleUser from "../models/googleUserModel.js";
import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";

export const VerifyJwt = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
    const googleToken = req.cookies?.googleToken;

    if (!accessToken && !googleToken) {
      return res.status(400).json({ message: "No tokens provided" });
    }

    let user = null;
    let googleUserInstance = null;
    let errors = [];

    if (accessToken && accessToken !== "undefined") {
      try {
        const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        user = await userModel.findById(decodedAccessToken._id).select("-password");
        if (!user) {
          errors.push("User not found from accessToken");
        }
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (googleToken && googleToken !== "undefined") {
      try {
        const decodedGoogleToken = jwt.verify(googleToken, process.env.ACCESS_GOOGLETOKEN_SECRET);
        googleUserInstance = await googleUser.findById(decodedGoogleToken._id);
        if (!googleUserInstance) {
          errors.push("Google user not found from googleToken");
        }
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (!user && !googleUserInstance) {
      return res.status(400).json({ message: "Authentication failed: " + errors.join(", ") });
    }

    req.user = user;
    req.googleuser = googleUserInstance;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
