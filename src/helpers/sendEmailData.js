const nodemailer = require('nodemailer');



const sendFileEmail = (data) =>{

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    const emailsToSend = process.env.EMAILS_TO_SEND_DATA.split(',').map(email => email.trim());
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: emailsToSend.join(', '),
        subject: 'Auditoria entre usuarios banner y blackboard',
        text: 'Adjunto encontrarás el archivo Excel ',
        attachments: [
            {
                filename: 'data.xlsx',
                content: data
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar el correo electrónico:", error);
        } else {
            console.log("Correo electrónico enviado:", info.response);
        }
    });
}



module.exports = {sendFileEmail};