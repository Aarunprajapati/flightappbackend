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
            const user = await googleUser.findOne({ email });
            if (user) {
                const options = {
                    httpOnly: true,
                    path: "/",
                    secure: true,
                    sameSite: "none",
                    maxAge: 86400 * 1000,

                };
                const googleToken = await user.generateAccessToken();
                return res.status(200)
                    .cookie("googleToken", googleToken, options)
                    .json({
                        success: "User login successfully",
                        user
                    });
            } else {
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
                const googleToken = await user.generateAccessToken();
                return res.status(200)
                    .cookie("googleToken", googleToken, options)
                    .json({
                        success: "User created successfully",
                        user
                    });
            }
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async googleUserData(req, res) {

        const user = await googleUser.findById(req.googleuser)
        return res.send({ user })

    }
}

export default googleUserController