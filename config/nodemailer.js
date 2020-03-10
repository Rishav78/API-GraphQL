const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
        type: 'login',
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.sendMail = (to, token) => {
    return transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: 'Verification Email',
        text: "Click the link to verify your account",
        html: `<a href="http://localhost:${process.env.PORT}/verify/${token}">Verify</a>`
    });
}
