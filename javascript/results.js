$(document).ready(function () {

    var originalTags;
    var editingTags = false;

    function onClickEditTags() {
        if (!editingTags) {
            originalTags = $(this).prev().text();
            var inputHTML = "<input class='tag-input' type='text' value='" + originalTags + "'>"
            $(this).prev().replaceWith(inputHTML);
            $(this).text("Done");
            editingTags = true;
        } else {
            var newTags = $(".tag-input").val();

            $.post("http://localhost:4000/tag", {
                    originalTags: originalTags.split(","),
                    newTags: newTags.split(",")
                },
                function (data, status) {
                    console.log(data);
                    console.log(status)
                });


            var spanHTML = "<span class='tags'>" + newTags + "</span>"
            $(".tag-input").replaceWith(spanHTML);
            $(this).text("Edit");
            editingTags = false;
        }
    }

    //$(".edit-tags-button").click(onClickEditTags); //Needs to be called after all artists are created (page load and pagination)

    function constructArtistHTML(name, url, tags) {
        var html =
            "<div class='artist-result'>" +
            "<a class='artist-text' href='" + url + "' target='_blank'>" + name + "</a>" +

            "<div class='artist-text'>" +
            "<label>Tags: </label>" +
            "<span class='tags'>" + tags + "</span>" +
            "<button class='edit-tags-button'>Edit</button>" +
            "</div>" +

            "</div>";

        return html;
    }


    function constructSongHTML(name, artist, listens) {
        var html =
            "<div class='song-result'>" +

            "<span class='inner-text'>" + artist + " - " + name + "</span>" +
            "<span class='inner-text listens'>" + listens + " listens</span>" +

            "</div>";

        return html;
    }

    function artistTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += constructArtistHTML(item.name, item.url, item.tags);
        });
        return html;
    }

    function getArtistData() {
        var result = [];

        //result.push({name: "Michael Jackson", url: "http://www.last.fm/music/Michael+Jackson", tags: "pop, 80s, michael jackson, soul, dance, funk"});
        for (var i=1; i<=50; i++) {
            result.push({name: "Name " + i, url: "https://www.google.com", tags: "tag" + i + ", tag" + (i+1) + ", tag" + (i+2)});
        }

        return result;
    }



    $('#artistPages').pagination({
        dataSource: function (done) {
            done(getArtistData());
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = artistTemplating(data);
            $('#artistDataContainer').html(html);
            $(".edit-tags-button").click(onClickEditTags);
        }
    })


    function getSongData() {
        var result = [];

        //result.push({name: "Michael Jackson", url: "http://www.last.fm/music/Michael+Jackson", tags: "pop, 80s, michael jackson, soul, dance, funk"});
        for (var i=1; i<=50; i++) {
            result.push({name: "Song Name " + i, artist: "Artist " + i, listens: i * 1000});
        }

        return result;
    }

    function songTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += constructSongHTML(item.name, item.artist, item.listens);
        });
        return html;
    }

    $('#songPages').pagination({
        dataSource: function (done) {
            done(getSongData());
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = songTemplating(data);
            $('#songDataContainer').html(html);
            $(".edit-tags-button").click(onClickEditTags);
        }
    })

    $('#song-pagination').twbsPagination({
        totalPages: $('#songsInDOM .songItem').length,
        visiblePages: 7,
        onPageClick: function (event, page) {
            $('#songdetails').html($('#song' + (page - 1)).html());
        }
    });


})
