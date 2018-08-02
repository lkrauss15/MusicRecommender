/* Initial Setup */
var express = require('express');
var mysql = require('mysql');

let args = process.argv.slice(2);
let pass = args[0];

/* Connection Setup */
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: pass,
  database: 'music_recommender'
});

connection.connect();

/* Server Setup */
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* Server Routes */
app.get('/search', function (req, res) {

  connection.query("SELECT s.name, s.listeners, a.name, a.url FROM music_recommender.song s, music_recommender.artist a where s.name = 'Va Va Voom' and s.createdBy = a.artistID;", function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.send(results);
  });
  
  //res.send({resonse: "Response in this Object"});
});

app.post('/search', function (req, res) {
  console.log(req.body);

  sname = req.body.songName;

  connection.query("SELECT s.name, s.listeners, a.name, a.url FROM music_recommender.song s, music_recommender.artist a where s.name = '" + sname + "' and s.createdBy = a.artistID;", function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.send(results);
  });
  
  //res.send({ field1: "Received Post", field2: "Example Response Object" });
});

/* Start Server */
var port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log('Express started, listening to port: ', port);
});
