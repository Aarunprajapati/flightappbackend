
import schedule from 'node-schedule';

function scheduleDeactivation(userInstance, model) {
    // Assume 30 days for deactivation
    // const date30DaysLater = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
    const date30DaysLater = new Date(new Date().getTime() + 60 * 1000); // 30 days in milliseconds
    schedule.scheduleJob(userInstance._id.toString(), date30DaysLater, async function () {
        const userToUpdate = await model.findById(userInstance._id);
        if (userToUpdate && userToUpdate.isActive) {
            userToUpdate.isActive = false;
            await userToUpdate.save();
            console.log(`Account for user ${userToUpdate._id} has been deactivated.`);
        }
    });
}
export default scheduleDeactivation;