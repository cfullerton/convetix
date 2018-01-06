const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const request = require('request');
const EVENT_TABLE = process.env.EVENT_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

app.post('/create-event', function (req, res) {
  const {eventName, venueId,imageURL,description,date,doorTime,showTime,ticketType} = req.body;
  const params = {
    TableName: EVENT_TABLE,
    Item: {
      eventName: eventName,
      venueId:venueId,
      imageURL:imageURL,
      description:description,
      date:date,
      doorTime:doorTime,
      showTime:showTime,
      ticketType:ticketType,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      theError = error;
      res.status(400).json({ error: theError });
    }
    req.send("worked")
  });
})
module.exports.handler = serverless(app);
