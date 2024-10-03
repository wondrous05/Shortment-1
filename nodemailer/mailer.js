const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
     service: 'Gmail',
      port: 465,
      secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendMail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
      console.log("Message sent: %s", info.messageId);
    });
  });
};

module.exports = {
  sendMail
};
