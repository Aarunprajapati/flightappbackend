import BookingModel from "../models/bookingModel.js";
import Stripe from "stripe";
import userModel from "../models/userModel.js"; // Ensure this is used if necessary, currently it's imported but not used.

const stripe = new Stripe('sk_test_51P11cvSHl2BiGxNdVAvkRuoRTWR4CqZ5WrcHVW6tAdDtf8KEk1AFOR9U1uDXH1I4Phs5MS252llHLPt0FErxxdOV009lnFO2s0');

const bookingController = {
  async registerBooking(req, res) {
    try {
      const {
        id, fare, code: { dial_code }, phone, email, members
      } = req.body;

      console.log(req.body, "req.body")
      // Check if all required fields are provided
      if (!id || !fare || !phone || !email || !members || members.length === 0) {
        return res.status(400).json({ error: "Please provide all the required details including members information" });
      }
      const totalFare = fare * members.length || fare;
      const booking = new BookingModel({
        id,
        fare: totalFare,
        code: { dial_code },
        phone,
        email,
        members 
      });


      const [firstMember] = members;
      const customer = await stripe.customers.create({
        email: email,
        name: `${firstMember.firstName} ${firstMember.lastName}`,
        phone: phone
      });

      

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'INR',
            product_data: {
              name: "Booking Flight",
            },
            unit_amount: totalFare * 100, 
          },
          quantity: 1,
        }],
        customer: customer.id,
        success_url: 'http://localhost:3000/', // Replace with your actual success URL
        cancel_url: 'http://localhost:3000/', // Replace with your actual cancel URL
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
