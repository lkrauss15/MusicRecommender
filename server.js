var qs = require('./QueryStrings.js');

/* Initial Setup */
var express = require('express');
var app = express();

var paginateHelper = require('express-handlebars-paginate');

var server = require('http').createServer(app);
var exphbs = require('express-handlebars');
var hbs = require('hbs');
var mysql = require('mysql2');

hbs.handlebars.registerHelper('paginateHelper', paginateHelper.createPagination);

let args = process.argv.slice(2);
let pass = args[0];

/* Connection Setup */
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: pass,
  database: 'music_recommender',
  multipleStatements: true
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

app.post('/userid', function(req, res) {
    console.log('in userID');
    var userID = req.body.userID;

    connection.query(qs.getTaggedArtists() + qs.getUserTags() + qs.getFriends() + qs.getRecommendedArtists(),
      function (error, results, fields) {
        if (error) throw error;
        res.render('results', { artists: results[0], tags: results[1], friends: results[2], artistsRec: results[3] });
     });

});

app.post('/tag', function(req, res) {
    var tagsToAdd = req.body.tagsToAdd;
    var tagsToRemove = req.body.tagsToRemove;
    var tagsToAddWithID = req.body.tagsToAddWithID;
    var tagsToRemoveWithID = req.body.tagsToRemoveWithID;
    console.log(tagsToAdd, tagsToRemove, tagsToAddWithID, tagsToRemoveWithID);

    //connection.query(addTag(tagsToAdd, tagsToAddWithID) + removeTag(tagsToRemove, tagsToRemoveWithID),
    //  function (error, results, fields) {
    //    if (error) throw error;
    //    res.send(results); //No results, nothing to render
    // });

});

app.post('/search', function (req, res) {

  artistName = req.body.artistName;
  songName = req.body.songName;
  tag = req.body.tag && req.body.tag.split(',');

  // all values
  if (artistName && songName && tag) {

    connection.query(qs.queryArtistSongTag(artistName, songName, tag),
      function (error, results, fields) {
        if (error) throw error;
        //console.log(results);

        let artists = [];
        results.forEach(entry => {
          artists.push({ name: entry.aname, artistID: entry.artistID, url: entry.url, tags: entry.tags })
        });

        console.log(artists);

        // remove duplicates
        artists = artists.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.artistID === thing.artistID
          ))
        )

        //let uniq = [...new Set(artists)];
        //console.log(artists);
        //res.send(artists);
        res.render('results', { artists: artists, songs: results });

      });

    // only artist and song -- no tag
  } else if (artistName && songName) {

    connection.query(qs.queryArtistSong(artistName, songName),
      function (error, results, fields) {
        if (error) throw error;

        let artists = [];
        results.forEach(entry => {
          artists.push({ name: entry.aname, artistID: entry.artistID, url: entry.url, tags: entry.tags })
        });

        artists = artists.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.artistID === thing.artistID
          ))
        )

        console.log(artists);

        res.render('results', { artists: artists, songs: results });
      });

    // only artist and tag -- no song
  } else if (artistName && tag) {

    connection.query(qs.queryArtistTag(artistName, tag),
      function (error, results, fields) {
        if (error) throw error;

        let artists = [];
        results.forEach(entry => {
          artists.push({ name: entry.aname, artistID: entry.artistID, url: entry.url, tags: entry.tags })
        });

        artists = artists.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.artistID === thing.artistID
          ))
        )

        console.log(results);

        res.render('results', { artists: artists }); //, songs: results });
      });

    // only song and tag -- no artist
  } else if (songName && tag) {

    connection.query(qs.querySongTag(songName, tag),
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      });

    // only artist
  } else if (artistName) {

    connection.query(qs.queryArtist(artistName) + qs.querySongGivenArtist(artistName),
      function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        let artists = [];
        results[0].forEach(entry => {
          artists.push({name: entry.name, artistID: entry.artistID, url: entry.url, tags: entry.tags})
        });

        // remove duplicates
        artists = artists.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.artistID === thing.artistID
          ))
        )

        console.log(artists);
        res.render('results', { artists: artists, songs: results[1]});
        //res.send(results);
      });

    // only song
  } else if (songName) {

    connection.query(qs.querySong(songName),
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      });

    // only tag
  } else if (tag) {

    connection.query(qs.queryTag(tag),
      function (error, results, fields) {
        if (error) throw error;
                res.render('results', {artists: results});
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

