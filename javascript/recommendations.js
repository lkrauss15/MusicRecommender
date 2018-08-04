$(document).ready(function () {

    var originalTags;
    var editingTags = false;
    var hidden = true;

    $("#showRec").click(function() {
        $("#hiddenRecs").slideToggle(300);
        if (!hidden) {
            $("#showRec").text("Show recommended artists \u25B6");
            hidden = true;
        } else {
            $("#showRec").text("Show recommended artists \u25BC");
            $("#hiddenRecs").css("display", "flex");
            hidden = false;
        }
    });

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

    /* HTML Construction */

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


    function constructTagHTML(artist, tag, date) {
        var html =
            "<div class='tag-result'>" +

            "<span class='inner-text'>" + artist + ": " + tag + "</span>" +
            "<span class='inner-text date'>" + date + " </span>" +

            "</div>";

        return html;
    }

    function constructFriendHTML(friendID) {
        var html =
            "<div class='tag-result'>" +

            "<span class='inner-text'>Friend ID: " + friendID + "</span>" +
            "</div>";

        return html;
    }

    /* Artist Generation */

    function artistTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += constructArtistHTML(item.name, item.url, item.tags);
        });
        return html;
    }

    function getArtistData() {
        var result = [];

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

    /* Tag Generation */

    function getTagData() {
        var result = [];

        for (var i=1; i<=50; i++) {
            result.push({artist: "Artist " + i, tag: "Tag " + i, date: new Date().toLocaleDateString()});
        }

        return result;
    }

    function tagTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += constructTagHTML(item.artist, item.tag, item.date);
        });
        return html;
    }

    $('#tagPages').pagination({
        dataSource: function (done) {
            done(getTagData());
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = tagTemplating(data);
            $('#tagDataContainer').html(html);
            $(".edit-tags-button").click(onClickEditTags);
        }
    })

    /* Friend Generation */

        function getFriendData() {
        var result = [];

        for (var i=1; i<=50; i++) {
            result.push({friendID: i});
        }

        return result;
    }

    function friendTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += constructFriendHTML(item.friendID);
        });
        return html;
    }

    $('#friendPages').pagination({
        dataSource: function (done) {
            done(getFriendData());
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = friendTemplating(data);
            $('#friendDataContainer').html(html);
            $(".edit-tags-button").click(onClickEditTags);
        }
    })

    /* Recommendation Generation */

        function artistRecTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += constructArtistHTML(item.name, item.url, item.tags);
        });
        return html;
    }

    function getArtistRecData() {
        var result = [];

        for (var i=1; i<=50; i++) {
            result.push({name: "Name " + i, url: "https://www.google.com", tags: "tag" + i + ", tag" + (i+1) + ", tag" + (i+2)});
        }

        return result;
    }

    $('#artistRecPages').pagination({
        dataSource: function (done) {
            done(getArtistRecData());
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = artistRecTemplating(data);
            $('#artistRecDataContainer').html(html);
            $(".edit-tags-button").click(onClickEditTags);
        }
    })


})
