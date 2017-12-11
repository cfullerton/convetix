var aws = require('aws-sdk');
var ses = new aws.SES({
   region: 'us-east-1'
});

exports.handler = function(event, context) {
  var message = JSON.parse(event.Records[0].Sns.Message);
    console.log(message);
    var attachmentPath = "https://s3.amazonaws.com/barcode-tickets-s3/"+message.id+".png"
    var html='This is your ticket <img src="'+attachmentPath+'"/>'
    var eParams = {
        Destination: {
            ToAddresses: [message.toEmail]
        },
        Message: {
            Body: {
                Text: {
                    Data: message.id
                },
                Html:{
                  Data:html
                }
            },
            Subject: {
                Data: "Ticket From convetix"
            }

        },
        Source: "cfullerton@convetix.com"
    };

    console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(eParams, function(err, data){
        if(err) console.log(err);
        else {
            console.log("===EMAIL SENT===");
            console.log(data);


            console.log("EMAIL CODE END");
            console.log('EMAIL: ', email);
            context.succeed(event);

        }
    });

};
