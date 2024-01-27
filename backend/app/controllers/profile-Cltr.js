require("dotenv").config()
const ProfileModel = require("../models/profile-model")
const _ = require("lodash")
const { validationResult } = require("express-validator")
const axios = require("axios")

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
    try {
      const body = {
        profilePic: req.file.filename, // This will contain information about the uploaded file
        description: req.body.description,
        address: req.body.address,
        place_id: req.body.place_id,
        lonlat: req.body.lonlat,
        city: req.body.city,
      };
  
      // Process the data as needed (e.g., save to the database)
      const profile = new ProfileModel(body)
      await profile.save()
      // Respond with the processed data
      res.status(200).json(body);
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


profileCltr.update= async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }else{
        const body = _.pick(req.body,["profilePic","description","addressInfo"])
        try{
            const profileInfo = await ProfileModel.findOneAndUpdate({id:req.user.id},body,{new:true})
            if(!profileInfo){
                return res.status(404).json({err:"Profile/user not found "})
            }
            profileInfo.addressInfo = {
                    address:body.addressInfo.address,
                    city:body.addressInfo.city
                }
    
                
                let longitude
                let latitude
                const data = await getCoByGeoCode(body.addressInfo.address)
                if(!data || data.length===0){
                    return res.status(404).json({err:"Try give correct spelling"})
                }
                
                data.map((ele)=>{
                    longitude = ele.lat
                    latitude = ele.lon
                })
        
                
                profileInfo.location = {
                    type:"Point",
                    coordinates:[longitude,latitude]
                }

        }catch(err){
            console.log(err)
            return res.status(500).json(err)
        }
    } 
}

profileCltr.getAll=async(req,res)=>{
    try{
        const allProfile=await ProfileModel.find()
        res.status(200).json(allProfile)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

profileCltr.getOne=async(req,res)=>{
    try{
        const allProfile= ProfileModel.findOne({_id:req.user.id}).populate('userId')
        if(!allProfile){
            res.status(404).json({error:"User not found"})
        }
        res.status(200).json(allProfile)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

//The user cannot delete his profile but admin can or not
// profileCltr.delete=async(req,res)=>{
//     try{
//         const allProfile= ProfileModel.findOneAndDelete({_id:req.user.id})
//         if(!allProfile){
//             res.status(404).json({error:"User not found"})
//         }
//         res.status(200).json({error:allProfile})
//     }catch(err){
//         console.log(err)
//         res.status(500).json(err)
//     }
// }



module.exports = profileCltr

