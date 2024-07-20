const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'deontae.pfannerstill@ethereal.email',
        pass: 'GusmmVRBBJ1T4Hpcjh'
    }
});

const send =  (info) => {
    return new Promise(async (resolve, reject) => {

    try {
    // send mail with defined transport object
    const result = await transporter.sendMail(info);

  console.log("Message sent: %s", result.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

    resolve(result)
    }catch (error){
        console.log(error);



    }
})

  
}
const emailProcessor = (email, pin) => {

    const info = {
        from: '"TMS Company" <deontae.pfannerstill@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password reset Pin", // Subject line
        text: "Here is your password reset pin" + pin + "This will expires in 1 day", // plain text body
        html: `<b>Hello </b>
        Here is your pin
        <b>${pin}</b>
        This pin will expires in 1 day
        <p></p>`, // html body

    }
    send(info)


}

module.exports = {
    emailProcessor
}