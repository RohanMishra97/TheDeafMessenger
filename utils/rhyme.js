const reply = require('./reply')

module.exports = function rhyme(id,text) {
  var url = 'http://rhymebrain.com/talk?function=getRhymes&word='+text.split(' ')[text.split(' ').length-1]+'&maxResults=6'
  var i = Math.floor(Math.random()*10)
  axios.get(url)
  .then(res=>res.data[i])
  .then(res=>{
    if(!res){
      sendTextMessage(id,"Hain!?");
    } else {
      console.log(res.word);
      reply.replyText(id,res.word+'!?')
    }
  })
  .catch("Hain")
}