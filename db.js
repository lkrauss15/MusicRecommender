var mysql = require('mysql');

let args = process.argv.slice(2);
let pass = args[0];

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: pass,
	database: 'music_recommender'
});

connection.connect();

connection.query("SELECT s.name, s.listeners, a.name, a.url FROM music_recommender.song s, music_recommender.artist a where s.name = 'Va Va Voom' and s.createdBy = a.artistID;", function (error, results, fields) {
	if (error) throw error;
	console.log(results);
});

connection.end();