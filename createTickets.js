const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const request = require('request');
const s3 = new AWS.S3();
const TICKET_TABLE = process.env.TICKET_TABLE;
const BC_S3 = process.env.BC_S3;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

// Get User endpoint
app.get('/tickets/:ticketId', function (req, res) {
  const params = {
    TableName: TICKET_TABLE,
    Key: {
      ticketId: req.params.ticketId,
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get user' });
    }
    if (result.Item) {
      const {ticketId, venueId,eventId,username} = result.Item;
      res.json({ ticketId, username });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
})

// Create Ticket in db
app.post('/tickets', function (req, res) {
  const {ticketId, venueId,eventId,username} = req.body;
  if (typeof ticketId !== 'string') {
    res.status(400).json({ error: '"ticketId" must be a string' });
  }

  const params = {
    TableName: TICKET_TABLE,
    Item: {
      ticketId: ticketId,
      venueId:venueId,
      eventId:eventId,
      username:username
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      theError = error;
      res.status(400).json({ error: theError });
    }
    var imageURL= 'http://bwipjs-api.metafloor.com/?bcid=code128&text=' + params.Item.ticketId;
    var options = {
        uri: imageURL,
        encoding: null
    };
    request(options, function(error, response, body) {
        if (error || response.statusCode !== 200) {
            console.log("failed to get image");
            console.log(error);
        } else {
            console.log(params.Item.ticketId)
            filename = params.Item.ticketId +".png";
            snsMessage ='{"toEmail":"'+ params.Item.username +'","id": "'+params.Item.ticketId+'"}';
            s3.putObject({
                Body: body,
                Key: filename,
                Bucket: BC_S3
            }, function(error, data) {
                if (error) {
                    console.log(error);
                    console.log("error downloading image to s3");
                } else {
                    console.log("success uploading to s3");
                    var sns = new AWS.SNS();

                    sns.publish({
                      Message: snsMessage,
                      TopicArn: 'arn:aws:sns:us-east-1:112028903682:sendMail'
                    }, function(err, data) {
                      if (err) {
                        console.log(err.stack);
                        return;
                      }
                      console.log('push sent');
                      console.log(data);
                      res.json({ ticketId, username });
                    });

                }
            });
        }
    });

  });
})
module.exports.handler = serverless(app);
