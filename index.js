let nodemailer = require('nodemailer'); 
let  CronJob = require('cron').CronJob;  
let mailCreds =  require('./mailCreds.json'); 
let botToken = require('./botToken.json'); 
let telegram = require('telegram-bot-api');

let EVENING_MAIL_CONFIRMATION = ''; 
let MORNING_MAIL_CONFIRMATION = ''; 

let api = new telegram({
    token: botToken.token,
    updates: {
        enabled: true
}
});
api.on('message', function(message)
{
   console.log(message);
});
let mailerConfig = {    
    service: 'Godaddy',
    host: "smtpout.secureserver.net",  
    secureConnection: true,
    port: 587,
    auth: {
        user: mailCreds.email,
        pass: mailCreds.password
    }
};
let transporter = nodemailer.createTransport(mailerConfig);

let mailOptions = {
    from: mailerConfig.auth.user,
    to: mailCreds.mentorMail, 
    cc: mailCreds.trainerMail,
    subject: 'Some Subject',
    html: `<body>` +
        `<p>Hey Dude</p>` +
        `</body>`
};

const morningMail = () => {  
    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log('error:', error); 
            MORNING_MAIL_CONFIRMATION = error; 
        } else {
            console.log('good'); 
            MORNING_MAIL_CONFIRMATION = "Sent Successfully"; 
        }
    } 
    ); 
}  

const eveningMail = () => {  
    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log('error:', error); 
            EVENING_MAIL_CONFIRMATION = error; 
        } else {
            console.log('good'); 
            EVENING_MAIL_CONFIRMATION = "Sent Successfully"; 
        }
    } 
    ); 
}  

var morningMailjob = new CronJob('00 49 10 * * 1-6', function() {
    morningMail();
  }, null, true, 'Asia/Kolkata'); 

var eveningMailjob = new CronJob('00 30 18 * * 1-6', function() {
    morningMail();
  }, null, true, 'Asia/Kolkata');
 
  morningMailjob.start(); 

morningMail();