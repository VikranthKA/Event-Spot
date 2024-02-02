const jwt = require("jsonwebtoken")
const UserModel = require("../models/user-model")

const authenticateUser =async (req,res,next)=>{
    const token = req.headers["authorization"]
    if(!token){
        return res.status(400).json({errors:"jwt token is missing"})
    }
    try{
        const tokenData = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {
            id:tokenData.id,
            role:tokenData.role
        }
        const user = await UserModel.findById(req.user.id)
        if(user.isActive){
            next()
        }else{
            return res.status(403).json("You'r account is blocek by user")
        }

    }catch(err){
        console.log(err)
        res.status(400).json(err)
    }
}



const authorizeUser = (role)=>{
     return(req,res,next)=>{
        if(role.includes(req.user.role)){
            next()
        }
        else{
            res.status(403).json({error:"You are not Authorized to access the Data"})
        }
     }
}

module.exports= {
    authenticateUser,authorizeUser
}