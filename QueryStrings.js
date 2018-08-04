const queryArtistSongTag = (artistName, songName, tag) => (
	`SELECT a.name as aname, a.url
	FROM music_recommender.song s, music_recommender.artist a
	WHERE s.createdBy = a.artistID and s.name = '${songName}' and a.name = '${artistName}' and a.artistID IN
	(SELECT a.artistID
		FROM music_recommender.artist a, artist_tag t
		WHERE a.artistID = t.artistID and (${genTagString(tag)}));`
);

const queryArtistSong = (artistName, songName) => (
	`SELECT s.name as sname, s.listeners, a.name as aname, a.url
	FROM music_recommender.song s, music_recommender.artist a
	WHERE s.name = '${songName}' and a.name = '${artistName}' and s.createdBy = a.artistID;`
);

const queryArtistTag = (artistName, tag) => (
	`SELECT a.name as aname, a.url
FROM music_recommender.artist a
WHERE a.name = '${artistName}' and a.artistIID IN 
(SELECT a.artistID
	FROM music_recommender.artist a, artist_tag t
	WHERE a.artistID = t.artistID and (${genTagString(tag)}));`
);

const querySongTag = (songName, tag) => (
	`SELECT s.name as sname, s.listeners, a.name as aname, a.url
	FROM music_recommender.song s, music_recommender.artist a
	WHERE s.name = '${songName}' and s.createdBy = a.artistID and a.artistID IN 
	(SELECT a.artistID 
	FROM music_recommender.artist a, artist_tag t
	WHERE a.artistID = t.artistID and (${genTagString(tag)}));`
);

const queryArtist = (artistName) => (
`SELECT s.name as sname, s.listeners, a.name as aname, a.url
FROM music_recommender.song s, music_recommender.artist a
WHERE a.name = '${artistName}' and s.createdBy = a.artistID;`
);

const querySong = (songName) => (
	`SELECT s.name as sname, s.listeners, a.name as aname, a.url
	FROM music_recommender.song s, music_recommender.artist a
	WHERE s.name = '${songName}' and s.createdBy = a.artistID;`
);

const queryTag = (tag) => (
`SELECT a.name as aname, a.url
FROM music_recommender.artist a, artist_tag t
WHERE a.artistID = t.artistID and (${genTagString(tag)});`
);

const genTagString = (tag) => {
	let str = "t.tagValue = '";
	tag.forEach((t) => {
		str = str.concat(t + "' OR t.tagValue = '");
	});
	str = str.slice(0, str.length - 18);
	return str;
}