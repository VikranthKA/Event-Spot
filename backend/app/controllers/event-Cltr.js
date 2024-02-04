require("dotenv").config()
const axios = require("axios")
const moment = require('moment')
const geolib = require('geolib')
const { validationResult, body } = require('express-validator')
const EventModel = require('../models/event-model')
const _ = require('lodash')
const jwt = require("jsonwebtoken")
const CategoryModel = require("../models/category-model")
const ProfileModel = require("../models/profile-model")



async function getCoByGeoCode(data) {
    try {
        const addressResponse = await axios.get(`https://geocode.maps.co/search?q=${data}&api_key=${process.env.GEO_CODE_API_KEY}`)
        if (addressResponse.data.length === 0) {
            return res.status(404).json({ error: "Please give the correct Name of the place check if miss spell or try give another nearer location" })
        }
        return addressResponse.data
    } catch (err) {
        console.log(err)
        return res.status(404).json(err)
    }
}

async function distanceBtwThem(source, dest) {
    const distanceInMeters = geolib.getDistance(source, dest);
    const distanceInKilometers = distanceInMeters / 1000; // Convert meters to kilometers
    return distanceInKilometers;
}

const getCoByGeoApify = async (data, res) => {
    const body = _.pick(req.body, ['building', 'locality', 'city', 'state', 'pincode', 'country']);

    const searchString = encodeURIComponent(`${req.body.building}, ${req.body.locality}, ${req.body.city}, ${req.body.state}, ${req.body.pincode}, ${req.body.country}`);
    console.log(searchString, "data");
    try {
        const mapResponse = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${searchString}&apiKey=${process.env.GEO_APIFY_KEY}`);

        if (mapResponse.data.features.length == 0) {
            return res.status(400).json({ errors: [{ msg: "Invalid address", path: 'invalid address' }] })
        }
        const location = [mapResponse.data.features[0].properties.lon, mapResponse.data.features[0].properties.lat]
        return location
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};

async function getCoByIndia_PostApi(code, res) {
    try {
        const codeResponse = await axios.get(`https://api.postalpincode.in/pincode/${code}`)
        return codeResponse.data
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

async function getAddressByGeoCode(data) {

    try {
        const addressResponse = await axios.get(`https://geocode.maps.co/reverse?lat=${parseInt(data.lattitude)}&lon=${parseInt(data.longitude)}&api_key=${process.env.GEO_CODE_API_KEY}`)
        if (addressResponse.data.lenght === 0) {
            return res.status(404).json({ error: "Lat and lon didnt find the address" })

        }
        return addressResponse.data
    } catch (err) {
        console.log(err)
    }

}

const totalTicketCount = (ticketType) => {

}
// finding the total count of the ticket count
function totalCount(ticketArray) {
    return ticketArray.reduce((total, ticket) => total + ticket.ticketCount, 0);
}

function momentConvertion(date) {
    return moment(date).format("YYYY-MM-DD HH:mm:ss")
}

function convertToMiles(inMeters){
    return radiusInRadians = inMeters / (6371 * 1000)
}

const eventCltr = {}


eventCltr.create = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const body = _.pick(req.body,
        [
            "eventStartDateTime", 'title', 'description', "ClipName", "BrochureName", 'categoryId',
            "ticketType", "venueName", "addressInfo", "ticketSaleStartTime", "ticketSaleEndTime", "youTube", "location", "Actors"
        ])
    
    console.log(req.body,"i am category")
    console.log(body.categoryId,"hello")
    const event = new EventModel(body)
    
    try {
        event.organiserId = req.user.id

        event.categoryId = body.categoryId

        event.eventStartDateTime = momentConvertion(body.eventStartDateTime)

        event.ticketType = await body.ticketType.map((ele) => ({
            ticketName: ele.ticketName,
            ticketPrice: ele.ticketPrice,
            ticketCount: ele.ticketCount,
            remainingTickets: ele.ticketCount
        }))

        event.addressInfo = {
            address: body.addressInfo.address,
            city: body.addressInfo.city
        }

        if (body.ticketSaleStartTime > event.eventStartDateTime) {
            event.ticketSaleStartTime = momentConvertion(ticketSaleStartTime)
        }

        event.ticketSaleEndTime = momentConvertion(body.eventEndDateTime)

        event.totalTickets = await totalCount(body.ticketType)


        event.posters = [{
            ClipName: body.ClipName,
            image: req.files.ClipFile[0].filename
        }, {
            BrochureName: body.BrochureName,
            image: req.files.BrochureFile[0].filename
        }]
        event.location = {
            type: "Point",
            coordinates: [body.location.lon, body.location.lat]
        }
        event.actors = body.Actors

        //Means the ticket can be purchased even if the event not yet started
        // if (event.ticketSaleStartTime >= event.eventStartDateTime) return res.status(400).json("Ticket live on must be greater than event start time")

        await event.save()
        // await CategoryModel.findByIdAndUpdate(event.categoryId, { $push: { event: event._id } })
        await CategoryModel.findByIdAndUpdate(event.categoryId, { $push: { events: event._id } })

        //   const populatedEvent = event.populate({
        //     path: "organiserId", select: "_id username email"
        // }).populate({
        //     path: "categoryId" ,select:"name"
        // })
        // .populate({
        //     path: 'reviews',
        //     populate: {
        //         path: 'userId',
        //         model: 'UserModel',
        //         select: '_id username email'
        //     }
        // })
            
        // console.log(event,"goodmoring")
        return res.json(event)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}

eventCltr.getRadiusValueEvent = async (req, res) => {

    const { userlat, userlon, radius } = await req.params 
    console.log(userlat,userlon,radius)
    try {

        const radiusEvents = await EventModel.find({ location: { $geoWithin: { $centerSphere: [[parseInt(userlon), parseInt(userlat)], convertToMiles(radius) / 3963.2] } } }).populate({
            path: "organiserId", select: "_id username email"
        }).populate({
            path: "categoryId" ,select:"name"
        })
        .populate({
            path: 'reviews',
            populate: {
                path: 'userId',
                model: 'UserModel',
                select: '_id username email'
            }
        })
        if (radiusEvents.length === 0) {
            return res.status(404).json({err:"Events Not Found in this radius"})
        }
        // const validEvents = radiusEvents.filter((event) => {
        //     return event.isApproved === true && new Date(event.eventStartDateTime) >= new Date()
        // })
        // console.log(validEvents)


        // if (validEvents.length === 0) {
        //     return res.status(404).json(validEvents)
        // }
        // return res.status(200).json(validEvents)
        return res.json(radiusEvents)




    } catch (err) {
        return res.status(500).json({ error: console.log(err) })

    }
}



eventCltr.distanceAmongThem = async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        try {
            const eventId = req.params.eventId
            const userId = req.params.userId
            console.log(eventId, userId)
            // return res.json(eventId,userId)
            const event = await EventModel.findById({ _id: eventId })
            // return res.json(event)
            if (!event || event.length === 0) {
                console.log(event);
                return res.status(404).json(event);
            }

            const profileInfo = await ProfileModel.findOne({ _id: userId });

            if (!profileInfo) {
                console.log(profileInfo);
                return res.status(404).json(profileInfo);
            }

            const destCoordinates = event.location.coordinates;
            const sourceCoordinates = profileInfo.location.coordinates;

            if (!destCoordinates || !sourceCoordinates) {
                return res.status(400).json({ errors: [{ msg: 'Invalid coordinates' }] });
            }

            const distanceResult = await distanceBtwThem(sourceCoordinates, destCoordinates);

            if (!distanceResult) {
                return res.status(400).json({ errors: [{ msg: 'Error calculating distance' }] });
            }

            return res.status(200).json({ distance: distanceResult + 'km' });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ errors: [{ msg: 'Internal server error' }] })
        }
    }
};



eventCltr.getAll = async (req, res) => {
    try {
        const events = await EventModel.find(
        ).populate({
            path: "organiserId", select: "_id username email"
        }).populate({
            path: "categoryId" ,select:"name"
        })
        .populate({
            path: 'reviews',
            populate: {
                path: 'userId',
                model: 'UserModel',
                select: '_id username email'
            }
        })
 
        if (!events || events.lenght === 0) {
            res.status(404).json(events)
        }
        res.status(200).json(events)

    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
}

eventCltr.getOne = async (req, res) => {

    try {
        const event = await EventModel.findById({ _id: req.params.eventId })
        if (!event) return res.status.json("Error getting the Event")
        return res.status(200).json(event)

    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

eventCltr.getEvent = async (req, res) => {
    try {
        const { location } = req.query;
        const { category } = req.query

        const query = {};
        if (location) {
            query.location = location;
        }
        if (category) {
            query.category = category;
        }

        const events = await EventModel.find(query);
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json(err);
    }
};


eventCltr.update = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const body = _.pick(req.body,
        [
            "eventStartDateTime", 'title', 'description', "ClipName", "BrochureName", 'categoryId',
            "ticketType", "venueName", "addressInfo", "ticketSaleStartTime", "ticketSaleEndTime", "youTube", "location", "Actors"
        ])
    const event = new EventModel(body)
    
    try {
        // if (event.ticketSaleStartTime >= event.eventStartDateTime) return res.status(400).json("Ticket live on must be greater than event start time")

        event.organiserId = req.user.id

        if(body.categoryId) event.categoryId = body.categoryId

        if(event.eventStartDateTime) event.eventStartDateTime = momentConvertion(body.eventStartDateTime)

        if(body.ticketType) {
            event.ticketType = await body.ticketType.map((ele) => ({
                ticketName: ele.ticketName,
                ticketPrice: ele.ticketPrice,
                ticketCount: ele.ticketCount,
                remainingTickets: ele.ticketCount
            }))
            event.totalTickets = await totalCount(body.ticketType)
        }
        if(body.addressInfo.address ) {
            event.addressInfo = {
                address: body.addressInfo.address,
            }
        }
        if(body.addressInfo.city ) {
            event.addressInfo = {
                address: body.addressInfo.city,
            }
        }
        if(event.ticketSaleStartTime)event.ticketSaleStartTime = momentConvertion(ticketSaleStartTime)
        
        if(event.ticketSaleEndTime)event.ticketSaleEndTime = momentConvertion(body.eventEndDateTime)

        event.posters = [{
            ClipName: body.ClipName,
            image: req.files.ClipFile[0].filename
        }, {
            BrochureName: body.BrochureName,
            image: req.files.BrochureFile[0].filename
        }]

        


        event.location = {
            type: "Point",
            coordinates: [body.location.lon, body.location.lat]
        }
        event.actors = body.Actors


        await event.save()

        await CategoryModel.findByIdAndUpdate(event.categoryId, { $push: { events: event._id } })

          const populatedEvent = event.populate({
            path: "organiserId", select: "_id username email"
        }).populate({
            path: "categoryId" ,select:"name"
        })
        .populate({
            path: 'reviews',
            populate: {
                path: 'userId',
                model: 'UserModel',
                select: '_id username email'
            }
        })
            
        return res.json(populatedEvent)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}

eventCltr.removeEvent = async (req, res) => {
    try {
        const event = await EventModel.findOneAndDelete({
            _id: req.params.id, organiserId: req.user.id
        })
        if (!event || event.lenght === 0) {
            return res.status(404).json(event)
        }
        return res.status(200).json(event)
    } catch (e) {
        return res.status(500).json(e)
    }
}

eventCltr.getOneEvent = async (req, res) => {
    try {
        const event = await EventModel.findOne({
            _id: req.params.id, organiserId: req.user.id
        })
        res.status(200).json(event)
    } catch (err) {
        res.status(500).json(e)
    }
}

module.exports = eventCltr




