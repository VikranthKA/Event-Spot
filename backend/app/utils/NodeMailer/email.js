const nodemailer = require("nodemailer")

const sendEmail =async (options)=>{
    //create a  transport
    const transport = nodemailer.createTransport({
        host:process.env.EMIAL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_PASSWORD,
            pass:process.env.EMAIL_PASSWORD
        }


    })

    const emailOptions = {
        from:'Event-Spot support<support@event_spot.com>',
        to:options.email,
        subject:options.subject,
        text:options.message


    }
    await transport.sendMail(emailOptions)
        // .then(res=>console.log(res))
        // .catch(err=>console.log(err))


}

module.exports = sendEmail