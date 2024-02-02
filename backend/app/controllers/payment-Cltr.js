const { validationResult } = require("express-validator");
const BookingModel = require("../models/booking-model");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const _ = require("lodash");
const PaymentModel = require("../models/payment-model");
const ProfileModel = require("../models/profile-model");

const paymentCltr = {};

paymentCltr.paymentCheckoutSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  } else {
    const body = _.pick(req.body, ["CARD"])

    const { bookingId } = req.params
    console.log(bookingId,"id")
    try {
      
      const bookedEvent = await BookingModel.findOne({ _id: bookingId ,userId:req.user.id})
      console.log(bookedEvent)


      if (!bookedEvent) {
        return res.status(404).json({ error: bookedEvent, message: "Cannot find the booked event" });
      }

      const profile = await ProfileModel.findOne({userId:req.user.id}).populate("userId")

      const customer = await stripe.customers.create({
        name: profile.userId.username,
        address: {
            line1: 'India',
            postal_code: '560002',
            city: 'Banglore',
            state: 'KA',
            country: 'US', 
        },
    })

      const session = await stripe.checkout.sessions.create({
        payment_method_types: [body.card],
        mode: "payment",
        line_items: bookedEvent.tickets.map((ticket) => {
          return {
            price_data: {
              currency: "inr",
              product_data: {
                name: ticket.ticketType,
              },
              unit_amount: ticket.ticketPrice * 100, // not done the converting to cents for usd
            },
            quantity: ticket.quantity,
          };
        }),
        customer:customer.id,

        success_url: `${process.env.SERVER_URL}/success.html`,
        cancel_url: `${process.env.SERVER_URL}/cancel.html`,
      }); 
        const totalPaidAmount = bookedEvent.tickets.reduce((acc,cv ) => {
            return acc + cv.totalAmount;
          }, 0);
        console.log({id:session.id,url:session.url})
        res.json({id:session.id,url:session.url})

        if(session.id){
          const paymentPending = new PaymentModel({
            userId:req.user.id,
            bookingId:bookingId,
            paymentDate:new Date(),
            amount :totalPaidAmount,
            paymentType:session.payment_method_types[0],
            transaction_Id:session.id
        })

        await paymentPending.save()
        
      }

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

paymentCltr.updatedPayment = async(req,res)=>{
  const {transactionId,bookingId} = req.body
  try{
    const payment = await PaymentModel.findOneAndUpdate({transaction_Id:id},{status:true},{new:true})
    if(payment.status === false){
      const bookedStatusTrue =await BookingModel.findByIdAndUpdate({_id:bookingId,userId:req.user.id},{status:true})

    }

  } catch(err){
    return res.status(200).json("payment sucess")
  }
}



module.exports = paymentCltr;
