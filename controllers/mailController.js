import BookingModel from "../models/bookingModel.js";
import Stripe from "stripe";
import userModel from "../models/userModel.js";
import { sendEmail } from "../utils/nodeMailer.js";

const stripe = new Stripe('sk_test_51P11cvSHl2BiGxNdVAvkRuoRTWR4CqZ5WrcHVW6tAdDtf8KEk1AFOR9U1uDXH1I4Phs5MS252llHLPt0FErxxdOV009lnFO2s0');



const mailController = {
    async sendmail(req, res) {
        try {
            console.log(req.user, "usermail")
            if (!req.user) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            const user = await userModel.findById(req.user?._id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
            });
            const invoice = await stripe.invoices.create({
                customer: customer.id,
                description: 'Booking Flight',
                auto_advance: true,
                collection_method: 'send_invoice',
                days_until_due: 7
            });
            const invoices = await stripe.invoices.sendInvoice(invoice.id);
            await sendEmail(user.email, invoices.invoice_pdf)

            return res.status(200).json({ success: "your are successfully booked please check your mail" })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
};

export default mailController;
