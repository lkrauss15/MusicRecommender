/* Initial Setup */
var express = require('express');
var app = express();

var paginateHelper = require('express-handlebars-paginate');

var server = require('http').createServer(app);
var exphbs = require('express-handlebars');
var hbs = require('hbs');
var mysql = require('mysql');

hbs.handlebars.registerHelper('paginateHelper', paginateHelper.createPagination);

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



app.use(express.static(__dirname));
app.engine('.hbs', exphbs(hbs));
app.set('view engine', '.hbs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* Server Routes */
app.get('/', function (req, res) {
  res.render('search.hbs');
});

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

    connection.query("SELECT a.name as aname, a.url "
      + "FROM music_recommender.song s, music_recommender.artist a "
      + "WHERE s.createdBy = a.artistID and s.name = '" + songName + "' and a.name = '" + artistName + "' and a.artistID IN "
      + "(SELECT a.artistID "
      + "FROM music_recommender.artist a, artist_tag t"
      + " WHERE a.artistID = t.artistID and (" + genTagString(tag) + "));",
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      });

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

    connection.query("SELECT a.name as aname, a.url "
      + "FROM music_recommender.artist a "
      + "WHERE a.name = '" + artistName + "' and a.artistID IN "
      + "(SELECT a.artistID "
      + "FROM music_recommender.artist a, artist_tag t"
      + " WHERE a.artistID = t.artistID and (" + genTagString(tag) + "));",
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      });

    // only song and tag -- no artist
  } else if (songName && tag) {

    connection.query("SELECT s.name as sname, s.listeners, a.name as aname, a.url "
      + "FROM music_recommender.song s, music_recommender.artist a "
      + "WHERE s.name = '" + songName + "' and s.createdBy = a.artistID and a.artistID IN "
      + "(SELECT a.artistID "
      + "FROM music_recommender.artist a, artist_tag t"
      + " WHERE a.artistID = t.artistID and (" + genTagString(tag) + "));",
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      });

    // only artist
  } else if (artistName) {

    connection.query("SELECT s.name as sname, s.listeners, a.name as aname, a.url "
      + "FROM music_recommender.song s, music_recommender.artist a "
      + "WHERE a.name = '" + artistName + "' and s.createdBy = a.artistID;",
      function (error, results, fields) {
        if (error) throw error;
        console.log(results[0]);
        res.render('results', { songs: results, pagination: { totalRows: results.length }});
        //res.send(results);
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

    connection.query("SELECT a.name as aname, a.url "
      + "FROM music_recommender.artist a, artist_tag t"
      + " WHERE a.artistID = t.artistID and (" + genTagString(tag) + ");",
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      });

    // nothing entered
  } else {
    res.render('results', {});
  }
});

/* Start Server */
var port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log('Express started, listening to port: ', port);
});

/* Helpers */
const genTagString = (tag) => {
  let str = "t.tagValue = '";
  tag.forEach((t) => {
    str = str.concat(t + "' OR t.tagValue = '");
  });
  str = str.slice(0, str.length - 18);
  return str;
}
