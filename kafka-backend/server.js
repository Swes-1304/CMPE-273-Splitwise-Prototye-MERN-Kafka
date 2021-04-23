var connection = new require('./kafka/Connection');
//topics files
//var signin = require('./services/signin.js');
var addbill = require('./services/addbill');
var addcomment = require('./services/addcomment');

function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log('server is running ');
  consumer.on('message', function (message) {
    console.log('message received for ' + topic_name + ' ', fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    //var userid = JSON.parse(message.userid)

    fname.handle_request(data.data, function (err, res) {
      if (err) {
        console.log('handle request error', err);
      }
      console.log('after handle' + res);
      // console.log('eror ', err);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      console.log(' payload ', payloads[0]);
      producer.send(payloads, function (err, data) {
        console.log('producer send succes data ');
        console.log(data);
        if (err) {
          console.log('producer send error', err);
        }
      });
      return;
    });
  });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
// handleTopicRequest("post_book",Books)
handleTopicRequest('add_bill1', addbill);
handleTopicRequest('add_comment', addcomment);
