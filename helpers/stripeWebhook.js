// import Stripe from 'stripe';
// import { sendEmail } from '../utils/nodeMailer.js';
// import BookingModel from '../models/bookingModel.js';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function handleStripeWebhook(req, res) {
//   const sig = req.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.error(`Webhook Error: ${err.message}`);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   switch (event.type) {
//     case 'checkout.session.completed':
//       const session = event.data.object;
//       const booking = await BookingModel.findOne({ session_id: session.id });
//       if (!booking) {
//         return res.status(404).send('Booking not found');
//       }
      
//       const invoice = await stripe.invoices.create({
//         customer: session.customer,
//         description: 'Booking Flight',
//         auto_advance: true,
//         collection_method: 'send_invoice',
//         days_until_due: 7
//       });

//       const sendInvoice = await stripe.invoices.sendInvoice(invoice.id);
//       await sendEmail(booking.email, sendInvoice.invoice_pdf);
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.status(200).send({ received: true });
// }
