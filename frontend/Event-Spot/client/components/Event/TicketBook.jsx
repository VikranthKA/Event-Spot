import React from 'react'
import {useState,useEffect} from 'react'

function TicketBook() {
    
    const eventDetails={
        title:"TITLE",
        venueName:"VENUENAME",
        ticketType : [{
            _id:"asdfasdawe7hbj1278378",
            ticketName:"Ticket1",
            ticketPrice:1500,
            ticketCount:100,
            remainingTickets: 100
        },{
            _id:"98uijh8u9iojkiujk",
            ticketName:"Ticket2",
            ticketPrice:1200,
            ticketCount:120,
            remainingTickets: 120
        }]
    }
    
const [ticketCount,setTicketCount] = useState({})
const [selectedTickets ,setSelectedTickets] = useState([])

const handleCountChange = (ticketId,count)=>{
    setTicketCount((prevCounts)=>({
        ...prevCounts,
        [ticketId]:count,

    }))
}

const handleTicketSelect = (ticket)=>{
    setSelectedTickets((prevSelected)=>[...prevSelected,ticket])
}

const renderSelectedTickets=()=>{
    return selectedTickets.map((selectedTickets)=>(
        <div className="bookingContainer">
            <div className="selectedTicketsForBooking">
                {`${selectedTickets.ticketName}-${selectedTickets.seats} seats`}
                
            </div>
            <div className="totalTicketCost">
                {/*should i add total cost 
                and also i should take care of remaing seats count
                */}
            </div>
        </div>
    ))
}

  return (
    <div className="ticketBooking">
        <h2>Ticket Booking</h2>
        <div className="ticketTypes">
            {eventDetails.ticketType.map((ticket)=>(
                <div className="ticket">
                    <h3>{ticket.ticketName}</h3>
                    <p>Price:${ticket.ticketPrice}</p>
                    <p>Remaining Tickets :{ticket.remainingTickets}</p>
                    <label>
                        Select Count:<input type="number" value={ticketCount[ticket._id] || 0}
                        onChange={(e)=>handleCountChange(ticket._id,e.target.value)}
                        />
                    </label>
                    <button
                        onClick={()=>
                            handleTicketSelect({
                                _id:ticket._id,
                                ticketName:ticket.ticketName,
                                seats:ticketCount[ticket._id] || 0,
                            })
                        }
                    >Add to Booking</button>
                    
                </div>
            ))}
            <div className="displaySelctedTickets">
                <h3>Selcted Tickets:</h3>
                {renderSelectedTickets()}
            </div>

        </div>

    </div>
  )
}

export default TicketBook
