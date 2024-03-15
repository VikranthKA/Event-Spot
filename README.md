<h2>Event Spot – Online Event Finding App </h2>
<h2>https://event-spot-frontend.vercel.app/</h2>

<h3>Event Spot is an online event-finding app that helps users discover events happening near them using their location coordinates and a specified radius. It offers features for booking tickets, viewing event details, and managing user accounts.</h3>

Frontend Technologies
<ul>
<li>Geo-Spatial Search : Finds events within user's radius using their location & radius (converted to radians)
                    EventModel.find({
                              location: {
                                  $geoWithin: {
                                      $centerSphere: [[userlon, userlat], radiusInRadians]}}) </li>

<li>Maps: react-leaflet - Integrates interactive maps for visualizing event locations.</li>

<li>Multi-Step Form for the creating the event by the organiser</li>

<li>  Icons: @fortawesome/free-solid-svg-icons - Provides vector icons for various purposes.</li>

<li>Calendar and Events: @fullcalendar/react - Facilitates displaying bookings and events in a calendar format.</li>

<li>Dashboards: Apexcharts, react-chartjs-2 - Create visually appealing and interactive dashboards for displaying data like event statistics.</li>

<li>Data Fetching: axios - Enables communication with the backend API to retrieve and send data.</li>

<li>UI Framework and Components: bootstrap, react-bootstrap, @mui/material - Provide building blocks for creating responsive and visually appealing user interfaces.</li>

<li>Form Management: formik, yup - Offer tools for building efficient and user-friendly forms with validation.</li>

<li>Authentication and Authorization: jwt-decode - Decodes JWT tokens for user data to enable role-based access control.</li>

<li>Date Formatting: moment - Allows converting and formatting date objects for user-friendliness.</li>

<li>Reviews and Ratings: react-awesome-stars-rating, react-rating-stars-component - Facilitate user reviews and ratings for events.</li>

<li>Timing: react-countdown - Displays a countdown timer for events with limited time availability.</li>

<li>Image Uploads: react-filepond - Enables users to upload images for event profiles.</li>


<li>Carousel: react-multi-carousel - Presents a carousel component for showcasing events based on categories.</li>

<li>QR Codes: react-qr-code - Generates QR codes for secure access or displaying ticket details.</li>

<li>State Management: react-redux, Context API, useReducer - Manage complex application state effectively.</li>

<li>Routing: react-router-dom - Enables navigation between different sections of the app.</li>

<li>Dropdowns and Selects: react-select - Provides dropdown menus and selection options for categories, addresses, etc.</li>

<li>Notifications: react-toastify, sweetalert2 and Snackbar- Display user notifications like success messages, warnings, or errors.</li>

<li>Geo Code: This API is utilized for searching addresses and retrieving their corresponding latitude and longitude coordinates. It enhances location-based features by accurately identifying and geocoding user-provided addresses, thereby improving the precision of location-based services within the application.</li>

<li>React-Select: Implemented for creating dropdown menus that enable users to select addresses and categories. This component enhances user interaction by providing a user-friendly interface for choosing options from predefined lists. It simplifies the process of selecting addresses and categories, contributing to an improved overall user experience within the application.</li>

</ul>


Backend Technologies

<ul>
  
<li>Server Framework: express - Provides the foundation for building the backend API that handles user requests and interacts with the database.</li>

<li>Authentication and Authorization: bcryptjs, jsonwebtoken - Implement secure authentication using password hashing and JWT tokens for user authorization.</li>

<li>Security: express-validator, joi, morgan - Validate user input, prevent vulnerabilities, and log HTTP requests and responses for monitoring.</li>

<li>File Storage: @aws-sdk/client-s3, multer, multer-s3 - Integrate with Amazon S3 cloud storage for uploading and managing event images.</li>

<li>Email Management: nodemailer - Sends emails for functionalities like password reset or notifications after booking the events.</li>

<li>Location and Distance: geolib - Calculates distances between user location and event locations for radius search.</li>

<li>Payments: stripe - Integrates Stripe for secure payment processing of event tickets.</li>

<li>Scheduling Tasks: node-cron - Enables scheduling automated tasks like sending reminder emails or updating event status and Deleting the Booking if payment not paid.</li>
</ul>

Overall, Event Spot leverages a comprehensive set of technologies to deliver a user-friendly and feature-rich online event-finding experience.

BACKEND API
<ol>

<li>User Management:</li>

/api/user/register: Register a new user.
/api/user/login: User login.
/api/user/updatepassword: Update user password.
/api/users: Get all users (for admins).
/api/users/:userId: Deactivate a user account (for admins).

<li>Password Management:</li>

/api/user/forgot-password: Request to reset forgotten password.
/api/reset-password/:id/:token: Reset password using a reset token.

<li>Profile Management:</li>

/api/profile: Create a user profile.
/api/profile: Get user profile.
/api/profile: Update user profile.
/api/profile-all: Get all profiles (for admins).

<li>Event Management:</li>

/api/event: Create an event.
/api/event/:eventId: Get details of a specific event.
/api/event/:eventId: Update an event.
/api/event/approve/:eventId: Approve an event.
/api/event/cancel-approve/:eventId: Cancel approval for an event.
/api/event: Get all events.
/api/org-stats: Get statistics on most popular events.
/api/event/:radius/:userlon/:userlat: Get events within a certain radius of a user's location.
/api/event/:userId/:eventId: Get distance between a user and an event.
/api/organiser-events: Get all events organized by a user.

<li>Booking Management:</li>

/api/event/:eventId/booking: Create a booking for an event.
/api/ticket/:bookedId: Get information about a ticket.
/api/booking/:bookingId: Cancel a booking (for admins).
/api/get/false/bookings: Get all bookings that are not confirmed.

<li>Payment Management</li>

/api/booking/:bookingId/payment: Initiate a payment checkout session.
/api/booking/update-payment: Update payment information.
/api/delete-payment/:paymentId: Delete a payment.

<li>Review Management:</li>

/api/event/:eventId/review: Create a review for an event.
/api/event/:eventId/review/:reviewId: Update a review.
/api/event/:eventId/review/:reviewId: Delete a review.

<li>Category Management:</li>

/api/category: Create a new category (for admins).
/api/categoryall: Get all categories.
/api/category/:categoryId: Get details of a specific category.
/api/category/:categoryId: Update a category (for admins).
/api/category/:categoryId: Delete a category (for admins).
/api/category: Get all categories along with associated events.
/api/category/:categoryId: Get events associated with a specific category.

<li>Admin Dashboard:</li>

/api/dashboard: Get aggregated data for admin dashboard.
</ol>


<div>
<ul>

  <li>
    Home 
    <img width="949" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/706dafc5-ce8e-4838-b090-4cf193d3807e">

  </li>
  <li>
    Category
    <img width="911" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/26db287b-00e8-4d9a-9a1f-c4b5b98ca0ba">

  </li>
  <li>
    All Events
    <img width="856" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/8be1a8fd-845a-4f19-ad42-5707915056d1">

  </li>
  <li>
    Login Page
    <img width="945" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/3f472bbf-f68d-4194-b770-8816c2eb303b">

  </li>
  <li>
    Register page
    <img width="937" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/43830066-e15e-44a5-8cb7-0fb76161b2cd">

  </li>

  <li>
    User Profile Page After Login 
    <img width="944" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/9441f717-056e-4d88-97b6-0d6e9d58b5c3">

  </li>
  <li>
    Single Event Display
    <img width="877" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/3789e580-1891-4561-90aa-379286abf67d">
    <img width="840" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/5717e38a-a775-4cba-b751-1ba288d9bd0e">
    

  </li>
  <li>
    Ticket Booking
    <img width="849" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/728b32bb-d301-496c-8309-ee14b34bfc35">

  </li>
  <li>
    Review 
    <img width="830" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/120dc1c5-a5e8-4aea-beb6-d947ae606079">

  </li>

  <li>
    Booked Tickets in the calender
    <img width="856" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/f5a8a136-b0db-49f3-b635-a06cc571c7f2">

  </li>
  <li>
    Home Loading page
    <img width="872" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/4052f3a0-76b4-4f36-99f1-95104456fe64">

  </li>
</ul>

<ul>
  <li>
    Organiser Dashboard
    <img width="886" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/5588992b-c151-4240-9dcb-365a9cd13eeb">

  </li>
  <li>
    Event Create
    <img width="867" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/4b835d1e-9617-4d91-89c4-eb67e7aec7c0">
    <img width="849" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/d54fcb6d-a821-451e-826a-3315a15e16ab">
    <img width="737" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/9fe5f709-07a5-42ea-9cdf-07342fe817ef">
    <img width="339" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/498c508a-d6af-4b49-82be-87e193ee038c">




  </li>
  <li>
    Event Update
    <img width="900" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/d8a87167-3efc-4b25-a685-00a33fde4928">
    <img width="850" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/77aeb01a-d4aa-46a5-bcc9-23eb7826b42b">


  </li>
  <li>
    Ticket Sold For Single Event
    <img width="842" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/16560aa3-9424-49ce-9069-1878c7374550">

  </li>
  
</ul>

<ul>
    Admin Dashboard
  <li>
    Event Approval List <img width="288" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/f6283ffe-4aeb-46d7-8584-43e44d5815cc">
    <img width="911" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/106a2fa3-8ffc-4ce7-b2ca-fecba75809dc">


  </li>
  <li>
    Activate and Deactivate the Users 
    <img width="849" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/4c863f29-fd08-476d-a52b-83cca02984e4">

  </li>
  <li>
    Admin Dashboard
    <img width="936" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/33df0953-6eac-4c91-9595-a860e511fc3f">

  </li>
  <li>
    Categoty List
    <img width="416" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/24bd0fd4-e012-44d8-b58d-39ba825312c8">

  </li>
</ul>

<ul>
  Forgot password
  <img width="723" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/e6316475-64cd-49f7-a38a-841792705c39">
  <img width="323" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/fdb2227e-3d95-4a7c-a740-9ce5eaa8b010">


</ul>

<ul>
  <li><img width="244" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/068d3456-eb62-4d4d-b02b-d56cd33dad9e">
  <img width="254" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/1e13f22c-7ffa-4109-9b04-91089a4a7353">
  <img width="272" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/70219da1-a2f2-4798-a5a4-2b3c5b26986e">
<img width="395" alt="image" src="https://github.com/VikranthKA/Event-Spot_frontend/assets/130019579/d5ecf555-6882-45f0-903b-29053bea40c5">




  
  </li>


</ul>

  
</div>

