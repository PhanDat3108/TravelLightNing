const nodemailer = require('nodemailer');
require('dotenv').config();
const secure = process.env.MAIL_SECURE == "true"
const transporter = nodemailer.createTransport({

    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: secure,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

module.exports.sendMail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: `"TravelLightNing" <${process.env.MAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Đã gửi mail thành công: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        throw error;
    }
};
