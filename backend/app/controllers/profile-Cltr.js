require("dotenv").config()
const ProfileModel = require("../models/profile-model")
const _ = require("lodash")
const { validationResult } = require("express-validator")
const axios = require("axios")
const UserModel = require("../models/user-model")


async function getCoByGeoCode(data,res){
    try{
    const addressResponse =await axios.get(`https://geocode.maps.co/search?q=${data}&api_key=${process.env.GEO_CODE_API_KEY}`)
    if(addressResponse.data.length===0){
        return res.status(404).json({error:"Please give the correct Name of the place check if miss spell or try give another nearer location"})
    }
    return addressResponse.data
    }catch(err){
        console.log(err)
        return res.status(404).json(err)
    }
}

const profileCltr = {}

profileCltr.create = async (req, res) => {
    console.log(req.body)

    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json(error)
    }
    const body = _.pick(req.body,["description","address","lonlat","city"])
    try {
        const profile = new ProfileModel({
        userId:req.user.id,
        profilePic: req.file.filename,
        description: body.description,
        addressInfo: {
            address: body.address,
            city: body.city
        },
        location : {
            type: "Point",

            coordinates: [body.lonlat.lon, body.lonlat.lat]
        },
      })
  
        await profile.save()
      const result = profile.populate("userId")
        return res.status(200).json(result) 
    } catch (error) {
      console.error('Error creating profile:', error)
      return res.status(500).json(error);
    }
  }


  profileCltr.update = async (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        console.log(error)
        return res.status(400).json(error)
    }
    console.log(req.params.profileId)
    const body = _.pick(req.body,["description","address","lonlat","city"])
    try {
        const updatedProfile = {
        userId:req.user.id,
        description: body.description && body.description,
        addressInfo: {
            address:body.address && body.address,
            city:body.city && body.city
        },
        location : {
            type: "Point",

            coordinates: [body?.lonlat?.lon ,  body?.lonlat?.lat]
        },
      }
      if(req.file)  updatedProfile.profilePic

      
      const profile = await ProfileModel.findOneAndUpdate({_id:req.params.profileId},{userId:req.user.id},updatedProfile,{new:true})
      const result = profile.populate("userId")

      return res.status(200).json(result) 
    } catch (error) {
      console.error('Error creating profile:', error)
      return res.status(500).json(error);
    }
  }


profileCltr.getAll=async(req,res)=>{
    try{
        const allProfile=await ProfileModel.find().populate("userId")
        res.status(200).json(allProfile)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

profileCltr.getOne = async (req, res) => {

    try {
        // Find the profile by profileId and ensure it belongs to the authenticated user
        const profile = await ProfileModel.findOne({ userId: req.user.id} ).populate("userId").populate("bookings")
        
        if (!profile) {
            // If profile is not found or doesn't belong to the authenticated user
            return res.status(404).json({ error: "Profile not found " });
        } 
        // const event = await EventModel.findById({_id:profile.eventId})
        


        return res.status(200).json(profile);
    } catch (err) {
        console.error(err);
    
        // Handle unexpected errors
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
    
// The user cannot delete his profile but admin can or not
profileCltr.delete=async(req,res)=>{
    try{
        const allProfile= ProfileModel.findOneAndDelete({_id:req.user.id})
        if(!allProfile){
            res.status(404).json({error:"User not found"})
        }
        res.status(200).json({error:allProfile})
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}



module.exports = profileCltr  

