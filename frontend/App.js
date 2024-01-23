import React from 'react'
import {Routes,Route,Link} from 'react-router-dom'
// import 'leaflet/dist/leaflet.css';

import DisplayUser from './Event-Spot/client/components/UserProfile.js/DisplayUser'
import Darkmode from './Event-Spot/client/components/Z_Dark_Mode/Darkmode'
import './App.css'
import Map from './Event-Spot/client/components/Location/Map'
import CreateBookingInfo from './Event-Spot/client/components/Booking/CreateBookingInfo'
import Test from './Event-Spot/client/components/Location/Test'
import MapWithPolyline from './Event-Spot/client/components/Location/MapWithPolyline'
import EventInfo from './Event-Spot/client/components/Event/EventInfo'
import TicketBook from './Event-Spot/client/components/Event/TicketBook'
import Create from './Event-Spot/client/components/Category/Create'
import ContextStore from './Event-Spot/client/ContextApi/ContextStore'
import Header from './Event-Spot/client/components/Layout/Header'
import Home from './Event-Spot/client/pages/Home'
import Register from './Event-Spot/client/components/UserAuthenticate.js/Register'
import Login from './Event-Spot/client/components/UserAuthenticate.js/Login'
import UserProfile from './Event-Spot/client/components/UserProfile.js/UserProfile'

import EventForm from './Event-Spot/client/components/Event/EventForm'
import EventInMap from './Event-Spot/client/components/Location/EventInMap'

const App = () => {
  return (
    <div>
      <ContextStore>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/user-profile' element={<UserProfile/>}/>
          <Route path='/event-form' element={<EventForm/>}/>
          <Route path='/event/:id' element={<EventInMap/>}/>
          {/* // <Route path='/' element={</>}/> */}

          {/*  <Route path='/' element={</>}/> */}
          {/*  <Route path='/' element={</>}/> */}

          {/*  <Route path='/' e/>}/>
           <Route path='/' element={</>}/> */}

          {/*  <Route path='/' element={</>}/> */}



          

          



        </Routes>
      </ContextStore>

     
    </div>
  )
}

export default App
