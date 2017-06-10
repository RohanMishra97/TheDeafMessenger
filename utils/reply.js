const config = require('../config/secret')

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

      console.log("Sent");
    } else {
      console.error("Unable to send message.");
      console.error("Failed Response - 103");
      if(error) {
        console.error("Error - 105");
      }
    }
  });  
}

module.exports.replyText = function sendTextMessage(receipientID, text) {
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