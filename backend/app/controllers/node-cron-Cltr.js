const { cancelBookingFunction } = require("./booking-Cltr");
const cron = require("node-cron")
const BookingModel = require("../models/booking-model")

const nodeCronCltr =()=>{ 

cron.schedule("0 0 * * *", async () => {
    try {
        // find bookings with event start time within the next 5 minutes
        const currentDateTime = new Date()
        const futureDateTime = new Date(currentDateTime.getTime() + 5 * 60000)// 5 min  now
        const bookings = await BookingModel.find().populate({
            path: 'eventId',
            match: {
                'eventStartDateTime': { $lte: futureDateTime }
            },
            select: 'eventStartDateTime' // populate  the eventStartDateTime 
        }).populate({
            path: 'userId',
            select: 'email'
        });

        // Filter out bookings where eventId.eventStartDateTime is less than or equal to futureDateTime
        const filteredBookings = bookings.filter(booking => booking.eventId !== null);


        filteredBookings.forEach(async (booking) => {
            const userEmail = booking.userId.email;
            const eventStart = booking.eventId.eventStartDateTime; // Access eventStartDateTime from populated eventId
            const eventTitle = booking.eventId.title; // Assuming you have a 'title' field in your EventModel

            await funEmail({
                email: userEmail,
                subject: `Event Reminder: ${eventTitle}`,
                message: `Your event "${eventTitle}" starts in 5 minutes at ${eventStart}.`
              })

            
            console.log(`Reminder email sent to ${userEmail}`);
        });
    } catch (error) {
        console.error('CronError : sending email reminders:', error);
    }
})

cron.schedule('*/5 * * * *',async()=>{
    try{
        const bookingToCancel = await BookingModel.find({status:false})

        const currentTime = new Date()

        //iterate thorugh the each booking and check if that differenece is greater than 5 min then cancel it (1000 * 60)=> milli sec to minutes
        for(const booking of bookingToCancel){
            const timeDifference = Math.floor((currentTime-new Date(booking.createdAt))/1000*60)

            if(timeDifference >=5){
                await cancelBookingFunction(booking._id)
            }
        }
    }catch(err){
        console.log("Error in the cancel booking in cron",err)
    }
})

}

// cron.validate('25 * * * * ') to validate is a correct cron or not


module.exports = {nodeCronCltr}

