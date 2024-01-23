const EventModel = require("../models/event-model")
const UserModel = require("../models/user-model")

const adminCltr = {}

adminCltr.dashboard=async(req,res)=>{
//get all the event which are not Approved

try{
    const event =await EventModel.find({isApproved:false})
    if(!event ){
        res.status(400).json(event)
    }else if(event.length===0){
        res.status(200).json({data:event,message:"All event are approved"})
    }

}catch(err){

    console.log(err)
    res.status(500).json(err)
}


adminCltr.approveTrue  = async(req,res)=>{
    const {id}=body//also make as params
    try{
        const eventApprove = await EventModel.findByIdAndUpdate({_id:id},{isApproved:true},{new:true})
        if(!eventApprove){
            res.status(404).json({data:eventApprove,message:"Event cannot be found"})
        }
        res.status(200).json(eventApprove)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

adminCltr.getUser = async(req,res)=>{
    try{
      const userData  = await UserModel.find()
      return res.status(200).json(userData)
    }catch(err){
      console.log(err)
      return res.status(500).json(err)
    }
  }
//get all the revenue
//get all the new customer from today
//get all the events
//get all bookings
//get users map on the dashboard
//get all the organiser
//get the top 10 most purchased event tickets
//get all the user and event can be categories based on the country
//get all the completed events and its stat 
//get the user with type of payment and the currency type

}