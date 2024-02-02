const { validationResult } = require("express-validator");
const BookingModel = require("../models/booking-model");
const EventModel = require("../models/event-model");
const ProfileModel = require("../models/profile-model");

const bookingCltr = {};

bookingCltr.createBooking = async (req, res) => {
    const { eventId } = req.params;
    const { tickets } = req.body;

    try {
        const event = await EventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Cannot find the Event' });
        }

        // Transform the incoming tickets array to match the BookingModel structure
        const transformedTickets = tickets.map(ticket => ({
            ticketId:ticket._id,
            ticketType: ticket.ticketName,  // Assuming _id is the reference to EventModel
            quantity: ticket.Quantity,
            totalAmount: ticket.totalAmount, // Include totalAmount for each ticket
        }));

        // Check if there are enough available seats for the specified ticket types
        const availableSeats = transformedTickets.every(ticket => {
            const matchingTicket = event.ticketType.find(eventTicket => eventTicket.ticketName === ticket.ticketType);
        
            if (!matchingTicket) {
                console.log(matchingTicket, "matc");
                return false; // Ticket not found in the event.ticketType array
            }
        
            return matchingTicket.remainingTickets >= ticket.quantity;
        });
        
        

        if (!availableSeats) {
            return res.status(400).json({ error: 'Not enough available seats for the specified ticket types' });
        }

        // Calculate the overall amount for the booking
        const totalAmount = transformedTickets.reduce((total, ticket) => total + ticket.totalAmount, 0);

        // Create a new booking instance with the event ID and transformed tickets
        const booking = new BookingModel({
            userId: req.user.id,
            eventId,
            tickets: transformedTickets,
            amount: totalAmount,
            status: null
        });

        // Save the booking to the database

        // Update the remaining tickets for each ticket type in the event
// Update the remaining tickets for each ticket type in the event
const updatedTicketTypes = event.ticketType.map(eventTicket => {
    const matchingTicket = transformedTickets.find(ticket => ticket.ticketType === eventTicket.ticketName);

    if (matchingTicket) {
        // Subtract the booked quantity from the remaining tickets
        eventTicket.remainingTickets -= matchingTicket.quantity;

    }

    return eventTicket;
});


        // Update the event in the database with the modified ticket types
        try{
            const updatedEvent = await EventModel.findByIdAndUpdate(eventId, {
                ticketType: updatedTicketTypes,
            },{new:true});
            //this not needed
        }catch(err){
            return res.status(err)
        }
        (await (await booking.save()).populate("userId")).populate("eventId")
        const addBooking = await ProfileModel.findOneAndUpdate({userId:req.user.id},{$push:{bookings:booking._id}})
        
        return res.status(201).json(booking);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};





bookingCltr.TicketsInfo = async(req,res)=>{
    const {bookedId} = req.params
    try{
        const ticketInfo = await BookingModel.findOne(
            {
                _id:bookedId,
                userId:req.user.id

            }).populate(
                {
                    path:"userId",
                    select:"_id username email"
            }).populate(
                {
                    path:"eventId",
                    select:"title eventStartDateTime venueName"
            })
            // .populate({
            //     path: 'tickets',
            //     populate: {
            //         path: 'ticketId',
            //         model: 'EventModel',
            //         select: '_id ticketName ticketPrice'
            //     }
            // })
              
        if(!ticketInfo) return res.status(404).json("Ticket Not Found")

        
        return res.status(200).json(ticketInfo)
        
    }catch(err){
        console.log(err)
        return res.status(500).json(err)

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


module.exports = bookingCltr