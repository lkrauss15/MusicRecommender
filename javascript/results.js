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

    $(".edit-tags-button").click(onClickEditTags); //Needs to be called after all artists are created (page load and pagination)

    function constructPage(num, isActive, isMax, isStart) {
        var classes = "page-button "
        if (isMax) {
            classes += "max ";
        }
        if (isActive) {
            classes += "active ";
        }
        if (isStart) {
            classes += "start ";
        }

        return "<a href='#' class='" + classes + "'>" + num + "</a>";
    }

    function constructPagesHtml(start, activePage, numPages) {
        if (numPages <= 5) {

        }

        var html =
        "<div class='pages'>" +
            "<a href='#' class='arrow left-arrow page-button'>&laquo;</a>" +
            constructPage(start, start==activePage, false, true) +
            constructPage(start+1, start+1==activePage, false, false) +
            constructPage(start+2, start+2==activePage, false, false);

        if (start >= numPages-4) {
            html += constructPage(start+3, start+3==activePage, false, false) +
                    constructPage(start+4, start+4==activePage, true, false) +
                    "<a href='#' class='arrow disabled-arrow'>&raquo;</a>";
        } else {
            html += "<a href='#' class='dots'>&hellip;</a>" +
                    constructPage(numPages, numPages==activePage, true, false) +
                    "<a href='#' class='arrow right-arrow page-button'>&raquo;</a>";
        }

        html += "</div>";

        return html;
    }

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

            "<span class='inner-text'>" + artist +  "-" + name + "</span>" +
            "<span class='inner-text listens'>" + listens + " listens</span>" +

        "</div>";

        return html;
    }

    $("#testButton").click(function() {
        //$(this).after(constructArtistHTML("Name", "www.google.com", "tag1, tag2, tag3"));
        //$(".edit-tags-button").click(onClickEditTags);

        //$(this).after(constructSongHTML("Song Name", "Artist", "1,000,000"));

         $("#pageContainer").append(constructPagesHtml(46, 47, 50));
        $("#pageContainer").on("click", ".page-button", function() {
            var page = $(this).text();
            var newPage = 1;
            if ($(this).hasClass("left-arrow")) {
                var test = $(".pages > .active").text();
                newPage = Number($(".pages > .active").text()) - 1;
            } else if ($(this).hasClass("right-arrow")) {
                newPage = Number($(".pages > .active").text()) + 1;
            } else {
                newPage = Number(page);
            }

            var maxPage = Number($(this).parent().find(".max").text());
            var startPage = newPage - 1;
            if (newPage == 1) {
                startPage = 1;
            }
            if (newPage >= maxPage-4) {
                startPage = Number($(this).parent().find(".start").text());
            }

            $(this).parent().replaceWith(constructPagesHtml(startPage, newPage, maxPage));

        });
    });





})
