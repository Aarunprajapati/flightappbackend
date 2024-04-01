
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

const generateFreshAccessToken = async function (userId) {
  console.log(userId);
  const user = await userModel.findById(userId);
  console.log(user);
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
        secure: true,
        sameSite: 'None',
      };
      const accessToken = await user.generateAccessToken();
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json({ success: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
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
          secure: true,
        };

        const { accessToken } = await generateFreshAccessToken(user._id);

        res.status(200).cookie("accessToken", accessToken, options).json({success:"login Successfully "});
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async loggeduser(req, res) {
    res.send({ user: req.user });
  },
};

export default userController;
