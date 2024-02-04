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
            ticketPrice:ticket.ticketPrice,
            totalAmount:ticket.ticketPrice * ticket.Quantity , // Include totalAmount for each ticket
        }));
        const totalAmount = transformedTickets.reduce((total, ticket) => total + (ticket.ticketPrice *ticket.Quantity), 0);

        // Check if there are enough available seats for the specified ticket types
        const availableSeats = transformedTickets.every(ticket => {
            const matchingTicket = event.ticketType.find(eventTicket => eventTicket.ticketName === ticket.ticketType);
        
            if (!matchingTicket) {
                return false; // Ticket not found in the event.ticketType array
            }
        
            return matchingTicket.remainingTickets >= ticket.quantity;
        });
        
        

        if (!availableSeats) {
            return res.status(400).json({ error: 'Not enough available seats for the specified ticket types' });
        }


        const booking = new BookingModel({
            userId: req.user.id,
            eventId,
            tickets: transformedTickets,
            totalAmount: totalAmount,
            status:null
        });


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
    const {bookingId} = req.params //send the form front end 
    

    
    try{
        const bookedEvent = await BookingModel.findOne({_id:bookingId,userId:req.user.id})
        //check the if the payment is create for this user and ticket if that sucess then say payment done
        
        if(!bookedEvent){
            return res.status.json(404).json(bookedEvent)
        }else if(bookedEvent.status===true){
            return res.status.json(200).json({bookedEvent:bookedEvent.tickets,message:"You have already booked"})
        }else{
            return res.status(200).json("Your confirmed seats are canceled")
                //write the logic of re updating the tickets in the event
        }
    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}


module.exports = bookingCltr