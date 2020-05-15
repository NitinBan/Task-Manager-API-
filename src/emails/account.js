const sgMail = require("@sendgrid/mail");

//const sendgridAPIKey = "";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "nitin.kb09@gmail.com",
    subject: "Welcome to the Task Manager App",
    text: `Welcome to the app, ${name} . Let me know how are you?`,
    html: "",
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "nitin.kb09@gmail.com",
    subject: "Cancelation to the Task Manager App",
    text: `Good bye, ${name} . Let me know how are you?`,
    html: "",
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
