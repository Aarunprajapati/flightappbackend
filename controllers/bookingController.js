import BookingModel from "../models/bookingModel.js";
import Stripe from "stripe";
import userModel from "../models/userModel.js";
import { sendEmail } from "../utils/nodeMailer.js";

const stripe = new Stripe(
  "sk_test_51P11cvSHl2BiGxNdVAvkRuoRTWR4CqZ5WrcHVW6tAdDtf8KEk1AFOR9U1uDXH1I4Phs5MS252llHLPt0FErxxdOV009lnFO2s0"
);



const bookingController = {
  async registerBooking(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const {
        id,
        fare,
        code: { dial_code },
        phone,
        email,
        members,
      } = req.body;
    
      if (!id || !fare || !phone || !email || !members || members.length === 0) {
        return res.status(400).json({
          error: "Please provide all the required details including members information",
        });
      }

      const totalFare = fare * members.length || fare;


      const user = await userModel.findById(req.user?._id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        phone: phone
      });
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "INR",
              product_data: {
                name: "Booking Flight",
              },
              unit_amount: totalFare * 100,
            },
            quantity: 1,
          },
        ],
        customer: customer.id,
        success_url: 'http://localhost:3000/checkoutpage', 
        cancel_url: 'http://localhost:3000/', 
      });
  
      
      const booking = new BookingModel({
        id,
        fare: totalFare,
        code: { dial_code },
        phone,
        email,
        user: user._id,
        members,
      });
      
      await booking.save();

      // Respond with success message and checkout session URL
      res.status(200).json({ success: "Booking has been done", url: checkoutSession.url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default bookingController;
