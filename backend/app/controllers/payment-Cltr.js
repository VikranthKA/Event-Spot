const { validationResult } = require("express-validator");
const BookingModel = require("../models/booking-model");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const _ = require("lodash");
const PaymentModel = require("../models/payment-model");

const paymentCltr = {};

paymentCltr.paymentCheckoutSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  } else {
    const body = _.pick(req.body, ["paymentType"]);

    const { bookingId } = req.params;
    try {
      const bookedEvent = await BookingModel.findById({ _id: bookingId });
      if (!bookedEvent) {
        return res.status(404).json({ error: bookedEvent, message: "Cannot find the booked event" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: [body.paymentType],
        mode: "payment",
        line_items: bookedEvent.tickets.map((ticket) => {
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: ticket.ticketType,
              },
              unit_amount: ticket.amount * 100, // converting to cents for usd
            },
            quantity: ticket.quantity,
          };
        }),
        success_url: `${process.env.SERVER_URL}/success.html`,
        cancel_url: `${process.env.SERVER_URL}/cancel.html`,
      }); 
      if(success_url){
        const totalAmount = bookedEvent.tickets.reduce((result, ticket) => {
            return result + ticket.quantity * ticket.amount;
          }, 0);
        const paymentSuccess = new PaymentModel({
            userId:req.user.id,
            bookingId:bookingId,
            paymentDate:new Date(),
            amount :totalAmount,
            paymentType:body.paymentType,
            status:true 
        })
        await paymentSuccess.save()
        const bookedStatusTrue =await BookingModel.findByIdAndUpdate({_id:bookingId},{status:true})//check if the one or id
      }

      return res.json({ url: session.url,paymentSuccess});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};



module.exports = paymentCltr;
