import BookingModel from "../models/bookingModel.js";
const  bookingController={
    async registerBooking(req, res){
        try {
            const {
                id,
                code: { dial_code },
                phone,
                Gender,
                Nationality,
                email,
                firstName,
                lastName
              } = req.body;
            if(!(id  && phone && Gender && firstName && lastName && Nationality && email)){
                return res.status(400).json({error: "Please provide all the required details"});
              }
           const booking = new BookingModel({
            id,
            code: { dial_code }, 
            phone,
            Gender,
            Nationality,
            email,
            firstName,
            lastName
           })   
           await booking.save();
           res.status(200).json({ success: 'Booking has been done ' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
    
        }

    },
};
export default bookingController;