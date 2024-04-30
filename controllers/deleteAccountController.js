import googleUser from "../models/googleUserModel.js";
import userModel from "../models/userModel.js";

import scheduleDeactivation from "../utils/TemporaryDeleteUser.js";

const deleteAccount = {
    async deleteAccount(req, res) {
        try {
            const user = await userModel.findById(req.user?._id);
            const googleuser = await googleUser.findById(req.user?._id);
            console.log(googleUser,"googleUser>>>>>>>>>>>>>>>")
            if (!user && !googleuser) {
                return res.status(404).json({ message: 'User not found' });
            }


            if (user) {
                user.deletionDate = new Date();
                await user.save();
                scheduleDeactivation(user, userModel);
            }
            if (googleuser) {
                googleuser.deletionDate = new Date();
                await googleuser.save();
                scheduleDeactivation(googleuser, googleUser);
            }

            res.status(200).json({
                message: 'Your account(s) have been marked for deletion and will be deactivated after 30 days.'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};



export default deleteAccount;
