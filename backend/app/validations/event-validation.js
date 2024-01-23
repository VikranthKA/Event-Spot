const Joi = require('joi')

const eventValidationSchema = Joi.object({

    eventStartDateTime:Joi.date().required(),

    eventEndDateTime:Joi.date().required(),

    title:Joi.string().required(),

    description:Joi.string().required(),

    poster:Joi.array().items(Joi.object({

        title:Joi.string().required(),

        file:Joi.binary().encoding('base64').required()

    })),
    categoryId:Joi.array().items(Joi.string().required()),
    
    ticketType:Joi.array().items(Joi.object({
        
        ticketName:Joi.string().required(),
        
        tikcetPrice:Joi.number().required(),
        
        ticketCount:Joi.number().required(),
   
    })),
   
    totalTickets:Joi.number().required(),
   
    venueName:Joi.string().required(),
   
    addressInfo:Joi.object({
   
        address:Joi.string().required(),
   
        city:Joi.string().required()
   
    }),
   
    location:Joi.object({
   
        type:Joi.string().valid("Point").required(),
   
        coordinates: Joi.array().items(

            Joi.number().min(-180).max(180), // Longitude

            Joi.number().min(-90).max(90)     // Latitude
            
        ).length(2).required()   
    }),
   
    ticketSaleStartTime:Joi.date().required(),
   
    ticketSaleEndTime:Joi.date().required()

})

module.exports = {eventSchema:eventValidationSchema}

