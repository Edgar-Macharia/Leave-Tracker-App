const { createTransport } = require('nodemailer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();



const transporter = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "edgar.macharia@gebeya.com",
        pass: "iubm nqxo dcji fkwq",
    },
});

exports.sendMail = (recipient, subject, message) => {
    const mailOptions = {
        from: 'Leave Tracker App',
        to: recipient,
        subject: subject,
        html: message,
    };

    if (process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        sendEmailUsingSendgrid(mailOptions);
    } else {
        mailOptions.from = 'Leave Tracker App <edgar.macharia@gebeya.com>';
        sendEmailUsingSMTP(mailOptions);
    }
}

function sendEmailUsingSMTP(mailOptions) {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email via SMTP:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

function sendEmailUsingSendgrid(mailOptions) {
    sgMail
        .send(mailOptions)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error('Error sending email via SendGrid:', error)
        })
}