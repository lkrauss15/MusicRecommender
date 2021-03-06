const queryArtistSongTag = (artistName, songName, tag) => (
	`select sname, art.name as aname, art.url, art.artistID, sub.tags from artist as art join
    (
    SELECT filtered.sname, filtered.artistID, GROUP_CONCAT(filtered.b ORDER BY filtered.b ASC SEPARATOR ', ') as tags
    FROM (
        SELECT t.artistID as artistID, t.tagValue as b, s.name as sname
        FROM (music_recommender.artist_tag t join music_recommender.artist a on t.artistID = a.artistID) join music_recommender.song s on s.createdBy = a.artistID
        WHERE s.name LIKE '%${songName}%' and a.artistID in (
                            SELECT a.artistID
                            FROM music_recommender.artist a
                            WHERE a.name LIKE '%${artistName}%' and a.artistID IN
                                (SELECT a.artistID
                                    FROM music_recommender.artist a, music_recommender.artist_tag t
                                    WHERE a.artistID = t.artistID and (${genTagString(tag)}))
                            )
    ) as filtered
    GROUP BY filtered.artistID, filtered.sname )
    as sub on  art.artistID = sub.artistID;`
);

const queryArtistSong = (artistName, songName) => (
	`SELECT s.name as sname, s.listeners, a.name as aname, a.url, a.artistID
	FROM music_recommender.song s, music_recommender.artist a
	WHERE s.name LIKE '%${songName}%' and a.name LIKE '%${artistName}%' and s.createdBy = a.artistID;`
);

const queryArtistTag = (artistName, tag) => (
    `select art.name as aname, art.url, art.artistID, sub.tags from artist as art join
    (
    SELECT filtered.artistID, GROUP_CONCAT(filtered.b ORDER BY filtered.b ASC SEPARATOR ', ') as tags
    FROM (
        SELECT t.artistID as artistID, t.tagValue as b
        FROM music_recommender.artist_tag t join music_recommender.artist a on t.artistID = a.artistID
        WHERE a.artistID in (
                            SELECT a.artistID
                            FROM music_recommender.artist a
                            WHERE a.name LIKE '%${artistName}%' and a.artistID IN
                                (SELECT a.artistID
                                    FROM music_recommender.artist a, music_recommender.artist_tag t
                                    WHERE a.artistID = t.artistID and (${genTagString(tag)}))
                            )
    ) as filtered
    GROUP BY filtered.artistID )
    as sub on  art.artistID = sub.artistID`
);

const querySongTag = (songName, tag) => (
	`SELECT s.name as sname, s.listeners, a.name as aname, a.url, a.artistID
	FROM music_recommender.song s, music_recommender.artist a
	WHERE s.name LIKE '%${songName}%' and s.createdBy = a.artistID and a.artistID IN 
	(SELECT a.artistID 
	FROM music_recommender.artist a, music_recommender.artist_tag t
	WHERE a.artistID = t.artistID and (${genTagString(tag)}));`
);

const addTag = (tags, artistTagPairs, artistTagPairsWithID) => (
    `insert ignore into tag (tagValue) values ${tags};
     insert into artist_tag (artistID, tagValue) values ${artistTagPairs};
     insert into tagged (artistID, userID, tagValue, date) values ${artistTagPairsWithID};
    `
);

const removeTag = (artistTagPairs, artistTagPairsWithID) => (
    `delete from artist_tag where (artistID, tagValue) in (${artistTagPairs});
     delete from tagged where (artistID, userID, tagValue) in (${artistTagPairsWithID});
    `
);

const getTaggedArtists = (userID) => (
    `select art.name, art.url, sub.tags from artist as art join
    (
    SELECT filtered.artistID, GROUP_CONCAT(filtered.b ORDER BY filtered.b ASC SEPARATOR ', ') as tags
    FROM (
        SELECT t.artistID as artistID, t.tagValue as b
        FROM music_recommender.artist_tag t join music_recommender.artist a on t.artistID = a.artistID
        WHERE a.artistID in (
            select artistID from listened where userID = ${userID}
        )
    ) as filtered
    GROUP BY filtered.artistID )
    as sub on  art.artistID = sub.artistID;`
);

const getUserTags = (userID) => (
    `select a.name, t.tagValue, DATE_FORMAT(t.date, "%Y-%m-%d") as date, a.url from artist a join tagged t on a.artistID = t.artistID where userID = ${userID} order by date desc, a.name;`
);

const getFriends = (userID) => (
    `select friendID from friend where userID = ${userID};`
);

const getRecommendedArtists = (userID, tag) => (
    `select art.name as aname, art.url, sub.tags from artist as art join
    (
    SELECT filtered.artistID, GROUP_CONCAT(filtered.b ORDER BY filtered.b ASC SEPARATOR ', ') as tags
    FROM (
        SELECT t.artistID as artistID, t.tagValue as b
        FROM music_recommender.artist_tag t join music_recommender.artist a on t.artistID = a.artistID
        WHERE a.artistID in (
            select a.artistID
            from music_recommender.artist a, music_recommender.song s
            where s.createdBy = a.artistID and a.artistID IN
                (select a.artistID
                from music_recommender.artist a, music_recommender.tagged t
                where a.artistID = t.artistID and (${genTagString(tag)}) and t.userID = ${userID})
            Group By a.artistID, a.name
            Order By sum(s.listeners) desc
        )
    ) as filtered
    GROUP BY filtered.artistID )
    as sub on  art.artistID = sub.artistID`

);


const queryArtist = (artistName) => (
	`select art.artistID, art.name, art.url, sub.tags from artist as art join
    (
    SELECT filtered.artistID, GROUP_CONCAT(filtered.b ORDER BY filtered.b ASC SEPARATOR ', ') as tags
    FROM (
        SELECT t.artistID as artistID, t.tagValue as b
        FROM music_recommender.artist_tag t join music_recommender.artist a on t.artistID = a.artistID
        WHERE a.name like '%${artistName}%'

    ) as filtered
    GROUP BY filtered.artistID )
    as sub on  art.artistID = sub.artistID;`
);

const querySong = (songName) => (
	`SELECT s.name as sname, s.listeners, a.name as aname, a.url, a.artistID
	FROM music_recommender.song s, music_recommender.artist a
	WHERE s.name LIKE '%${songName}%' and s.createdBy = a.artistID;`
);

const querySongGivenArtist = (artistName) => (
	`SELECT s.name as sname, s.listeners, a.name as aname, a.url
    FROM music_recommender.song s, music_recommender.artist a
    WHERE a.name like '%${artistName}%' and s.createdBy = a.artistID;`
);

const querySongGivenArtistAndSong = (artistName, songName) => (
	`SELECT s.name as sname, s.listeners, a.name as aname, a.url
    FROM music_recommender.song s, music_recommender.artist a
    WHERE a.name like '%${artistName}%' and s.name like "%${songName}%" and s.createdBy = a.artistID;`
);

const queryTag = (tag) => (
	`select art.name, art.url, art.artistID, sub.tags from artist as art join
    (
    SELECT filtered.artistID, GROUP_CONCAT(filtered.b ORDER BY filtered.b ASC SEPARATOR ', ') as tags
    FROM (
        SELECT t.artistID as artistID, t.tagValue as b
        FROM music_recommender.artist_tag t join music_recommender.artist a on t.artistID = a.artistID
        WHERE a.artistID in (
            Select a.artistID
            From artist a, Tag t, artist_tag y
            Where t.tagValue in ('${tag}') and t.tagValue = y.tagValue and a.artistID = y.artistID
        )
    ) as filtered
    GROUP BY filtered.artistID )
    as sub on  art.artistID = sub.artistID;`
);

const querySongByTagAndName = (songName, tag) => (
    `select s.songID, s.name as sname, s.listeners, filteredArtists.name as aname from song s join (
    select art.artistID, art.name from artist as art join
    (
    SELECT filtered.artistID, GROUP_CONCAT(filtered.b ORDER BY filtered.b ASC SEPARATOR ', ') as tags
    FROM (
        SELECT t.artistID as artistID, t.tagValue as b
        FROM music_recommender.artist_tag t join music_recommender.artist a on t.artistID = a.artistID
        WHERE a.artistID in (
            Select a.artistID
            From artist a, Tag t, artist_tag y
            Where t.tagValue = y.tagValue and a.artistID = y.artistID and (${genTagString(tag)})
        )
    ) as filtered
    GROUP BY filtered.artistID )
    as sub on  art.artistID = sub.artistID
    ) as filteredArtists on s.createdBy = filteredArtists.artistID
    where s.name like '%${songName}%';`
);

const genTagString = (tag) => {
	console.log('genTag tag is: ', tag);
	let str = "t.tagValue = '";
	tag.forEach((t) => {
		str = str.concat(t + "' OR t.tagValue = '");
	});
	str = str.slice(0, str.length - 18);
	return str;
}

const getTagsForArtist = (artistID) => (
	`SELECT t.tagValue
FROM music_recommender.artist_tag t join music_recommender.artist a on t.artistID = a.artistID
WHERE a.artistID = ${artistID};`
);

module.exports = {
    querySongGivenArtistAndSong,
    querySongByTagAndName,
	querySongGivenArtist,
	queryArtistSongTag,
	queryArtistSong,
	queryArtistTag,
	querySongTag,
	queryArtist,
	querySong,
	queryTag,
    getRecommendedArtists,
	getTagsForArtist,
	getTaggedArtists,
	getUserTags,
	getFriends,
    removeTag,
    addTag
};
