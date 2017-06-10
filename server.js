const
	express = require('express')
	request = require('request')
	axios = require('axios')
  bodyParser = require('body-parser')
  port = process.env.PORT ? process.env.PORT : 3000
  config = require('./config/secret')
  rhyme = require('./utils/rhyme')

const app = express()
app.use(bodyParser.json());

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

      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", Object.keys(event));
        }
      });
    });
    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  if(event.message.is_echo)
  {
    console.log('Received');
  }
  else if(event.message.text)
  {
    console.log("Message data: ", event.message.text);
    var text = event.message.text;
    rhyme(event.sender.id,text)
  }
}



app.get('/',(req,res)=>{
	res.send('<h1>Hello World.</h1>')
})
app.listen(port,()=>{
	console.log("live on ",port)
})
