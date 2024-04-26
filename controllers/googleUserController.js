import googleUser from "../models/googleUserModel.js";

const googleUserController = {
    async googleUser(req, res) {
        try {
            const { name, email, image } = req.body;
            if (!(name && email)) {
                return res
                    .status(400)
                    .json({ error: "Please provide all the required details" });
            }
            const emailExist = await googleUser.findOne({ email });
            if (emailExist) {
                return res.status(400).json({ error: "Email already exists" });
            }
            const user = await googleUser.create({
                name,
                email,
                image: image || ""
            });
            const options = {
                httpOnly: true,
                path: "/",
                secure: true,
                sameSite: "none",
        
              };
              const accessToken = await user.generateAccessToken();
            return res.status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                success: "User created successfully",
                user
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async googleUserData(req, res) {
        const userdata = await googleUser.findOne(req.user);
        console.log(userdata)

        return res.send({user: userdata})

    }
}

export default googleUserController