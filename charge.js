const serverless = require('serverless-http');
const express = require('express');
const stripe = require("stripe")('sk_test_7YbMPNI5AFmDzzqisAH2yI6P');
const app = express()
const request = require('request');
//test variables
ticketId = "32342318";
venueId = "1";
eventId = "1";
app.use(require("body-parser").urlencoded({extended: false}));
app.post("/charge", (req, res) => {
  console.log(req.body);
  let amount = 500;
  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "usd",
         customer: customer.id
    }))
  .then(charge => {
    var snsMessage = {ticketId:"df234235",
    venueId:"1",
    eventId:"1",
    username:req.body.stripeEmail
    };

    request({
      url: "https://ufnrkytl70.execute-api.us-east-1.amazonaws.com/dev/tickets",
      method: "POST",
      json: true,   // <--Very important!!!
      body: snsMessage
    }, function (error, response, body){
      if(error){
        console.log(error)
      }else{
        console.log(body)
        console.log("----------------------")
        console.log(response);
      }
      res.send("email sent to" + body.stripeEmail)
    });

  });
});

module.exports.handler = serverless(app);
