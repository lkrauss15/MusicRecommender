var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/search', function (req, res) {
  
  res.send({resonse: "Response in this Object"});
});

app.post('/search', function (req, res) {
  console.log(req.body);
  
  res.send({ field1: "Received Post", field2: "Example Response Object" });
});

var port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log('Express started, listening to port: ', port);
});