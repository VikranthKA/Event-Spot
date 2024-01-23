const EventModel = require("../models/event-model")
const { validationResult } = require("express-validator")
const _ = require('lodash')


const reviewCltr = {}



reviewCltr.create = async (req, res) => {
    const errors = validationResult(req)
    if (errors) {
        return res.status.json(400)
    } else {
        const eventId = req.params._id

        const body = _.pick(req.body, ["title", "body", "rating"])
        try {
            const event = await EventModel.findById({ _id: eventId })
            if (event.length === 0 || !event) return res.status(404).json("Event not found")
            //also we can check the other organiser cannot write a review on this event
            const reviewBody = {
                userId: req.user.id,
                title: body.title,
                rating: body.rating,
                body: body.body
            }


            const addReview = await EventModel.findOneAndUpdate({ _id: eventId },
                { $push: { reviews: reviewBody } },
                { new: true })
            if (!addReview || addReview.length === 0) return res.status(400).json("Connot add the review")
            res.status.json(addReview)//also we can send the created review how to do that

        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = reviewCltr