const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
    eventStartDateTime: Date,
    eventEndDateTime: Date,
    title: String,
    description: String,
    poster: [{
        title: String,
        file: String
    }],
    categoryId: [{
        type: Schema.Types.ObjectId,
        ref: "CategoryModel"
    }],
    ticketType: [{
        ticketName: String,
        ticketPrice: Number,
        ticketCount: Number,
        remainingTickets: Number
    }],
    totalTickets: Number, 
    venueName: String,
    addressInfo: {
        address: String,
        city: String
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number] // Geospatial data
        }
    },
    organiserId: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    reviews: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        title: String,
        body: String,
        rating: String
    }],
    actors:[{
        name:String,
        image:String
    }],
    ticketSaleStartTime: Date,
    ticketSaleEndTime: Date
}, { timestamps: true });

const EventModel = model("EventModel", eventSchema);

module.exports = EventModel;
