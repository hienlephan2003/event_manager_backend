
// const nodemailer = require("nodemailer");
import * as nodemailer from 'nodemailer'

module.exports = async(email:any, subject:any, text:any) => {
    try {
        // host: "fdf",
        //     service: process.env.SERVICE,
        //     post: Number(process.env.EMAIL_POST),
        //     secure: Boolean(process.env.SECURE),
        //     auth: {
        //         user:process.env.USER,
        //         pass:process.env.PASS
        //     }
        
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            secure: Boolean(process.env.SECURE),
            port:Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS  
            }
            
        })
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            html: text
        })
        console.log("Email sent successfully")
    }

    catch(e) {
        console.log("Email not sent")
        console.log(e)
    }
}   