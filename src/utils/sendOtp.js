import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user : process.env.NODEMAILER_EMAIL,
        pass : process.env.NODEMAILER_PASSWORD
    }
})

const sendOtp = async (to,otp) => {
    try {
        const send = await transporter.sendMail({
            to: to,
            subject: "OTP for verification",
            text: `Your OTP is ${otp}`,
        });
    
        console.log("Message sent: %s", send.messageId);
    } catch (error) {
        console.log(error);
    }
}

export { sendOtp };