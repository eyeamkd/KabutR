let nodemailer = require("nodemailer");
let CronJob = require("cron").CronJob;
let mailCreds = require("./mailCreds.json");
let botToken = require("./botToken.json");
let telegram = require("telegram-bot-api"); 
const figlet = require("figlet");

let EVENING_MAIL_CONFIRMATION = "";
let MORNING_MAIL_CONFIRMATION = "";
let TO_DO = "";
let DAILY_REPORT = "";
let d = new Date();
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
  subject: `TO DO | ${d.getDate} + "." + ${d.getMonth} + ${d.getFullYear}`,
  text: ""
};

let eveningMailOptions = {
  from: mailerConfig.auth.user,
  to: mailCreds.mentorMail,
  cc: mailCreds.trainerMail,
  subject: `TO DO | ${d.getDate} + "." + ${d.getMonth} + ${d.getFullYear}`,
  text: ""
};

const morningMail = () => {
  if (TO_DO !== null) {
    transporter.sendMail(morningMailOptions, function(error) {
      if (error) {
        console.log("error:", error);
      } else {
        console.log("good");
        MORNING_MAIL_CONFIRMATION = "Wah Dubey ji Wah! 😎 Sent Successfully";
        api.sendMessage({
          chat_id: mailCreds.chatId,
          text: MORNING_MAIL_CONFIRMATION
        });
      }
    });
  } else {
    api.sendMessage({
      chat_id: mailCreds.chatId,
      text:
        "What Kunal, you didn't send me the Tasks 😑😑. KabutR couldn't send the mail"
    });
  }
  TO_DO = null;
};

const eveningMail = () => {
  if (DAILY_REPORT !== null) {
    transporter.sendMail(eveningMailOptions, function(error) {
      if (error) {
        console.log("error:", error);
      } else {
        console.log("good");
        EVENING_MAIL_CONFIRMATION =
          "Great Job, I've sent the mail to your mentors! You can happily Enjoy now 🎉";
        api.sendMessage({
          chat_id: mailCreds.chatId,
          text: EVENING_MAIL_CONFIRMATION
        });
      }
    });
  } else {
    api.sendMessage({
      chat_id: mailCreds.chatId,
      text:
        "What Kunal, you didn't send me the Daily Report 😑😑. KabutR couldn't send the mail"
    });
  }
  DAILY_REPORT = null;
};

const morningMailReminder = () => {
  console.log(mailCreds.chatId);
  api
    .sendMessage({
      chat_id: mailCreds.chatId,
      text: "Good Morning Kunal! 🤗  What tasks have you planned for today"
    })
    .then(() => {
      api.on("message", function(message) {
        if (message.text[0] === "$") {
          messageText = message.text.toString();
          console.log(messageText);
          TO_DO =
            messageText.substring(1, messageText.length) +
            "\nRegards, \n" +
            "Kunal :)";
          console.log("Your To do is : ", TO_DO);
          morningMailOptions.text = TO_DO;
          morningMailOptions.subject =
            "TO DO | " +
            d.getDate() +
            "." +
            String(d.getMonth() + 1) +
            "." +
            d.getFullYear();
        }
      });
    })
    .catch(err => {
      console.log("Error in sending daily Report ", err);
      api.sendMessage({
        chat_id: mailCreds.chatId,
        text:
          "Sorry Kunal 🥺 . An Error occured due to which i couldn't send the mail"
      });
    });
};

const eveningMailReminder = () => {
  console.log(mailCreds.chatId);
  api
    .sendMessage({
      chat_id: mailCreds.chatId,
      text:
        "Hey Kunal! 🎈" +
        "\n" +
        "Hope you had a great day at Office Today \n" +
        " What tasks have you done today ?"
    })
    .then(() => {
      api.on("message", function(message) {
        if (message.text[0] === "#") {
          messageText = message.text.toString();
          console.log(messageText);
          DAILY_REPORT =
            messageText.substring(1, messageText.length) +
            "\nRegards, \n" +
            "Kunal :)";
          console.log("Your Daily Report is : ", DAILY_REPORT);
          eveningMailOptions.text = DAILY_REPORT;
          eveningMailOptions.subject =
            "DAILY REPORT | " +
            d.getDate() +
            "." +
            String(d.getMonth() + 1) +
            "." +
            d.getFullYear();
        }
      });
    })
    .catch(err => {
      console.log("Error in sending daily Report ", err);
      api.sendMessage({
        chat_id: mailCreds.chatId,
        text:
          "Sorry Kunal 🥺 . An Error occured due to which i couldn't send the mail"
      });
    });
};

let morningMailjobReminder = new CronJob(
  "00 00 9 * * 1-6",
  function() {
    morningMailReminder();
  },
  null,
  true,
  "Asia/Kolkata"
);

let morningMailjob = new CronJob(
  "00 30 9 * * 1-6",
  function() {
    morningMail();
  },
  null,
  true,
  "Asia/Kolkata"
);

let eveningMailjobReminder = new CronJob(
  "00 00 18 * * 1-6",
  function() {
    eveningMailReminder();
  },
  null,
  true,
  "Asia/Kolkata"
);

let eveningMailjob = new CronJob(
  "00 30 18 * * 1-6",
  function() {
    eveningMail();
  },
  null,
  true,
  "Asia/Kolkata"
);

figlet.text('KabutR', {
  font: 'Doh',
  horizontalLayout: 'default',
  verticalLayout: 'default'
}, function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  console.log(data); 
}); 



morningMailjob.start();
eveningMailjob.start();

morningMailjobReminder.start();
eveningMailjobReminder.start();
