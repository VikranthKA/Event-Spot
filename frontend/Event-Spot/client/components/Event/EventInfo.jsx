import React,{useState} from 'react'
import moment from 'moment'
import CountDown from '../Utils/CountDown/CountDown'
import './EventInfo.css'
import { useParams } from 'react-router-dom'

function EventInfo() { //add props {eventDetails}

    const {eventId} = useParams()
    const [eventDetails,setEventDetails] = useState(null)


 

    function readableDate(inputDateString) {
        const momentObject = moment(inputDateString);
        return momentObject.format('LLLL');
    }


    const handleBookTickets = () => {

    }





    return (

        <div className="container" key={eventDetails._id}>
            <div className="image">

            </div>

            <div>
                <div className="details">
                    Venue Name: {eventDetails.venueName}<br />
                    Genre : {eventDetails.categoryId} <br />  {/*how to find the name using id */}
                    Start At : {readableDate(eventDetails.eventStartDateTime)}<br />
                    End At:{readableDate(eventDetails.eventEndDateTime)}<br />
                </div>

                <div className="book">
                    {eventDetails.ticketSaleStartTime === new Date() && eventDetails.remainingTickets >= 1 ? <button onClick={handleBookTickets}>Book</button> : <CountDown ticketSaleStartTime={eventDetails.ticketSaleStartTime} />}
                    {eventDetails.ticketSaleEndTime === new Date() && <h4>Ticket Booking Closed</h4>}
                </div>

            </div>

            <div className="actorsAndDesc">
                <div className="actors">
                    <span>Actors</span>
                    {eventDetails.actors.map((ele) => {
                        return (
                            <div className="actor">
                                <span key={ele._id}>
                                    Image : {ele.image}<br />
                                    Name :{ele.name}</span>
                            </div>
                        )
                    })}
                </div>

                <div className="desc">
                    About:{eventDetails.description}
                </div>

            </div>

            <div className="reviews">
                <ul>
                    <p>Reviews</p>
                    {eventDetails.reviews.map((ele) => {
                        return (
                            <div className="review">
                                <li key={ele._id}> Name:{ele.userId} <br /></li>
                                <li>Title:{ele.title} Rating :{ele.rating}<br /></li>
                                <li>Body:{ele.body} <br /></li>
                            </div>

                        )
                    })}
                </ul>
            </div>
            <footer>
                <h2>I am footer</h2>
            </footer>

        </div>
    )
}

export default EventInfo