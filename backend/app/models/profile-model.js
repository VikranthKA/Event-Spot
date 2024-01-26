// const {Schema,model} = require("mongoose")

// const profileSchema = new Schema({
    
//     profilePic:String,
//     description:String,
//     userId:{
//         type:Schema.Types.ObjectId,
//         ref:"UserModel"
//     },
//     addressInfo: {
//         address: String,
//         city: String
//     },
//     location:{
//         type:{
//             type:String,
//             required:true,
//             enum:['Point']
//         },
//         coordinates: {      
//             required:true,
//             type:[Number]       //geospatial data
//         }
//     }, 
//     bookings:[{
//         type:Schema.Types.ObjectId,
//         ref:"UserModel"
//     }]

// })

// const ProfileModel = model("ProfileModel",profileSchema)

// module.exports = ProfileModel





// // # Profile
// //     
// //     
// //     
// //      
// //      - { lat, lng }
// //     : []

const {Schema,model} = require("mongoose")

const profileSchema = new Schema({
    
    profilePic:String,
    description:String,
    userId:{
        type:Schema.Types.ObjectId,
        ref:"UserModel"
    },
    geo :{
        latitude:Number,
        longitude:Number
    },
    address:[{
        type:String,
        required:true
    }],
    bookings:[{
        type:Schema.Types.ObjectId,
        ref:"UserModel"
    }]

})

const ProfileModel = model("ProfileModel",profileSchema)

module.exports = ProfileModel