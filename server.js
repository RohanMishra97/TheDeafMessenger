const
	express = require('express')
	request = require('request')
	axios = require('axios')
  bodyParser = require('body-parser')
  port = process.env.PORT ? process.env.PORT : 3000
  config = require('./config/secret')

const app = express()
app.use(bodyParser.json());

function rhyme(text) {
  var url = 'http://rhymebrain.com/talk?function=getRhymes&word='+text.split(' ')[text.split(' ').length-1]+'&maxResults=6'
  var i = Math.floor(Math.random()*10)
  axios.get(url)
  .then(res=>res.data[i])
  .then(res=>{console.log(res.word);return res.word})
  .catch("Hain")
}

app.get('/webhook',(req,res)=>{
	if(req.query['hub.mode'] === 'subscribe' && 
	   req.query['hub.verify_token'] === config.verify_token) {
		console.log("Validating Webhook")
		res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error('Failed validation, make sure the tokens match');
		res.sendStatus(403);
	}
})

app.post('/webhook', function (req, res) {
  var data = req.body;
  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", Object.keys(event));
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  if(event.message.is_echo)
    return
  if(event.message.text)
  {
    console.log("Message data: ", event.message);
    var text = event.message.text;
    var reply = rhyme(text)
    console.log(reply)
    sendTextMessage(event.sender.id,reply)
  }
}

function sendTextMessage(receipientID, text) {
	var messageData = {
		'recipient': {
			'id': receipientID
		},
		message: {
			'text': text
		}
	}
	callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: config.page_access_token },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent!");
    } else {
      console.error("Unable to send message.");
      console.error("Response - ",Object.keys(response));
      if(error) {
        console.error("Error - ",Object.keys(error));
      }
    }
  });  
}

app.get('/',(req,res)=>{
	res.send('<h1>Hello Rohan.</h1>')
})
app.listen(port,()=>{
	console.log("live on ",port)
})
