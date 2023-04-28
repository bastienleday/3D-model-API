
require('dotenv').config();



const debug = require("debug")("MAILER");
const nodemailer = require("nodemailer");

debug(process.env.MAIL)



/**
 * @description - function for send mail to user when is register
 * @method - main
 * @param {string} to - email of user
 * @param {string} subject - subject of mail
 * @param {string} message - message of mail
 * @returns {object} - return a function for send mail
 */
async function main(to, subject, message) {
    debug("main");
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    
    auth: {
        user: `${process.env.MAIL}`,
        pass: `${process.env.MAIL_PASSWORD}`
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'api.test.apo@gmail.com', // sender address
    to: `${to}`, // list of receivers
    subject: `${subject}`, // Subject line
    
    html: `${message}`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main('api.test.apo@gmail.com', 'nouvelle notification', '3 personnes ont like votre post')


/**
 * @description - export main function
 */
module.exports = main;


