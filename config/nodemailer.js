const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    // secure: false,
    // port: 25,
    auth: {
        type: 'login',
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log(process.env.EMAIL, process.env.PASSWORD)

exports.sendMail = (to, token) => {
    // console.log(transporter)
    return transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: 'Verification Email',
        text: "Click the link to verify your account",
        html: `<a href="http://localhost:${process.env.PORT}/verify/${token}">Verify</a>`
    });
}
