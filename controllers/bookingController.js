import BookingModel from "../models/bookingModel.js";
import Stripe from "stripe";

const stripe = new Stripe('sk_test_51P11cvSHl2BiGxNdVAvkRuoRTWR4CqZ5WrcHVW6tAdDtf8KEk1AFOR9U1uDXH1I4Phs5MS252llHLPt0FErxxdOV009lnFO2s0');

const bookingController = {
  async registerBooking(req, res) { 
    try {
      const {
        id,
        fare,
        code: { dial_code },
        phone,
        Gender,
        Nationality,
        email,
        firstName,
        lastName,
      } = req.body;

      // Check if all required fields are provided
      if (
        !(
          id &&
          fare &&
          phone &&
          Gender &&
          firstName &&
          lastName &&
          Nationality &&
          email
        )
      ) {
        return res
          .status(400)
          .json({ error: "Please provide all the required details" });
      }

      // Create a customer in Stripe
      const customer = await stripe.customers.create({
        email: email,
        name: firstName,
        address:{
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        }
      });

      // Create a checkout session in Stripe
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'INR',
              product_data: {
                name: "Booking Flight",
              },
              unit_amount: fare * 100, // Amount should be in cents
            },
            quantity: 1, // You can adjust quantity if needed
          },
        ],
        customer: customer.id,
        success_url: 'http://localhost:3000/'  , // Replace with your actual success URL
        cancel_url: 'http://localhost:3000/', // Replace with your actual cancel URL
      });

      // Save booking details in your database
      const booking = new BookingModel({
        id,
        fare,
        code: { dial_code },
        phone,
        Gender,
        Nationality,
        email,
        firstName,
        lastName,
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
