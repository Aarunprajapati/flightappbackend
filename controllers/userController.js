import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const generateFreshAccessToken = async function (userId) {
  const user = await userModel.findById(userId);
  const accessToken = await user.generateAccessToken();
  return { accessToken };
};

const userController = {
  async register(req, res) {
    try {
      const { name, email, password, dob, phoneNumber, gender } = req.body;
      const profilePic = req.file?.path


      if (!(name && email && password && dob && phoneNumber && gender)) {
        return res
          .status(200)
          .json({ error: "Please provide all the required details" });
      }
      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const avatarimage = await uploadOnCloudinary(profilePic)

      const user = await userModel.create({
        name,
        email,
        phoneNumber,
        dob,
        password: hashedPassword,
        gender,
        profilePic: avatarimage?.url,
        isActive: true
      });

      const options = {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "None",
        maxAge: 86400 * 1000,
        domain: `${process.env.FRONTEND_URL}`

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
        user.isActive = true;
        await user.save();
        const options = {
          httpOnly: true,
          path: "/",
          secure: true,
          sameSite: "None",
          maxAge: 86400 * 1000,
         domain: `${process.env.FRONTEND_URL}`
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
      return res.status(400).json({ error: error.message });
    }
  },
  async profile(req, res) {
    const user = await userModel.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    if (!user.isActive) {
      return res.status(404).json({ error: "User Account is not active" });
    }
    return res.status(200).json({ user: req.user });
  },
  async logOut(req, res) {
    try {
      res.cookie("accessToken", "", {
        maxAge: 0,
      });
      res.cookie("googleToken", "", {
        maxAge: 0,
      });
      res.status(200).json({ success: "logout successfully" });
    } catch (error) {
      return res.status(406).json({ error: "internal server error" });
    }
  },
  async updateUser(req, res) {
    try {
      const { name, dob, phoneNumber, gender } = req.body;
      const userId = req.user?._id;
      const updateFields = { name, dob, phoneNumber, gender };
      const filteredFields = Object.fromEntries(Object.entries(updateFields).filter(([key, value]) => value !== undefined));
      const user = await userModel.findByIdAndUpdate(userId, filteredFields, { new: true });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await res
        .status(200)
        .json(new ApiResponse(200, { success: "user update Successfully" }));
    } catch (error) {
      console.error("error in the update", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default userController;
