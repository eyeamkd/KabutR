let nodemailer = require("nodemailer");
let CronJob = require("cron").CronJob;
let mailCreds = require("./mailCreds.json");
let botToken = require("./botToken.json");
let telegram = require("telegram-bot-api");

let EVENING_MAIL_CONFIRMATION = "";
let MORNING_MAIL_CONFIRMATION = ""; 
let TO_DO = "";
let DAILY_REPORT = "";

let api = new telegram({
  token: botToken.token,
  updates: {
    enabled: true
  }
});

let mailerConfig = {
  service: "Godaddy",
  host: "smtpout.secureserver.net",
  secureConnection: true,
  port: 587,
  auth: {
    user: mailCreds.email,
    pass: mailCreds.password
  }
}; 

let transporter = nodemailer.createTransport(mailerConfig);

let morningMailOptions = {
  from: mailerConfig.auth.user,
  to: mailCreds.mentorMail,
  cc: mailCreds.trainerMail,
  subject: "TO DO",
  text: TO_DO
}; 


let eveningMailOptions = {
    from: mailerConfig.auth.user,
    to: mailCreds.mentorMail,
    cc: mailCreds.trainerMail,
    subject: "DAILY REPORT",
    text: DAILY_REPORT
  };

const morningMail = () => {
  transporter.sendMail(morningMailOptions, function(error) {
    if (error) {
      console.log("error:", error);
    } else {
      console.log("good");
      MORNING_MAIL_CONFIRMATION = "Sent Successfully";  
      api.sendMessage({ 
          chat_id : mailCreds.chatId, 
          text : MORNING_MAIL_CONFIRMATION
      })
    }
  }); 
};

const eveningMail = () => {
  transporter.sendMail(eveningMailOptions, function(error) {
    if (error) {
      console.log("error:", error);
      EVENING_MAIL_CONFIRMATION = error;
    } else {
      console.log("good");
      EVENING_MAIL_CONFIRMATION = "Sent Successfully"; 
      api.sendMessage({ 
        chat_id:mailCreds.chatId, 
        text:EVENING_MAIL_CONFIRMATION
    })
    }
  }); 
  
};

const morningMailReminder = () => { 
    console.log(mailCreds.chatId);
  api
    .sendMessage({
      chat_id: mailCreds.chatId,
      text: "Good Morning Kunal! What tasks have you planned for today"
    })
    .then(() => {
      api.on("message", function(message) {
        if(message.text[0] === '$'){ 
            TO_DO = message.text.substring(1,message.text.length); 
            console.log("Your To do is : ", TO_DO);
        }  
      }); 
    })  
    .catch(err => { 
        console.log("Error in saving message", err);
    })
};

const eveningMailReminder = () => { 
    console.log(mailCreds.chatId);
  api
    .sendMessage({
      chat_id: mailCreds.chatId,
      text: "Good Evening Kunal! What tasks have you done today"
    })
    .then(() => {
      api.on("message", function(message) {
        if(message.text[0] === '#'){ 
            DAILY_REPORT = message.text.substring(1,message.text.length); 
        }  
      });
    });
}; 

let morningMailjob = new CronJob(
  "00 50 12 * * 1-6",
  function() {
    morningMail();
  },
  null,
  true,
  "Asia/Kolkata"
);

let eveningMailjob = new CronJob(
  "00 00 13 * * 1-6",
  function() {
    eveningMail();
  },
  null,
  true,
  "Asia/Kolkata"
); 

let morningMailjobReminder = new CronJob(
    "00 45 12 * * 1-6",
    function() {
      morningMailReminder();
    },
    null,
    true,
    "Asia/Kolkata"
); 

let eveningMailjobReminder = new CronJob(
    "00 55 12 * * 1-6",
    function() {
      eveningMailReminder();
    },
    null,
    true,
    "Asia/Kolkata"
);

morningMailjob.start(); 
eveningMailjob.start();  

morningMailjobReminder.start(); 
eveningMailjobReminder.start(); 



