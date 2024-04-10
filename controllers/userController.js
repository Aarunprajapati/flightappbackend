
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Domain } from "domain";

const generateFreshAccessToken = async function (userId) {
  const user = await userModel.findById(userId);
  const accessToken = await user.generateAccessToken();
  return { accessToken };
};

const userController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!(name && email && password)) {
        return res
          .status(200)
          .json({ error: "Please provide all the required details" });
      }
      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      const options = {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: 'none',
      };
      const accessToken = await user.generateAccessToken();
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { success: "Register Successfully" }));
    } catch (error) {
      new ApiError(500, error.message || "Internal Server Error");
    }
  },
  async login(req, res) {
    const { email, password } = req.body;
    try {
      if (!(email && password)) {
        return res
          .status(400)
          .json({ error: "Please provide email and password" });
      } else {
        const user = await userModel.findOne({ email });
        if (!user)
          return res.status(400).json({ error: "Invalid Email or Password" });
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          res.status(404).json({ message: "Invalid Password" });
        }

        const options = {
          httpOnly: true,
          path: "/",
          secure: true,
          sameSite: "none",
          

        };

        const { accessToken } = await generateFreshAccessToken(user._id);
        res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .json(
            new ApiResponse(200, {
              success: "User login successfully",
              accessToken,
            }),
          );
      }
    } catch (error) {
      throw new ApiError(500, "Internal Server Error");
    }
  },
  async loggeduser(req, res) {
    res.send({ user: req.user });
  },
  async logOut(req, res) {
    // const user = await userModel.findByIdAndUpdate(req.user._id);
    // if (!user) return null;
    // const options = {
    //   httpOnly: true,
    //   secure: true,
    //   path: "/",
    //   sameSite: "none"
    // }
    // res.status(200)
    //   .clearCookie("accessToken", options)
    //   .json(
    //     new ApiResponse(200, {}, "user logged out successfully")
    //   )
    try {
      res.cookie("accessToken","",{
        maxAge:0
      })
      res.status(200).json({success:"logout successfully"})
    } catch (error) {
      return res.status(406).json({error:"internal server error"})
    }
  },
};

export default userController;
