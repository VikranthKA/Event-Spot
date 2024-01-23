const {Schema,model} = require("mongoose")

const categorySchema = new Schema({
    
    name:String,
    events:[{
        type:Schema.Types.ObjectId,
        ref:"EventModel"
    }]


})

const CategoryModel = model("CategoryModel",categorySchema)

module.exports = CategoryModel







// # Category
//      