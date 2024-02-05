const nodemailer = require("nodemailer")

const sendEmail =async (options)=>{
    //create a  transport
    const transport = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_PASSWORD,
            pass:process.env.EMAIL_PASSWORD
        },
        authMethod:"LOGIN",
        secure: false


    })

    const emailOptions = {
        from:'Event-Spot support<support@event_spot.com>',
        to:options.email,
        subject:options.subject,
        text:options.message


    }
    try{

        await transport.sendMail(emailOptions)
        console.log("Email send Successfully")
    }catch(err){
        console.log(err)
        
    }
        // .then(res=>console.log(res))
        // .catch(err=>console.log(err))


}

module.exports = sendEmail