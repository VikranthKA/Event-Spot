 const profileValidationSchema = {
    // "profilePic","description","addressInfo" 
    profilePic: {

        custom: {
            options: async function (value, { req }) {
                if (!req.file) {
                    throw new Error("Please upload a profile picture");
                }
    
                const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                console.log('Uploaded file MIME type:', req.file.mimetype);
    
                if (!allowedTypes.includes(req.file.mimetype)) {
                    console.log(req.file.mimetype,"in if")
                    throw new Error('Picture should be in these formats: ' + allowedTypes.join(', '));
                }
    
                return true;
            }
        }
    }
    
    ,

    description:{
        notEmpty:{
            errorMessage:"Give a valid description or Bio"
        },
        isLength:{
            options:{min:5,max:100},
            errorMessage:"Description must be btw 5 to 100"
        }
    },


    "addressInfo.address":{
            notEmpty:{
                errorMessage:"Address cannot be empty"
            },
            isLength:{
                options:{min:5,max:100},
                errorMessage:"address length btw 5 to 100"
            }
    },

    "addressInfo.city":{
        notEmpty:{
            errorMessage:"City cannot be empty"
        },
        isLength:{
            options:{min:2,max:100},
            errorMeaasge:"City lenght should be more than 2  "
        }
    }
 }

 module.exports = {profileSchema:profileValidationSchema}













