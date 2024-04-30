import GoogleUser from "../models/googleUserModel.js";  // Renamed for clarity

const googleUserController = {
    async googleUser(req, res) {
        const { name, email, image } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: "Please provide all the required details (name and email)." });
        }

        try {
            let user = await GoogleUser.findOne({ email });
            if (user) {
                // User exists, log in
                setGoogleTokenCookie(res, user);
                return res.status(200).json({ success: "User logged in successfully", user });
            } else {
                // No user found, create new user
                user = new GoogleUser({
                    name,
                    email,
                    image: image || "",
                    isActive: true
                });
                await user.save();
                setGoogleTokenCookie(res, user);
                return res.status(200).json({ success: "User created successfully", user });
            }
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ error: "A user with this email already exists!" });
            }
            console.error("Error in googleUser method:", error);
            return res.status(500).json({ error: error.message });
        }
    },

    async googleUserData(req, res) {
        try {
            const user = await GoogleUser.findById(req.user?._id);

            console.log(user,"user")
            if (!user || !user.isActive) {
                return res.status(404).json({ error: "User account is not active or does not exist." });
            }
            return res.json({ user });
        } catch (error) {
            console.error("Error in googleUserData method:", error);
            return res.status(500).json({ error: error.message });
        }
    }
}

function setGoogleTokenCookie(res, user) {
    const googleToken = user.generateAccessToken();
    const options = {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
        maxAge: 86400 * 1000  // 24 hours
    };
    res.cookie("googleToken", googleToken, options);
}

export default googleUserController;
