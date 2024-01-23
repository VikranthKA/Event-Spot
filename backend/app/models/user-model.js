const {Schema,model} = require("mongoose")

const userSchema = new Schema({
    
    username:String,
    email:String,
    password:String,
    mobile :Number,
    role:String,

})

const UserModel = model("UserModel",userSchema)

module.exports = UserModel