const { validationResult } = require("express-validator")
const BookingModel = require("../models/booking-model")
const EventModel = require("../models/event-model")
const _ = require("lodash")
const bookingCltr = {}

bookingCltr.create= async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { eventId } = req.params;
  const { ticketData } = req.body;

  try {
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Cannot find the Event' });
    }

const availableSeats = event.ticketType.every(ticketType => {
  const matchingTicket = ticketData && Array.isArray(ticketData) && ticketData.find(ticketInfo => ticketInfo._id === ticketType._id)

      if (!matchingTicket) {
        // If the ticket type is not present in the ticketData, consider it as available.
        return true;
      }

      return ticketType.remainingTickets >= matchingTicket.quantity;
    });

    if (!availableSeats) {
      return res.status(400).json({ error: 'Not enough available seats for the specified ticket types' });
    }

    const booking = new BookingModel({
      eventId,
      tickets:ticketData
    });

    await booking.save();

    const updatedTicketTypes = event.ticketType.map(ticketType => {
        const matchingTicket = ticketData && Array.isArray(ticketData) && ticketData.find(ticketInfo => ticketInfo._id === ticketType._id);
      
        if (matchingTicket) {
          ticketType.remainingTickets -= matchingTicket.quantity;
        }
      
        return ticketType;
      });
      

    await EventModel.findByIdAndUpdate(eventId, {
      ticketType: updatedTicketTypes,
    });

    return res.status(201).json( booking)
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}



///write a logic in the FE and show Timer of the 5 min if the times exists more then, call canelPayment and also add button to the says cancel payment
bookingCltr.cancelBooking= async(req,res)=>{
    const {ticketData} = body //send the form front end 
    

    
    try{
        const {bookingId} = req.params.id
        const bookedEvent = await BookingModel.findOne({_id:bookingId,userId:req.user.id})
        //check the if the payment is create for this user and ticket if that sucess then say payment done
        
        if(!bookedEvent){
            return res.status.json(404).json(bookedEvent)
        }else if(bookedEvent.status===true){
            return res.status.json(200).json({bookedEvent:bookedEvent.tickets,message:"You have already booked"})
        }else{
        //     ticketData=[
        //         {
        //          "_id":"65a186661351d7e0b9fc73b2",  
        //         "ticketType":"Gold Class",
        //         "quantity":2, 
        //         "amount":3000
        //        } 
        //    ]

            try{
                // const undoTicketBooking = EventModel.findByIdAndUpdate({_id:bookingId},{
                //     // chatGPT fill the code to canel the booking realse the reserved seats
                // },{new:true})
                const event = await EventModel.findById(bookedEvent.eventId);

        if (event) {
          for (const ticket of ticketData) {
            const reservedSeatIndex = event.reservedSeats.findIndex((seat) => seat._id === ticket._id);
            if (reservedSeatIndex !== -1) {
              event.reservedSeats.splice(reservedSeatIndex, 1);
            }
          }

          await event.save();
        }

        // Update the booking status to canceled
        bookedEvent.status = false;
        await bookedEvent.save()

        return res.status(200).json({ message: "Booking canceled successfully" });

            }catch(err){
                console.log(err)
                return res.status(500).json({err,info:"Can undo the tickets booked"})
            }
        }
        
       

        
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
}
}


module.exports = bookingCltr;




