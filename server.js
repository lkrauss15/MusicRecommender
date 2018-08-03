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

  artistName = req.body.artistName;
  songName = req.body.songName;
  tag = req.body.tag && req.body.tag.split(',');

  // all values
  if (artistName && songName && tag) {

    // only artist and song -- no tag
  } else if (artistName && songName) {

    connection.query("SELECT s.name as sname, s.listeners, a.name as aname, a.url "
      + "FROM music_recommender.song s, music_recommender.artist a "
      + "WHERE s.name = '" + songName + "' and a.name = '" + artistName + "' and s.createdBy = a.artistID;",
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      });

    // only artist and tag -- no song
  } else if (artistName && tag) {

    // only song and tag -- no artist
  } else if (songName && tag) {

    // only artist
  } else if (artistName) {

    connection.query("SELECT s.name as sname, s.listeners, a.name as aname, a.url "
      + "FROM music_recommender.song s, music_recommender.artist a "
      + "WHERE a.name = '" + artistName + "' and s.createdBy = a.artistID;",
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      });

    // only song
  } else if (songName) {

    connection.query("SELECT s.name as sname, s.listeners, a.name as aname, a.url "
      + "FROM music_recommender.song s, music_recommender.artist a "
      + "WHERE s.name = '" + songName + "' and s.createdBy = a.artistID;",
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      });

    // only tag
  } else if (tag) {

    connection.query("SELECT DISTINCT s.name as sname, s.listeners, a.name as aname, a.url "
      + "FROM music_recommender.song s, music_recommender.artist a, artist_tag t"
      + " WHERE s.createdBy = a.artistID and a.artistID = t.artistID and " + genTagString(tag) + ";",
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      });

    // nothing entered
  } else {

  }
});

/* Start Server */
var port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log('Express started, listening to port: ', port);
});

/* Helpers */
const genTagString = (tag) => {
  console.log('in gen, tag is: ');
  console.log(tag);
  let str = "t.tagValue = '";
  tag.forEach((t) => {
    str = str.concat(t + "' OR t.tagValue = '");
  });
  str = str.slice(0, str.length - 18);
  //console.log("str is: " + str);
  return str;
}
