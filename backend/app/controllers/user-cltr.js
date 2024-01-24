const { validationResult } = require("express-validator")
const UserModel = require("../models/user-model")
const _ = require("lodash")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const email = require("../utils/NodeMailer/email")
const sendEmail = require("../utils/NodeMailer/email")

const userCltr = {}

userCltr.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  } else {
    const body = _.pick(req.body, ["username", "email", "password", "number", "role"]);

    try {
      const user = new UserModel(body);
      const salt = await bcryptjs.genSalt();
      
      const encryptedPwd = await bcryptjs.hash(user.password, salt);
      user.password = encryptedPwd;

      const userCount = await UserModel.countDocuments();

      if (userCount === 0) {
        user.role = "Admin";
      }

      await user.save();
      return res.status(201).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }
};


userCltr.login =async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }else{
        const body  = _.pick(req.body,["email","password"])
        try{
            const user = await UserModel.findOne({email:body.email})
            console.log(user)
            if(!user){
                return res.status(400).json({error:"invalid email/password"})
            }
            const result = await bcryptjs.compare(body.password,user.password)
            if(!result){
                return res.status(400).json({error:"invalid email/password"})
            }
            const tokenData = {
                id:user._id,
                role:user.role
            }
            const token = jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:"14d"})
            res.status(200).json({token})
            
        }catch(err){
            console.log(err)
            return res.status(500).json(err)
        }
    }
}




userCltr.updatePassword = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors })
  } else {
    const body = _.pick(req.body, ["newPassword", "changePassword"])

    try {
      if (body.newPassword === body.changePassword) {
        const tempUser = await UserModel.findOne(req.user.id) //check its one or id

        if (!tempUser) {
          return res.status(404).json({ error: "User not found" })
        }

        const salt = await bcryptjs.genSalt();
        const encryptedPwd = await bcryptjs.hash(body.changePassword, salt)

        const user = await UserModel.findOneAndUpdate(
          { _id: req.user.id },
          { password: encryptedPwd },
          { new: true }
        );

        return res.status(200).json(user);
      } else {
        return res.status(400).json({ error: "New passwords do not match" })
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }
};




userCltr.getAll =async(req,res)=>{
  try{
    const userData  = await UserModel.find()
    return res.status(200).json(userData)
  }catch(err){
    console.log(err)
    return res.status(500).json(err)
    
    
  }
}

///check userCltr.forgotPassword

userCltr.forgotPassword = async(req,res)=>{
  //Get user based on the posted email
  
  //add lodash
  const user = await UserModel.findOne({email:req.body.email})
  if(!user) res.status(404).json("Email not found",404)
  
  //generate a random reset token
  const resetToken = adsf


  //send the token back to the user email
  const resetUrl = `${req.protocol}://${req.get(process.env.SERVER_URL)}/api/v1/users/resetPassword/${resetToken}`
 const message = `below link to reset ${resetUrl}`
 try{
   await sendEmail({
     email:user.email,
     subject:"Password Change",
     message:message
   })
   res.status(200).json({status:"sucess",msg:"sent success "})
 }catch(err){
  console.log(err)
  // user.passwordResetToken = undefined
  // user.passwordResetTokenExpires = undefined
  // user.save({validationBeforeSave:false})
  return next(new CustomerError("error inpwd sending"))
 }


}




module.exports = userCltr