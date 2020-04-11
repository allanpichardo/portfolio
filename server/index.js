import dotenv from "dotenv";
import * as nodemailer from "nodemailer";

const app = require('./app').default;
const PORT = process.env.PORT || 3001;

const express = require('express');
const emailApp = express();
const https = require('https');
const fs = require('fs');

let privateKey  = fs.readFileSync('/etc/letsencrypt/live/talkinghead.allanpichardo.com/privkey.pem', 'utf8');
let certificate = fs.readFileSync('/etc/letsencrypt/live/talkinghead.allanpichardo.com/fullchain.pem', 'utf8');

let credentials = {key: privateKey, cert: certificate};

emailApp.use(express.urlencoded({ extended: true }));
emailApp.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let httpsServer = https.createServer(credentials, emailApp);

const EMAIL_PORT = 3002;

dotenv.config();

emailApp.post('/email', (req, res) => {
  let response = {
    success: false,
    message: ''
  };

  dotenv.config();

  if(!req.body.from || !req.body.subject || !req.body.message) {
    response.message = "Missing fields";
    res.json(response);
    return;
  }

  let from = req.body.from;
  let subject = req.body.subject;
  let message = req.body.message;

  let transporter = nodemailer.createTransport({
    pool: true,
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    secure: false, // use TLS,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    },
    tls: {
      secureProtocol: "TLSv1_method",
      rejectUnauthorized: false,
    }
  });

  transporter.sendMail({
    from: "webform@allanpichardo.com", // sender address
    to: "webform@allanpichardo.com", // list of receivers
    subject: `${from}: ${subject}`, // Subject line
    text: message
  }).then((info) => {
    response.success = true;
    response.message = "Sent!";
    response.info = info;
    res.json(response);
  }).catch((e) => {
    response.message = e.message;
    res.json(response);
  });

});

httpsServer.listen(PORT, () => {
  console.log(`CRA Server listening on port ${PORT}!`);
  emailApp.listen(EMAIL_PORT, () => {
    console.log(`EMAIL Server listening on port ${EMAIL_PORT}!`);
  })
});
