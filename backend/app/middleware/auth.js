const jwt = require("jsonwebtoken")

const authenticateUser = (req,res,next)=>{
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
        next()

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